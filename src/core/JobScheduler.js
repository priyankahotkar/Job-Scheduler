import { Job } from './Job.js';
import { Worker } from './Worker.js';

export class JobScheduler {
  constructor() {
    this.jobs = new Map();
    this.workers = new Map();
    this.completedJobs = new Set();
    this.isRunning = false;
    this.executionInterval = null;
    
    // Initialize workers
    this.initializeWorkers();
  }

  initializeWorkers() {
    const workerConfigs = [
      { id: 'worker-1', name: 'Primary Worker', capacity: 5 },
      { id: 'worker-2', name: 'Secondary Worker', capacity: 3 },
      { id: 'worker-3', name: 'Backup Worker', capacity: 4 },
      { id: 'worker-4', name: 'Processing Node', capacity: 6 }
    ];

    workerConfigs.forEach(config => {
      this.workers.set(config.id, new Worker(config.id, config.name, config.capacity));
    });
  }

  addJob(jobConfig) {
    const job = new Job(jobConfig);
    this.jobs.set(job.id, job);
    job.addLog(`Job created: ${job.name}`);
    return job;
  }

  updateJob(id, updates) {
    const job = this.jobs.get(id);
    if (!job) return false;

    Object.assign(job, updates);
    job.nextRun = job.calculateNextRun();
    job.addLog(`Job updated: ${job.name}`);
    return job;
  }

  deleteJob(id) {
    const job = this.jobs.get(id);
    if (!job) return false;

    if (job.status === 'running') {
      job.status = 'cancelled';
    }
    
    this.jobs.delete(id);
    this.completedJobs.delete(id);
    return true;
  }

  getJob(id) {
    return this.jobs.get(id);
  }

  getAllJobs() {
    return Array.from(this.jobs.values());
  }

  getAllWorkers() {
    return Array.from(this.workers.values());
  }

  findAvailableWorker() {
    const availableWorkers = Array.from(this.workers.values())
      .filter(worker => worker.canAcceptJob())
      .sort((a, b) => a.getLoad() - b.getLoad()); // Prefer less loaded workers

    return availableWorkers[0] || null;
  }

  async executeJob(job) {
    const worker = this.findAvailableWorker();
    if (!worker) {
      job.addLog('No available workers', 'warning');
      return false;
    }

    job.status = 'running';
    job.assignedWorker = worker.id;
    job.executionCount++;
    worker.assignJob(job.id);
    
    job.addLog(`Started execution on ${worker.name}`, 'info');

    try {
      // Simulate job execution
      await this.simulateJobExecution(job);
      
      job.status = 'completed';
      job.lastRun = new Date();
      job.nextRun = job.calculateNextRun();
      this.completedJobs.add(job.id);
      
      worker.completeJob(job.id, true);
      job.addLog(`Completed successfully on ${worker.name}`, 'success');
      
      return true;
    } catch (error) {
      job.status = 'failed';
      job.failureCount++;
      worker.completeJob(job.id, false);
      job.addLog(`Failed: ${error.message}`, 'error');

      // Handle retry logic
      if (job.failureCount < job.retryPolicy.maxRetries) {
        const delay = job.retryPolicy.backoffMs * Math.pow(2, job.failureCount - 1);
        job.nextRun = new Date(Date.now() + delay);
        job.status = 'pending';
        job.addLog(`Scheduled retry in ${delay}ms`, 'warning');
      } else {
        job.addLog('Maximum retries exceeded', 'error');
      }
      
      return false;
    } finally {
      job.assignedWorker = null;
    }
  }

  async simulateJobExecution(job) {
    // Simulate different execution times and success rates
    const executionTime = Math.random() * 5000 + 2000; // 2s to 7s for better visibility
    const failureRate = job.priority === 'High' ? 0.1 : job.priority === 'Medium' ? 0.15 : 0.2;
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    if (Math.random() < failureRate) {
      throw new Error('Simulated job failure');
    }
  }

  getExecutableJobs() {
    return Array.from(this.jobs.values())
      .filter(job => job.canRun(this.completedJobs) && job.status !== 'running')
      .sort((a, b) => {
        // Sort by priority first, then by next run time
        const priorityDiff = b.getPriorityWeight() - a.getPriorityWeight();
        if (priorityDiff !== 0) return priorityDiff;
        return a.nextRun - b.nextRun;
      });
  }

  async processPendingJobs() {
    const executableJobs = this.getExecutableJobs();
    const availableWorkers = Array.from(this.workers.values()).filter(w => w.canAcceptJob()).length;
    
    // Execute jobs up to available worker capacity
    const jobsToExecute = executableJobs.slice(0, availableWorkers);
    
    const executionPromises = jobsToExecute.map(job => this.executeJob(job));
    await Promise.allSettled(executionPromises);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.executionInterval = setInterval(async () => {
      await this.processPendingJobs();
    }, 2000); // Check every 2 seconds for better visibility
  }

  stop() {
    this.isRunning = false;
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
  }

  getSystemStats() {
    const jobs = this.getAllJobs();
    const workers = this.getAllWorkers();
    
    return {
      totalJobs: jobs.length,
      runningJobs: jobs.filter(j => j.status === 'running').length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      totalWorkers: workers.length,
      activeWorkers: workers.filter(w => w.status === 'busy').length,
      avgWorkerLoad: workers.reduce((sum, w) => sum + w.getLoad(), 0) / workers.length,
      systemUptime: this.isRunning
    };
  }
}
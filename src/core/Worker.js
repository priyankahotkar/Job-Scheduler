export class Worker {
  constructor(id, name, capacity = 5) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.currentJobs = new Set();
    this.totalExecuted = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.status = 'idle';
    this.lastActivity = new Date();
  }

  canAcceptJob() {
    return this.currentJobs.size < this.capacity && this.status === 'idle';
  }

  assignJob(jobId) {
    if (this.canAcceptJob()) {
      this.currentJobs.add(jobId);
      this.status = this.currentJobs.size > 0 ? 'busy' : 'idle';
      this.lastActivity = new Date();
      return true;
    }
    return false;
  }

  completeJob(jobId, success = true) {
    this.currentJobs.delete(jobId);
    this.totalExecuted++;
    
    if (success) {
      this.successCount++;
    } else {
      this.failureCount++;
    }
    
    this.status = this.currentJobs.size > 0 ? 'busy' : 'idle';
    this.lastActivity = new Date();
  }

  getLoad() {
    return this.currentJobs.size / this.capacity;
  }

  getSuccessRate() {
    return this.totalExecuted > 0 ? (this.successCount / this.totalExecuted) : 1;
  }
}
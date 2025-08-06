export class Job {
  constructor({
    id,
    name,
    schedule,
    command,
    priority = 'Medium',
    dependencies = [],
    retryPolicy = { maxRetries: 3, backoffMs: 1000 },
    description = ''
  }) {
    this.id = id;
    this.name = name;
    this.schedule = schedule;
    this.command = command;
    this.priority = priority;
    this.dependencies = dependencies;
    this.retryPolicy = retryPolicy;
    this.description = description;
    
    // Runtime properties
    this.status = 'pending';
    this.lastRun = null;
    this.nextRun = this.calculateNextRun();
    this.executionCount = 0;
    this.failureCount = 0;
    this.logs = [];
    this.assignedWorker = null;
    this.createdAt = new Date();
  }

  calculateNextRun() {
    const now = new Date();
    const schedule = this.schedule.toLowerCase();
    
    if (schedule.includes('every') && schedule.includes('minute')) {
      const minutes = parseInt(schedule.match(/\d+/)?.[0] || '5');
      return new Date(now.getTime() + minutes * 60 * 1000);
    } else if (schedule.includes('every') && schedule.includes('hour')) {
      const hours = parseInt(schedule.match(/\d+/)?.[0] || '1');
      return new Date(now.getTime() + hours * 60 * 60 * 1000);
    } else if (schedule.includes('daily')) {
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      
      if (schedule.includes('at')) {
        const timeMatch = schedule.match(/(\d+)\s*(am|pm)/i);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          const isPM = timeMatch[2].toLowerCase() === 'pm';
          nextDay.setHours(isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour, 0, 0, 0);
        }
      }
      return nextDay;
    } else if (schedule.includes('weekly')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    
    // Default: run in 5 minutes
    return new Date(now.getTime() + 5 * 60 * 1000);
  }

  addLog(message, level = 'info') {
    this.logs.push({
      timestamp: new Date(),
      message,
      level
    });
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }
  }

  canRun(completedJobs) {
    if (this.status === 'running') return false;
    
    // Check if all dependencies are completed
    for (const depId of this.dependencies) {
      if (!completedJobs.has(depId)) {
        return false;
      }
    }
    
    return new Date() >= this.nextRun;
  }

  getPriorityWeight() {
    switch (this.priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 2;
    }
  }
}
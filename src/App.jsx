import React, { useState, useEffect } from 'react';
import { JobScheduler } from './core/JobScheduler.js';
import JobCard from './components/JobCard.jsx';
import JobForm from './components/JobForm.jsx';
import SystemStats from './components/SystemStats.jsx';
import WorkerPanel from './components/WorkerPanel.jsx';
import { Play, Pause, Plus, Search, Filter, Settings, BarChart3 } from 'lucide-react';
import Footer from './components/Footer.jsx';

const App = () => {
  const [scheduler] = useState(() => new JobScheduler());
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [stats, setStats] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Create some sample jobs
  useEffect(() => {
    const sampleJobs = [
      {
        id: 'job-1',
        name: 'Data Backup',
        description: 'Daily backup of user data to cloud storage',
        schedule: 'daily at 2 AM',
        command: 'backup.sh',
        priority: 'High',
        dependencies: [],
        retryPolicy: { maxRetries: 5, backoffMs: 2000 }
      },
      {
        id: 'job-2',
        name: 'Cache Cleanup',
        description: 'Clear expired cache entries',
        schedule: 'every 2 minutes',
        command: 'clearCache()',
        priority: 'Medium',
        dependencies: [],
        retryPolicy: { maxRetries: 3, backoffMs: 1000 }
      },
      {
        id: 'job-3',
        name: 'Report Generation',
        description: 'Generate daily analytics reports',
        schedule: 'daily at 6 AM',
        command: 'generateReports()',
        priority: 'High',
        dependencies: ['job-1'],
        retryPolicy: { maxRetries: 3, backoffMs: 1500 }
      },
      {
        id: 'job-4',
        name: 'Email Notifications',
        description: 'Send pending email notifications',
        schedule: 'every 15 minutes',
        command: 'sendEmails()',
        priority: 'Medium',
        dependencies: [],
        retryPolicy: { maxRetries: 2, backoffMs: 500 }
      },
      {
        id: 'job-5',
        name: 'System Health Check',
        description: 'Monitor system resources and performance',
        schedule: 'every 5 minutes',
        command: 'healthCheck()',
        priority: 'Low',
        dependencies: [],
        retryPolicy: { maxRetries: 1, backoffMs: 1000 }
      }
    ];

    sampleJobs.forEach(jobConfig => scheduler.addJob(jobConfig));
    updateData();
  }, [scheduler]);

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(updateData, 500); // Update more frequently
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    setJobs(scheduler.getAllJobs());
    setWorkers(scheduler.getAllWorkers());
    setStats(scheduler.getSystemStats());
  };

  const handleStartStop = () => {
    if (isRunning) {
      scheduler.stop();
    } else {
      scheduler.start();
    }
    setIsRunning(!isRunning);
  };

  const handleJobSubmit = (jobData) => {
    if (editingJob) {
      scheduler.updateJob(editingJob.id, jobData);
    } else {
      scheduler.addJob(jobData);
    }
    updateData();
    setShowJobForm(false);
    setEditingJob(null);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      scheduler.deleteJob(jobId);
      updateData();
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getNextJob = () => {
    const executableJobs = scheduler.getExecutableJobs();
    return executableJobs[0] || null;
  };

  const nextJob = getNextJob();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Scheduler</h1>
            <p className="text-gray-600 mt-1">Manage and monitor distributed job execution</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isRunning ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            
            <button
              onClick={handleStartStop}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Stop' : 'Start'}</span>
            </button>
            
            <button
              onClick={() => setShowJobForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Job</span>
            </button>
          </div>
        </div>

        {/* System Stats */}
        <SystemStats stats={stats} workers={workers} />

        {/* Next Job Alert */}
        {isRunning && nextJob && nextJob.status !== 'running' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Next job: <strong>{nextJob.name}</strong> scheduled for {new Date(nextJob.nextRun).toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 mt-1">{nextJob.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Currently Running Jobs */}
        {isRunning && jobs.filter(job => job.status === 'running').length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-medium text-green-900">Currently Executing</h3>
            </div>
            <div className="space-y-2">
              {jobs.filter(job => job.status === 'running').map(job => (
                <div key={job.id} className="flex items-center justify-between bg-white rounded-md p-3 border border-green-100 transition-shadow shadow-md animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.name}</p>
                      <p className="text-xs text-gray-600">{job.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-700 font-medium">
                      Worker: {job.assignedWorker || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Run #{job.executionCount}
                    </p>
                  </div>
                  <div className="w-24 h-2 bg-green-200 rounded-full mt-2">
                    <div className="h-2 bg-green-500 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Jobs ({filteredJobs.length})
                </h2>
              </div>
              
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    {jobs.length === 0 
                      ? "Get started by creating your first job" 
                      : "Try adjusting your search or filter criteria"}
                  </p>
                  {jobs.length === 0 && (
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Job
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <WorkerPanel workers={workers} />
          </div>
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <JobForm
            job={editingJob}
            existingJobs={jobs}
            onSubmit={handleJobSubmit}
            onClose={() => {
              setShowJobForm(false);
              setEditingJob(null);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
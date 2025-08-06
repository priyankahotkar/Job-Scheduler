import React from 'react';
import { Clock, Play, Pause, AlertCircle, CheckCircle, XCircle, Zap, MoreHorizontal } from 'lucide-react';

const JobCard = ({ job, onEdit, onDelete, onToggle }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Play className="w-4 h-4 text-green-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const getExecutionStats = () => {
    const successRate = job.executionCount > 0 ? 
      ((job.executionCount - job.failureCount) / job.executionCount * 100).toFixed(1) : 
      100;
    return { successRate, total: job.executionCount };
  };

  const stats = getExecutionStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getStatusIcon(job.status)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
              <Zap className="w-3 h-3 mr-1" />
              {job.priority}
            </span>
            <button 
              onClick={() => {}} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Schedule:</span>
              <p className="font-medium text-gray-900">{job.schedule}</p>
            </div>
            <div>
              <span className="text-gray-500">Next Run:</span>
              <p className="font-medium text-gray-900">{formatDate(job.nextRun)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Last Run:</span>
              <p className="font-medium text-gray-900">{formatDate(job.lastRun)}</p>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <p className={`font-medium capitalize ${
                job.status === 'completed' ? 'text-green-600' :
                job.status === 'failed' ? 'text-red-600' :
                job.status === 'running' ? 'text-blue-600' :
                'text-gray-600'
              }`}>
                {job.status}
              </p>
            </div>
          </div>

          {job.dependencies.length > 0 && (
            <div>
              <span className="text-xs text-gray-500">Dependencies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {job.dependencies.slice(0, 3).map(depId => (
                  <span key={depId} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                    {depId}
                  </span>
                ))}
                {job.dependencies.length > 3 && (
                  <span className="text-xs text-gray-500">+{job.dependencies.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{stats.successRate}%</span> success rate
              <span className="mx-2">•</span>
              <span>{stats.total} runs</span>
              {job.failureCount > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-red-600">{job.failureCount} failures</span>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(job)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {job.status === 'running' && job.assignedWorker && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-700">Running on {job.assignedWorker}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
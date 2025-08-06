import React from 'react';
import { Activity, Clock, CheckCircle, XCircle, Users, Zap } from 'lucide-react';

const SystemStats = ({ stats, workers }) => {
  const getWorkerStatusColor = (status) => {
    return status === 'busy' ? 'bg-green-500' : 'bg-gray-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">{stats.runningJobs} running</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">{stats.completedJobs} completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalJobs > 0 ? 
                Math.round(((stats.totalJobs - stats.failedJobs) / stats.totalJobs) * 100) : 
                100}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${stats.totalJobs > 0 ? 
                  ((stats.totalJobs - stats.failedJobs) / stats.totalJobs) * 100 : 
                  100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Workers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            {workers.slice(0, 4).map(worker => (
              <div key={worker.id} className="flex items-center space-x-1">
                <div className={`w-2 h-2 ${getWorkerStatusColor(worker.status)} rounded-full`}></div>
              </div>
            ))}
            <span className="text-sm text-gray-600">{stats.activeWorkers} active</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Avg Load</p>
            <p className="text-2xl font-bold text-gray-900">
              {(stats.avgWorkerLoad * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                stats.avgWorkerLoad > 0.8 ? 'bg-red-500' :
                stats.avgWorkerLoad > 0.6 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${stats.avgWorkerLoad * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
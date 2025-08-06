import React from 'react';
import { Cpu, Activity, TrendingUp, Clock } from 'lucide-react';

const WorkerPanel = ({ workers }) => {
  const getStatusColor = (status) => {
    return status === 'busy' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getLoadColor = (load) => {
    if (load > 0.8) return 'bg-red-500';
    if (load > 0.6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-blue-600" />
          Worker Cluster
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workers.map(worker => (
            <div key={worker.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{worker.name}</h3>
                    <p className="text-sm text-gray-500">{worker.id}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(worker.status)}`}>
                  {worker.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Load</span>
                    <span className="font-medium">{Math.round(worker.getLoad() * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getLoadColor(worker.getLoad())}`}
                      style={{ width: `${worker.getLoad() * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center space-x-1 text-gray-600 mb-1">
                      <Activity className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                    <p className="font-medium text-gray-900">{worker.currentJobs.size}/{worker.capacity}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-gray-600 mb-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Success</span>
                    </div>
                    <p className="font-medium text-gray-900">{Math.round(worker.getSuccessRate() * 100)}%</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 text-gray-600 mb-1">
                      <Clock className="w-3 h-3" />
                      <span>Total</span>
                    </div>
                    <p className="font-medium text-gray-900">{worker.totalExecuted}</p>
                  </div>
                </div>

                {worker.currentJobs.size > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Current Jobs:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(worker.currentJobs).slice(0, 3).map(jobId => (
                        <span key={jobId} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {jobId.split('-')[0]}...
                        </span>
                      ))}
                      {worker.currentJobs.size > 3 && (
                        <span className="text-xs text-gray-500">+{worker.currentJobs.size - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerPanel;
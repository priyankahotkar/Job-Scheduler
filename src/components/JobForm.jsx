import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const JobForm = ({ job, onSubmit, onClose, existingJobs = [] }) => {
  const [formData, setFormData] = useState({
    name: job?.name || '',
    description: job?.description || '',
    schedule: job?.schedule || 'every 5 minutes',
    command: job?.command || '',
    priority: job?.priority || 'Medium',
    dependencies: job?.dependencies || [],
    retryPolicy: {
      maxRetries: job?.retryPolicy?.maxRetries || 3,
      backoffMs: job?.retryPolicy?.backoffMs || 1000
    }
  });

  const [newDependency, setNewDependency] = useState('');

  const scheduleOptions = [
    'every 1 minute',
    'every 5 minutes',
    'every 15 minutes',
    'every 30 minutes',
    'every 1 hour',
    'every 6 hours',
    'daily at 12 AM',
    'daily at 6 AM',
    'daily at 12 PM',
    'daily at 6 PM',
    'weekly'
  ];

  const availableDependencies = existingJobs
    .filter(j => j.id !== job?.id)
    .map(j => ({ id: j.id, name: j.name }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: job?.id || `job-${Date.now()}`,
      ...formData
    });
  };

  const addDependency = () => {
    if (newDependency && !formData.dependencies.includes(newDependency)) {
      setFormData({
        ...formData,
        dependencies: [...formData.dependencies, newDependency]
      });
      setNewDependency('');
    }
  };

  const removeDependency = (depId) => {
    setFormData({
      ...formData,
      dependencies: formData.dependencies.filter(id => id !== depId)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            {job ? 'Edit Job' : 'Create New Job'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter job name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what this job does"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule
              </label>
              <select
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {scheduleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Command/Method
              </label>
              <input
                type="text"
                required
                value={formData.command}
                onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., processData(), /api/sync, backup.sh"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Retries
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.retryPolicy.maxRetries}
                onChange={(e) => setFormData({
                  ...formData,
                  retryPolicy: { ...formData.retryPolicy, maxRetries: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Retry Backoff (ms)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={formData.retryPolicy.backoffMs}
                onChange={(e) => setFormData({
                  ...formData,
                  retryPolicy: { ...formData.retryPolicy, backoffMs: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dependencies
            </label>
            
            {formData.dependencies.length > 0 && (
              <div className="mb-3 space-y-2">
                {formData.dependencies.map(depId => {
                  const dep = availableDependencies.find(d => d.id === depId);
                  return (
                    <div key={depId} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md">
                      <span className="text-sm">{dep?.name || depId}</span>
                      <button
                        type="button"
                        onClick={() => removeDependency(depId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {availableDependencies.length > 0 && (
              <div className="flex items-center space-x-2">
                <select
                  value={newDependency}
                  onChange={(e) => setNewDependency(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a dependency</option>
                  {availableDependencies
                    .filter(dep => !formData.dependencies.includes(dep.id))
                    .map(dep => (
                      <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={addDependency}
                  disabled={!newDependency}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {availableDependencies.length === 0 && (
              <p className="text-sm text-gray-500">No other jobs available for dependencies</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
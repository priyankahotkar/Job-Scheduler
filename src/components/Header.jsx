import React from 'react';

const Header = () => (
  <header className="w-full bg-white border-b border-gray-200 py-6 mb-8 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CareEco Distributed Job Scheduler</h1>
        <p className="text-gray-600 mt-1 text-base">
          Manage and monitor distributed job execution across your cluster
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-4">
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-medium"
        >
          GitHub
        </a>
        <a
          href="mailto:support@careeco.com"
          className="text-gray-600 hover:underline font-medium"
        >
          Support
        </a>
      </div>
    </div>
  </header>
);

export default Header;
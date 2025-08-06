import React from 'react';

const Footer = () => (
  <footer className="w-full border-t border-gray-200 bg-white py-6 mt-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-gray-800">CareEco Distributed Job Scheduler</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-500 text-sm">© {new Date().getFullYear()} CareEco. All rights reserved.</span>
      </div>
      <div className="flex items-center space-x-4 text-sm">
        <a
          href="https://github.com/priyankahotkar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          GitHub
        </a>
        <a
          href="mailto:support@careeco.com"
          className="text-gray-600 hover:underline"
        >
          Contact Support
        </a>
        <a
          href="#"
          className="text-gray-600 hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
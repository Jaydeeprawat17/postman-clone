import React from 'react';
import { Send } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Send className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">REST Client</h1>
            <p className="text-sm text-gray-600">Professional API testing tool</p>
          </div>
        </div>
      </div>
    </header>
  );
}
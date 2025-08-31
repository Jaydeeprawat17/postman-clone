import React, { useState, useMemo } from 'react';
import { Clock, Trash2, Search, Filter } from 'lucide-react';
import { RequestHistoryItem } from '../types';

interface RequestHistoryProps {
  history: RequestHistoryItem[];
  onSelectRequest: (request: RequestHistoryItem) => void;
  onDeleteRequest: (id: string) => void;
  onClearHistory: () => void;
}

export function RequestHistory({ history, onSelectRequest, onDeleteRequest, onClearHistory }: RequestHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMethod = methodFilter === 'ALL' || item.method === methodFilter;
      return matchesSearch && matchesMethod;
    });
  }, [history, searchTerm, methodFilter]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'text-green-700 bg-green-100',
      POST: 'text-blue-700 bg-blue-100',
      PUT: 'text-yellow-700 bg-yellow-100',
      DELETE: 'text-red-700 bg-red-100',
    };
    return colors[method as keyof typeof colors] || 'text-gray-700 bg-gray-100';
  };

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-500';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={20} />
            History
          </h2>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto">
        {paginatedHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {history.length === 0 ? (
              <p>No requests yet. Send your first request to see it here!</p>
            ) : (
              <p>No requests match your search criteria.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginatedHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectRequest(item)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(item.method)}`}>
                      {item.method}
                    </span>
                    {item.response && (
                      <span className={`text-xs font-medium ${getStatusColor(item.response.status)}`}>
                        {item.response.status}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-900 font-medium mb-1 truncate">
                  {item.url}
                </div>
                
                <div className="text-xs text-gray-500">
                  {formatTime(item.timestamp)}
                  {item.response && (
                    <span className="ml-2">• {item.response.duration}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} requests
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
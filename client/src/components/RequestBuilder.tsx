import React, { useState } from 'react';
import { Send, Plus, Trash2, Zap } from 'lucide-react';
import { ApiResponse } from '../types';

interface RequestBuilderProps {
  onSendRequest: (method: string, url: string, headers: Record<string, string>, body?: string) => Promise<ApiResponse>;
  loading: boolean;
}

export function RequestBuilder({ onSendRequest, loading }: RequestBuilderProps) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [headers, setHeaders] = useState<Array<{ key: string; value: string; enabled: boolean }>>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [activeTab, setActiveTab] = useState('headers');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const enabledHeaders = headers
      .filter(h => h.enabled && h.key.trim() && h.value.trim())
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    await onSendRequest(method, url, enabledHeaders, body.trim() || undefined);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    setHeaders(updated);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const methodColors = {
    GET: 'bg-green-100 text-green-800 border-green-200',
    POST: 'bg-blue-100 text-blue-800 border-blue-200',
    PUT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    DELETE: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* URL and Method */}
        <div className="flex gap-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={`px-4 py-2 rounded-md border font-medium text-sm min-w-[100px] ${methodColors[method as keyof typeof methodColors]}`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter request URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Request
              </>
            )}
          </button>
        </div>

        {/* Real-time indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-blue-50 px-3 py-2 rounded-md">
          <Zap size={14} className="text-blue-500" />
          <span>Real-time response rendering • No page reloads</span>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['headers', 'body'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'headers' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Headers</h3>
              <button
                type="button"
                onClick={addHeader}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors"
              >
                <Plus size={16} />
                Add Header
              </button>
            </div>
            
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Header name"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Header value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Request Body</h3>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={method === 'GET' ? 'Request body is not typically used with GET requests' : 'Enter request body (JSON format)\n\nExample:\n{\n  "title": "My Post",\n  "body": "This is the content",\n  "userId": 1\n}'}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none leading-relaxed"
              disabled={method === 'GET'}
            />
            {method !== 'GET' && (
              <p className="text-xs text-gray-500">
                Enter your request body in JSON format. Response will appear instantly below.
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
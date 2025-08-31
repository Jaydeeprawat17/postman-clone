import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Code } from 'lucide-react';
import { ApiResponse } from '../types';

interface ResponseViewerProps {
  response: ApiResponse | null;
  loading: boolean;
}

export function ResponseViewer({ response, loading }: ResponseViewerProps) {
  const [activeTab, setActiveTab] = useState('pretty');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!response) return;
    
    const content = formatJson(response.data);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50 border-green-200';
    if (status >= 400) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const renderJsonWithSyntaxHighlight = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return (
        <div className="space-y-1">
          {renderJsonValue(obj, 0)}
        </div>
      );
    } catch {
      return <span className="text-gray-800">{jsonString}</span>;
    }
  };

  const renderJsonValue = (value: any, depth: number): React.ReactNode => {
    const indent = '  '.repeat(depth);
    
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{String(value)}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-600">[]</span>;
      
      return (
        <div>
          <span className="text-gray-600">[</span>
          <div className="ml-4">
            {value.map((item, index) => (
              <div key={index}>
                {renderJsonValue(item, depth + 1)}
                {index < value.length - 1 && <span className="text-gray-600">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-600">]</span>
        </div>
      );
    }
    
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return <span className="text-gray-600">{}</span>;
      
      return (
        <div>
          <span className="text-gray-600">{'{'}</span>
          <div className="ml-4">
            {keys.map((key, index) => (
              <div key={key} className="flex">
                <span className="text-red-600">"{key}"</span>
                <span className="text-gray-600 mx-1">:</span>
                <span>{renderJsonValue(value[key], depth + 1)}</span>
                {index < keys.length - 1 && <span className="text-gray-600">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-600">{'}'}</span>
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <span className="text-gray-600 text-sm">Sending request...</span>
            <div className="mt-2 text-xs text-gray-500">Response will appear here without page reload</div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No response yet</p>
          <p className="text-sm mt-2">Send a request to see the live response here</p>
          <div className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-lg p-3 max-w-md mx-auto">
            <p className="font-medium mb-1">✨ Real-time Response Rendering</p>
            <p>Responses appear instantly without page reloads, with syntax highlighting and formatted JSON</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Response Status */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(response.status)}`}>
            {response.status} {response.statusText}
          </span>
          <span className="text-sm text-gray-600">
            Time: {response.duration}ms
          </span>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Live Response
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(formatJson(response.data))}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4">
          {['pretty', 'raw', 'headers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'pretty' ? 'Pretty' : tab === 'raw' ? 'Raw' : 'Headers'}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'pretty' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Formatted Response</span>
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Live rendering enabled</span>
              </div>
            </div>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto text-sm font-mono max-h-96 border leading-relaxed">
              <code className="block">
                {typeof response.data === 'object' ? 
                  renderJsonWithSyntaxHighlight(formatJson(response.data)) : 
                  <span className="text-gray-800">{String(response.data)}</span>
                }
              </code>
            </pre>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Raw Response</span>
              <div className="flex items-center gap-2">
                <Code size={16} className="text-gray-400" />
                <span className="text-xs text-gray-500">Unformatted data</span>
              </div>
            </div>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto text-sm font-mono max-h-96 border">
              <code className="text-gray-800">{formatJson(response.data)}</code>
            </pre>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Response Headers</span>
              <span className="text-xs text-gray-500">{Object.keys(response.headers).length} headers</span>
            </div>
            {Object.entries(response.headers).map(([key, value]) => (
              <div key={key} className="flex gap-4 py-2 border-b border-gray-100 last:border-b-0">
                <div className="font-medium text-sm text-gray-700 min-w-[150px]">{key}:</div>
                <div className="text-sm text-gray-600 font-mono break-all">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
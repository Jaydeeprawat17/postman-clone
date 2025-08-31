import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { RequestBuilder } from "./components/RequestBuilder";
import { ResponseViewer } from "./components/ResponseViewer";
import { RequestHistory } from "./components/RequestHistory";
import { makeRequest } from "./utils/api";
import {
  saveToHistory,
  getHistory,
  clearHistory,
  deleteFromHistory,
} from "./utils/storage";
import { RequestHistoryItem, ApiResponse } from "./types";

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getHistory();
      setHistory(result.items);
    };
    fetchHistory();
  }, []);

  const handleSendRequest = async (
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: string
  ): Promise<ApiResponse> => {
    setLoading(true);
    // Don't clear response immediately to show loading state over previous response

    try {
      const apiResponse = await makeRequest(method, url, headers, body);
      // Set response immediately for real-time rendering
      setResponse(apiResponse);

      // Save to history
      const historyItem: RequestHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        method: method as RequestHistoryItem["method"],
        url,
        headers,
        body,
        timestamp: Date.now(),
        response: apiResponse,
      };

      saveToHistory(historyItem);
      const result = await getHistory();
      setHistory(result.items);

      return apiResponse;
    } catch (error) {
      const errorResponse = error as ApiResponse;
      // Show error response immediately
      setResponse(errorResponse);

      // Save error to history too
      const historyItem: RequestHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        method: method as RequestHistoryItem["method"],
        url,
        headers,
        body,
        timestamp: Date.now(),
        response: errorResponse,
      };

      saveToHistory(historyItem);
      const result = await getHistory();
      setHistory(result.items);

      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRequest = (request: RequestHistoryItem) => {
    // Show the response immediately when selecting from history
    if (request.response) {
      setResponse(request.response);
    }
  };

  const handleDeleteRequest = (id: string) => {
    deleteFromHistory(id);
    getHistory().then((result) => setHistory(result.items));
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - History */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 p-4">
          <RequestHistory
            history={history}
            onSelectRequest={handleSelectRequest}
            onDeleteRequest={handleDeleteRequest}
            onClearHistory={handleClearHistory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Live Response Indicator */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Live Response Mode
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  Responses render instantly without page refreshes • Real-time
                  JSON formatting • Syntax highlighting
                </span>
              </div>
            </div>

            <RequestBuilder
              onSendRequest={handleSendRequest}
              loading={loading}
            />

            <ResponseViewer response={response} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

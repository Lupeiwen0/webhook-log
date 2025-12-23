'use client';

import { useState, useEffect } from 'react';

interface WebhookLog {
  id: number;
  method: string;
  url: string;
  headers: string;
  body: string | null;
  query: string | null;
  ip: string | null;
  created_at: number;
}

export default function Home() {
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState(30);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLog | null>(null);

  const fetchWebhooks = async (minutes: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs?minutes=${minutes}`);
      const data = await response.json();
      if (data.success) {
        setWebhooks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks(timeFilter);
    const interval = setInterval(() => {
      fetchWebhooks(timeFilter);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [timeFilter]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatJson = (jsonString: string | null) => {
    if (!jsonString) return 'N/A';
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Webhook 日志系统</h1>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Webhook 接收地址:</p>
            <code className="bg-gray-100 px-3 py-2 rounded block text-sm">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook` : '/api/webhook'}
            </code>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter(30)}
              className={`px-4 py-2 rounded ${
                timeFilter === 30
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              最近 30 分钟
            </button>
            <button
              onClick={() => setTimeFilter(60)}
              className={`px-4 py-2 rounded ${
                timeFilter === 60
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              最近 1 小时
            </button>
            <button
              onClick={() => setTimeFilter(240)}
              className={`px-4 py-2 rounded ${
                timeFilter === 240
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              最近 4 小时
            </button>
            <button
              onClick={() => fetchWebhooks(timeFilter)}
              className="ml-auto px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              刷新
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                日志记录 ({webhooks.length} 条)
              </h2>
              
              {webhooks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无日志记录</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时间
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          方法
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {webhooks.map((webhook) => (
                        <tr key={webhook.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {webhook.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(webhook.created_at)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${
                              webhook.method === 'POST' ? 'bg-green-100 text-green-800' :
                              webhook.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                              webhook.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              webhook.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {webhook.method}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                            {webhook.url}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {webhook.ip}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <button
                              onClick={() => setSelectedWebhook(webhook)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              查看详情
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {selectedWebhook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold">Webhook 详情 #{selectedWebhook.id}</h3>
                  <button
                    onClick={() => setSelectedWebhook(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">基本信息</h4>
                    <div className="bg-gray-50 p-4 rounded">
                      <p><span className="font-medium">时间:</span> {formatDate(selectedWebhook.created_at)}</p>
                      <p><span className="font-medium">方法:</span> {selectedWebhook.method}</p>
                      <p><span className="font-medium">IP:</span> {selectedWebhook.ip}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">URL</h4>
                    <div className="bg-gray-50 p-4 rounded break-all">
                      {selectedWebhook.url}
                    </div>
                  </div>

                  {selectedWebhook.query && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">查询参数</h4>
                      <div className="bg-gray-50 p-4 rounded break-all">
                        {selectedWebhook.query}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">请求头</h4>
                    <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                      {formatJson(selectedWebhook.headers)}
                    </pre>
                  </div>

                  {selectedWebhook.body && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">请求体</h4>
                      <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
                        {formatJson(selectedWebhook.body)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedWebhook(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

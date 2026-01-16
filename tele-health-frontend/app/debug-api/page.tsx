'use client';

import { useEffect, useState } from 'react';

export default function DebugAPIPage() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
    setApiUrl(url);
  }, []);

  const testHealthEndpoint = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      // Test health endpoint (should work without auth)
      const healthUrl = apiUrl.replace('/api/v1', '') + '/health';
      console.log('Testing health endpoint:', healthUrl);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: healthUrl,
        data: data,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        url: apiUrl.replace('/api/v1', '') + '/health',
      });
    } finally {
      setLoading(false);
    }
  };

  const testRegisterEndpoint = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const registerUrl = apiUrl + '/auth/patient/register';
      console.log('Testing register endpoint:', registerUrl);
      
      // Test with dummy data (will fail validation but should not be 404)
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          email: 'test@test.com',
          password: 'test123',
        }),
      });

      const data = await response.json().catch(() => ({ error: 'Could not parse response' }));
      
      setTestResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: registerUrl,
        data: data,
        note: response.status === 400 ? 'Endpoint exists! (400 = validation error, which is expected)' : '',
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        url: apiUrl + '/auth/patient/register',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Configuration Debug</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
        <div className="space-y-2">
          <div>
            <strong>NEXT_PUBLIC_API_URL:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded">{apiUrl}</code>
          </div>
          <div>
            <strong>Environment:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded">{process.env.NODE_ENV}</code>
          </div>
          <div className="mt-4">
            <strong>Expected Registration URL:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded block mt-1">
              {apiUrl}/auth/patient/register
            </code>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={testHealthEndpoint}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Health Endpoint'}
        </button>
        
        <button
          onClick={testRegisterEndpoint}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? 'Testing...' : 'Test Register Endpoint'}
        </button>
      </div>

      {testResult && (
        <div className={`p-6 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className="text-xl font-semibold mb-4">
            {testResult.success ? '✅ Success' : '❌ Error'}
          </h2>
          <div className="space-y-2">
            <div>
              <strong>URL:</strong> <code>{testResult.url}</code>
            </div>
            <div>
              <strong>Status:</strong> {testResult.status} {testResult.statusText}
            </div>
            {testResult.note && (
              <div className="text-green-700 font-semibold">{testResult.note}</div>
            )}
            {testResult.error && (
              <div className="text-red-700">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}
            {testResult.data && (
              <div>
                <strong>Response:</strong>
                <pre className="bg-white p-4 rounded mt-2 overflow-auto">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>404 Error:</strong> The endpoint doesn't exist at that URL. Check:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li>Is your backend deployed and running?</li>
              <li>Is the NEXT_PUBLIC_API_URL correct?</li>
              <li>Did you rebuild the frontend after setting the environment variable?</li>
            </ul>
          </li>
          <li>
            <strong>CORS Error:</strong> Backend CORS settings need to allow your frontend domain
          </li>
          <li>
            <strong>Network Error:</strong> Backend might not be accessible from the internet
          </li>
        </ul>
      </div>
    </div>
  );
}


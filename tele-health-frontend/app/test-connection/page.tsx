'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestConnectionPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';
  const backendBaseUrl = apiUrl.replace('/api/v1', '');

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, ...result, timestamp: new Date().toISOString() }]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);
    
    // Test 1: Environment Variable
    addResult('Environment Check', {
      status: 'info',
      message: `NEXT_PUBLIC_API_URL: ${apiUrl}`,
      details: {
        isSet: !!process.env.NEXT_PUBLIC_API_URL,
        value: apiUrl,
        isLocalhost: apiUrl.includes('localhost'),
      },
    });

    // Test 2: Health Endpoint
    try {
      const healthUrl = `${backendBaseUrl}/health`;
      addResult('Health Check', {
        status: 'testing',
        message: `Testing: ${healthUrl}`,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        addResult('Health Check', {
          status: 'success',
          message: 'Backend is accessible!',
          details: data,
        });
      } else {
        addResult('Health Check', {
          status: 'error',
          message: `Backend returned status: ${response.status}`,
          details: { status: response.status, statusText: response.statusText },
        });
      }
    } catch (error: any) {
      addResult('Health Check', {
        status: 'error',
        message: error.message || 'Connection failed',
        details: {
          error: error.name,
          message: error.message,
          isTimeout: error.name === 'AbortError',
          isNetworkError: !error.response,
        },
      });
    }

    // Test 3: Login Endpoint
    try {
      const loginUrl = `${apiUrl}/auth/login`;
      addResult('Login Endpoint Check', {
        status: 'testing',
        message: `Testing: ${loginUrl}`,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(loginUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
        }),
      });

      clearTimeout(timeoutId);

      // We expect this to fail (wrong credentials), but it should reach the server
      const data = await response.json().catch(() => ({}));
      
      if (response.status === 404 || response.status === 401) {
        // These are expected - means server is reachable
        addResult('Login Endpoint Check', {
          status: 'success',
          message: `Server is reachable (Status: ${response.status})`,
          details: {
            status: response.status,
            statusText: response.statusText,
            message: data.message || 'Endpoint exists',
          },
        });
      } else {
        addResult('Login Endpoint Check', {
          status: 'warning',
          message: `Unexpected status: ${response.status}`,
          details: { status: response.status, data },
        });
      }
    } catch (error: any) {
      addResult('Login Endpoint Check', {
        status: 'error',
        message: error.message || 'Connection failed',
        details: {
          error: error.name,
          message: error.message,
          isTimeout: error.name === 'AbortError',
          isNetworkError: !error.response,
        },
      });
    }

    // Test 4: CORS Check
    try {
      const corsUrl = `${apiUrl}/auth/login`;
      const response = await fetch(corsUrl, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      addResult('CORS Check', {
        status: response.ok ? 'success' : 'warning',
        message: `CORS preflight: ${response.ok ? 'OK' : 'May have issues'}`,
        details: {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      });
    } catch (error: any) {
      addResult('CORS Check', {
        status: 'error',
        message: 'CORS check failed',
        details: { error: error.message },
      });
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'testing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Connection Diagnostic Tool</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Current Configuration</h2>
        <div className="space-y-1 text-sm">
          <div><strong>NEXT_PUBLIC_API_URL:</strong> <code className="bg-white px-2 py-1 rounded">{apiUrl}</code></div>
          <div><strong>Backend Base URL:</strong> <code className="bg-white px-2 py-1 rounded">{backendBaseUrl}</code></div>
          <div><strong>Environment:</strong> <code className="bg-white px-2 py-1 rounded">{process.env.NODE_ENV}</code></div>
        </div>
      </div>

      <Button
        onClick={testConnection}
        disabled={loading}
        className="mb-6"
      >
        {loading ? 'Testing...' : 'Run Connection Tests'}
      </Button>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          {results.map((result, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{result.test}</h3>
                <span className="text-xs opacity-75">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mb-2">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>If all tests fail:</strong> Your backend is not accessible. Check if it's deployed and running.</li>
          <li><strong>If health check fails but login works:</strong> Check the health endpoint route.</li>
          <li><strong>If you see "localhost" in the URL:</strong> The environment variable is not set. Rebuild your frontend after setting it.</li>
          <li><strong>If you get CORS errors:</strong> Check your backend CORS configuration.</li>
          <li><strong>If you get timeouts:</strong> The backend might be slow or not responding. Check server logs.</li>
        </ul>
      </div>
    </div>
  );
}



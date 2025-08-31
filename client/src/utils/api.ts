import { ApiResponse } from '../types';

export async function makeRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: string
): Promise<ApiResponse> {
  const startTime = Date.now();
  
  try {
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      config.body = body;
    }

    const response = await fetch(url, config);
    const endTime = Date.now();
    
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: responseHeaders,
      duration: endTime - startTime,
    };
  } catch (error) {
    const endTime = Date.now();
    throw {
      status: 0,
      statusText: 'Network Error',
      data: { error: error.message },
      headers: {},
      duration: endTime - startTime,
    };
  }
}
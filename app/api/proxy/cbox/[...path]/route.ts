import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';
  
  // Reconstruct the full URL with proper subdomain
  // Path format: subdomain.cbox.ws/resource or www3.cbox.ws/resource
  let targetUrl: string;
  
  if (path.includes('.cbox.ws/')) {
    // Path contains full domain: static.cbox.ws/jsc/file.js
    targetUrl = `https://${path}${queryString}`;
  } else if (path.startsWith('static.cbox.ws') || path.startsWith('www3.cbox.ws') || path.match(/^www\d+\.cbox\.ws/)) {
    // Path starts with domain: static.cbox.ws or www3.cbox.ws
    targetUrl = `https://${path}${queryString}`;
  } else {
    // Regular path: assume www3.cbox.ws
    targetUrl = `https://www3.cbox.ws/${path}${queryString}`;
  }
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Accept': request.headers.get('accept') || '*/*',
        'Referer': 'https://www3.cbox.ws/',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('javascript') || contentType.includes('css')) {
      let data = await response.text();
      // Replace cbox.ws URLs in JS/CSS files
      data = data
        .replace(/https?:\/\/static\.cbox\.ws\//g, '/api/proxy/cbox/static.cbox.ws/')
        .replace(/https?:\/\/www3\.cbox\.ws\//g, '/api/proxy/cbox/www3.cbox.ws/')
        .replace(/https?:\/\/www\d*\.cbox\.ws\//g, '/api/proxy/cbox/www3.cbox.ws/')
        .replace(/(['"])\/api\?/g, '$1/api/proxy/cbox/www3.cbox.ws/api?')
        .replace(/\burl\s*:\s*['"]\/api\?/g, 'url:"/api/proxy/cbox/www3.cbox.ws/api?')
        .replace(/fetch\s*\(\s*['"]\/api\?/g, 'fetch("/api/proxy/cbox/www3.cbox.ws/api?')
        .replace(/src=["']\/(?!api\/proxy)/g, 'src="/api/proxy/cbox/www3.cbox.ws/')
        .replace(/href=["']\/(?!api\/proxy)/g, 'href="/api/proxy/cbox/www3.cbox.ws/');
      
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.arrayBuffer();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': contentType.includes('image') ? 'public, max-age=86400' : 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';
  
  // Reconstruct the full URL with proper subdomain
  let targetUrl: string;
  
  if (path.includes('.cbox.ws/')) {
    targetUrl = `https://${path}${queryString}`;
  } else if (path.startsWith('static.cbox.ws') || path.startsWith('www3.cbox.ws') || path.match(/^www\d+\.cbox\.ws/)) {
    targetUrl = `https://${path}${queryString}`;
  } else {
    targetUrl = `https://www3.cbox.ws/${path}${queryString}`;
  }
  
  try {
    const body = await request.arrayBuffer();
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Referer': 'https://www3.cbox.ws/',
      },
      body: body,
    });

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post resource' },
      { status: 500 }
    );
  }
}

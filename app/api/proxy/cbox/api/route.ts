import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';
  
  const targetUrl = `https://www3.cbox.ws/api${queryString}`;
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Accept': request.headers.get('accept') || '*/*',
        'Accept-Language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
        'Referer': 'https://www3.cbox.ws/',
        'Origin': 'https://www3.cbox.ws',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('json')) {
      const data = await response.text();
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (contentType.includes('javascript') || contentType.includes('css')) {
      let data = await response.text();
      // Replace cbox.ws URLs in JS/CSS files
      data = data
        .replace(/https?:\/\/static\.cbox\.ws\//g, '/api/proxy/cbox/static.cbox.ws/')
        .replace(/https?:\/\/www3\.cbox\.ws\//g, '/api/proxy/cbox/www3.cbox.ws/')
        .replace(/https?:\/\/www\d*\.cbox\.ws\//g, '/api/proxy/cbox/www3.cbox.ws/')
        .replace(/(['"])\/api\?/g, '$1/api/proxy/cbox/www3.cbox.ws/api?')
        .replace(/\burl\s*:\s*['"]\/api\?/g, 'url:"/api/proxy/cbox/www3.cbox.ws/api?');
      
      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const data = await response.arrayBuffer();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from cbox.ws API' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  const queryString = searchParams ? `?${searchParams}` : '';
  
  const targetUrl = `https://www3.cbox.ws/api${queryString}`;
  
  try {
    const body = await request.arrayBuffer();
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Referer': 'https://www3.cbox.ws/',
        'Origin': 'https://www3.cbox.ws',
      },
      body: body,
    });

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post to cbox.ws API' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

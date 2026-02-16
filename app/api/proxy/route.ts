import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const boxid = searchParams.get('boxid') || '3548579';
  const boxtag = searchParams.get('boxtag') || 'ZJc4tl';
  
  const targetUrl = `https://www3.cbox.ws/box/?boxid=${boxid}&boxtag=${boxtag}`;
  
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Accept': request.headers.get('accept') || '*/*',
        'Accept-Language': request.headers.get('accept-language') || 'en-US,en;q=0.9',
        'Referer': 'https://www3.cbox.ws/',
      },
    });

    const data = await response.text();
    
    // Modify URLs in the response to point to our proxy
    const modifiedData = data
      // Replace absolute URLs
      .replace(/https?:\/\/www3\.cbox\.ws/g, '/api/proxy/cbox')
      .replace(/https?:\/\/www\d*\.cbox\.ws/g, '/api/proxy/cbox')
      // Replace relative URLs in src, href, and action attributes
      .replace(/src=["']\/(?!api\/proxy)/g, 'src="/api/proxy/cbox/')
      .replace(/href=["']\/(?!api\/proxy)/g, 'href="/api/proxy/cbox/')
      .replace(/action=["']\/(?!api\/proxy)/g, 'action="/api/proxy/cbox/')
      // Replace in JavaScript strings
      .replace(/(['"])\/api\?/g, '$1/api/proxy/cbox/api?')
      .replace(/\burl\s*:\s*['"]\/(?!api\/proxy)/g, 'url:"/api/proxy/cbox/')
      // Replace fetch and XHR calls
      .replace(/fetch\s*\(\s*['"]\/(?!api\/proxy)/g, 'fetch("/api/proxy/cbox/')
      .replace(/open\s*\(\s*['"][^'"]+['"]\s*,\s*['"]\/(?!api\/proxy)/g, (match) => {
        return match.replace(/['"]\//, '"/api/proxy/cbox/');
      });

    return new NextResponse(modifiedData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from cbox.ws' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = `https://www3.cbox.ws/box/?${searchParams.toString()}`;
  
  try {
    const body = await request.text();
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/x-www-form-urlencoded',
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
        'Referer': 'https://www3.cbox.ws/',
      },
      body: body,
    });

    const data = await response.text();

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
      { error: 'Failed to post to cbox.ws' },
      { status: 500 }
    );
  }
}

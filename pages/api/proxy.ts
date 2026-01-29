import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { url, method = 'GET', headers = {}, body } = req.body

    // Validar que la URL sea del dominio permitido
    const allowedDomains = ['www3.cbox.ws', 'cbox.ws']
    const targetUrl = new URL(url)
    
    if (!allowedDomains.includes(targetUrl.hostname)) {
      return res.status(403).json({ message: 'Domain not allowed' })
    }

    // Preparar headers para la petición
    const proxyHeaders: Record<string, string> = {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': req.headers.accept || '*/*',
      'Accept-Language': req.headers['accept-language'] || 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      ...headers
    }

    // Si hay cookies en la petición original, las pasamos
    if (req.headers.cookie) {
      proxyHeaders['Cookie'] = req.headers.cookie
    }

    // Realizar la petición al servidor original
    const response = await fetch(url, {
      method,
      headers: proxyHeaders,
      body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    })

    const responseData = await response.text()

    // Pasar las cookies de vuelta al cliente
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      res.setHeader('Set-Cookie', setCookieHeaders)
    }

    // Establecer headers de respuesta
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/plain')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return res.status(response.status).send(responseData)

  } catch (error) {
    console.error('Proxy error:', error)
    return res.status(500).json({ 
      message: 'Proxy error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

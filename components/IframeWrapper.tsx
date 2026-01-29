'use client'

import React, { useState, useRef, useEffect } from 'react'

interface IframeWrapperProps {
  src: string
  className?: string
  allowtransparency?: string
  allow?: string
  frameBorder?: number
  marginHeight?: number
  marginWidth?: number
  scrolling?: string
}

export default function IframeWrapper({ src, className = '', ...props }: IframeWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Función para inyectar código en el textarea del iframe
  const injectCode = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    
    try {
      // Intentar acceder directamente al iframe (funcionará si no hay CORS)
      const iframe = iframeRef.current
      if (iframe?.contentWindow) {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
          const textarea = iframeDoc.querySelector('textarea[name="pst"]') as HTMLTextAreaElement
          
          if (textarea) {
            textarea.value = code
            textarea.focus()
            
            // Disparar eventos para simular escritura real
            const inputEvent = new Event('input', { bubbles: true })
            const changeEvent = new Event('change', { bubbles: true })
            textarea.dispatchEvent(inputEvent)
            textarea.dispatchEvent(changeEvent)
            
            setCode('')
            setIsVisible(false)
            setIsLoading(false)
            return
          }
        } catch {
          console.log('CORS detected, using proxy method')
        }
      }

      // Si hay CORS, usar el proxy para obtener la página y buscar formularios
      const proxyResponse = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: src,
          method: 'GET'
        })
      })

      if (proxyResponse.ok) {
        const html = await proxyResponse.text()
        
        // Buscar formularios en el HTML para entender la estructura
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const forms = doc.querySelectorAll('form')
        
        console.log('Found forms:', forms.length)
        forms.forEach((form, index) => {
          console.log(`Form ${index}:`, form.action, form.method)
          const textareas = form.querySelectorAll('textarea')
          textareas.forEach((ta, taIndex) => {
            console.log(`  Textarea ${taIndex}:`, ta.name, ta.placeholder)
          })
        })

        // Aquí podrías implementar lógica adicional para enviar el código
        // mediante el formulario encontrado usando el proxy
        
        alert('Código preparado. Debido a las restricciones de CORS, copia manualmente el código al textarea del chat.')
        navigator.clipboard.writeText(code)
        setCode('')
        setIsVisible(false)
      }
    } catch (error) {
      console.error('Error injecting code:', error)
      alert('Error al inyectar código. Copia manualmente: ' + code)
      navigator.clipboard.writeText(code)
    }
    
    setIsLoading(false)
  }

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + I para abrir/cerrar el panel
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
      
      // Escape para cerrar el panel
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  return (
    <div className="relative w-full h-full">
      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        className={`w-full h-full ${className}`}
        {...props}
      />
      
      {/* Botón flotante para abrir el panel */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
        title="Inyectar código (Ctrl+Shift+I)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </button>

      {/* Panel de inyección de código */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-2xl max-h-96 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Inyectar Código</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Área de texto */}
            <div className="flex-1 p-4">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Pega aquí el código que quieres enviar al chat..."
                className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Atajo: Ctrl+Shift+I
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsVisible(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={injectCode}
                  disabled={!code.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Inyectar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

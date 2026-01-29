'use client'

import { useState } from 'react'

export default function Instructions() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      {/* Botón de ayuda */}
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
        title="Ver instrucciones de uso"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Modal de instrucciones */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-2xl max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-green-600">
              <h3 className="text-lg font-semibold text-white">Instrucciones de Uso</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4 text-sm dark:text-gray-300">
                <div>
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">🎯 Cómo inyectar código:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Botón azul:</strong> Haz clic en el botón azul con icono de código (esquina superior derecha)</li>
                    <li><strong>Atajo:</strong> Presiona <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + Shift + I</kbd></li>
                    <li><strong>Escape:</strong> Presiona <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> para cerrar</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">🔄 Proceso de inyección:</h4>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Abre el panel de inyección</li>
                    <li>Pega tu código en el área de texto</li>
                    <li>Haz clic en &ldquo;Inyectar&rdquo;</li>
                    <li>El código aparecerá en el textarea del chat</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">⚠️ Solución de problemas:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>No funciona la inyección:</strong> Espera a que el chat cargue completamente</li>
                    <li><strong>Error de CORS:</strong> El sistema usará el proxy automáticamente</li>
                    <li><strong>Código no visible:</strong> Verifica que el textarea esté disponible en el chat</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Consejo:</h4>
                  <p className="text-blue-600 dark:text-blue-400 text-xs">
                    Si la inyección directa falla por CORS, el código se copiará automáticamente al portapapeles. 
                    Solo tendrás que pegarlo manualmente en el chat.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => setIsVisible(false)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
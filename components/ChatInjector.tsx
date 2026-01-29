'use client'

import { useEffect } from 'react'

interface ChatInjectorProps {
  targetTextareaSelector?: string
  onReady?: () => void
}

export function ChatInjector({ 
  targetTextareaSelector = 'textarea[name="pst"]',
  onReady 
}: ChatInjectorProps) {

  useEffect(() => {
    // Función para inyectar código directamente en el textarea
    const injectCodeToTextarea = (code: string): boolean => {
      try {
        // Buscar el textarea en el documento principal
        const textarea = document.querySelector(targetTextareaSelector) as HTMLTextAreaElement
        
        if (textarea) {
          // Establecer el nuevo valor
          textarea.value = code
          textarea.focus()
          
          // Disparar eventos para que la aplicación detecte el cambio
          const inputEvent = new Event('input', { bubbles: true, cancelable: true })
          const changeEvent = new Event('change', { bubbles: true, cancelable: true })
          const keyboardEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true })
          
          textarea.dispatchEvent(inputEvent)
          textarea.dispatchEvent(changeEvent)
          textarea.dispatchEvent(keyboardEvent)
          
          // Opcional: trigger de eventos específicos que pudiera necesitar el chat
          textarea.dispatchEvent(new Event('focus'))
          
          return true
        }
      } catch (error) {
        console.error('Error injecting code:', error)
      }
      return false
    }

    // Función para monitorear cuando el textarea esté disponible
    const waitForTextarea = (): Promise<HTMLTextAreaElement> => {
      return new Promise((resolve) => {
        const checkForTextarea = () => {
          const textarea = document.querySelector(targetTextareaSelector) as HTMLTextAreaElement
          if (textarea) {
            resolve(textarea)
          } else {
            setTimeout(checkForTextarea, 500)
          }
        }
        checkForTextarea()
      })
    }

    const initializeInjector = async () => {
      try {
        await waitForTextarea()
        onReady?.()
        
        // Agregar listener global para inyección de código
        const handleGlobalInject = (event: CustomEvent) => {
          if (event.detail && event.detail.code) {
            const success = injectCodeToTextarea(event.detail.code)
            
            // Enviar respuesta
            window.dispatchEvent(new CustomEvent('codeInjectResult', {
              detail: { success, error: success ? null : 'Textarea not found' }
            }))
          }
        }

        window.addEventListener('injectCode', handleGlobalInject as EventListener)
        
        return () => {
          window.removeEventListener('injectCode', handleGlobalInject as EventListener)
        }
      } catch (error) {
        console.error('Failed to initialize chat injector:', error)
      }
    }

    initializeInjector()
  }, [targetTextareaSelector, onReady])

  return null // Este componente no renderiza nada
}

// Función helper para uso externo
export const injectCodeToChat = (code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const handleResult = (event: CustomEvent) => {
      window.removeEventListener('codeInjectResult', handleResult as EventListener)
      resolve(event.detail.success)
    }
    
    window.addEventListener('codeInjectResult', handleResult as EventListener)
    window.dispatchEvent(new CustomEvent('injectCode', { detail: { code } }))
    
    // Timeout en caso de que no haya respuesta
    setTimeout(() => {
      window.removeEventListener('codeInjectResult', handleResult as EventListener)
      resolve(false)
    }, 2000)
  })
}
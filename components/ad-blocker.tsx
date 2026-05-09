'use client'

import { useEffect } from 'react'

/**
 * AdBlocker Component
 * Blocks common ad networks and tracking scripts
 * Integrates with content security policy
 */
export function AdBlocker() {
  useEffect(() => {
    // Block common ad networks
    const adNetworks = [
      'googleadservices.com',
      'pagead2.googlesyndication.com',
      'adservice.google.com',
      'ads.google.com',
      'googlesyndication.com',
      'doubleclick.net',
      'scorecardresearch.com',
      'quantserve.com',
      'c.amazon-adsystem.com',
      'amazon-adsystem.com',
    ]

    // Create script blocker
    const originalFetch = window.fetch
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.toString() || ''

      // Block requests to known ad networks
      for (const adNetwork of adNetworks) {
        if (url.includes(adNetwork)) {
          console.log(`[Light TV] Blocked ad request to: ${adNetwork}`)
          return Promise.reject(new Error(`Blocked by Light TV ad blocker`))
        }
      }

      return originalFetch.apply(this, args)
    }

    // Block iframes from ad networks
    const originalIframe = HTMLIFrameElement.prototype.setAttribute
    HTMLIFrameElement.prototype.setAttribute = function (name, value) {
      if (name === 'src') {
        for (const adNetwork of adNetworks) {
          if (value.includes(adNetwork)) {
            console.log(`[Light TV] Blocked ad iframe: ${adNetwork}`)
            return
          }
        }
      }
      return originalIframe.call(this, name, value)
    }

    // Block script tags from ad networks
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as HTMLElement
            if (element.tagName === 'SCRIPT') {
              const src = element.getAttribute('src') || ''
              for (const adNetwork of adNetworks) {
                if (src.includes(adNetwork)) {
                  console.log(`[Light TV] Blocked ad script: ${adNetwork}`)
                  element.remove()
                  return
                }
              }
            }
          }
        })
      })
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}

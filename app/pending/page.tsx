'use client'

import { PrinterAnimation } from '@/components/printer-animation'
import { useEffect, useState } from 'react'

export default function PendingPage() {
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    // Get username from session/cookie
    const storedUsername = document.cookie
      .split('; ')
      .find(row => row.startsWith('lighttv_username='))
      ?.split('=')[1]
    
    if (storedUsername) {
      setUsername(decodeURIComponent(storedUsername))
    }
  }, [])

  return <PrinterAnimation status="pending" username={username} />
}

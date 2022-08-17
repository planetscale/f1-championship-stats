import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import { useEffect, useState } from 'react'

import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }: AppProps) {
  const [favicon, setFavicon] = useState('/favicon_system.svg?v=2')

  useEffect(() => {
    const onChange = (event) => {
      setFavicon(`/favicon_${event.matches ? 'dark' : 'light'}.svg?v=2`)
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    if (query.addEventListener) {
      query.addEventListener('change', onChange)
    }
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeProvider attribute='class'>
      <Head>
        <link rel='icon' href='/favicon.ico?v=2' sizes='any' />
        <link rel='icon' href={favicon} sizes='any' type='image/svg+xml' />
      </Head>

      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp

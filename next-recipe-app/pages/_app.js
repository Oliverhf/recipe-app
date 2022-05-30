import Link from 'next/link'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <nav className='header'>
        <div>
          <Link href="/">
            Oliver's Kitchen
          </Link>
        </div>
      </nav>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  ) 

}

export default MyApp

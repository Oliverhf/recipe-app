import Link from 'next/link'
import '../styles/globals.css'
import Logo from '../public/assets/chef-kitchen.png'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {

  return (
    <>
      <nav className='header'>
        <div>
          <Link href="/">
            <Image className='block cursor-pointer z-20' src={Logo} alt="/"  width={300} height={80} />
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

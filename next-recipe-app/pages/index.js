import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home({data}) {
  const recipes = data.recipes
  return (
    <div className={styles.container}>
      <Link href="/">{recipes[0]?.title}</Link>
    </div>
  )
}

export function getStaticProps() {
  return {
    props: {
      data: {
        recipes: [
          {
            title: "Paineapple Smoothie"
          }
        ]
      }
    }
  }
}

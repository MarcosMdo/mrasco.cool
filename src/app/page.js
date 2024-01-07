'use client'
import styles from './page.module.css'
import Toaster from './components/toaster/Toaster';


export default function Home() {
  return (
    <main className={styles.main}>
      <Toaster></Toaster>
    </main>
  )
}

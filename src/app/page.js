'use client'
import styles from './page.module.css'
import Toaster from './components/toaster/Toaster';
import { Analytics } from '@vercel/analytics/react';



export default function Home() {
  return (
    <main className={styles.main}>
      <br></br>
      <br></br>
      <br></br>
      <Toaster></Toaster>
      <Analytics />
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../collection.module.css';
import Link from 'next/link';

import shmasi from '../../shmasi/shmasi_invert.png';

export default function CollectionPage({ params }) {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('')
  const { collectionName } = params;

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(`/api/getImages?collectionName=${collectionName}`);
        console.log('Response status:', res.status);
        const text = await res.text(); // Get the response as text
        console.log('Response text:', text);
        const data = JSON.parse(text); // Parse it manually
        setImages(data.images);
        setDescription(data.description);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchImages();
  }, [collectionName]);

  return (
    <div>
      <div className={styles.shmain}>
        <Link href="https://www.mrasco.cool/shmasi" className={styles.title}>shmasi</Link>
        <div className={styles.infoContainer}>
          <div className={styles.personalInfo}>
            <p className={styles.name}>Ali Younis (he/him)</p>
            <p className={styles.jobTitle}>Photographer</p>
            <p className={styles.location}>Southern California</p>
            <div className={styles.contactInfo}>
              <a href="mailto:shmasi.jpg@gmail.com" className={styles.email}>shmasi.jpg@gmail.com</a>
              <a href="https://www.instagram.com/shmasi.jpg/" target="_blank" rel="noopener noreferrer" className={styles.instagram}>Instagram</a>
          </div>
          </div>
          <div className={styles.logoContainer}>
            <Image
              src={shmasi}
              alt="Shmasi Logo"
              width={100}
              height={100}
              className={styles.logo}
            />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>{decodeURIComponent(collectionName)}</h1>
        {description && <h3 className={styles.description}>{description}</h3>}
        <div className={styles.imageGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <Image
                src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${image}`}
                alt={image}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
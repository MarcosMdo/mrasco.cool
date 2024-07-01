'use client'

import styles from './page.module.css';
import shmasi from './shmasi_invert.png';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
const region = process.env.NEXT_PUBLIC_S3_REGION;

export default function Shmasi() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/getCollections');
        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }
        const collectionsData = await response.json();
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

return (
  <div>
    <div className={styles.shmain}>
      <Link href="https://www.mrasco.cool/shmasi" className={styles.shmasititle}>shmasi</Link>
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
    <main className={styles.main}>
      {collections.map((collection, index) => (
        <CollectionCard key={index} collection={collection} />
      ))}
    </main>
  </div>
);
}

function CollectionCard({ collection }) {
  return (
      <div className={styles.card}>
        <Link href={`/collections/${collection.name}`} passHref={true} legacyBehavior>
          <a>
            {collection.randomImage && (
              <Image
                src={`https://${bucket}.s3.${region}.amazonaws.com/${collection.randomImage}`}
                alt={collection.name}
                width={800}
                height={600}
                className={styles.image}
                priority
              />
            )}
            <div className={styles.overlay}>
              <h3 className={styles.title}>{collection.name}</h3>
              <p className={styles.description}>{collection.description}</p>
            </div>
          </a>
        </Link>
      </div>
  );
}
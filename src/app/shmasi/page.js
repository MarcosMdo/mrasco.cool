'use client'

import styles from './page.module.css';
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
    <main className={styles.main}>
      {collections.map((collection, index) => (
        <CollectionCard key={index} collection={collection} />
      ))}
    </main>
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
            <h3>{collection.name}</h3>
            <p>{collection.description}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}
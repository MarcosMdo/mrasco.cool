'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../collection.module.css';

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
        //setDescription(data.description);
        console.log("desc: "+ description)
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }
    fetchImages();
  }, [collectionName]);

  return (
    <div className={styles.container}>
      <h1>{collectionName}</h1>
      {/* {description && <p className={styles.description}>{description}</p>} */}
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
  );
}
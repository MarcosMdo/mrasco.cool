import { NextResponse } from 'next/server';
import { S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const bucket = process.env.S3_BUCKET;
const prefix = 'shmasi/';
const region = process.env.AWS_REGION;

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET() {
  try {
    const { CommonPrefixes } = await s3.send(new ListObjectsCommand({ Bucket: bucket, Prefix: prefix, Delimiter: '/' }));
    const folderNames = CommonPrefixes.map(folder => folder.Prefix.split('/')[1]);

    const collectionsData = await Promise.all(folderNames.map(async (folder) => {
      const { Contents } = await s3.send(new ListObjectsCommand({ 
        Bucket: bucket, 
        Prefix: `${prefix}${folder}/`,
        MaxKeys: 50
      }));

      const images = Contents.filter(item => {
        const extension = item.Key.split('.').pop().toLowerCase();
        return ['heic', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension);
      }).map(item => item.Key);

      let randomImage = '';
      if (images.length > 0) {
        const randomIndex = Math.floor(Math.random() * images.length);
        randomImage = images[randomIndex];
      }

      const descriptionFile = Contents.find(item => item.Key === `${prefix}${folder}/description.txt`);

      let description = '';
      if (descriptionFile) {
        const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: descriptionFile.Key }));
        const descriptionText = await new Response(Body).text();
        description = descriptionText.trim();
      }

      return {
        name: folder,
        randomImage,
        description,
      };
    }));

    return NextResponse.json(collectionsData);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Error fetching collections' }, { status: 500 });
  }
}
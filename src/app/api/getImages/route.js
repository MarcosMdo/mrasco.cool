import { NextResponse } from 'next/server';
import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collectionName = searchParams.get('collectionName');

  if (!collectionName) {
    return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
  }

  try {
    const { Contents } = await s3.send(new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Prefix: `shmasi/${collectionName}/`,
    }));

    const images = Contents.filter(item => {
      const extension = item.Key.split('.').pop().toLowerCase();
      return ['heic', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension);
    }).map(item => item.Key);

    //const descriptionFile = Contents.find(item => item.Key === `shmasi/${collectionName}/description.txt`);
    //console.log("desc file: " + descriptionFile)
    // let description = '';

    // if (descriptionFile) {
    //   const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: descriptionFile.Key }));
    //   const descriptionText = await new Response(Body).text();
    //   description = descriptionText.trim();
    // }
    //console.log(description)

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}
'use client'
import styles from './page.module.css'
import Image from 'next/image'
import marctoast from './marctoast.gif'
import marctoaststill from './marctoaststill.png'
import discostill from './sparkledisco_still.png'
import disco from './sparkledisco.gif'
import margo from './margo.gif'
import margostill from './margostill.png'

import { useEffect, useState } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';


export default function Home() {
  
  const bucket = 'mrasco'
  const key = 'BigBrownEyes.mp3'
  const voiceKey = 'Valentine.m4a'
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isVoicePlaying, setVoiceIsPlaying] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const [index, setIndex] = useState(0);
  const colors = ["#f99696", "#ffa8a8", "#df4646", "#f08282", "#ffcaca", "#a70808", "#ffa7a7"]
  const [color, setColor] = useState(colors[index])


  useEffect(() => {
    const fetchSound = async () => {
      try {

        // Configure AWS SDK
        const s3 = new S3Client({
          region: 'us-east-2',
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
          },
        });
        
        // Fetch the audio file
        const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

        const blob = await streamToBlob(Body);
        const objectUrl = URL.createObjectURL(blob);

        var audio = new Audio(objectUrl);
        audio.volume = .7
        setSound(audio);
      } catch (error) {
        console.error('Error fetching mp3:', error);
      }
    };

    fetchSound();
  }, []);

  useEffect(() => {
    const fetchVoice = async () => {
      try {

        // Configure AWS SDK
        const s3 = new S3Client({
          region: 'us-east-2',
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
          },
        });
        
        // Fetch the audio file
        const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: voiceKey }));

        const blob = await streamToBlob(Body);
        const objectUrl = URL.createObjectURL(blob);

        var audio = new Audio(objectUrl);
        
        setVoice(audio);
      } catch (error) {
        console.error('Error fetching mp3:', error);
      }
    };

    fetchVoice();
  }, []);

  // Function to convert a ReadableStream to a Blob
  async function streamToBlob(readableStream) {
    const reader = readableStream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (!(value instanceof Uint8Array)) {
        throw new Error('Invalid value type in ReadableStream');
      }

      chunks.push(value);
    }

    return new Blob(chunks, { type: 'audio/mpeg' });
  }

  const handlePlaySound = () => {
    if (sound) {
      if (isVoicePlaying) {
        voice.pause()
      }
      if (isPlaying) {
        sound.pause(); // Pause the audio
      } else {
        sound.play(); // Play the audio
      }
    }

    // Toggle the playback status
    setIsPlaying(!isPlaying);
  };

  const handlePlayVoice = () => {
    if (voice) {
      if (isPlaying) {
        sound.pause(); // Pause the audio
      }
      if (isVoicePlaying) {
        voice.pause();
      } else {
        voice.play();
      }

    }

    // Toggle the playback status
    setVoiceIsPlaying(!isVoicePlaying);
  };

  const handleShowQuestion = () => {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
    }

  };

  useEffect(() => {
    const interval = setInterval(() => {
      if(isPlaying) {
        setColor(colors[index]);
        setIndex((index + 1) % 7);
      }
    }, 2000); // time in ms

    return () => clearInterval(interval);
  }, [isPlaying, color, index])
  
  return (
    <main className={styles.main} style={{ backgroundColor: color }}>
      <div className={styles.inner}>
        { isPlaying && 
          <div>
            <a onClick={handlePlaySound} >
            <Image  src={marctoast}
                    width={400}
                    height={400}
                    alt='click me'
                    className={styles.mrasco}>
            </Image>
          </a>

          <a onClick={handlePlayVoice} >
            <Image  src={disco}
                    width={400}
                    height={400}
                    alt='click me'
                    className={styles.mrasco}>
            </Image>
          </a>
          
          <a onClick={handleShowQuestion}>
          <Image  src={margo}
                  width={400}
                  height={400}
                  className={styles.mrasco}
                  alt='show question'>
          </Image>    
          </a>
        </div>
        }

        { !isPlaying &&
          <div>
            <a onClick={handlePlaySound} >
              <Image  src={marctoaststill}
                      width={400}
                      height={400}
                      alt='click me'
                      className={styles.mrasco}>
              </Image>
            </a>

          <a onClick={handlePlaySound} >
            <Image  src={discostill}
                    width={400}
                    height={400}
                    alt='click me'
                    className={styles.mrasco}>
            </Image>
          </a>
          
            <a onClick={handleShowQuestion}>
              <Image  src={margostill}
                      width={400}
                      height={400}
                      className={styles.mrasco}
                      alt='show question'>
              </Image>    
            </a>
          </div>
        }
      </div>
      <div className={styles.inner}>
      { isClicked && 
        <p className={styles.question}> will u be my valentine ?</p>
      }
      </div>
    </main>
  )
}

// components/Radio.js
'use client'
import { useState, useEffect, useRef } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const channels = [
  'radio/Avenida José de Diego.m4a',
  'radio/Central Park.m4a',
  'radio/Cumpleaños.m4a',
  'radio/El Yunque National Forest.m4a',
  'radio/Grandview Public Market.m4a',
  'radio/Guavatron.m4a',
  'radio/Home 2.m4a',
  'radio/Minerva 1974.mp3',
  'radio/N 19th Ave.m4a',
  'radio/Nassau Square.m4a',
  'radio/New Recording 12.m4a',
  'radio/New Recording 13.m4a',
  'radio/New Recording 21.m4a',
  'radio/New Recording 6.m4a',
  'radio/New Recording 8.m4a',
  'radio/New Recording.m4a',
  'radio/Nozomi 2.m4a',
  'radio/Nozomi.m4a',
  'radio/Salsa viejo San Juan.m4a',
  'radio/Thom.m4a',
  'radio/Tia Carmen Ana.m4a',
  'radio/Zendesk 2.m4a',
  'radio/Zendesk.m4a',
  'radio/Juana @ Pappy’s.m4a'
];

const Radio = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const scanInterval = useRef(null);

  const bucket = 'mrasco';
  const region = 'us-east-2';

  useEffect(() => {
    const savedChannel = localStorage.getItem('savedChannel');
    const savedVolume = localStorage.getItem('savedVolume');
    if (savedChannel) setCurrentChannelIndex(parseInt(savedChannel));
    if (savedVolume) setVolume(parseFloat(savedVolume));

    const handleBeforeUnload = () => {
      if (sound) {
        sound.pause();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const fetchSound = async () => {
      if (sound) {
        sound.pause();
        URL.revokeObjectURL(sound.src);
      }
      try {
        const s3 = new S3Client({
          region,
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
          },
        });
        const key = channels[currentChannelIndex];
        const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

        const blob = await streamToBlob(Body);
        const objectUrl = URL.createObjectURL(blob);
        const audio = new Audio(objectUrl);
        audio.loop = true; // Enable looping
        audio.onloadedmetadata = () => {
          const randomStartTime = Math.random() * audio.duration;
          audio.currentTime = randomStartTime;
        };
        setSound(audio);
      } catch (error) {
        console.error('Error fetching mp3:', error);
      }
    };

    fetchSound();
  }, [currentChannelIndex]);

  useEffect(() => {
    if (sound) {
      sound.volume = volume;
      if (isPlaying) {
        sound.play();
      } else {
        sound.pause();
      }
    }
  }, [sound, isPlaying]);

  useEffect(() => {
    if (isScanning) {
      scanInterval.current = setInterval(nextChannel, 5000);
    } else {
      clearInterval(scanInterval.current);
    }
    return () => clearInterval(scanInterval.current);
  }, [isScanning]);

  const playPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextChannel = () => {
    setCurrentChannelIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % channels.length;
      localStorage.setItem('savedChannel', newIndex);
      return newIndex;
    });
  };

  const prevChannel = () => {
    setCurrentChannelIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + channels.length) % channels.length;
      localStorage.setItem('savedChannel', newIndex);
      return newIndex;
    });
  };

  const scanChannels = () => {
    setIsScanning((prev) => !prev);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    localStorage.setItem('savedVolume', newVolume);
    if (sound) {
      sound.volume = newVolume;
    }
  };

  async function streamToBlob(readableStream) {
    const reader = readableStream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }

    return new Blob(chunks, { type: 'audio/mpeg' });
  }

  const getFileName = (filePath) => {
    return filePath.split('/').pop();
  };

  return (
    <div className="radio-container">
      <div className="radio-screen">
        {getFileName(channels[currentChannelIndex])}
      </div>
      <div className="radio-controls">
        <button onClick={prevChannel} className="radio-button">Back</button>
        <button onClick={playPause} className="radio-button">{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={scanChannels} className={`radio-button ${isScanning ? 'active' : ''}`}>Scan</button>
        <button onClick={nextChannel} className="radio-button">Forward</button>
      </div>
      <div className="volume-control">
        <label>Volume:</label>
        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
      </div>
      <style jsx>{`
        .radio-container {
          border: 2px solid #333;
          width: 400px;
          padding: 20px;
          border-radius: 15px;
          background-color: #444;
          font-family: 'Courier New', monospace;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          color: #fff;
        }
        .radio-screen {
          background-color: #222;
          color: #0f0;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 20px;
          animation: flicker 0.1s infinite alternate;
          font-size: 1.2em;
          border: 2px solid #555;
        }
        .radio-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .radio-button {
          background-color: #555;
          color: #fff;
          border: 1px solid #777;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.1s;
          font-size: 1em;
        }
        .radio-button:active {
          transform: scale(0.95);
        }
        .radio-button.active {
          background-color: #333;
          border-color: #ff0;
        }
        .radio-button:hover {
          background-color: #666;
        }
        .volume-control {
          display: flex;
          align-items: center;
        }
        .volume-control label {
          margin-right: 10px;
        }
        .volume-control input {
          width: 100%;
        }
        @keyframes flicker {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Radio;

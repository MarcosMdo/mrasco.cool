import React, { useState } from 'react';
import styles from './Toaster.module.css';
import Image from 'next/image';
import toaster from './toaster.png';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import useSound from 'use-sound';
import toasterPop from './toaster.mp3';
import toasterClick from './toasterClick.mp3';


const Toaster = () => {
  const [showText, setShowText] = useState(false);
  const [playPop] = useSound(toasterPop);
  const [playClick] = useSound(toasterClick);
  const [showInternal, setShowInternal] = useState(false);
  const [showExternal, setShowExternal] = useState(false);
  const [internalCounter, setInternalCounter] = useState(0);
  const [externalCounter, setExternalCounter] = useState(0);
  const internalLinks = ["/comingsoon", "/comingsoon", "mrasco"];
  const internalTexts = ["subtunes", "neo65", "mrasco"];
  const externalLinks = ["https://www.discofish.cool", "https://www.tummy.wtf"];
  const externalTexts = ["disco", "tummy"];


  const handleImageClick = () => {
    setShowText(!showText);
    if (!showText) {
      playPop();
      handlePopup();
    } else {
      playClick()
    }
    
  };

  const handlePopup = () => {

    var option = Math.random();
    console.log(option)
    
    if (option > 0.3) {
      setShowExternal(false);
      setShowInternal(true);
      setInternalCounter(() => Math.floor(Math.random() * 3));
    } else {
      setShowInternal(false);
      setShowExternal(true);
      setExternalCounter(() => Math.floor(Math.random() * 2));
    }
  }

  return (
    <div className={styles.toaster}>
      <AnimatePresence>
        {showText && (
          <motion.a
            className={styles.text}
            initial={{ opacity: 0, y: -30, x: 225 }}
            animate={{ opacity: 1, y: -80, x: 225 }}
            exit={{ opacity: 0, y: 90 }}
          >
            {showInternal && (
              <Link className={styles.toasterPop} href={internalLinks[internalCounter]}>{internalTexts[internalCounter]}</Link>
            )}
            {showExternal && (
              <Link className={styles.toasterPop} href={externalLinks[externalCounter]} target="_blank" rel="noreferrer">{externalTexts[externalCounter]}</Link>
            )}
          </motion.a>
        )}
      </AnimatePresence>
      <motion.div
        className={styles.imageContainer}
        onClick={handleImageClick}
        whileTap={{ scale: .9 }} 
        style={{cursor: 'pointer'}}
      >
        <Image src={toaster} alt='a toaster' />
      </motion.div>
    </div>
  );
};

export default Toaster;
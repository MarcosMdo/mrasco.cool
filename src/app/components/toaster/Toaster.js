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
  const [showOptions, setShowOptions] = useState(false);
  const [playPop] = useSound(toasterPop);
  const [playClick] = useSound(toasterClick);


  const handleImageClick = () => {
    setShowText(!showText);
    if (!showText) {
      playPop();
    } else {
      playClick()
    }
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  }

  return (
    <div className={styles.toaster}>
      <AnimatePresence>
        {showText && (
          <motion.h1
            className={styles.text}
            initial={{ opacity: 0, y: -20, x:175 }}
            animate={{ opacity: 1, y: -50, x:175}}
            exit={{ opacity: 0, y: 50 }}
            onClick={handleShowOptions}
          >
            mrasco.cool
          </motion.h1>
        )}
      </AnimatePresence>
      <motion.div
        className={styles.imageContainer}
        onClick={handleImageClick}
        //whileHover={{ scale: 1.1 }} // Add a hover effect for visual feedback
        whileTap={{ scale: 0.9 }} // Add a tap effect for visual feedback
      >
        <Image src={toaster} alt='a toaster' />
      </motion.div>
      <AnimatePresence>
        {showOptions && (
          <motion.div
            className={styles.options}
            initial={{ opacity: 0, y: -50, x:150 }}
            animate={{ opacity: 1, y: -50, x:150}}
            exit={{ opacity: 0, y: -50, x: 150}}
          >
            <ul>
              <Link href="/comingsoon">new</Link>
              <Link href="/comingsoon">option 2</Link>
              <a href="https://www.discofish.cool" target="_blank" rel="noreferrer">go</a>
              <Link href="/mrasco">mrasco</Link>
            </ul>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;

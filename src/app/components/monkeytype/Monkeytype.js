// Terminal.js

import React, { useState, useEffect} from 'react';
import styles from './Monkeytype.module.css';
import useSound from 'use-sound';
import keyboard from './keyboard.mp3';

const Monkeytype = ({text, onComplete}) => {

  const [output, setOutput] = useState("");
  const [overlay, setOverlay] = useState(text);
  const [isClicked, setIsClicked] = useState(false);
  const [typingStarted, setTypingStarted] = useState(false);
  const [play, { stop, isPlaying }] = useSound(keyboard);


  const handleClick = () => {
    if (!isClicked) {
      setIsClicked(true);
      typeText(text, 0, "");
      play();
      
    } else {
      stop();
      setIsClicked(false);
    }
    
  };

  const handleTypingComplete = () => {
    stop();
    setIsClicked(false);
  };

  const handleResetClick = () => {
    if (!isClicked) {
      onComplete()
      reset();
    }
     
  };

  const typeText = (text, index, typedText) => {
    if (index < text.length) {
      typedText += text.charAt(index);
      setOutput((prevOutput) => [...prevOutput.slice(0, -1), `${typedText}`]);
      setTimeout(() => typeText(text, index + 1, typedText), 50); // Adjust the typing speed here
    }
    
    if (index === text.length -1) {
      handleTypingComplete();
    }
  
  };

  const handleStartTyping = () => {
    setTypingStarted(true);
    handleClick()
  }

  const reset = (text) => {
    setOutput("");
    setOverlay(text);
    setIsClicked(false);
    setTypingStarted(false);
    stop();
  };

  useEffect(() => {
    return reset(text); // Cleanup function to reset when component unmounts
  }, [text]);

  return (
    <div>
      <div className={styles.box}>
        {!typingStarted && (
          <div className={styles.hover} onClick={handleStartTyping}>
            Click here to begin typing
          </div>
        )}
        <div className={typingStarted ? styles.textBox1 : styles.blur}>
          {overlay}
        </div>
        <div className={styles.textBox2}>
          {output}
        </div>
        
      </div>
      <div className={styles.resetButton} onClick={handleResetClick} >
        <a href="#" className={styles.next}>&#8250;</a>
      </div>
    </div>
  );
};

export default Monkeytype;

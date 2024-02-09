'use client'

import { useState } from 'react';
import styles from './page.module.css';
import Monkeytype from '../components/monkeytype/Monkeytype';
import ImageGallery from '../components/imageGallery/ImageGallery';
import { useRouter } from 'next/navigation'


const restore = "The art of restoration centers around returning to an initial state due to damage, wear, etc. Why? The world is ever revolving, ever projecting forward. What do we gain by attempting to go back? Nostalgia. Remembrance of a “better” time. A time which was constructed in our minds to represent something we will never experience again.";
const growth = "View opportunities like so to grow. A way to improve the current state to reach a new state. This can be done organically or abruptly. Sometimes organic growth leads to such needed changes on a neutral positive slope. Months may pass. Years. And sometimes abrupt change can lead to an intensity that drains us, drowning our pains. But this can linger thoughts, images, and memories which may flood us.. No matter the path we choose, relocate.";
const memories = "What you hear is a GMMK 75% keyboard which does not belong to me. It carries unknown memories to me. It’s unkept state reflects holes in its previous state. Inconsistently lubricated housings and springs. Follicles and dust built up over the years. A dull layer of oil and coffee over its metallic shine. Rattling where metal and plastic meet.";
const foundation = "But it has potential. It is a wonderful foundation which can be lead to millions of possibilities. It can represent new memories and carry newfound emotions through its functionality. This keyboard is a representation of relocation: the opportunity of moving something from one place to another.";
const specs = "Specifications:  GMMK 75% keyboard | Gateron milky yellows Lubed and Filmed | Lubed stock stabilizers | Guyker guitar knob | Yunzii keycaps";

const TypingPage = () => {
  const router = useRouter()

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [gallery, setGallery] = useState(false);
  const [monkey, setMonkey] = useState(true);


  const texts = [restore, growth, memories, foundation, specs];
  const images = ["/keyboard/1a.JPG", "/keyboard/1c.JPG","/keyboard/2a.JPG", "/keyboard/2b.JPG"]
  const handleTypingComplete = () => {
    if (currentTextIndex < texts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
      router.refresh();
    } else {
      setGallery(true)
      setMonkey(false)
    }
  };

  return (
    <div className={styles.main}>
      {monkey && 
      <div className={styles.container}>
      <Monkeytype text={texts[currentTextIndex]} onComplete={handleTypingComplete} />
    </div>}
    {gallery &&
      <ImageGallery images={images} />}
    </div>
  );
};

export default TypingPage;

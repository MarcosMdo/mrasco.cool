// Terminal.js

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from './Terminal.module.css';

const Terminal = () => {
  const listState = ['ls'];
  const directoryState = ['relocation.sh gallery.sh  specs.sh'];
  const state0 = ['mrasco$ ' + listState, 'mrasco$ ' + directoryState];
  const state1 = ['The art of restoration centers around returning something to an initial state due to damage, wear, etc. But why? Why is our goal to return to the initial state? The world is ever revolving, ever projecting forward. What do we gain by attempting to go back? Possibly it’s for nostalgia, remembrance of a “better” time. A time, which in reality, was constructed in our minds to represent something we will never experience again.', 
                  'type y to continue...'];
  const state2 = ['We need to view opportunities like so as a way to grow. A way to improve the state to reach a new state. This can be done organically or abruptly. Sometimes organic growth leads to such needed changes on a neutral positive slope. But this can linger thoughts, images, and memories which may flood us. And sometimes abrupt change can lead to an intensity that drains us. No matter the path we choose, growth is good. change is good.', 
                  'type y to continue...'];
  const state3 = ['This GMMK 75% keyboard belongs to a friend. It carries unknown memories to me. It’s unkept state shows memories of what it may have once been. But it also shows holes in its previous state. inconsistently lubricated housings and springs. Follicles and dust built up over the years. A dull layer of oil and coffee over its metallic shine. Rattling where metal and plastic meet.',
                  'type y to continue...'];
  const state4 = ['But it has potential. It is a wonderful foundation which can be lead to millions of possibilities. It can represent new memories and carry newfound emotions through its functionality. This keyboard is a representation of relocation: the opportunity of moving something from one place to another. This usually represents a physical location, but it’s definition in this case represents state.'];              
  const specs = ['Specifications', 'GMMK 75% keyboard', 'Gateron milky yellows: Lubed and Filmed', 'Lubed stock stabilizers', 'Guyker guitar knob', 'Yunzii keycaps']

  const [input, setInput] = useState('');
  const [state, setState] = useState(0);
  const [output, setOutput] = useState(state0);
  const inputRef = useRef();

  

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      console.log("ctrl c hit");
      setOutput([]);
      setState(0);
    }
  };

  const processCommand = (command) => {
    let typedText = 'mrasco$ ';

  const typeText = (text, index) => {
    if (index < text.length) {
      typedText += text.charAt(index);
      setOutput((prevOutput) => [...prevOutput.slice(0, -1), `${typedText}_`]);
      setTimeout(() => typeText(text, index + 1), 10); // Adjust the typing speed here
    }
  };
    // You can implement your own logic for command processing here
    // For demonstration purposes, let's just echo the command
    if (command === './gallery.sh' && state === 0) {
      setOutput(['todo']);
    } else if (command == 'ls' && state == 0) {
      //setOutput(directoryState);
      setOutput([...output, `mrasco$ ${directoryState}`]);
    } else if (command === './specs.sh' && state === 0) {
      setOutput(specs);
    } else if (command === './relocation.sh' && state === 0) {
      for (const text of state1) {
        typeText(text, 0);
      }
      setState(state + 1);
    } else if (command === 'y' && state === 1) {
      setOutput(state2);
      setState(state + 1);
    } else if (command === 'y' && state === 2) {
      setOutput(state3);
      setState(state + 1);
    } else if (command === 'y' && state === 3) {
      setOutput(state4);
      setState(0);
    } else {
      setOutput([...output, `mrasco$ ${command}`]);
    }
  };

  const handleClose = () => {

  }

  useEffect(() => {
    // Auto-scroll to the bottom of the terminal when new output is added
    inputRef.current.scrollTop = inputRef.current.scrollHeight;
  }, [output]);

  return (
    <Draggable handle={`.${styles.windowBorder}`}>
      <div className={styles.terminal}>
        <div className={styles.windowBorder}>
          <div className={styles.closeButton} onClick={handleClose}>
            X
          </div>
        </div>
        <div className={styles.terminalOutput} ref={inputRef}>
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className={styles.terminalInput}>
          <span>mrasco$</span>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleEnterKey}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default Terminal;

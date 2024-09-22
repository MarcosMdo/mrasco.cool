'use client'
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { DndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import styles from './MessageBoard.module.css';

const DraggableSticky = ({ id, content, position }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: position.left,
    top: position.top,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.stickyNote} {...listeners} {...attributes}>
      <p>{content}</p>
    </div>
  );
};

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const nodeRef = React.useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch('/api/messages');
    const data = await response.json();
    console.log(data)
    if (response.status == 200){
      setMessages(data.map(message => ({
        ...message,
        position: getRandomPosition(),
      })));
    }
  };

  const getRandomPosition = () => ({
    left: `${Math.random() * 70}%`,
    top: `${Math.random() * 70}%`,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: nanoid(),
      content: newMessage,
      position: getRandomPosition(),
    };

    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setMessages(messages.map(msg =>
      msg.id === active.id
        ? {
            ...msg,
            position: {
              left: `calc(${msg.position.left} + ${delta.x}px)`,
              top: `calc(${msg.position.top} + ${delta.y}px)`,
            },
          }
        : msg
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Message Board</h1>
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        {messages.map((message) => (
          <DraggableSticky
            key={message.id}
            id={message.id}
            content={message.content}
            position={message.position}
          />
        ))}
      </DndContext>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a new message"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Post Message
        </button>
      </form>
    </div>
  );
};

export default MessageBoard;
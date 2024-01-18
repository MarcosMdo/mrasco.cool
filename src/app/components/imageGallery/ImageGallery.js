// ImageGallery.js

import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageGallery.module.css'; // Create a CSS module for styling

const ImageGallery = ({ images }) => {
  return (
    <div className={styles.galleryContainer}>
      <div className={styles.imageGallery}>
        {images.map((image, index) => (
          <img key={index} src={image} className={styles.img} alt={`Image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageGallery;

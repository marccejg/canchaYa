import React from 'react';
import './BannerVertical.css';

const BannerVertical = ({ imagen, url }) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="banner-vertical" onClick={handleClick}>
      {imagen ? (
        <img src={imagen} alt="Banner Publicitario" className="banner-vertical-imagen" />
      ) : (
        <div className="banner-vertical-placeholder">
          Banner Publicitario
        </div>
      )}
    </div>
  );
};

export default BannerVertical;
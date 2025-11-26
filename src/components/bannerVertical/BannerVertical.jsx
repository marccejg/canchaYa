import React from 'react';
import './BannerVertical.css';
import img from '../bannerVertical/banners/img1.png';

// Ya no acepta la prop 'imagen'
const BannerVertical = ({ url }) => { 
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="banner-vertical" onClick={handleClick}>
      {/* Muestra la imagen directamente */}
      <img 
        src={img} 
        alt="Banner Publicitario" 
        className="banner-vertical-imagen" 
      />
    </div>
  );
};

export default BannerVertical;
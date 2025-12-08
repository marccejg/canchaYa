import React from 'react';
import BannerVertical from '../bannerVertical/BannerVertical';
import Header from '../header/header';
import Footer from '../footer/footer';

import './Layout.css';


const Layout = ({ children }) => {
  return (
    <>
      <div className="app-layout">
        <Header />

        <div className="layout">
          <BannerVertical side="left" />

          <main className="main-content">
            {children}
          </main>

          <BannerVertical side="right" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;

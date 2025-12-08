import React from 'react';
import BannerVertical from '../bannerVertical/BannerVertical';
import Header from '../header/header';
import Footer from '../footer/footer';

import './Layout.css';


const Layout = ({ children, currentUser }) => {
  return (
    <>
      <div className="app-layout">
        <Header currentUser={currentUser} />

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
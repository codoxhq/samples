import React from 'react';

const SimpleLoading = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'start',
      paddingTop: '100px',
      fontSize: '30px',
      fontWeight: '700',
      position: 'fixed',
      zIndex: '1000',
      background: 'rgba(255,255,255, 0.7)',
    }}
  >
    Loading....
  </div>
);

export default SimpleLoading;

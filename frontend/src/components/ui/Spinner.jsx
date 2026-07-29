import React from 'react';

const Spinner = ({ size = 'default', text = '' }) => {
  return (
    <div className="loading-center" style={{ flexDirection: 'column', gap: 16 }}>
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
      {text && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{text}</p>}
    </div>
  );
};

export default Spinner;

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Share2, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="var(--color-accent)" />
                AssetVault
              </span>
            </div>
            <p className="footer-desc">
              The premier marketplace for premium digital assets. Discover UI kits, templates, icons, and more crafted by talented creators worldwide.
            </p>
          </div>

          <div>
            <p className="footer-heading">Marketplace</p>
            <div className="footer-links">
              <Link to="/" className="footer-link">Browse Assets</Link>
              <Link to="/" className="footer-link">UI Kits</Link>
              <Link to="/" className="footer-link">Templates</Link>
              <Link to="/" className="footer-link">Icons</Link>
            </div>
          </div>

          <div>
            <p className="footer-heading">Company</p>
            <div className="footer-links">
              <Link to="/" className="footer-link">About Us</Link>
              <Link to="/" className="footer-link">Privacy Policy</Link>
              <Link to="/" className="footer-link">Terms of Service</Link>
              <Link to="/" className="footer-link">Contact</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AssetVault. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" className="footer-link" aria-label="Website"><Globe size={16} /></a>
            <a href="#" className="footer-link" aria-label="Share"><Share2 size={16} /></a>
            <a href="#" className="footer-link" aria-label="Code"><Code size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

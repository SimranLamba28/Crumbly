'use client';
import Link from 'next/link';
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="bm-footer">
      <div className="bm-footer-inner">
        <div className="bm-footer-socials">
          <a href="https://github.com/simranlamba28" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="bm-footer-social">
            <FaGithub />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bm-footer-social">
            <FaInstagram />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="bm-footer-social">
            <FaTwitter />
          </a>
        </div>
        <div className="bm-footer-meta">
          © {new Date().getFullYear()} Crumbly &mdash; Made with <span className="bm-footer-heart">♥</span> 
        </div>
      </div>
    </footer> 
  );
}

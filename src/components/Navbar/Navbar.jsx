'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import {FaUser, FaHeart, FaPlus, FaHome, FaBook } from 'react-icons/fa';
import '../../styles/navbar.css';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg py-3">
      <div className="container">
      <div className="navbar-logo">
        <Link href="/">
          <span className="logo">🧁 BakeMuse</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link href="/" className="nav-link">
          <FaHome /> <span>Home</span>
        </Link>
        
        <Link href="/favourites" className="nav-link">
          <FaHeart /> <span>Favorites</span>
        </Link>
        
        <Link href="/add" className="nav-link">
          <FaPlus /> <span>Add Recipe</span>
        </Link>

        <Link href="/your-recipes" className="nav-link">
          <FaBook /> <span>Your Recipes</span>
        </Link>
        
      </div>
      
      <div className="navbar-auth">
        {status === 'loading' ? (
          <div className="loading-spinner"></div>
        ) : session ? (
          <div className="user-menu-container" onClick={toggleMenu}>
            <div className="user-avatar">
              {session.user.image ? (
                <img src={session.user?.image} alt={session.user.name} />
              ) : (
                <FaUser />
              )}
            </div>
            
            {isMenuOpen && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{session.user?.name}</p>
                  <p className="user-email">{session.user?.email}</p>
                </div>
                <hr />
                <Link href="/favourites" className="dropdown-item">
                  <FaHeart /> <span>My Favorites</span>
                </Link>
                <Link href="/add" className="dropdown-item">
                  <FaPlus /> <span>Add Recipe</span>
                </Link>
                <button onClick={() => signOut()} className="sign-out-btn">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="sign-in-btn">
            Sign In
          </button>
        )}
      </div>
      </div>
    </nav>
  );
}
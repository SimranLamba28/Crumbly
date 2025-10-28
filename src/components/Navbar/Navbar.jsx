'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaUser, FaHeart, FaPlus, FaHome, FaBook, FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/navbar.css';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = (menuType, e) => {
    e?.stopPropagation();
    if (menuType === 'main') {
      setIsMenuOpen(prev => !prev);
      setIsUserMenuOpen(false);
    } else if (menuType === 'user') {
      setIsUserMenuOpen(prev => !prev);
      setIsMenuOpen(false);
    }
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) closeAll();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className="bm-navbar" role="navigation" aria-label="Top">
      <div className="container d-flex align-items-center justify-content-between bm-navbar-inner">

        {/* Hamburger */}
        <button
          className="bm-toggler btn d-md-none p-2"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={(e) => toggleMenu('main', e)}
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="bm-left flex-grow-1 text-center text-md-start">
          <Link href="/" onClick={closeAll} className="bm-logo text-decoration-none">
            <span className="bm-logo-text">Crumbly</span>
          </Link>
        </div>

        {/* Offcanvas Menu */}
        <div className={`bm-nav-collapse ${isMenuOpen ? 'open' : ''}`}>
          <button className="bm-close-btn btn d-md-none" onClick={closeAll} aria-label="Close menu">
            <FaTimes />
          </button>
          <div className="bm-navbar-links d-flex flex-column flex-md-row gap-2 gap-md-3 mt-3 mt-md-0">
            <Link href="/" className="bm-nav-link d-flex align-items-center gap-2" onClick={closeAll}>
              <FaHome /> <span>Home</span>
            </Link>
            <Link href="/favourites" className="bm-nav-link d-flex align-items-center gap-2" onClick={closeAll}>
              <FaHeart /> <span>Favorites</span>
            </Link>
            <Link href="/add" className="bm-nav-link d-flex align-items-center gap-2" onClick={closeAll}>
              <FaPlus /> <span>Add Recipe</span>
            </Link>
            <Link href="/your-recipes" className="bm-nav-link d-flex align-items-center gap-2" onClick={closeAll}>
              <FaBook /> <span>Your Recipes</span>
            </Link>
          </div>
        </div>

        {/* User Menu */}
        <div className="bm-auth d-flex align-items-center gap-2">
          {status === 'loading' ? (
            <div className="bm-loading-spinner" />
          ) : session ? (
            <div className="bm-user-menu-container position-relative">
              <button
                className="bm-user-avatar-btn border-0 bg-transparent"
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                onClick={(e) => toggleMenu('user', e)}
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user?.name || 'User avatar'}
                    className="bm-user-avatar-img rounded-circle"
                  />
                ) : (
                  <FaUser aria-hidden />
                )}
              </button>

              {isUserMenuOpen && (
                <div className="bm-user-dropdown position-absolute end-0 mt-2">
                  <div className="bm-user-info border-bottom pb-2 mb-2">
                    <div className="fw-semibold small">{session.user?.name}</div>
                    <div className="text-muted small">{session.user?.email}</div>
                  </div>

                  <Link href="/favourites" className="bm-dropdown-item d-flex align-items-center gap-2" onClick={closeAll}>
                    <FaHeart /> <span>My Favorites</span>
                  </Link>
                  <Link href="/add" className="bm-dropdown-item d-flex align-items-center gap-2" onClick={closeAll}>
                    <FaPlus /> <span>Add Recipe</span>
                  </Link>
                  <button
                    className="bm-sign-out-btn btn btn-link text-muted text-start p-0 mt-2 border-top pt-2 w-100"
                    onClick={() => {
                      signOut();
                      closeAll();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bm-sign-in-btn"
              onClick={() => {
                signIn('google');
                closeAll();
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

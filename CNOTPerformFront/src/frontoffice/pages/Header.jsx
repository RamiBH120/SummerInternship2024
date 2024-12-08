import React, { useState, useEffect } from "react";
import ProfileMenu from "../../components/CommonForBoth/TopbarDropdown/ProfileMenu1";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authUser'));

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <a href="/landing" style={styles.logoContainer}>
          <img
            src="../../assets/images/CNOT_logo.svg"
            height="20"
            width="60"
            alt="logo"
          />
        </a>
        <nav style={isDesktop ? styles.nav : styles.navHidden}>
          <a href="#" style={styles.navLink}>
            Home
          </a>
          <a href="#" style={styles.navLink}>
            About
          </a>
          <a href="#" style={styles.navLink}>
            Services
          </a>
          <a href="#" style={styles.navLink}>
            Events
          </a>
          <a href="#" style={styles.navLink}>
            Galerie
          </a>
          <a href="#" style={styles.navLink}>
            Contact
          </a>
          {isLoggedIn ? (
  <ProfileMenu />
) : (
  <a href="/login" style={styles.navButton}>Sign In</a>
)}
          
        </nav>
        <div style={!isDesktop ? styles.menuButtonContainer : styles.navHidden}>
          <button onClick={toggleMenu} style={styles.menuButton}>
            <MenuIcon style={styles.icon} />
            <span style={styles.srOnly}>Toggle navigation menu</span>
          </button>
        </div>
      </div>
      {isMenuOpen && !isDesktop && (
        <div style={styles.mobileMenu}>
          <nav style={styles.mobileNav}>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              Home
            </a>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              About
            </a>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              Services
            </a>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              Events
            </a>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              Galerie
            </a>
            <a href="#" style={styles.navLink} onClick={toggleMenu}>
              Contact
            </a>
            {isLoggedIn ? (
   <ProfileMenu />
 ) : (
   <a href="/login" style={styles.navLink} onClick={toggleMenu}>Sign In</a>
 )}
           
          </nav>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    zIndex: 50,
    width: "100%",
    height: "75px",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Updated for transparency
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  container: {
    display: "flex",
    height: "4rem",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logoContainer: {
    paddingTop: 15,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
  },
  logoText: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#000",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    alignItems: "center",
  },
  navHidden: {
    display: "none",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    transition: "color 0.2s",
  },
  navButton: {
    textDecoration: "none",
    color: "#333",
    backgroundColor: "#f0f0f0",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.2s, color 0.2s",
    marginLeft: "0.5rem",
  },
  menuButtonContainer: {
    display: "block",
  },
  menuButton: {
    padding: "0.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0,
  },
  icon: {
    width: "1.5rem",
    height: "1.5rem",
  },
  mobileMenu: {
    position: "absolute",
    top: "4rem",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  mobileNav: {
    display: "grid",
    gap: "1rem",
    padding: "1rem",
  },
};

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default Header;

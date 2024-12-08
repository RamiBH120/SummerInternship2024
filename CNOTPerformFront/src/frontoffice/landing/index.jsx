import React, { useEffect, useState } from "react";

//Import Components
import Navbar from "./Navbar/Navbar";
import Section from "./HeroSection/Section";
import AboutUs from "./AboutUs/about-us";
import Features from "./Features/features";

import Events from "./Planning/events";
import Blog from "./Blog/blog";
import Footer from "./Footer/footer";
import Offres from "./Features/offres";
import Contact from "./Contact/Contact";
import Joinus from "./Contact/Joinus";
import BourseCategories from "../../pages/Bourse/BourseCategories";

const CryptoIcoLanding = () => {
  //meta title
  document.title = "Accueil | CNOT PERFORM";

  const [showButton, setShowButton] = useState(false);

  // Use ComponentDidMount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.addEventListener("scroll", scrollNavigation, true);
  }, []);

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
  }

  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false);
    };

    window.addEventListener("scroll", handleScrollButtonVisibility);

    return () => {
      window.removeEventListener("scroll", handleScrollButtonVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <React.Fragment>
      {/* import navbar */}
      <Navbar isSimple={true} />

      {showButton && (
        <button
          className="  z-50 cursor-pointer p-4"
          onClick={handleScrollToTop}
        >
          <div className="event-up-icon">
            <i className="bx bx-up-arrow-circle h1 up-arrow-icon text-primary"></i>
          </div>
        </button>
      )}
      {/* Hero section */}
      <Section />

      {/* aboutus */}
      <AboutUs />

      {/* features */}
      <Features />

      <Offres />

      <Joinus />

      <BourseCategories />

      {/* blog */}
      <Blog />

      <Events />
      {/* footer */}
      <Footer />
    </React.Fragment>
  );
};

export default CryptoIcoLanding;

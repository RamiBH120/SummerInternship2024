import React from "react";

import Events from "../landing/Planning/events";

const Home = () => {
  document.title = "Accueil | CNOT PERFORM";
  return (
    <div>
      {/* Full-screen Image */}
      <div style={styles.fullScreenImageContainer}>
        <img
          style={styles.fullScreenImage}
          src="assets/images/sport.jpg" // Change the src to your image path
          alt="Full-Screen Banner"
        />
      </div>
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.content}>
              <h1 style={styles.title}>Contexte & objectifs</h1>
              <p style={styles.subtitle}>
                CNOT Perform révolutionne l'entraînement sportif grâce à
                l'Intelligence Artificielle. Suivez vos performances en temps
                réel, analysez vos données pour identifier vos points forts et
                faibles, recevez des conseils personnalisés et prévenez les
                blessures. Rejoignez-nous pour améliorer vos performances
                sportives et atteindre vos objectifs.
              </p>
            </div>
            <div style={styles.imageContainer}>
              <img
                style={styles.image}
                src="assets/images/2.jpg"
                alt="Banner Image"
              />
            </div>
          </div>
        </div>
        <img
          style={styles.shape}
          src="assets/images/banner-shape.svg"
          alt="Decorative Shape"
        />
      </section>
      <section className="section key-feature relative">
        <img
          className="absolute left-0 top-0 -z-[1] -translate-y-1/2"
          src="assets/images/icons/feature-shape.svg"
          alt=""
        />
        <div className="container">
          <div className="row justify-between text-center lg:text-start">
            <div className="lg:col-5">
              <h2>Liste Des Fonctionnalités</h2>
            </div>
            <div className="mt-6 lg:col-5 lg:mt-0"></div>
          </div>
          <div className="key-feature-grid mt-10 grid grid-cols-2 gap-7 md:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">
                  Suivi des performances en temps réel
                </h3>
                <p>
                  la plateforme permettra aux sportifs de suivre leurs
                  performances en temps réel
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-1.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Analyse des données</h3>
                <p>
                  la plateforme utilisera l'IA pour analyser les données
                  collectées et identifier les points forts et les points
                  faibles des sportifs
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-2.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">
                  Conseils personnalisés
                </h3>
                <p>
                  la plateforme fournira des conseils personnalisés aux sportifs
                  pour améliorer leurs performances
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-3.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">
                  Prevention des blessures
                </h3>
                <p>
                  la plateforme identifiera les risques potentiels de blessures
                  et fournira des conseils pour les prévenir
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-4.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">utilisation de IA</h3>
                <p>
                  utilisation de l'intellidence artificielle conversationnelle.
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-5.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">Une plateforme IA</h3>
                <p>
                  Une plateforme IA qui permet aux sportifs de trouver des
                  partenaires d'entrainement.
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-6.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">
                  L'utilisation de l'analyse vidéo
                </h3>
                <p>
                  {" "}
                  L'analyse vidéo peut fournir des informations précieuses sur
                  les performances des athlètes
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-7.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-lg">
              <div>
                <h3 className="h4 text-xl lg:text-2xl">
                  L'utilisation de IA conversationnelle
                </h3>
                <p>
                  L'intelligence artificielle conversationnelle peut être
                  utilisée pour interagir avec les athlètes
                </p>
              </div>
              <span className="icon mt-4">
                <img
                  className="objec-contain"
                  src="assets/images/icons/feature-icon-8.svg"
                  alt=""
                />
              </span>
            </div>
          </div>
        </div>
      </section>

      <Events />

      <section>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.imageContainer}>
              <img
                style={styles.image}
                src="assets/images/3.jpg"
                alt="Banner Image"
              />
            </div>
            <div style={styles.content}>
              <h1 style={styles.title}>
                Révolutionner l'Entraînement Sportif avec l'Intelligence
                Artificielle{" "}
              </h1>
              <p style={styles.subtitle}>
                Découvrez comment CNOT Perform transforme l'entraînement sportif
                grâce à l'Intelligence Artificielle. Suivez vos performances en
                temps réel et analysez vos données pour identifier vos forces et
                faiblesses
              </p>
            </div>
          </div>
        </div>
        <img
          style={styles.shape}
          src="assets/images/3.jpg"
          alt="Decorative Shape"
        />
      </section>
      <section>
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.content}>
              <h1 style={styles.title}>
                Scale design & dev operations with Avocode Enterprise
              </h1>
              <p style={styles.subtitle}>
                A fully integrated suite of authentication & authorization
                products, Stytch’s platform removes the headache of.
              </p>
              <a style={styles.button} href="#">
                Download The Theme
              </a>
            </div>
            <div className="video pb-5 pr-9">
              <div className="video-thumbnail overflow-hidden rounded-2xl">
                <img
                  className="w-full object-contain"
                  src="assets/images/intro-thumbnail.png"
                  alt=""
                />
                <button className="video-play-btn">
                  <img src="assets/images/icons/play-icon.svg" alt="" />
                </button>
              </div>
              <div className="video-player absolute left-0 top-0 z-10 hidden h-full w-full">
                <iframe
                  className="h-full w-full"
                  allowfullscreen=""
                  src="https://www.youtube.com/watch?v=R_k6939hFLY"
                ></iframe>
              </div>
              <img
                className="intro-shape absolute bottom-0 right-0 -z-[1]"
                src="assets/images/shape.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <img
          style={styles.shape}
          src="assets/images/banner-shape.svg"
          alt="Decorative Shape"
        />
      </section>
      <section style={{ padding: "60px 0", backgroundColor: "#f9f9f9" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flexBasis: "50%", maxWidth: "50%" }}>
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Rejoignez-nous dès aujourd'hui{" "}
              </h2>
            </div>
            <div style={{ flexBasis: "33.333333%", maxWidth: "33.333333%" }}>
              <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#666" }}>
                Rejoignez-nous dès aujourd'hui et profitez d'une nouvelle ère de
                performance sportive grâce à CNOT Perform. Atteignez vos
                objectifs plus rapidement et de manière plus intelligente avec
                l'aide de l'Intelligence Artificielle{" "}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed left-0 top-0 z-50 flex w-[30px] items-center justify-center bg-gray-200 py-[2.5px] text-[12px] uppercase text-black sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200">
        <span className="block sm:hidden">all</span>
        <span className="hidden sm:block md:hidden">sm</span>
        <span className="hidden md:block lg:hidden">md</span>
        <span className="hidden lg:block xl:hidden">lg</span>
        <span className="hidden xl:block 2xl:hidden">xl</span>
        <span className="hidden 2xl:block">2xl</span>
      </div>
    </div>
  );
};

const styles = {
  section: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 0",
    marginTop: "80px", // Increased margin-top to create space from navbar
    "@media (max-width: 768px)": {
      padding: "20px 0",
    },
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    "@media (max-width: 768px)": {
      width: "100%",
      padding: "0 10px",
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  content: {
    flex: 1,
    paddingRight: "50px", // Adjust the spacing based on your design needs
    "@media (max-width: 768px)": {
      paddingRight: "0",
      textAlign: "center",
    },
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
    "@media (max-width: 768px)": {
      fontSize: "1.5rem",
    },
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "20px",
    "@media (max-width: 768px)": {
      fontSize: "1rem",
    },
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#FF6464", // Adjust button color
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    borderRadius: "5px",
    "@media (max-width: 768px)": {
      padding: "8px 16px",
      fontSize: "0.875rem",
    },
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      marginTop: "20px",
    },
  },
  image: {
    width: "100%",
    maxWidth: "500px", // Adjust the image size
    objectFit: "contain",
  },
  shape: {
    position: "absolute",
    top: "-100px",
    right: "0",
    maxWidth: "300px",
    zIndex: -1,
  },
  fullScreenImageContainer: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    marginTop: "75px", // Add your desired margin-top value here
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};
export default Home;

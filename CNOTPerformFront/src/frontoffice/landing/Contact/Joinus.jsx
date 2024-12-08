import React from "react";
import { Link } from "react-router-dom";
import { Row, Container } from "reactstrap";

const Joinus = () => {
  return (
    <section className="section hero-section">
      <div className="glow-container">
        <div className="glow-circle left"></div>
        <div className="glow-circle right"></div>
      </div>
      <Container>
        <Row>
          <div className="membership-banner">
            
            <div className="content">
              <h1 className=" text-white"></h1>
              <p
  className="text-white"
  style={{
    fontSize: "0.9em",
    textAlign: "center",
    fontFamily: "'Lobster', cursive",  // Utilisation de la police Lobster
    color: "violet",  // Couleur violette
  }}
>
  LES PROGRAMMES MONDIAUX
</p>


              <p className=" text-white" style={{ fontSize: "0.9em" }}>     
              Les programmes mondiaux apportent une assistance financière , technique et administrative aux CNO dans l'organisation d'activités 
              spécifiques liées au développement du sport. Ils sont essentiels pour permettre aux CNO d'accomplir la mission qui leur a été 
              confiée par la Charte olympique .
              </p>
              <p>   </p> 
              <p className=" text-white" style={{ fontSize: "0.9em" }}> Alors que les programmes mondiaux sont ouverts à tous les CNO , l'attribution des budgets privéligera les CNO ayant les besoins les plus 
                importants , conformément à la mission de la Solidarité Olympique . </p> 
                <p className=" text-white" style={{ fontSize: "0.9em" }}> Le bureau international de la Solidarité Olympique à Lausanne gére les programmes mondiaux en cencertation avec les associations continentales et en 
                  étroite coopération avec les différents partenaires.  </p>
            </div>
            <div className="image">
           
  <img
    src="/public/assets/images/Lespgmondiaux.jpg"
    alt="Athletes celebrating"
    style={{ width: '100%', height: 'auto' }} // Ajuster la taille en fonction de la largeur du conteneur
  />
</div>

          </div>
        </Row>
      </Container>
    </section>
  );
};

export default Joinus;

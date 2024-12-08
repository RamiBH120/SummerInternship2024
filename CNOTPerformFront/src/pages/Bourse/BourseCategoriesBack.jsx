// Import statements
import React from 'react';
import Navbar_Page from "../../frontoffice/landing/Navbar/Navbar";
import Features from "../../frontoffice/landing/Footer/footer";

// Image imports
import univ from "../../assets/images/icon/univolymp.png";
import developpement from "../../assets/images/icon/devsport.png";
import valeur from "../../assets/images/icon/valeursolymp.png";
import admin from "../../assets/images/icon/administration.png";
import entourage from "../../assets/images/icon/entourage.png";
import {
  Button,
  Container
} from "reactstrap";
import { useNavigate } from 'react-router-dom';

// Card Component
const Card = ({ image, title, subtitle, children, footer }) => (
  <div className="bg-black text-white rounded-lg shadow-lg overflow-hidden w-full sm:w-96 my-3">
    {/*<img src={image} alt={title} className="w-full h-56 object-cover" />*/}
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <h3 className="text-lg text-gray-400 mb-4">{subtitle}</h3>
      <p className="mb-4">{children}</p>
      <div className="flex justify-end space-x-2">{footer}</div>
    </div>
  </div>
);

function BourseCategoriesBack() {
  const navigate = useNavigate();
  const cardsData = [
    {
      image: univ,
      title: "Universalité des jeux Olympiques",
      subtitle: "Formation et éducation",
      description:
        "L'Universalité des jeux Olympiques offre des programmes éducatifs visant à promouvoir les valeurs sportives et l'excellence.",
    },
 
    {
      image: developpement,
      title: "Développement du Sport",
      subtitle: "Promotion et soutien",
      description:
        "Nous travaillons à développer le sport à tous les niveaux en offrant des ressources et un soutien aux athlètes.",
    },
    
    {
      image: valeur,
      title: "Valeurs Olympiques",
      subtitle: "Respect, Excellence, Amitié",
      description:
        "Nous inculquons les valeurs fondamentales de l'Olympisme pour inspirer les générations futures.",
    },
    {
      image: admin,
      title: "Gestion des CNO et partage de connaissances",
      subtitle: "Gestion efficace",
      description:
        "Notre équipe administrative assure une gestion efficace et transparente de toutes les activités sportives.",
    },
 
  ];

  return (
    <React.Fragment>
      <div className="page-content">
      <Container fluid>
      <section className="section hero-section bg-ico-hero" id="home">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                image={card.image}
                title={card.title}
                subtitle={card.subtitle}
                footer={
                  <>
                <Button
                  color="primary"
                  className="font-16 btn-block m-auto"
                  style={{ borderRadius: "25px" }}
                  onClick={() => navigate(`/listbourses/${card.title}`)}
                >
                  Consulter
                </Button>
                  </>
                }
              >
                {card.description}
              </Card>
            ))}
          </div>
        </div>
      </section>
      </Container>
      </div>
    </React.Fragment>
  );
}

export default BourseCategoriesBack;

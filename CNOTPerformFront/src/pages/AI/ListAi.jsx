import React, { useState } from "react";
import {
  Button
} from "reactstrap";
import { useNavigate } from "react-router-dom";

// Image imports
import athletisme from "../../assets/images/pictogrammes/athletisme.png";
import boxe from "../../assets/images/pictogrammes/Boxe.png";
import natation from "../../assets/images/pictogrammes/natation.png";
import taekwondo from "../../assets/images/pictogrammes/taekwondo.png";

// Card Component
const Card = ({ image, title, subtitle, children, blessure, performance }) => (
  <div className="my-3 w-full overflow-hidden rounded-lg bg-black text-white shadow-lg sm:w-96">
    <div className="p-6">
      <h2 className="mb-2 text-2xl font-semibold text-center">{title}</h2>
      <h3 className="mb-4 text-lg text-gray-400">{subtitle}</h3>
      <p className="mb-4">{children}</p>
      <img src={image} className="m-3 mx-auto" alt="dicpline pictogramme" />
      <div className="flex justify-end space-x-2">
      <Button
       color="primary"
        className="font-16 btn-block m-auto"
        style={{ borderRadius: "25px" }}
        onClick={() => {
          blessure();
        }}
        >
          Blessure
        </Button>
         <Button
          color="primary"
          className="font-16 btn-block m-auto"
          style={{ borderRadius: "25px" }}
             onClick={() => {
               performance();
              }}
              >
             Performance
          </Button>
      </div>
    </div>
  </div>
);
function ListAi() {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([
    {
      image: athletisme,
      title: "Athletisme",
      blessure: "/athletismeblessure",
      performance: "/athletismeperformance",
    },
    {
      image: boxe,
      title: "Boxe",
      blessure: "/boxeblessure",
      performance: "/boxeperformance",
    },
    {
      image: natation,
      title: "Natation",
      blessure: "/natationblessure",
      performance: "/natationperformance",
    },
    {
      image: taekwondo,
      title: "Taekwondo",
      blessure: "/taekwondoblessure",
      performance: "/taekwondoperformance",
    },
  ]);

  return (
    <React.Fragment>
      <section className="section hero-section mt-5" id="home">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <div className="container mx-auto px-4" style={{ zIndex: 1 }}>
          {/*<iframe title="dashbord final - Copie 1" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=1e06cbdf-c229-4f38-a6c9-ebe14b81f40c&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730" frameborder="0" allowFullScreen="true"></iframe> */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {cardsData.map((card, index) => (
              <Card
                key={index}
                image={card.image}
                title={card.title}
                blessure={() => navigate(card.blessure)}   // Navigating to blessure
                performance={() => navigate(card.performance)}  // Navigating to performance
              >
              </Card>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default ListAi
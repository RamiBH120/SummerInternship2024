import React from "react";
import { Col, Container, Row } from "reactstrap";

const Contact = () => {
  return (
    <section id="contact" className="section hero-section">
      <div className="glow-container">
        <div className="glow-circle left"></div>
        <div className="glow-circle right"></div>
      </div>
      <Container>
        <Row>
          <Col lg="12">
            <div className="mb-5 text-left text-white">
              <div className="small-title text-white">Contacter</div>
              <h4>Contacter nous</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="contact-box">
            <div className=" info mx-2 my-4">
              <h1>Information de Contacte</h1>
              <h3>Pour démarrer</h3>
              <ul>
                <li>
                  <i className="bx bx-phone" /> +(216) 71 767 681
                </li>
                <li>
                  <i className="bx bx-mail" /> president.cnot@email.ati.tn
                </li>
                <li>
                  <i className="bx bx-geo-alt" /> Centre Culturel et Sportif de
la Jeunesse El Menzah 6 -2091 Tunis
                </li>
                
              </ul>
              <div className="icons mx-5 flex flex-row gap-3">
                <img src="assets/images/icons/twitter.svg" alt="t" />
                <img src="assets/images/icons/linkedin.svg" alt="g" />
                <img src="assets/images/icons/facebook.svg" alt="fb" />
              </div>
            </div>
            <div className="input-form">
              <form action="">
                <div>
                  <label htmlFor="name">Votre nom</label>
                  <input type="text" required name="name" id="name" />
                </div>

                <div>
                  <label htmlFor="email">Votre email</label>
                  <input type="email" required name="email" id="email" />
                </div>

                <div>
                  <label htmlFor="sujet">Sujet</label>
                  <input type="text" required name="sujet" id="sujet" />
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea
                    type="text"
                    required
                    name="message"
                    id="message"
                    rows={3}
                    cols={4}
                  />
                </div>

                <div className="flex-row justify-center text-center">
                  <button
                    type="submit"
                    className="font-16 btn-block cta-button w-100 mx-auto  p-3 px-2 text-center"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;

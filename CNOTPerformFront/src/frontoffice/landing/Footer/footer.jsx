import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

//Import Components
import FooterLink from "./footer-link";

const Features = () => {
  const footerLinks = [
    {
      title: "",
      links: [
        { title: "", link: "#" },
        { title: "", link: "#" },
        { title: "", link: "#" },
        { title: "", link: "#" },
        { title: "", link: "#" },
      ],
    },
    {
      title: "",
      links: [
        { title: "", link: "#" },
        { title: "", link: "#" },
      ],
    },
  ];

  return (
    <React.Fragment>
      <footer className="landing-footer">
        <Container>
          <Row>
            {footerLinks.map((footerLink, key) => (
              <Col lg="4" sm="6" key={key}>
                <div className="mb-lg-0 mb-4">
                  <h5 className="footer-list-title mb-3">{footerLink.title}</h5>
                  <ul className="list-unstyled footer-list-menu">
                    {footerLink.links.map((Flink, key) => (
                      <li key={key}>
                        <Link to={Flink.link}>{Flink.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            ))}
            <Col lg="4" sm="6">
              <div className="mb-lg-0 mb-4">
                <ul className="list-unstyled footer-list-menu flex flex-row gap-3">
                  <li>
                    <a
                      href="https://www.facebook.com/CNOTunisie"
                      target="_blank"
                      title="Facebook"
                    >
                      <img
                        src="/public/assets/images/icons/facebook-colored.svg"
                        alt="Facebook"
                        style={{
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                          backgroundColor: "white",
                        }}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://www.cnot.org.tn"
                      target="_blank"
                      title="CNOT.ORG"
                      style={{
                        borderRadius: "50%",
                        width: "80px",
                        height: "80px",
                        backgroundColor: "white",
                      }}
                    >
                      <img
                        src="/public/assets/images/CNOT_logo.svg"
                        alt="CNOT_logo"
                        style={{
                          padding: "15px",
                        }}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/cnotunisien/"
                      target="_blank"
                      title="Instagram"
                    >
                      <img
                        src="/public/assets/images/icons/Instagram_logo.svg"
                        alt="Instagram_logo"
                        style={{
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                          backgroundColor: "white",
                        }}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>

          <hr className="footer-border my-2" />

          <FooterLink />
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Features;

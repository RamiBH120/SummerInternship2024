import React from "react";
import { Container, Row } from "reactstrap";

import BlogList from "./BlogList";
import Navbar_Page from "../../Navbar/Navbar";
import Footer from "../../Footer/footer";

const Index = () => {
  //meta title
  document.title = "Evénements | CNOT PERFORM";

  return (
    <React.Fragment>
      <Navbar_Page isSimple={false} />
      <section className="page-content section hero-section">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container fluid>
          <Row>
            <BlogList />
          </Row>
        </Container>
      </section>

      <Footer />
    </React.Fragment>
  );
};

export default Index;

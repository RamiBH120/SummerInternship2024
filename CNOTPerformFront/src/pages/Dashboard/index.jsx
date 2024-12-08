import React, { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";

//import component
import CardUser from "./CardUser";
import Settings from "./Settings";
import Posts from "./Posts";
import Comments from "./Comments";
import TapVisitors from "./TapVisitors";
import Activity from "./Activity";
import PopularPost from "./PopularPost";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getEvents } from "../../service/event-service";

const index = () => {
  //meta title
  document.title = "Dashboard | CNOT PERFORM";

  const [popularpost, setPopularpost] = useState([]);

  useEffect(() => {
    try {
      let isMounted = true;
      const fetchEvents = async () => {
        const data = await getEvents();
        if (isMounted) setPopularpost(await data.data.message);
      };

      fetchEvents();

      return () => {
        isMounted = false;
      };
    } catch (error) {
      alert(error.message);
    }
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Dashboards" breadcrumbItem="Dashboard" />
          <Row>
            {/* card user */}
            <CardUser
              popularpost={popularpost}
              dataColors='["--bs-primary", "--bs-warning"]'
            />
            <Settings popularpost={popularpost} />
          </Row>
          <Row>
          </Row>
          <Row>
            {" "}
            <PopularPost popularpost={popularpost} />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default index;

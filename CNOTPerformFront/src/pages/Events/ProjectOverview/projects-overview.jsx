import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withRouter from "../../../components/Common/withRouter";
import { isEmpty } from "lodash";
import { Col, Container, Row } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import { getProjectDetail as onGetProjectDetail } from "/src/store/projects/actions";
import ProjectDetail from "./projectDetail";
import TeamMembers from "./teamMembers";
import OverviewChart from "./overviewChart";
import AttachedFiles from "./attachedFiles";
import Comments from "./comments";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getEvents } from "../../../service/event-service";

const ProjectsOverview = (props) => {
  //meta title
  document.title = "Détails évènement | CNOT PERFORM";

  const { id } = useParams();

  const [event, setEvent] = useState([]);

  const dispatch = useDispatch();

  const { projectDetail } = useSelector((state) => ({
    projectDetail: state.projects.projectDetail,
  }));

  const params = props.router.params;

  useEffect(() => {
    if (params && params.id) {
      dispatch(onGetProjectDetail(params.id));
    } else {
      dispatch(onGetProjectDetail(1)); //remove this after full integration
    }
  }, [onGetProjectDetail]);

  useEffect(() => {
    try {
      const fetchEvent = async () => {
        const data = await getEvents(id);
        setEvent(data.data.message);
      };

      fetchEvent();
    } catch (err) {
      console.log(err.message);
    }
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Evénements" breadcrumbItem="Détails" />

          {!isEmpty(event) && (
            <>
              <Row>
                <Col lg="8">
                  <ProjectDetail event={event} />
                </Col>

                <Col lg="4">
                  <TeamMembers team={event?.participants} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

ProjectsOverview.propTypes = {
  match: PropTypes.object,
};

export default withRouter(ProjectsOverview);

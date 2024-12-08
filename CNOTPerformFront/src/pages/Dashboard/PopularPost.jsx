import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";

const PopularPost = ({ popularpost }) => {
  // Get current events for pagination
  const startIndex = popularpost?.length > 3 ? popularpost?.length - 3 : 0;
  const currentEvents = popularpost?.slice(startIndex, popularpost?.length);
  return (
    <React.Fragment>
      <Col xl={12} md={12}>
        <Card>
          <CardBody>
            <div className="d-flex">
              <div className="me-2">
                <h1 className="card-title mb-4"> Evénements & Manifestations</h1>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table-nowrap mb-0 table align-middle">
                <thead>
                  <tr>
                    <th scope="col" colSpan="2">
                      Evénement
                    </th>
                    <th scope="col">Catégorie</th>
                    <th scope="col">Participants</th>
                  </tr>
                </thead>

                <tbody>
                  {currentEvents.reverse().map((popularpost, key) => (
                    <tr key={key}>
                      <td style={{ width: "100px" }}>
                        <img
                          src={popularpost?.imgUrl}
                          alt=""
                          className="avatar-md d-block h-auto rounded"
                        />
                      </td>
                      <td>
                        <h5 className="font-size-13 text-truncate mb-1">
                          <Link
                            to={`/events/${popularpost._id}`}
                            className="text-dark"
                          >
                            {popularpost?.title}
                          </Link>
                        </h5>
                        <p className="text-muted mb-0">
                          {popularpost?.startDate?.substring(0, 10)} &nbsp;{" "}
                          {popularpost?.endDate?.substring(0, 10)}
                        </p>
                      </td>
                      <td>{popularpost?.category}</td>
                      <td>
                        <i className="bx bx-user me-1 align-middle"></i>{" "}
                        {popularpost?.participants?.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default PopularPost;

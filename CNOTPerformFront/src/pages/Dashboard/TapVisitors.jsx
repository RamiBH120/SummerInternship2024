import React from "react";

import { Card, CardBody, Col } from "reactstrap";

function TapVisitors({ popularpost }) {
  const entourage = popularpost?.filter(
    (event) => event.category === "Entourage"
  ).length;

  const univ = popularpost?.filter(
    (event) => event.category === "Universalité des jeux olympiques"
  ).length;

  const devsport = popularpost?.filter(
    (event) => event.category === "Développement du Sport"
  ).length;

  const valolymp = popularpost?.filter(
    (event) => event.category === "Valeurs olympiques"
  ).length;

  const gest = popularpost?.filter(
    (event) => event.category === "Gestion des CNO"
  ).length;

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex flex-wrap">
            <div className="ms-2">
              <h5 className="card-title mb-3">Evénements par categories</h5>
            </div>
          </div>

          <hr />

          <div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="py-2">
                  <h5 className="font-size-14">
                    Entourage{" "}
                    <span className="float-end">
                      {Math.trunc((entourage / popularpost?.length) * 100)}%
                    </span>
                  </h5>
                  <div className="progress animated-progess progress-sm">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{
                        width: `${Math.trunc(
                          (entourage / popularpost?.length) * 100
                        )}%`,
                      }}
                      aria-valuenow={Math.trunc(
                        (entourage / popularpost?.length) * 100
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="py-2">
                  <h5 className="font-size-14">
                    Universalité des jeux olympiques{" "}
                    <span className="float-end">
                      {Math.trunc((univ / popularpost?.length) * 100)}%
                    </span>
                  </h5>
                  <div className="progress animated-progess progress-sm">
                    <div
                      className="progress-bar bg-info"
                      role="progressbar"
                      style={{
                        width: `${Math.trunc(
                          (univ / popularpost?.length) * 100
                        )}%`,
                      }}
                      aria-valuenow={Math.trunc(
                        (univ / popularpost?.length) * 100
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="py-2">
                  <h5 className="font-size-14">
                    Développement du Sport{" "}
                    <span className="float-end">
                      {Math.trunc((devsport / popularpost?.length) * 100)}%
                    </span>
                  </h5>
                  <div className="progress animated-progess progress-sm">
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{
                        width: `${Math.trunc(
                          (devsport / popularpost?.length) * 100
                        )}%`,
                      }}
                      aria-valuenow={Math.trunc(
                        (devsport / popularpost?.length) * 100
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="py-2">
                  <h5 className="font-size-14">
                    Valeurs olympiques{" "}
                    <span className="float-end">
                      {Math.trunc((valolymp / popularpost?.length) * 100)}%
                    </span>
                  </h5>
                  <div className="progress animated-progess progress-sm">
                    <div
                      className="progress-bar bg-danger"
                      role="progressbar"
                      style={{
                        width: `${Math.trunc(
                          (valolymp / popularpost?.length) * 100
                        )}%`,
                      }}
                      aria-valuenow={Math.trunc(
                        (valolymp / popularpost?.length) * 100
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="py-2">
                  <h5 className="font-size-14">
                    Gestion des CNO{" "}
                    <span className="float-end">
                      {Math.trunc((gest / popularpost?.length) * 100)}%
                    </span>
                  </h5>
                  <div className="progress animated-progess progress-sm">
                    <div
                      className="progress-bar bg-dark"
                      role="progressbar"
                      style={{
                        width: `${Math.trunc(
                          (gest / popularpost?.length) * 100
                        )}%`,
                      }}
                      aria-valuenow={Math.trunc(
                        (gest / popularpost?.length) * 100
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}

export default TapVisitors;

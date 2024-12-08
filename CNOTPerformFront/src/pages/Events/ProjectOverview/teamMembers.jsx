import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, CardTitle, Table } from "reactstrap";
import { Link } from "react-router-dom";

import { OverviewTeamMember } from "../../../common/data";

const TeamMembers = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">Participants</CardTitle>

        <div className="table-responsive">
          <Table className="table-nowrap table align-middle">
            {OverviewTeamMember.map((item, key) => (
              <tbody key={key}>
                <tr>
                  <td style={{ width: "50px" }}>
                    {item.img ? (
                      <img
                        src={item.img}
                        className="rounded-circle avatar-xs"
                        alt=""
                      />
                    ) : (
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle font-size-16 bg-primary text-white">
                          {item.profile}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <h5 className="font-size-14 m-0">
                      <Link to="#" className="text-dark">
                        {item.title}
                      </Link>
                    </h5>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

TeamMembers.propTypes = {
  team: PropTypes.array,
};

export default TeamMembers;

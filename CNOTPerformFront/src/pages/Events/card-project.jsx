import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { map } from "lodash";
import {
  Badge,
  Card,
  CardBody,
  Col,
  UncontrolledTooltip,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { deleteEvent } from "../../service/event-service";
import DeleteModal from "../Calendar/DeleteModal";
import { EVENT_IMAGES_BASE_URL } from "../../utils";

const CardProject = ({ events, refresh, handleShowEdit }) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const [eventId, setEventId] = useState("");

  const onClickDelete = async (id) => {
    try {
      await deleteEvent(id);

      setDeleteModal(false);
      refresh();
    } catch (error) {
      console.error("There was an error!", error.message);
    }
  };

  const handleDeleteEvent = async (id) => {
    setEventId(id);

    setDeleteModal(true);
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => onClickDelete(eventId)}
        onCloseClick={() => setDeleteModal(false)}
      />
      {events.reverse().map((evt, key) => (
        <Col xl="4" sm="6" key={key}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="avatar-md me-4">
                  <span className="avatar-title rounded-circle text-danger font-size-16 bg-light">
                    {evt?.imgUrl !== "" ? (
                      <img
                      src={`${EVENT_IMAGES_BASE_URL}${evt?.imgUrl}`}
                        alt=""
                        height="30"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <img src="assets/images/icons/calender.svg" alt="" />
                    )}
                  </span>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="text-truncate font-size-15">
                    <Link to={`/events/${evt._id}`} className="text-dark">
                      {evt?.title}
                    </Link>
                  </h5>

                  <div className="badge font-size-11 m-1 bg-primary">
                    {evt?.category}
                  </div>
                </div>

                <UncontrolledDropdown>
                  <DropdownToggle className="card-drop" tag="a">
                    <i className="mdi mdi-dots-horizontal font-size-18" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>
                      <Link to={`/events/${evt._id}`}>
                        <i className="mdi mdi-information font-size-16 text-info me-1" />{" "}
                        Details
                      </Link>
                    </DropdownItem>
                    <DropdownItem onClick={() => handleShowEdit(evt)}>
                      <i className="mdi mdi-pencil font-size-16 text-info me-1" />{" "}
                      Modifier
                    </DropdownItem>
                    <DropdownItem onClick={() => handleDeleteEvent(evt?._id)}>
                      <i className="mdi mdi-trash-can font-size-16 text-danger me-1" />{" "}
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </CardBody>
            <div className="border-top px-4 py-3">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-3">
                  <Badge className={"bg-" + evt.color}>{evt.status}</Badge>
                </li>{" "}
                <li className="list-inline-item me-3" id="initDate">
                  <i className="bx bx-calendar me-1" />{" "}
                  {evt.startDate.substring(0, 10)}
                  <UncontrolledTooltip placement="top" target="initDate">
                    Start Date
                  </UncontrolledTooltip>
                </li>{" "}
                <li className="list-inline-item me-3" id="dueDate">
                  <i className="bx bx-calendar me-1" />{" "}
                  {evt.endDate.substring(0, 10)}
                  <UncontrolledTooltip placement="top" target="dueDate">
                    Due Date
                  </UncontrolledTooltip>
                </li>{" "}
                <li className="list-inline-item me-3" id="comments">
                  <i className="bx bx-user me-1" /> {evt?.participants?.length}
                  <UncontrolledTooltip placement="top" target="comments">
                    Participants
                  </UncontrolledTooltip>
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

CardProject.propTypes = {
  events: PropTypes.array,
  refresh: PropTypes.func,
};

export default CardProject;

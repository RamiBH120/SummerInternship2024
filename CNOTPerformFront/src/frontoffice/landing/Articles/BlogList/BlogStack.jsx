import React from "react";
import { Link } from "react-router-dom";

const BlogStack = ({ currentEvents }) => {
  return (
    <div>
      {currentEvents?.map((evt, index) => (
        <div key={index}>
          <h5>
            <Link to={`/articles/${evt?._id}`} className="text-white">
              {evt?.title}
            </Link>
          </h5>
          <div className=" flex flex-row justify-around ">
            <p className="text-muted">
              <i className="mdi mdi-calendar me-1"></i>
              {evt?.startDate?.substring(0, 10)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <i className="mdi mdi-calendar me-1"></i>
              {evt?.endDate?.substring(0, 10)} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <ul className="list-inline">
              <li className="list-inline-item mr-3">
                <p className="text-muted">
                  <i className="bx bx-purchase-tag-alt text-muted me-1 align-middle"></i>{" "}
                  {evt?.category}
                </p>
              </li>
              <li className="list-inline-item mr-3">
                <p className="text-muted">
                  <i className="bx bx-user text-muted me-1 align-middle"></i>{" "}
                  {evt?.participants?.length}
                </p>
              </li>
            </ul>
          </div>

          <div className="position-relative mb-3">
            <Link to={`/articles/${evt?._id}`}>
              <img src={evt?.imgUrl} alt="" className="img-thumbnail" />
            </Link>
          </div>

          <div>
            <Link to={`/articles/${evt?._id}`} className="text-primary">
              Voir plus <i className="mdi mdi-arrow-right"></i>
            </Link>
          </div>
          <hr className="my-5" />
        </div>
      ))}
    </div>
  );
};

export default BlogStack;

import PropTypes from "prop-types";
import React from "react";

const FeatureBox = (props) => {
  return (
    <React.Fragment>
      <div className="mt-md-auto mt-4">
        <div className="d-flex align-items-center mb-2">
          <div className=" font-weight-semibold display-4 me-3 text-white">
            {props.num}
          </div>
          <h3 className="mb-0 text-3xl text-white">{props.title}</h3>
        </div>
        <h5 className="text-xl text-slate-500">{props.desc}</h5>
      </div>
    </React.Fragment>
  );
};

FeatureBox.propTypes = {
  desc: PropTypes.any,
  features: PropTypes.array,
  num: PropTypes.string,
  title: PropTypes.string,
};

export default FeatureBox;

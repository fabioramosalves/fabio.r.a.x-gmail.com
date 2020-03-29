import React from "react";
import PropTypes from "prop-types";

import "./styles.css";

const CustomButton = ({ children, color, ...props }) => (
  <div className="button" type="button" color={color} {...props}>
    {children}
  </div>
);

CustomButton.propTypes = {
  children: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  props: PropTypes.object
};

export default CustomButton;
import PropTypes from "prop-types";

const Label = ({ htmlFor, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {children}
    </label>
  );
};

Label.propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default Label;

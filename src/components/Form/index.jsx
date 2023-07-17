import PropTypes from "prop-types";
import Group from "./Group";
import Label from "./Label";
import Input from "./Input";

const Form = ({ children }) => {
    return (
        <>
            {children}
        </>
    )
}

Form.Group = Group;
Form.Label = Label;
Form.Input = Input; 

Form.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Form;
import PropTypes from 'prop-types';
const Group = ({ children, ...otherProps }) => {
    return <div {...otherProps}>{children}</div>
}

Group.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Group;
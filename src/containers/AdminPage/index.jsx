import { Outlet } from 'react-router-dom';
// import PropTypes from 'prop-types';
import PrivateLayout from "../../layouts/Private"

const AdminPage = () => {
    return <PrivateLayout>
        <Outlet />
    </PrivateLayout>;
}

// AdminPage.propTypes = {
//     children: PropTypes.node.isRequired
// }

export default AdminPage;
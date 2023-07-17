import Proptypes from 'prop-types'
import LocationLogo from "../../assets/location_logo.png";

const RegionLogo = ({ className, title }) => (
  <a
    href="#"
    className="flex items-center text-xl font-semibold text-gray-900 dark:text-white"
  >
    <img alt="logo" src={LocationLogo} className={className} />
    {title}
  </a>
);

RegionLogo.propTypes = {
  className: Proptypes.string,
  title: Proptypes.string,
}

RegionLogo.defaultProps = {
  className: "w-8 h-8 mr-2",
  title: "Region API Panel"
}

export default RegionLogo;
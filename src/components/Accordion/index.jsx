import {
    Accordion as BaseAccordion
} from "flowbite-react"

import styled from "styled-components";
import PropTypes from "prop-types";

const BaseStyledAccordion = styled(BaseAccordion)`
background-color: green;
`

const Accordion = ({ children}) => {
    return <BaseStyledAccordion>{children}</BaseStyledAccordion>;
}

Accordion.propTypes = {
    children: PropTypes.node.isRequired
}

export default Accordion;
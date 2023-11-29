import { Select as BaseSelect } from "@material-tailwind/react";
import PropTypes from "prop-types";

import { useField } from "formik";
const Select = (props) => {
  const [
    field,
    // meta,
    // helpers
  ] = useField(props)
  // console.log({ field })
  // console.log({ helpers })
  return (
    <BaseSelect
      {...field}
      {...props}
      // onChange={(value) => {
      //   console.log({ value })
      //   helpers.setValue(value)
      // }}
      // onChange={async val => await helpers.setValue(val)}
    >
      {props.children}
    </BaseSelect>
  );
};

Select.propTypes = {
  //   field: PropTypes.object,
  form: PropTypes.object,
  children: PropTypes.node,
};

export default Select;

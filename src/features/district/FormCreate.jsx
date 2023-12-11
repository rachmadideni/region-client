import { Input, Button, Option, Typography } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Select from "../../components/Select";
import ReactSelect from "react-select";

import { createDistrict } from "../../services/district.service";

const createDistrictSchema = Yup.object().shape({
  oidDistrict: Yup.string()
    .required("District Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(8, "Must be exactly 8 digits")
    .max(8, "Must be exactly 8 digits"),
  oidCity: Yup.string()
    .required("City Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(4, "Must be exactly 4 digits")
    .max(4, "Must be exactly 4 digits"),
  districtName: Yup.string()
    .required("District Name is Required")
    .matches(/^[a-zA-Z]+$/, "only characters are allowed")
    .min(4, "City Name is Too short!"),
});

const FormCreate = ({
  // provinces,
  // cityTypes,
  cities,
  // isSubmitting,
  handleButtonLoader,
  handleToast,
  handleRefresh,
}) => {
  return (
    <Formik
      initialValues={{
        oidDistrict: "",
        oidCity: "",
        districtName: "",
      }}
      validationSchema={createDistrictSchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            oid_city: values.oidCity,
            oid_district: values.oidDistrict,
            district_name: values.districtName,
          };

          try {
            let response = await createDistrict(body);
            if (response.status === 200) {
              handleButtonLoader();
              handleToast("createSuccess", "District created successfully");
              handleRefresh();
            }
          } catch (err) {
            const respText = err?.response?.request?.responseText;
            const parsedRespText = JSON.parse(respText);
            if (err.response.status === 409 || err.response.status === 500) {
              handleButtonLoader();
              handleToast("createError", parsedRespText?.message);
            }
          }
        }
      }}
    >
      {({ errors, values, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oidDistrict">
            {({ field, meta }) => (
              <>
                <Input
                  label={
                    meta.touched && meta.error ? meta.error : "District OId"
                  }
                  color="blue-gray"
                  className="uppercase"
                  error={Boolean(meta.touched && meta.error)}
                  {...field}
                />
              </>
            )}
          </Field>          

          <Field name="oidCity">
            {({ field, form, meta }) => (
              <div className="flex flex-col gap-2">
                <Typography color="gray">Select city</Typography>
                <ReactSelect      
                  name={field.name}  
                  options={cities}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.key}
                  onChange={(opt) => {                    
                    form.setFieldValue(field.name, opt.key)
                  }}
                  defaultValue={cities.find(item => item.key === field.value)}
                  menuPosition="fixed"
                />              
              </div>              
            )}
          </Field>
          
          <Field name="districtName">
            {({ field, meta }) => (
              <Input
                label={
                  meta.touched && meta.error ? meta.error : "District name"
                }
                color="blue-gray"
                className="uppercase"
                error={Boolean(meta.touched && meta.error)}
                {...field}
              />
            )}
          </Field>
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={isSubmitting || Object.keys(errors).length > 0}>
            {isSubmitting ? "submitting" : "submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

FormCreate.propTypes = {
  isSubmitting: PropTypes.bool,
  handleButtonLoader: PropTypes.func,
  handleToast: PropTypes.func,
  handleRefresh: PropTypes.func,
  cities: PropTypes.array,
};

export default FormCreate;

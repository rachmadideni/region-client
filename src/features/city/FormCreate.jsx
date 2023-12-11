import { Input, Button, Option } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Select from "../../components/Select";
// import { createProvince } from "../../services/province.service";
import { createCity } from "../../services/city.service";

const createCitySchema = Yup.object().shape({
  oidCity: Yup.string()
    .required("City Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(4, "Must be exactly 4 digits")
    .max(4, "Must be exactly 4 digits"),
  oidProvince: Yup.string()
    // .max(2, "Province Oid is Too Long!"),
    .required("Province Oid is Required"),
  oidCityType: Yup.string()
    .max(2, "City Type is Too Long!")
    .required("City Type is Required"),
  cityName: Yup.string()
    .required("City Name is Required")
    // .matches(/^[a-zA-Z]+$/, "only characters are allowed")
    .min(4, "City Name is Too short!"),
});

const FormCreate = ({
  provinces,
  cityTypes,
  isSubmitting,
  handleButtonLoader,
  handleToast,
  handleRefresh,
}) => {
  return (
    <Formik
      initialValues={{
        oidCity: "",
        oidProvince: "",
        oidCityType: 0,
        cityName: "",
      }}
      // enableReinitialize={true}
      validationSchema={createCitySchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            oid_city: values.oidCity,
            oid_province: values.oidProvince,
            oid_cititype: values.oidCityType,
            city_name: values.cityName,
          };

          try {
            let response = await createCity(body);
            if (response.status === 200) {
              handleButtonLoader();
              handleToast("createSuccess", "City created successfully");
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
      {({ errors, values, touched }) => (
        <Form className="flex flex-col gap-4">
          {/* {JSON.stringify(values, null)} */}
          <Field name="oidCity">
            {({ field, meta }) => (
              <>
                <Input
                  label={meta.touched && meta.error ? meta.error : "City OId"}
                  color="blue-gray"
                  className="uppercase"
                  error={Boolean(meta.touched && meta.error)}
                  {...field}
                />
              </>
            )}
          </Field>

          <Field name="oidProvince">
            {({ field, form, meta }) => (
              <Select
                label={
                  meta.touched && meta.error ? meta.error : "Select Province"
                }
                name={field.name}
                onChange={(val) => form.setFieldValue(field.name, val)}
                error={Boolean(meta.touched && meta.error)}
              >
                {provinces.map((item, id) => (
                  <Option
                    key={`${item.label}${id}`}
                    value={item.key}
                    className="bg-white"
                  >
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </Field>

          <Field name="oidCityType">
            {({ field, form, meta }) => (
              <Select
                label={
                  meta.touched && meta.error ? meta.error : "Select City Type"
                }
                name={field.name}
                onChange={(val) => form.setFieldValue(field.name, val)}
                error={Boolean(meta.touched && meta.error)}
              >
                {cityTypes.map((item, id) => (
                  <Option key={item.label} value={item.key}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </Field>

          <Field name="cityName">
            {({ field, meta }) => (
              <Input
                label={meta.touched && meta.error ? meta.error : "City name"}
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
  provinces: PropTypes.array,
  cityTypes: PropTypes.array,
};

export default FormCreate;

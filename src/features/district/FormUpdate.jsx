import { Input, Button, Option } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Select from "../../components/Select";
import { updateDistrict } from "../../services/district.service";

const updateCitySchema = Yup.object().shape({
  oidDistrict: Yup.string()
    .required("District Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(8, "Must be exactly 8 digits")
    .max(8, "Must be exactly 8 digits"),
  oidCity: Yup.string().max(4, "Oid is Too Long!").required("Oid is Required"),
  districtName: Yup.string()
    .min(2, "District Name is Too short!")
    .required("District Name is Required"),
});

const FormUpdate = ({
  data,
  cities,
  isSubmitting,
  handleButtonLoader,
  handleToast,
  handleRefresh,
}) => {
  
  return (
    <Formik
      initialValues={{
        id: data?.id || "",
        oidCity: data?.oidCity || "",
        oidDistrict: data?.oidDistrict || "",
        districtName: data?.districtName || "",
      }}
      validationSchema={updateCitySchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            id: values.id,
            oid_city: values.oidCity,
            oid_district: values.oidDistrict,
            district_name: values.districtName
          };

          // console.log({ body })

          let response = await updateDistrict(data?.id, body);
          if (response.status === 200) {
            handleButtonLoader();
            handleToast("updateSuccess", "District updated successfully");
            handleRefresh();
          } else {
            handleButtonLoader();
            handleToast("updateError", "District failed to update");
          }
          
        }
      }}
    >
      {({ errors, values }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oidDistrict">
            {({ field, meta }) => (
              <>
                <Input
                  label={meta.touched && meta.error ? meta.error : "OId District"}
                  color="blue-gray"
                  className="uppercase"                  
                  error={meta.touched && meta.error}
                  {...field}
                />
              </>
            )}
          </Field>
          {/* https://stackoverflow.com/questions/74870262/how-to-set-default-value-of-select-element-in-material-tailwind */}
          <Select
            name="oidCity"
            label="City"
            color="blue-gray"
            value={String(values.oidCity)}
          >
            {cities.map((item, id) => (
              <Option key={id} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>          
          <Field name="districtName">
            {({ field, meta }) => (
              <Input
                label={meta.touched && meta.error ? meta.error : "District name"}
                color="blue-gray"
                className="uppercase"
                error={meta.touched && meta.error}
                {...field}
              />
            )}
          </Field>
          {/* {JSON.stringify(data)} */}          
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={
              ((errors && errors.oidCity) || errors.districtName || isSubmitting) ??
              false
            }
          >
            {isSubmitting ? "submitting" : "submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

FormUpdate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    oidCity: PropTypes.string.isRequired,
    oidDistrict: PropTypes.string.isRequired,
    districtName: PropTypes.string.isRequired,
  }),
  cities: PropTypes.array,
  isSubmitting: PropTypes.bool,
  handleButtonLoader: PropTypes.func,
  handleToast: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default FormUpdate;

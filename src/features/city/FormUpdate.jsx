/* eslint-disable react/prop-types */
import { Input, Button, Option } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { updateCity } from "../../services/city.service";
import PropTypes from "prop-types";
import Select from "../../components/Select";

const updateCitySchema = Yup.object().shape({
  oidCity: Yup.string().max(4, "Oid is Too Long!").required("Oid is Required"),
  cityName: Yup.string()
    .min(2, "City Name is Too short!")
    .required("City Name is Required"),
});

const FormUpdate = ({
  data,
  provinces,
  cityTypes,
  isSubmitting,
  handleButtonLoader,
  handleToast,
  handleRefresh,
}) => {
  // console.log("FormUpdate data", data);
  // console.log("provinces props", provinces);
  
  return (
    <Formik
      initialValues={{
        id: data?.id || "",
        oidCity: data?.oidCity || "",
        oidProvince: data?.oidProvince || "",
        oidCityType: data?.oidCityType || 0,
        cityName: data?.cityName || "",
      }}
      validationSchema={updateCitySchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            id: values.id,
            oid_city: values.oidCity,
            oid_province: values.oidProvince,
            city_name: values.cityName,
            oid_cititype: values.oidCityType,
          };

          // console.log({ body })

          let response = await updateCity(data?.id, body);
          if (response.status === 200) {
            handleButtonLoader();
            handleToast("updateSuccess", "City updated successfully");
            handleRefresh();
          } else {
            handleButtonLoader();
            handleToast("updateError", "City updated failed");
          }
        }
      }}
    >
      {({ errors, values }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oidCity">
            {({ field, meta }) => (
              <>
                <Input
                  label={meta.touched && meta.error ? meta.error : "OId"}
                  color="blue-gray"
                  className="uppercase"
                  readOnly
                  error={meta.touched && meta.error}
                  {...field}
                />
              </>
            )}
          </Field>
          {/* https://stackoverflow.com/questions/74870262/how-to-set-default-value-of-select-element-in-material-tailwind */}
          <Select
            name="oidProvince"
            label="Province"
            color="blue-gray"
            value={String(values.oidProvince)}
          >
            {provinces.map((item, id) => (
              <Option key={id} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>


          {/* <Select
            name="oidCityType"
            label="City type"
            color="blue-gray"
            value={String(values.oidCityType)}
          >
            {cityTypes.map((item, id) => (
              <Option key={id} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select> */}

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
                error={meta.touched && meta.error}
                {...field}
              />
            )}
          </Field>
          {/* {JSON.stringify(errors)} */}
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={
              ((errors && errors.oidCity) || errors.cityName || isSubmitting) ??
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
    oidProvince: PropTypes.string.isRequired,
    oidCityType: PropTypes.number.isRequired,
    cityName: PropTypes.string.isRequired,
  }),
  provinces: PropTypes.array,
  isSubmitting: PropTypes.bool,
  handleButtonLoader: PropTypes.func,
  handleToast: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default FormUpdate;

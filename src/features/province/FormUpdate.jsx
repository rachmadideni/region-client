import { Input, Button } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { updateProvince } from "../../services/province.service";
import PropTypes from "prop-types";

const updateProvinceSchema = Yup.object().shape({
  oid: Yup.string().max(2, "Oid is Too Long!").required("Oid is Required"),
  provinceName: Yup.string()
    .min(4, "Province Name is Too short!")
    .required("Province Name is Required"),
});

const FormUpdate = ({ data, isSubmitting, handleButtonLoader, handleToast, handleRefresh }) => {
  return (
    <Formik
      initialValues={{
        oid: data?.oid || "",
        provinceName: data?.provinceName || "",
      }}
      validationSchema={updateProvinceSchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            oid_province: values.oid,
            province_name: values.provinceName,
          };
          let response = await updateProvince(data?.id, body);
          if (response.status === 200) {
            handleButtonLoader()
            handleToast("updateSuccess", "Province updated successfully");
            handleRefresh();
          } else {
            handleButtonLoader();
            handleToast("updateError", "Province updated failed");
          }
        }
      }}
    >
      {({ errors }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oid">
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
          <Field name="provinceName">
            {({ field, meta }) => (
              <Input
                label={
                  meta.touched && meta.error ? meta.error : "Province name"
                }
                color="blue-gray"
                className="uppercase"
                error={meta.touched && meta.error}
                {...field}
              />
            )}
          </Field>
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={((errors && errors.oid) || errors.provinceName || isSubmitting) ?? false}
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
    oid: PropTypes.string.isRequired,
    provinceName: PropTypes.string.isRequired,
  }),
  isSubmitting: PropTypes.bool,
  handleButtonLoader: PropTypes.func,
  handleToast: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default FormUpdate;

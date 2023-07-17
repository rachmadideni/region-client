import { Input, Button } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { createProvince } from "../../services/province.service";

const createProvinceSchema = Yup.object().shape({
  oid: Yup.string().max(2, "Oid is Too Long!").required("Oid is Required"),
  provinceName: Yup.string()
    .min(4, "Province Name is Too short!")
    .required("Province Name is Required"),
});

const FormCreate = ({ isSubmitting, handleButtonLoader, handleToast, handleRefresh }) => {
  return (
    <Formik
      initialValues={{
        oid: "",
        provinceName: "",
      }}
      validationSchema={createProvinceSchema}
      onSubmit={async (values) => {
        if (values) {
          handleButtonLoader();
          let body = {
            oid_province: values.oid,
            province_name: values.provinceName,
          };

          try {
            let response = await createProvince(body);            
            if (response.status === 200) {
              handleButtonLoader();
              handleToast("createSuccess", "Province created successfully");
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
      {({ errors }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oid">
            {({ field, meta }) => (
              <>
                <Input
                  label={meta.touched && meta.error ? meta.error : "OId"}
                  color="blue-gray"
                  className="uppercase"
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
          {/* {JSON.stringify(errors)} */}
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={((errors && errors.oid) || errors.provinceName) ?? false}
          >
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
};

export default FormCreate;

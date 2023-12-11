import { useState } from "react";
import { Input, Button, Option, Typography } from "@material-tailwind/react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Select from "../../components/Select";
import SearchAutoComplete from "../../components/SearchAutoComplete";
import ReactSelect from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

import { searchDistrictByName } from "../../services/district.service";
import { createSubDistrict } from "../../services/subdistrict.service";

const createSubDistrictSchema = Yup.object().shape({
  oidSubDistrict: Yup.string()
    .required("SubDistrict Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(10, "Minimum length is 10 digits")
    .max(12, "Maximum length is 12 digits"),
  oidDistrict: Yup.string()
    .required("District Oid is Required")
    .matches(/^[0-9]+$/, "only digits are allowed")
    .min(7, "Minimum 8 digits")
    .max(8, "Maximum 8 digits"),
  oidSubDistrictType: Yup.string().max(2, "Sub District Type is Too Long!"),
  subDistrictName: Yup.string()
    .required("District Name is Required")
    .matches(/^[a-zA-Z\s]+$/, "only characters are allowed")
    .min(4, "Sub District Name is Too short!"),
  postCode: Yup.string()
    .required("Post Code is Required")
    .min(1, "Min 1 Digit")
    .max(6, "Post Code is Too Long!"),
});

const FormCreate = ({
  subdistrictTypes,
  districtes,
  isSubmitting,
  handleButtonLoader,
  handleToast,
  handleRefresh,
}) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  // only for select async
  const transformOpt = async (data, key, label) => {
    if (data.length > 0) {
      return data.map((item) => ({
        value: item[key],
        label:
          Array.isArray(label) && label.length > 0
            ? label.map((it) => item[it] + " ")
            : item[label],
      }));
    }
  };

  const loadAsyncOptions = async (inputValue, loadedOptions, { page }) => {
    if (inputValue.length < 3) return;
    const response = await searchDistrictByName(
      {
        page: 1,
        order: "ASC",
        take: 10,
      },
      inputValue
    );
    return {
      options: response.data.data,
      additional: {
        page: page + 1,
      },
    };    
  };

  return (
    <Formik
      initialValues={{
        oidSubDistrict: "",
        oidDistrict: "",
        oidSubDistrictType: "",
        subDistrictName: "",
        postCode: "",
        oidDistrictOptions: {
          oid_district: null,
          district_name: null
        },        
      }}
      validationSchema={createSubDistrictSchema}
      onSubmit={async (values) => {
        if (values) {

          // console.log(values)
          
          handleButtonLoader();

          let body = {
            oid_subdistrict: values.oidSubDistrict,
            oid_district: values.oidDistrict,
            oid_subdistricttype: values.oidSubDistrictType,
            subdistrict_name: values.subDistrictName,
            post_code: values.postCode,
          };

          try {
            let response = await createSubDistrict(body);
            if (response.status === 200) {
              handleButtonLoader();
              handleToast("createSuccess", "Sub District created successfully");
              handleRefresh();
            }
          } catch (err) {
            console.log(err);
            const respText = err?.response?.request?.responseText;
            const parsedRespText = JSON.parse(respText);
            if (err.response.status === 409 || err.response.status === 500) {
              handleButtonLoader();
              handleToast("createError", parsedRespText?.message);
            } else if (err.response.status === 400) {
              handleButtonLoader();
              console.log(parsedRespText?.message)
              handleToast("createError", parsedRespText?.message[0].message);
            }
          }
          
        }
      }}
    >
      {({ errors, values, setFieldValue }) => (
        <Form className="flex flex-col gap-4">
          <Field name="oidSubDistrict">
            {({ field, meta }) => (
              <>
                <Input
                  label={
                    meta.touched && meta.error ? meta.error : "Sub District OId"
                  }
                  color="blue-gray"
                  className="uppercase"
                  error={Boolean(meta.touched && meta.error)}
                  {...field}
                />
              </>
            )}
          </Field>

          <Field name="oidDistrict">
            {({ field, form }) => (
              <div className="flex flex-col gap-2">                
                <Typography color="gray">Select oid district</Typography>
                <AsyncPaginate
                  isLoading={false}
                  cacheOptions
                  loadOptions={loadAsyncOptions}
                  additional={{
                    page: 1,
                  }}
                  getOptionLabel={(opt) =>
                    `${opt.oid_district} - ${opt.district_name}`
                  }
                  getOptionValue={(opt) => ({
                    label: `${opt.oid_district} - ${opt.district_name}`,
                    value: opt.oid_district,
                  })}
                  // defaultValue={values.oidDistrictOptions ?? null}
                  onChange={evt => {
                    const { oid_district, district_name } = evt;
                    form.setFieldValue("oidDistrict", oid_district);
                    form.setFieldValue("oidDistrictOptions", {
                      oid_district,
                      district_name
                    });
                  }}
                />
                {/* <ReactSelect
                  isLoading
                  loadOptions={loadAsyncOptions}
                  defaultOptions={districtes} /> */}
              </div>
            )}
          </Field>

          <Field name="oidSubDistrictType">
            {({ field, form }) => (
              <Select
                name={field.name}
                label="Select Sub District type"
                value={values.oidSubDistrictType ?? null}
                onChange={(val) => {                  
                  form.setFieldValue(field.name, val)                  
                }} 
              >
                {subdistrictTypes.map((item, id) => (
                  <Option
                    key={`${item.label}${id}`}
                    value={item.value}
                    className="bg-white"
                  >
                    {item.label}                  
                  </Option>
                ))}
              </Select>

            )}
          </Field>

          <Field name="subDistrictName">
            {({ field, meta }) => (
              <Input
                label={
                  meta.touched && meta.error ? meta.error : "Sub District name"
                }
                color="blue-gray"
                className="uppercase"
                error={Boolean(meta.touched && meta.error)}
                {...field}
              />
            )}
          </Field>
          <Field name="postCode">
            {({ field, meta }) => (
              <>
                <Input
                  label={meta.touched && meta.error ? meta.error : "Post Code"}
                  color="blue-gray"
                  className="uppercase"
                  error={Boolean(meta.touched && meta.error)}
                  {...field}
                />
              </>
            )}
          </Field>
          {/* {JSON.stringify(values, null, 2)} */}
          {/* {JSON.stringify(errors, null, 2)} */}
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={
              (errors &&
                (errors.oidSubDistrict ||
                  errors.oidDistrict ||
                  errors.subDistrictName)) ??
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

FormCreate.propTypes = {
  subdistrictTypes: PropTypes.array,
  districtes: PropTypes.array,
  isSubmitting: PropTypes.bool,
  handleButtonLoader: PropTypes.func,
  handleToast: PropTypes.func,
  handleRefresh: PropTypes.func,
};

export default FormCreate;

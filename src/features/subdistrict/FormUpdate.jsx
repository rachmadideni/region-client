/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Form, Formik, Field } from "formik";
import { Input, Button, Option, select } from "@material-tailwind/react";
import SearchAutoComplete from "../../components/SearchAutoComplete";
import { AsyncPaginate } from "react-select-async-paginate";

import * as Yup from "yup";
import PropTypes from "prop-types";
import { searchDistrictByName } from "../../services/district.service";
import { findDistrictByOid } from "../../services/district.service";
import { updateSubDistrict } from "../../services/subdistrict.service";

const updateSchema = Yup.object().shape({
  // oidCity: Yup.string().max(4, "Oid is Too Long!").required("Oid is Required"),
  oidSubDistrict: Yup.string().required("Subdistrict Oid is Required"),
  oidDistrict: Yup.string().required("District Oid is Required"),
  subDistrictName: Yup.string()
    .min(2, "Subdistrict Name is Too short!")
    .required("Subdistrict Name is Required"),
});

const FormUpdate = ({ data, districtes, handlerOidDistrict, handleButtonLoader, handleToast, handleRefresh, isSubmitting }) => {
    console.log("data", data);
    /*
    {
        "id": 1,
        "oidSubDistrict": "1102043006",
        "oidDistrict": "1102043",
        "subDistrictName": "MUKTI LINCIR",
        "oidSubDistrictType": 3,
        "postCode": "0"
    }
    */

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

    // adapt with react-select-async-paginate
    return {
      options: response.data.data,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        id: data?.id || "",
        oidSubDistrict: data?.oidSubDistrict || "",
        subDistrictName: data?.subDistrictName || "",
        oidSubDistrictType: data?.oidSubDistrictType || "",
        postCode: data?.postCode || "",
        oidDistrict: data?.oidDistrict || "",
        oidDistrictOptions: {
          oid_district: data?.oidDistrict,
          district_name: data?.districtName
        }
      }}
      validationSchema={updateSchema}
      onSubmit={async (values) => {
        console.log(values);
        if (values) {
          handleButtonLoader();
          let body = {
            oid_sub_district: values.oidSubDistrict,
            subdistrict_name: values.subDistrictName,
            oid_district: values.oidDistrict,
            post_code: values.postCode,        
          }
          let response = await updateSubDistrict(data?.id, body);
          if (response.status === 200) {
            handleButtonLoader()
            handleToast("updateSuccess", "Sub District updated successfully");
            handleRefresh();
          } else {
            handleButtonLoader();
            handleToast("updateError", "Sub District update failed");
          }
        }
      }}
    >
      {({ errors, values }) => (
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
          {/* {JSON.stringify(errors, null, 2)} */}
          {/* {"--------------"} */}
          {/* {JSON.stringify(values, null, 2)} */}
          <Field name="oidDistrict">
            {({ form }) => (
              <AsyncPaginate
                styles={{
                  control: (baseStyles, { isFocused }) => ({
                    ...baseStyles,                    
                    boxShadow: "none",                    
                    "&:focus-within": {
                      borderWidth: ".1rem",
                      borderColor: "gray",
                      // boxShadow: "0 0 0.2rem rgba(233, 105, 71, 0.25)",
                    },                    
                  }),
                  input: (baseStyles, { isFocused}) => ({
                    ...baseStyles,
                    borderColor: isFocused ? "none" : "red",
                    "&:focus-within": {
                      borderColor: "red",
                    },                 
                  })
                }}
                isLoading={false}
                cacheOptions
                loadOptions={loadAsyncOptions}
                defaultValue={values.oidDistrictOptions ?? null}
                onChange={(evt) => {
                  const { oid_district, district_name } = evt
                  form.setFieldValue("oidDistrict", oid_district);
                  form.setFieldValue("oidDistrictOptions", {
                        oid_district,
                        district_name
                  });
                }}
                additional={{
                  page: 1,
                }}
                getOptionLabel={
                  (option) => {
                    return `${option.oid_district} - ${option.district_name}`;
                  }
                }
                getOptionValue={(option) => {
                  return {
                    label: `${option.oid_district} - ${option.district_name}`,
                    value: option.oid_district,
                  };
                }}
              />
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
          <Button
            type="submit"
            size="md"
            className="bg-green-800 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
            disabled={
              ((errors && errors.oidSubDistrict) ||
                errors.subDistrictName || errors.oidDistrict ||
                isSubmitting) ??
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
  }),
  districtes: PropTypes.any,
};

export default FormUpdate;

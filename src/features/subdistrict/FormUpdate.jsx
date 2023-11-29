/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Form, Formik, Field } from "formik";
import { Input, Button, Option } from "@material-tailwind/react";
import SearchAutoComplete from "../../components/SearchAutoComplete";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { searchDistrictByName } from "../../services/district.service";
import { findDistrictByOid } from "../../services/district.service";

const updateSchema = Yup.object().shape({
    oidCity: Yup.string().max(4, "Oid is Too Long!").required("Oid is Required"),
    cityName: Yup.string()
        .min(2, "City Name is Too short!")
        .required("City Name is Required"),
});

const FormUpdate = ({ data, districtes, handlerOidDistrict }) => {
    // console.log({ data });
    // const [selectedOpt, setSelectedOpt] = useState(null);
    const [selectedOpt, setSelectedOpt] = useState(null);

    useEffect(() => {
        // find existing oid district
        getExistingDistrict(data.oidDistrict);
    }, []);

    const getExistingDistrict = async (oid) => {
        const resp = await findDistrictByOid(oid);
        const curr = resp.data.data[0];
        // console.log("curr", curr); 
        // console.log(Object.values(curr));
        
        const transform = (curr) => {
            let tempLabels = []
            tempLabels = Object.values(curr).filter((_item, index) => index === 1 || index === Object.values(curr).length - 1)             
            return {
                value: curr.oid_district,
                label: tempLabels.map((item, id) => id === 1 ? item + '  ' : item)
            }
        }

        setSelectedOpt(transform(curr));

        /*
        {
    "value": "7371030",
    "label": [
        "7371030 ",
        "TAMALATE "
    ]
}  
        */
        console.log({ resp });
    };

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

    const loadAsyncOptions = async (inputValue) => {
        const response = await searchDistrictByName(
            {
                page: 1,
                order: "ASC",
                take: 10,
            },
            inputValue
        );
        return transformOpt(
            response.data.data,
            "oid_district",
            // "district_name"
            ["oid_district", "district_name"]
        );
    };

    return (
        <Formik
            initialValues={{
                id: data?.id || "",
                oidSubDistrict: data?.oidSubDistrict || "",
                subDistrictName: data?.subDistrictName || "",
                oidSubDistrictType: data?.oidSubDistrictType || "",
                postCode: data?.postCode || "",
                oidDistrict: data?.oidDistrict || ""
            }}
            validationSchema={updateSchema}
            onSubmit={async (values) => {
                console.log(values);
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
                    {JSON.stringify(selectedOpt, null, 2)}
                    {JSON.stringify(values, null, 2)}
                    <Field name="oidDistrict">
                        {({ field, form, meta}) => (
                            <SearchAutoComplete
                                label="District"
                                name="oidDistrict"
                                onChange={(val) => {
                                    // console.log("onSelect", val)

                                    // handlerOidDistrict(val);
                                    // setFieldValue("oidDistrict", val.value);
                                    form.setFieldValue("oidDistrict", val.value);
                                }}
                                loadOptions={loadAsyncOptions}
                                options={districtes}
                                getOptionValue={(option) => console.log(option)}
                                // defaultOptions={districtes}
                                value={selectedOpt ?? ""}
                                {...field}
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

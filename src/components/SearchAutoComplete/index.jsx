import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import PropTypes from "prop-types";
// import { useField } from "formik";

// const options = [
//     { value: 'chocolate', label: 'Chocolate' },
//     { value: 'strawberry', label: 'Strawberry' },
//     { value: 'vanilla', label: 'Vanilla' }
// ]

const SearchAutoComplete = (props) => {
    // const [ field ] = useField(props)
    return (
        <Select
            classNames={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    borderColor: 'red',
                })
            }}
            // cacheOptions
            // {...field}
            {...props} />
    )
} 

SearchAutoComplete.propTypes = {
    options: PropTypes.array,
}

export default SearchAutoComplete;
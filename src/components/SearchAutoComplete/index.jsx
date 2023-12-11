import { AsyncPaginate } from "react-select-async-paginate";
import PropTypes from "prop-types";

const SearchAutoComplete = (props) => {
    return (
        <AsyncPaginate
              classNames={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderColor: "red",
                }),
              }}
            isLoading={false}
            value={props.value}
            cacheOptions
            loadOptions={props.loadOptions}
            onChange={props.onChange}
            additional={{
                page: 1
            }}
            getOptionLabel={(option) => `${option.oid_district} - ${option.district_name}`}
            getOptionValue={(option) => `${option.oid_district}`}
            {...props}
    />
  );
};

SearchAutoComplete.propTypes = {
    value: PropTypes.string,
  options: PropTypes.array,
    loadOptions: PropTypes.func,
  onChange: PropTypes.func
};

export default SearchAutoComplete;

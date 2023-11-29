import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

const FormDeleteConfirmation = ({ data, onCancel, onDelete }) => {
  let cityName = data.cityName;
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex py-2">
        <Typography className="text-sm text-gray-600">
          {"are you sure want to delete the " + cityName +  " city?"}
        </Typography>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          variant="outlined"
          color="blue-gray"
          size="sm"
          className="shadow:blue-gray rounded-md disabled:cursor-not-allowed"
          onClick={onCancel}
        >
          cancel
        </Button>
        <Button
          size="sm"
          className="bg-red-500 shadow:blue-gray rounded-md disabled:cursor-not-allowed"
          onClick={onDelete}
        >
          delete
        </Button>
      </div>
    </div>
  );
};

FormDeleteConfirmation.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    oid: PropTypes.string.isRequired,
    cityName: PropTypes.string.isRequired,
  }),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FormDeleteConfirmation;

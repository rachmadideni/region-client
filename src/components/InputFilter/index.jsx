import { Input, Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const InputFilter = (props) => {
  const { onButtonClick } = props;
  return (
    <div className="relative flex w-full max-w-[24rem]">
      <Input {...props} />
      <Button
        size="sm"
        className="!absolute right-1 top-1 rounded bg-green-700"
        onClick={onButtonClick}
      >
        <HiOutlineMagnifyingGlass className="h-4 w-4 text-green" />
      </Button>
    </div>
  );
};

InputFilter.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
};

export default InputFilter;

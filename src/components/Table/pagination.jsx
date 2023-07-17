import { useReactTable } from "@tanstack/react-table";
import { Typography, IconButton } from "@material-tailwind/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import PropTypes from "prop-types";
const Pagination = ({ tableInstance }) => {
  return (
    <>
      <IconButton
        size="sm"
        variant="outlined"
        color="blue-gray"
        onClick={() => tableInstance.previousPage()}
        disabled={!tableInstance.getCanPreviousPage()}
      >
        <BsArrowLeft strokeWidth={1} className="h-3" />
      </IconButton>

      <Typography color="gray" className="font-normal">
        Page{" "}
        <strong className="text-blue-gray-900">
          {tableInstance.getState().pagination.pageIndex + 1}
        </strong>{" "}
        of{" "}
        <strong className="text-blue-gray-900">
          {tableInstance.getPageCount()}
        </strong>
      </Typography>

      <IconButton
        size="sm"
        variant="outlined"
        color="blue-gray"
        onClick={() => tableInstance.nextPage()}
        disabled={!tableInstance.getCanNextPage()}
      >
        <BsArrowRight strokeWidth={1} className="h-3" />
      </IconButton>
    </>
  );
};

Pagination.propTypes = {
  tableInstance: PropTypes.instanceOf(Object),
};


export default Pagination;
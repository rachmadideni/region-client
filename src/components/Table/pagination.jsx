import { Typography, IconButton, Input } from "@material-tailwind/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import PropTypes from "prop-types";

const Pagination = ({ tableInstance, meta, handlePageChange }) => {
  const goToNextPage = (page) => {
    handlePageChange({
      page,
      take: meta.take,
    });
  };

  const goToPreviousPage = (page) => {
    handlePageChange({
      page,
      take: meta.take,
    });
  };

  return !meta ? (
    <>
      <div className="flex flex-row w-full justify-center items-center space-x-2">
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
      </div>
      <div className="flex flex-row items-center">
        {/* <div className="block w-[50px]">
          <Typography color="gray" className="font-normal">
            go to  
          </Typography>
        </div> */}
        {/* <div className="flex"> */}
        <Input
          variant="outlined"
          label="Go To Page"
          type="number"
          size="sm"
          defaultValue={tableInstance.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            tableInstance.setPageIndex(page);
          }}
          // containerProps={{
          //   className: "w-[50px]"
          // }}
        />
        {/* </div> */}
      </div>
    </>
  ) : (
    <>
      <IconButton
        size="sm"
        variant="outlined"
        color="blue-gray"
        onClick={() => goToPreviousPage(meta.page - 1)}
        disabled={!meta.hasPreviousPage}
      >
        <BsArrowLeft strokeWidth={1} className="h-3" />
      </IconButton>

      <Typography color="gray" className="font-normal">
        Page <strong className="text-blue-gray-900">{meta.page}</strong> of{" "}
        <strong className="text-blue-gray-900">{meta.pageCount}</strong>
      </Typography>

      <IconButton
        size="sm"
        variant="outlined"
        color="blue-gray"
        onClick={() => goToNextPage(meta.page + 1)}
        disabled={!meta.hasNextPage}
      >
        <BsArrowRight strokeWidth={1} className="h-3" />
      </IconButton>

      <Typography>Go To</Typography>
    </>
  );
};

Pagination.propTypes = {
  tableInstance: PropTypes.instanceOf(Object),
  handlePageChange: PropTypes.func.isRequired,
  meta: PropTypes.shape({
    page: PropTypes.number,
    take: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    hasPreviousPage: PropTypes.bool,
    hasNextPage: PropTypes.bool,
  }),
};

// Pagination.defaultProps = {
//   meta: null
// }

export default Pagination;

// import { useState } from "react";
import {
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

import Pagination from "./pagination";

const Table = ({
    tableInstance,
}) => {

  return (
    <table className="table-auto w-full min-w-max text-left">
      <thead className="sticky top-0">
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="bg-silver-300 border-y border-silver-500 p-2"
              >
                <Typography
                  variant="small"
                  className="text-[13px] font-bold text-gray-600 capitalize leading-none"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Typography>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {tableInstance.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().length > 0 ? (
              row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-2 py-0 border-y border-blue-gray-50"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-xs"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Typography>
                </td>
              ))
            ) : (
              <p>no data</p>
            )}
            {}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.defaultProps = {
  data: [],
};

Table.propTypes = {
  tableInstance: PropTypes.instanceOf(Object),
};

Table.Pagination = Pagination;

export default Table;

import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
  Tooltip,
  IconButton,
  CardFooter,
} from "@material-tailwind/react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  //   FilterFn,
} from "@tanstack/react-table";

import Dialog from "../../components/Dialog";
import FormCreate from "../../features/province/FormCreate";
import FormUpdate from "../../features/province/FormUpdate";

import {
  //   RankingInfo,
  rankItem,
  //   compareItems,
} from "@tanstack/match-sorter-utils";

import { findAllProvince } from "../../services/province.service";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const columnHelper = createColumnHelper();



const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const ProvincePage = () => {
  const [data, setData] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  
  const columns = [
    columnHelper.accessor("id", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="w-3">id</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("oid_province", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="">oid</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("province_name", {
      width: 10,
      header: () => <span className="">name</span>,
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("action", {
      // width: 50,
      header: () => <span className="">action</span>,
      cell: ({ cell }) => (
        <>
          <Tooltip content="Edit">
            <IconButton
              variant="text"
              className="text-blue-gray-400 hover:bg-transparent hover:text-blue-gray-900"
              onClick={() => {
                setSelectedRowId(cell.row.original.id);
                const row = data.find(
                  (item) => item.id === cell.row.original.id
                );

                setSelectedRow({
                  id: row.id,
                  oid: row.oid_province,
                  provinceName: row.province_name
                })                
              }}
            >
              <AiOutlineEdit className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete">
            <IconButton
              variant="text"
              className="text-red-400 hover:bg-transparent hover:text-red-900"
              onClick={() => {
                setSelectedRowId(cell.row.original.id);
              }}
            >
              <AiOutlineDelete className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </>
      ),
    }),
  ];
  
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const getProvince = async () => {
      const response = await findAllProvince();
      setData(response.data);
    };
    getProvince();
  }, []);

  return (
    <div className="w-full h-screen space-y-4">
      <div className="flex flex-col">
        <Typography className="text-xl font-bold text-gray-800 font-sans">
          Manage Province
        </Typography>
        <Typography className="text-xs text-gray-500">lorem ipsum</Typography>
      </div>
      <div alt="table" className="flex flex-col">
        {/* table */}
        <Card className="h-full w-full px-4 pb-8">
          <CardHeader
            floated={false}
            shadow={false}
            className="rounded-none items-center justify-center"
          >
            <div className="mb-0 flex flex-col justify-between items-center gap-8 md:flex-row md:items-center">
              <div className="flex w-full shrink-0 gap-2 md:w-max pb-2">
                <div className="w-full items-between md:w-72">
                  <Input
                    label="Search"
                    color="teal"
                    size="md"
                    className="w-full"
                    value={globalFilter ?? ""}
                    onChange={(evt) => setGlobalFilter(evt.target.value)}
                    icon={<HiOutlineMagnifyingGlass className="h-5 w-5" />}
                  />
                </div>
              </div>
              <div>
                {selectedRowId}
                <Button
                  className="flex items-center gap-3 rounded-md bg-green-800"                  
                  size="sm"
                  onClick={() => setOpenCreateDialog(true)}
                >
                  Create new
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll no-scrollbar ">
            <table className="table-auto w-full min-w-max text-left">
              <thead className="sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
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
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().length > 0 ? (
                      row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-2 py-0 border-y border-blue-gray-50"
                          // border-b border-blue-gray-50
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-xs"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
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
          </CardBody>
          <CardFooter className="flex items-center justify-center gap-3 border-t border-blue-gray-50 p-4">
            {/* Table Pagination */}
            <IconButton
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <BsArrowLeft strokeWidth={1} className="h-3" />
            </IconButton>

            <Typography color="gray" className="font-normal">
              Page{" "}
              <strong className="text-blue-gray-900">
                {table.getState().pagination.pageIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-blue-gray-900">
                {table.getPageCount()}
              </strong>
            </Typography>

            <IconButton
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <BsArrowRight strokeWidth={1} className="h-3" />
            </IconButton>
          </CardFooter>
        </Card>
        <Dialog
          title="Create new province"
          open={openCreateDialog}
          size="xs"
          handleOpenClose={() => setOpenCreateDialog(false)}
        >
          <FormCreate />
        </Dialog>

        <Dialog
          title="edit province"
          open={selectedRowId ?? false}
          size="xs"
          handleOpenClose={() => setSelectedRowId(null)}
        >
          <FormUpdate data={selectedRow} />
          {/* Edit {selectedRowId} */}
        </Dialog>
        {/* end table */}
      </div>
    </div>
  );
};

export default ProvincePage;

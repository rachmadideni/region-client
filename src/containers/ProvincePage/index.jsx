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
  getPaginationRowModel,
  getFilteredRowModel,
  //   FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

import Table from "../../components/Table";
import Dialog from "../../components/Dialog";
import Toast from "../../components/Toast";
import FormCreate from "../../features/province/FormCreate";
import FormUpdate from "../../features/province/FormUpdate";
import FormDeleteConfirmation from "../../features/province/FormDeleteConfirmation";

import { findAllProvince, deleteProvince } from "../../services/province.service";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

import toast from "react-hot-toast";

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
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [selectRowForDelete, setSelectRowForDelete] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                  provinceName: row.province_name,
                });
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
                setDeleteRowId(cell.row.original.id);
                const row = data.find((item) => item.id === cell.row.original.id)
                setSelectRowForDelete({
                  id: row.id,
                  oid: row.oid_province,
                  provinceName: row.province_name,
                });
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

  const getProvince = async () => {
    const response = await findAllProvince();
    setData(response.data);
  };

  useEffect(() => {    
    getProvince();
  }, []);

  const handleButtonLoader = () => {
    setIsSubmitting((prevState) => !prevState);
  };
  const handleToast = (type, toastMessage) => {
    // 1. resetting state
    setSelectedRowId(null);
    setSelectedRow();
    setOpenCreateDialog(false);

    // 2. show toast
    setTimeout(() => {
      const toastType = type.includes("Error") ? "error" : "success";
      toast[toastType](toastMessage);
    }, 700);
  };

  const handleDelete = async () => {
    if (selectRowForDelete) {
      try {
        const response = await deleteProvince(selectRowForDelete.id);
        if (response.status === 200) {
          handleToast("deleteSuccess", "Province deleted successfully");
          setDeleteRowId(null);
          setSelectRowForDelete()
          getProvince();
        }
      } catch (err) {        
        const respText = err?.response?.request?.responseText;
        const parsedRespText = JSON.parse(respText);
        if (err.response.status === 409 || err.response.status === 500) {
          handleButtonLoader();
          handleToast("deleteError", parsedRespText?.message);
        }
      }
    }
  }

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
            <Table tableInstance={table} />
          </CardBody>
          <CardFooter className="flex items-center justify-center gap-3 border-t border-blue-gray-50 p-4">
            <Table.Pagination tableInstance={table} />
          </CardFooter>
        </Card>
        <Dialog
          title="Create new province"
          open={openCreateDialog}
          size="xs"
          handleOpenClose={() => setOpenCreateDialog(false)}
        >
          <FormCreate
            isSubmitting={isSubmitting}
            handleButtonLoader={handleButtonLoader}
            handleToast={handleToast}
            handleRefresh={getProvince}
          />
        </Dialog>

        <Dialog
          title="edit province"
          open={Boolean(selectedRowId) ?? false}
          size="xs"
          handleOpenClose={() => setSelectedRowId(null)}
        >
          <FormUpdate
            data={selectedRow}
            isSubmitting={isSubmitting}
            handleButtonLoader={handleButtonLoader}
            handleToast={handleToast}
            handleRefresh={getProvince}
          />
          {/* Edit {selectedRowId} */}
        </Dialog>

        <Dialog
          title="Delete Province"
          open={Boolean(deleteRowId) ?? false}
          size="xs"
          handleOpenClose={() => setDeleteRowId(null)}
        >
          <FormDeleteConfirmation
            data={selectRowForDelete}
            onCancel={() => setDeleteRowId(null)}
            onDelete={handleDelete}
          />
        </Dialog>
        {/* end table */}
        <Toast />
      </div>
    </div>
  );
};

export default ProvincePage;

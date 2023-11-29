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
import FormCreate from "../../features/city/FormCreate";
import FormUpdate from "../../features/city/FormUpdate";
import FormDeleteConfirmation from "../../features/city/FormDeleteConfirmation";

import { findAllProvince } from "../../services/province.service";
import { findAllCity, deleteCity } from "../../services/city.service";

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

const CityPage = () => {
  const [data, setData] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRow, setSelectedRow] = useState();
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [selectRowForDelete, setSelectRowForDelete] = useState();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // options for select
    const [provinces, setProvinces] = useState([]);
    const [cityTypes, setCityTypes] = useState([
      {
        key: 1,
        label: "KOTA",
      },
      {
        key: 2,
        label: "KABUPATEN",
      },
    ]);

  const columns = [
    columnHelper.accessor("id", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="w-3">id</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("oid_city", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="">oid</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("province.province_name", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="">Province</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("oid_cititype", {
      maxWidth: 4,
      minWidth: 4,
      width: 4,
      size: 4,
      header: () => <span className="">Type</span>,
      cell: (info) => {
        return (
          <span className="uppercase">
            {info.getValue() === 2 ? "kabupaten" : "kota"}
          </span>
        );
      },
    }),
    columnHelper.accessor("city_name", {
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
                  oidCity: row.oid_city,
                  oidProvince: row.oid_province,
                  oidCityType: row.oid_cititype,
                  cityName: row.city_name,
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
                const row = data.find(
                  (item) => item.id === cell.row.original.id
                );

                console.log("setSelectRowForDelete", row);
                setSelectRowForDelete({
                  id: row.id,
                  oid: row.oid_city,
                  cityName: row.city_name,
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

  const getCities = async () => {
    const response = await findAllCity();
    setData(response.data.data);
  };

  const transformAsOptions = async (data, key, label) => {
    if (data.length > 0) {      
      return data.map((item) => ({
        key: item[key],
        label: item[label],
      }));
    }
  };

  const getProvince = async () => {
    const response = await findAllProvince();
    let AsOptions = await transformAsOptions(
      response.data.data,
      "oid_province",
      "province_name"
    );

    setProvinces(AsOptions);
  };

  useEffect(() => {
    getCities();
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
        const response = await deleteCity(selectRowForDelete.id);
        if (response.status === 200) {
          handleToast("deleteSuccess", "City deleted successfully");
          setDeleteRowId(null);
          setSelectRowForDelete();
          getCities();
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
  };

  return (
    <div className="w-full h-screen space-y-4">
      <div className="flex flex-col">
        <Typography className="text-xl font-bold text-gray-800 font-sans">
          Manage Cities
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
          title="Create new city"
          open={openCreateDialog}
          size="xs"
          handleOpenClose={() => setOpenCreateDialog(false)}
        >
          <FormCreate
            provinces={provinces}
            cityTypes={cityTypes}
            isSubmitting={isSubmitting}
            handleButtonLoader={handleButtonLoader}
            handleToast={handleToast}
            handleRefresh={getCities}
          />
        </Dialog>

        <Dialog
          title="edit city"
          open={Boolean(selectedRowId) ?? false}
          size="xs"
          handleOpenClose={() => setSelectedRowId(null)}
        >
          <FormUpdate
            data={selectedRow}
            provinces={provinces}
            cityTypes={cityTypes}
            isSubmitting={isSubmitting}
            handleButtonLoader={handleButtonLoader}
            handleToast={handleToast}
            handleRefresh={getCities}
          />
          {/* Edit {selectedRowId} */}
        </Dialog>

        <Dialog
          title="Delete City"
          open={Boolean(deleteRowId) ?? false}
          size="xs"
          handleOpenClose={() => setDeleteRowId(null)}
        >
          {/* {JSON.stringify(selectRowForDelete)} */}
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

export default CityPage;

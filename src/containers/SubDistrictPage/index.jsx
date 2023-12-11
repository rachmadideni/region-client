import { useState, useEffect } from "react";
import {
    Typography,
    Card,
    CardHeader,
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
import InputFilter from "../../components/InputFilter";
import FormCreate from "../../features/subdistrict/FormCreate";
import FormUpdate from "../../features/subdistrict/FormUpdate";
import FormDeleteConfirmation from "../../features/subdistrict/FormDeleteConfirmation";

import {
    findAllDistrict,
    findDistrictByOid,
    // searchDistrictByName,
    // deleteDistrict
} from "../../services/district.service";

import {
    findAllSubDistrict,
    searchSubDistrictByName,
    deleteSubDistrict
} from "../../services/subdistrict.service"; 
import { findAllSubDistrictType } from "../../services/subdistricttype.service";
import { findAllCity } from "../../services/city.service";

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

const SubDistrictPage = () => {
    const [data, setData] = useState([]);
    const [paging, setPaging] = useState({
        page: 1,
        order: "ASC",
        take: 10
    });

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedRow, setSelectedRow] = useState();
    const [deleteRowId, setDeleteRowId] = useState(null);
    const [selectRowForDelete, setSelectRowForDelete] = useState();
    
    const [globalFilter, setGlobalFilter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // options for select
    const [cities, setCities] = useState([]);
    const [subdistrictType, setSubDistrictType] = useState([]);
    const [districtes, setDistrictes] = useState([]);
    const columns = [
        columnHelper.accessor("id", {
            maxWidth: 4,
            minWidth: 4,
            width: 4,
            size: 4,
            header: () => <span className="w-3">id</span>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("oid_subdistrict", {
            maxWidth: 4,
            minWidth: 4,
            width: 4,
            size: 4,
            header: () => <span className="">Oid Sub District</span>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("oid_district", {
            maxWidth: 4,
            minWidth: 4,
            width: 4,
            size: 4,
            header: () => <span className="">Oid District</span>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("districtes.district_name", {
            maxWidth: 4,
            minWidth: 4,
            width: 4,
            size: 4,
            header: () => <span className="">District</span>,
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("subdistrict_name", {
            width: 10,
            header: () => <span className="">subdistric name</span>,
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
                                
                                console.log({ row })
                                
                                setSelectedRow({
                                    id: row.id,
                                    oidSubDistrict: row.oid_subdistrict,
                                    oidDistrict: row.oid_district,
                                    districtName: row.districtes.district_name,
                                    subDistrictName: row.subdistrict_name,
                                    oidSubDistrictType: row.oid_subdistricttype,
                                    postCode: row.post_code,
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
                                    subDistrictName: row.subdistrict_name,
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
        // debugTable: false,
        // manualFiltering: true
    });

    const getAllSubDistrict = async () => {
        const response = await findAllSubDistrict(paging);
        setData(response.data.data);
        // setPaging(response.data.meta);
    };

    const getAllSubDistrictType = async () => {
        const response = await findAllSubDistrictType();
        let AsOptions = await transformAsOptions(
            response.data.data,
            "id",// key
            "subdistrict_type"// label
        );
        setSubDistrictType(AsOptions)
    }

    const getAllDistrict = async () => {
        const response = await findAllDistrict();
        let AsOptions = await transformAsOptions(
            response.data.data,
            "oid_district",
            "district_name"
        )

        setDistrictes(AsOptions);
        // setPaging(response.data.meta);
    };


    const transformAsOptions = async (data, key, label) => {
        if (data.length > 0) {
            return data.map((item) => ({
                value: item[key],
                label: item[label],
            }));
        }
    };

    useEffect(() => {
        getAllSubDistrict();
        getAllSubDistrictType();
        getAllDistrict();
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
                const response = await deleteSubDistrict(selectRowForDelete.id);
                if (response.status === 200) {
                    handleToast("deleteSuccess", "Sub District deleted successfully");
                    setDeleteRowId(null);
                    setSelectRowForDelete();
                    getAllDistrict();
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

    // pagination

    const handlePageChange = (props) => {
        console.log(props)
        setPaging({
            ...paging,
            page: props.page
        })
    }

    useEffect(() => {
        getAllSubDistrict()
    }, [paging.page])

    const filterData = async () => {
        const response = await searchSubDistrictByName(paging, globalFilter);
        setData(response.data.data);
        setPaging(response.data.meta);
    }

    const handlerOidDistrict = (value) => { 
        // setSelectedOpt(value);
    }

    // useEffect(() => {
    //     console.log({ selectedOpt })
    // }, [selectedRowId, handlerOidDistrict])

    return (
        <div className="w-full h-screen space-y-4">
            <div className="flex flex-col">
                <Typography className="text-xl font-bold text-gray-800 font-sans">
                    Manage Sub District
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
                                    <InputFilter
                                        label="Search"
                                        className="pr-20"
                                        containerProps={{
                                            className: "min-w-0",

                                        }}
                                        value={globalFilter ?? ""}
                                        onChange={(evt) => setGlobalFilter(evt.target.value)}
                                        onButtonClick={filterData} />
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
                        {/* {JSON.stringify(districtes, null, 2)} */}
                        {/* {JSON.stringify(globalFilter,null, 2)} */}
                        {/* {JSON.stringify(paging)} */}
                        <Table.Pagination tableInstance={table} />
                            {/* // meta={paging}
                            // handlePageChange={handlePageChange} */}
                        
                    </CardFooter>
                </Card>
                <Dialog
                    title="Create new sub district"
                    open={openCreateDialog}
                    size="xs"
                    handleOpenClose={() => setOpenCreateDialog(false)}
                >
                    <FormCreate                        
                        subdistrictTypes={subdistrictType}
                        districtes={districtes}
                        isSubmitting={isSubmitting}
                        handleButtonLoader={handleButtonLoader}
                        handleToast={handleToast}
                        handleRefresh={getAllSubDistrict}
                    />
                </Dialog>

                <Dialog
                    title="Edit Sub District"
                    open={Boolean(selectedRowId) ?? false}
                    size="xs"
                    handleOpenClose={() => setSelectedRowId(null)}
                >
                    <FormUpdate
                        data={selectedRow}
                        districtes={districtes}
                        isSubmitting={isSubmitting}
                        //selectedOpt={selectedOpt}
                        handlerOidDistrict={handlerOidDistrict}
                        handleButtonLoader={handleButtonLoader}
                        handleToast={handleToast}
                        handleRefresh={getAllSubDistrict}
                    />
                    {/* Edit {selectedRowId} */}
                </Dialog>

                <Dialog
                    title="Delete District"
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

export default SubDistrictPage;

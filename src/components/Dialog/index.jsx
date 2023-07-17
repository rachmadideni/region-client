import {
  Card,
  CardBody,
  CardHeader,
  Dialog as BaseDialog,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { IoCloseSharp } from "react-icons/io5";
import PropTypes from "prop-types";

const Dialog = ({ title, open, handleOpenClose, children, ...DialogProps }) => {
  return (
    <BaseDialog
      size="sm"
      open={open}
      className="bg-transparent shadow-none justify-start"
      handler={handleOpenClose}
      {...DialogProps}
    >
      <Card className="w-full rounded-md p-4">
        <CardHeader
          className="flex justify-between mb-4 h-8 overflow-visible no-scrollbar"
          floated={false}
          shadow={false}
        >
          <Typography variant="h5" color="blue-gray">
            {title}
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            color="blue-gray"
            className="absolute -top-6 -right-6 z-[10000] w-5 h-5 rounded-full border border:green-500 active:outline-none focus:outline-none"
            // bg-teal-500 hover:bg-teal-500
            // color="teal"
            // color="blue-gray"
            onClick={handleOpenClose}
          >
            <IoCloseSharp className="text-black" />
          </IconButton>
        </CardHeader>
        <CardBody className="px-4 py-1 overflow-scroll no-scrollbar">
          {children}
        </CardBody>
      </Card>
    </BaseDialog>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpenClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dialog;

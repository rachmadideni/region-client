// import * as BaseToast from "@radix-ui/react-toast";
import { Toaster } from "react-hot-toast";

const Toast = () => {
    return (
      <Toaster
        toastOptions={{
          className: "",
          style: {            
            zIndex: 99999,
          },
        }}
      />
    );
}

export default Toast;
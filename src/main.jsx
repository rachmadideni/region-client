import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterProvider from './Router'
import './index.css'
import { ThemeProvider } from "@material-tailwind/react";
// import * as Toast from "@radix-ui/react-toast";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* <Toast.Provider> */}
        <RouterProvider />
      {/* </Toast.Provider> */}
    </ThemeProvider>
  </React.StrictMode>,
)

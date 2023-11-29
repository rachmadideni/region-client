import {
  createBrowserRouter,
  RouterProvider as BaseRouterProvider,
  Navigate,
  useRouteError
} from "react-router-dom";
import PropTypes from "prop-types";

import LoginPage from "./containers/LoginPage";
import AdminPage from "./containers/AdminPage";
import ProvincePage from "./containers/ProvincePage";
import CityPage from "./containers/CityPage";
import DistrictPage from "./containers/DistrictPage";
import SubDistrictPage from "./containers/SubDistrictPage";

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/" />
  }
  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  token: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}


const ErrorPage = () => {
    const error = useRouteError();
    return (
        <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                    <p className="mt-4 mb-8 dark:text-gray-400">{error.statusText || error.message}</p>
                    <a rel="noreferrer" href="/" className="px-8 py-3 font-semibold rounded dark:bg-violet-400 dark:text-gray-900">Back to homepage</a>
                </div>
            </div>
        </section>
    )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute token="123">
        <AdminPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'provinces',
        element: <ProvincePage />,
      },
      {
        path: 'city',
        element: <CityPage />
      },
      {
        path: 'district',
        element: <DistrictPage />
      },
      {
        path: 'subdistrict',
        element: <SubDistrictPage />
      }
    ]
  },
]);

const RouterProvider = () => {
  return <BaseRouterProvider router={router} />;
};

export default RouterProvider;

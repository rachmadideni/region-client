import { useNavigate } from "react-router-dom";
import RegionLogo from "../../components/RegionLogo";
import Form from "../../components/Form";
import Button from "../../components/Button";
const LoginPage = () => {
    const navigate = useNavigate();
    const handleSubmit = (evt) => {
        evt.preventDefault()
        navigate('/admin')
    }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 space-y-6">
        <RegionLogo title="Region Api Panel" />
        {/* Form Section */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl capitalize font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              login
            </h1>
            <form className="space-y-4 md:space-y-6">
              <Form.Group>
                <Form.Label htmlFor="username">username</Form.Label>
                <Form.Input type="text" name="username" />
              </Form.Group>
              <Button type="submit" onClick={handleSubmit}>
                login
              </Button>
            </form>
          </div>
        </div>
        {/*  */}
      </div>
    </section>
  );
};

export default LoginPage;

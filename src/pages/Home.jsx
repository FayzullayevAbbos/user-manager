import { Button, message } from "antd";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const userRole = Cookies.get('userRole')
  const user = Cookies.get('token')
  const handleRoleSelection = async (selectedRole) => {
    Cookies.set("userRole", selectedRole);
  navigate('/login')
  };

  useEffect(() => {
    if (userRole && user) {
      navigate("/dashboard");
    } else if (!userRole) {
      navigate("/");
    }
   
    
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
      <div className='bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8'>
          Who are you?
        </h1>
        <p className='text-lg text-gray-600 mb-10'>
          Please select your role to continue
        </p>

        <div className='flex justify-around'>
          <Button
            type='primary'
            size='large'
            className='w-36 h-36 flex flex-col justify-center items-center bg-blue-500 hover:bg-blue-700 transition duration-300 ease-in-out text-white rounded-full shadow-lg'
            onClick={() => handleRoleSelection("user")}
            icon={<UserOutlined className='text-4xl mb-2' />}
          >
            User
          </Button>

          <Button
            type='primary'
            size='large'
            className='w-36 h-36 flex flex-col justify-center items-center bg-red-500 hover:bg-red-700 transition duration-300 ease-in-out text-white rounded-full shadow-lg'
            onClick={() => handleRoleSelection("admin")}
            icon={<CrownOutlined className='text-4xl mb-2' />}
            danger
          >
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;

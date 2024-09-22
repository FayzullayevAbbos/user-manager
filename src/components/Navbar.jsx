import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/"); // Tizimdan chiqqandan keyin asosiy sahifaga yo'naltirish
  };
     
  const handleAuth = (path) => {
    navigate(path)
  }

  // Cookie'dan rolni tekshirish
  useEffect(() => {
    const userRole = Cookies.get("userRole");
    if (!userRole) {
      navigate("/"); // Rol yo'q bo'lsa asosiy sahifaga yo'naltirish
    }
  }, [navigate]);

  return (
    <Header className='bg-white shadow-lg h-auto'>
      <div className='max-w-7xl mx-auto flex justify-between items-center bg-white   p-2'>
        <div className='text-2xl font-bold text-gray-800'>
          User Manager
        </div>
        <div className='text-[22px]'>
          {user ? (
            <>
              {Cookies.get("userRole")}

              <Button
                type='link'
                onClick={handleLogout}
                icon={<LogoutOutlined />}
                className='text-black text-[15px] mx-2  hover:text-blue-500'
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
              onClick={()=> handleAuth('/login')}
                type=''
                className='text-black text-[15px] mx-2  hover:text-blue-500'
              >
                Login
              </Button>
              <Button
               onClick={()=> handleAuth('/register')}
                type=''
                className='text-black text-[15px]  hover:text-blue-500'
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;

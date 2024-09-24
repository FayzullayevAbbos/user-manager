import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import Cookies from "js-cookie";
const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const { role } = useUserRole();
  const navigate = useNavigate();

  const location = useLocation();
  const token = Cookies.get("token");
  const [selectedPath, setSelectedPath] = useState("1");

  useEffect(() => {
    if (location.pathname == "/Dashboard") {
      setSelectedPath("1");
    } else if (location.pathname == "/users") {
      setSelectedPath("2");
    } else if (location.pathname == "/info") {
      role == 'user'?   setSelectedPath("1"):setSelectedPath('3')
    }
  }, [location.pathname]);
  
  

  const getMenuItems = () => {
    const baseItems = [];

    if (role === "admin") {
      baseItems.push(
        {
          key: "1",
          icon: <DashboardOutlined />,
          label: <Link to='/Dashboard'>Dashboard</Link>,
        },
        
        {
          key: "3",
          icon: <InfoCircleOutlined />,
          label: <Link to='/info'>Info</Link>,
        },
      );
    } else if (role === "user") {
      baseItems.push({
        key: "1",
        icon: <InfoCircleOutlined />,
        label: <Link to='/info'>Info</Link>,
      });
    }

    return baseItems;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      defaultSelectedKeys={"1"}
      className='min-h-screen'
    >
      <div className='text-white text-center mt-5 text-2xl font-bold pb-10'>
        <span
          className={`${
            !collapsed
              ? "logo1"
              : "logo2 bg-[#254195b3] text-xl p-3 rounded-md"
          }`}
        >
          Boss
        </span>
      </div>
      {role ? (
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={selectedPath}
          defaultSelectedKeys={["1"]}
          items={getMenuItems()} 
        />
      ) : (
        ""
      )}
    </Sider>
  );
};

export default Sidebar;



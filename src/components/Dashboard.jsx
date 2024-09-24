import React, { useEffect, useState } from "react";
import { Button, Layout, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import Sidebar from "./Sidebar";
import { Header } from "antd/es/layout/layout";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import useUserRole from "../hooks/useUserRole";
const { Content } = Layout;

const Dashboard = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, loading } = useUserRole();

  const navigate = useNavigate();
  
  useEffect(()=> {
    role == 'user'? navigate('/info'):''
  },[navigate])

  if (loading) {
    return (
      <Spin className='flex justify-center items-center h-screen' />
    );
  }
 
  
  const id = auth.currentUser.uid;
  async function logout() {
    await updateDoc(doc(firestore, "users", id), { active: false });
    Cookies.remove("userRole");
    Cookies.remove("token");
    navigate("/");
  }

  return (
    <Layout>
      <Layout>
        <Sidebar collapsed={collapsed} />
        <Layout className='site-layout'>
          <Header
            className='flex items-center justify-between '
            style={{ padding: 0, background: "white" }}
          >
            <Button
              type='text'
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className=' uppercase font-bold text-[20px]'>
              {" "}
              {role}
            </div>
            <Button onClick={() => logout()} className='mr-5'>
              Logout
              <LogoutOutlined />
            </Button>
          </Header>

          <Content className='p-4'>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

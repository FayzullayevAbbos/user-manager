import React, { useEffect, useState } from 'react';
import { Button, Layout, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Header } from 'antd/es/layout/layout';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";
const { Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const user = auth.currentUser;
        
        
        if (user) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          
          
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            message.error("User data not found!");
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        message.error("Error fetching role: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [navigate]);

  if (loading) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  function logout(){
    Cookies.remove("userRole")
    Cookies.remove('token')
    navigate('/')
  }

  console.log(role);
  
  return (
    <Layout>
      
      <Layout>
        <Sidebar collapsed={collapsed} />
        <Layout className="site-layout">
        <Header
          className='flex items-center justify-between '
          style={{ padding: 0, background: 'white' }}
        >
          <Button
            type='text'
            icon={
              collapsed ? (
                <MenuUnfoldOutlined/>
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
         <div className=" uppercase font-bold text-[20px]"> {role}</div>
          <Button
            onClick={()=>logout()}
            className='mr-5'
          >
            Logout
            <LogoutOutlined />
          </Button>
        </Header>

          <Content className="p-4">
            {role === 'admin' ? (
              <div className="admin-dashboard">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {/* Admin uchun ko'proq komponentlar qo'shish mumkin */}
              </div>
            ) : (
              <div className="user-dashboard">
                <h1 className="text-2xl font-bold">User Dashboard</h1>
                {/* Foydalanuvchi uchun ko'rsatiladigan kontent */}
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

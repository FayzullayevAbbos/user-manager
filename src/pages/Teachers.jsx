import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Firestore imports
import { app, firestore } from "../firebase"; // Firebase config
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Checkbox } from "antd";
import "tailwindcss/tailwind.css"; // Tailwind import
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { deleteUser, getAuth } from "firebase/auth";

const db = getFirestore(app);

const Teachers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading ,setLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([]);
  const userRole = Cookies.get("userRole");
  const auth = getAuth();
  const user = auth.currentUser; // Hozirgi foydalanuvchini oling
  const fetchUsers = async () => {
    setLoading(true)
    const querySnapshot = await getDocs(
      collection(firestore, "users"),
    ); // Users firestore collection
    const userList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsers(userList);
    setLoading(false)
    setSelectedUsers([])
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userRole === "user") {
      navigate("/info");
    }
  }, []);

  // Userni bloklash, blokdan chiqarish yoki o'chirish funksiyalari
  const handleBlock = async (id) => {
    setLoading(true)
    await updateDoc(doc(db, "users", id), { status: "blocked" });
    // Status yangilanadi
    if (user.uid === id) {
        
      Cookies.remove("userRole");
      Cookies.remove("token");
     
      
      

      // Foydalanuvchini bosh sahifaga yo'naltirish
      navigate("/");
    }
    fetchUsers();
  };

  const handleUnblock = async (id) => {
    setLoading(true)
    await updateDoc(doc(db, "users", id), { status: "unblock" });
    fetchUsers();
   
  };

  const handleDelete = async (id, authUser) => {
    setLoading(true)
    try {
     
        await updateDoc(doc(db, "users", id), { deleted: true });
       
  
    
      if (user.uid === id) {
        
        Cookies.remove("userRole");
        Cookies.remove("token");
       
        
        
  
        // Foydalanuvchini bosh sahifaga yo'naltirish
        navigate("/");
      }
  
      // 4. Foydalanuvchilar ro'yxatini yangilash
      fetchUsers();
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xatolik:", error);
    }
  };
  
  // Table kolonkalari// Table kolonkalari
  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(
                users.map((user) => ({ id: user.id, uid: user.uid })),
              );
            } else {
              setSelectedUsers([]);
            }
          }}
        />
      ),
      dataIndex: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedUsers.some(
            (user) => user.id === record.id,
          )}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([
                ...selectedUsers,
                { id: record.id, uid: record.uid },
              ]);
            } else {
              setSelectedUsers(
                selectedUsers.filter((user) => user.id !== record.id),
              );
            }
          }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Login / Registration Time",
      dataIndex: "time",
      key: "time",
      render: (_, record) => {
        const lastLogin = record.lastLogin
          ? new Date(record.lastLogin.seconds * 1000).toLocaleString()
          : null;
        const registrationTime = record.registrationTime
          ? new Date(
              record.registrationTime.seconds * 1000,
            ).toLocaleString()
          : null;

        if (lastLogin) {
          return <span>{lastLogin}</span>;
        } else if (registrationTime) {
          return <span>{registrationTime}</span>;
        } else {
          return <span>No Data</span>;
        }
      },
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (text) => <span>{text ? "Yes" : "No"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          className={`${
            text === "blocked" ? "text-red-500" : "text-green-500"
          }`}
        >
          {text}
        </span>
      ),
    },
  ];
  const filteredUsers = users.filter(user => user.deleted !== true);
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'> All Users</h1>

      {/* Toolbar */}
      <div className='mb-4 flex gap-2'>
        <Button
          type=''
          icon={<CloseOutlined />}
          onClick={() =>
            selectedUsers.forEach((user) => handleBlock(user.id))
          }
        >
          Block
        </Button>
        <Button
          icon={<CheckOutlined />}
          onClick={() =>
            selectedUsers.forEach((user) => handleUnblock(user.id))
          }
        >
          Unblock
        </Button>
        <Button
          icon={<DeleteOutlined />}
          onClick={() =>
            selectedUsers.forEach((user) =>
              handleDelete(user.id, user),
            )
          }
        >
          Delete
        </Button>
      </div>

      {/* Ant Design Table */}
      <Table loading={loading} columns={columns} dataSource={filteredUsers} rowKey='id' />
    </div>
  );
};

export default Teachers;

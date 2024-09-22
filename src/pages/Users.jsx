import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { firestore } from "../firebase";
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const Users = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };
    
    fetchUsers();
  }, []);

  const blockUser = async (userId) => {
    try {
      await updateDoc(doc(firestore, "users", userId), { status: "blocked" });
      message.success("User blocked successfully");
    } catch (error) {
      message.error("Failed to block user: " + error.message);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => blockUser(record.id)} 
          disabled={record.status === "blocked"}
        >
          Block User
        </Button>
      ),
    },
  ];

  return (
    <Table dataSource={users} columns={columns} rowKey="id" />
  );
};

export default Users;

import { Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    const usersData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersData);
  };

  const handleStatusChange = async (userId, status) => {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { status });
    message.success(`User status updated to ${status}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger={record.status === "active"}
          onClick={() => handleStatusChange(record.id, record.status === "active" ? "blocked" : "active")}
        >
          {record.status === "active" ? "Block" : "Unblock"}
        </Button>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} />;
};

export default AdminPanel;

import { Button, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(userData);
    };
    fetchUsers();
  }, []);

  const blockUser = async (userId) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { status: "blocked" });
  };

  const unblockUser = async (userId) => {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { status: "active" });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "blocked" ? "red" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button onClick={() => blockUser(record.id)} type="danger" className="mr-2">
            Block
          </Button>
          <Button onClick={() => unblockUser(record.id)}>Unblock</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default AdminPanel;

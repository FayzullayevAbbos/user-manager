import { useEffect, useState } from "react";
import { Card, Badge } from "antd"; // Ant Design komponentlari
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase Firestore
import { firestore } from "../firebase";
import useUserRole from "../hooks/useUserRole";

const Info = () => {
  const { data } = useUserRole();
  const [date ,  setDate] = useState('')

  useEffect(()=> {
    const lastLogin = data?.lastLogin
    ? new Date(data?.lastLogin.seconds * 1000).toLocaleString()
    : null;
  const registrationTime = data?.registrationTime
    ? new Date(
        data?.registrationTime.seconds * 1000,
      ).toLocaleString()
    : null;
    if (lastLogin) {
       setDate(lastLogin);
    } else if (registrationTime) {
       setDate(registrationTime);
    } else {
       'No Data';
    }

  },[data])
  

  
 

  if (!data) return <p>Loading...</p>;

  return (
    <Card className='p-4 shadow-lg rounded-lg bg-white'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold text-gray-800'>
          Your Information
        </h2>
        <Badge
          status={data.active ? "success" : "error"}
          text={data.active ? "Active" : "Inactive"}
        />
      </div>
      <div className='mt-4 space-y-2'>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Login:</strong> {data.email}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
        <p>
          <strong>Last Date:</strong>{" "}
         {date}
        </p>
      </div>
    </Card>
  );
};

export default Info;

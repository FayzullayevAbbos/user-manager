import { useState } from "react";
import { Button, Input, message, Form, Spin } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Cookies from 'js-cookie';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const handleRegister = async (values) => {
    const { name, email, password } = values;
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save role to cookie
      const role = "user"; // Or fetch from user input
      Cookies.set('userRole', role, { expires: 7 });  
  
      message.success("Registration successful!");
    } catch (error) {
      message.error("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  // const handleRegister = async () => {
  //   setLoading(true);
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     // Foydalanuvchini Firestore ga saqlash
  //     await firestore.collection('users').doc(user.uid).set({
  //       name,
  //       email,
  //       registrationTime: new Date(), // Hozirgi vaqt
  //       lastLoginTime: null, // Boshlang'ich holat
  //       status: 'active' // Boshlang'ich holat
  //     });

  //     message.success("Registration successful! You can now log in.");
  //     navigate("/login");
  //   } catch (error) {
  //     message.error("Registration failed: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          className="w-96 p-8 shadow-lg bg-white rounded-lg"
        >
          <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Register</h2>
          
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not a valid email!" }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 1, message: "Password must be at least 1 character." }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? <Spin size="small" /> : "Register"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;

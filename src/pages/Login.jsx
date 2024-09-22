import { useState } from "react";
import { Button, Input, message, Spin, Form } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Navbar from "../components/Navbar";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { email, password } = values;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRole = Cookies.get('userRole');

      if (userRole !== "admin") {
        message.error("You don't have permission to access this page. Please check your role.");
        setLoading(false);
        return;
      }

      navigate("/admin");
    } catch (error) {
      message.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          className='w-96 p-8 shadow-lg bg-white rounded-lg'
        >
          <h2 className='text-center text-3xl font-bold mb-6 text-gray-800'>Login</h2>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not a valid email!" }
            ]}
          >
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password!" }
            ]}
          >
            <Input.Password placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button 
              type='primary' 
              htmlType='submit' 
              block 
              loading={loading} 
              className='bg-blue-600 hover:bg-blue-700 text-white'
            >
              {loading ? <Spin size="small" /> : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;

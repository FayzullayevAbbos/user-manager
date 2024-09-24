import { useEffect, useState } from "react";
import { Button, Input, message, Spin, Form } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { Link, useFetcher, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useUserRole from "../hooks/useUserRole";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userRole = Cookies.get("userRole");
  const user = Cookies.get("token");

  const handleLogin = async (values) => {
    const { email, password } = values;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const dbUser = userCredential.user;

      const userDoc = await getDoc(
        doc(firestore, "users", dbUser.uid),
      );
      if (userDoc.exists()) {
        if (userDoc.data().role !== userRole) {
          message.error(
            "You don't have permission to access this page. Please check your role.",
          );
        } else {
          if (userDoc.data().status === "blocked") {
            message.error("This account was blocked");
          } else if (userDoc.data().deleted === true) {
            message.error("User data not found!");
          } else {
            Cookies.set("token", dbUser.accessToken);
            setLoading(false);
            navigate("/dashboard");
          }
        }
      } else {
        message.error("User data not found!");
      }

      console.log(Cookies.get("token"));
    } catch (error) {
      message.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userRole && user) {
      navigate("/dashboard");
    } else if (!userRole) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleLogin}
          className='w-96 p-8 shadow-lg bg-white rounded-lg'
        >
          <h2 className='text-center text-3xl font-bold mb-6 text-gray-800'>
            Login
          </h2>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
          >
            <Input placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
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
              Login
            </Button>
          </Form.Item>
          <hr />
          <Link to={"/register"} className='w-full'>
            <Button className='w-full mt-4' type=''>
              Register
            </Button>
          </Link>
        </Form>
      </div>
    </>
  );
};

export default Login;

import { useEffect, useState } from "react";
import { Button, Input, message, Form, Spin } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../firebase";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import serverTimestamp

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Navigate hook for redirecting
  const userRole =  Cookies.get('userRole')
  const user = Cookies.get('token')
  const handleRegister = async (values) => {
    const { name, email, password } = values;

    setLoading(true);
    try {
      // Foydalanuvchini Firebase Authentication yordamida ro'yxatdan o'tkazish
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const dbUser = userCredential.user;

      // Foydalanuvchi ma'lumotlarini Firestore ga saqlash
      await setDoc(doc(firestore, "users", dbUser.uid), {
        name: name,
        email: email,
        role:Cookies.get('userRole'), // Rollar uchun qiymat
        registrationTime: serverTimestamp(), // Ro'yxatdan o'tgan vaqt
        lastLoginTime: null, // Foydalanuvchi ilk marta kirgan vaqtda yangilanadi
        status: "active", // Yangi foydalanuvchi holati
      });

     

      message.success("Registration successful!");

      // Foydalanuvchini boshqa sahifaga yo'naltirish
      navigate("/dashboard");
    } catch (error) {
      message.error("Registration failed: " + error.message);
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
          onFinish={handleRegister}
          className='w-96 p-8 shadow-lg bg-white rounded-lg'
        >
          <h2 className='text-center text-3xl font-bold mb-6 text-gray-800'>
            Register
          </h2>

          <Form.Item
            name='name'
            label='Full Name'
            rules={[
              { required: true, message: "Please input your name!" },
            ]}
          >
            <Input placeholder='Full Name' />
          </Form.Item>

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
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              }, // Correct password length validation
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
              Register
            </Button>
          </Form.Item>
          <hr />
          <Link to={"/login"} className='w-full'>
            <Button className='w-full mt-4' type=''>
              Login
            </Button>
          </Link>
        </Form>
      </div>
    </>
  );
};

export default Register;

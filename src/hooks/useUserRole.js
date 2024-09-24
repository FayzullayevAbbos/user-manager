import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; // Firebase dan import qilish
import { useNavigate } from "react-router-dom";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [data, setData] = useState(null)
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
            setData(userDoc.data())
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

  return { role, loading , data };
};

export default useUserRole;

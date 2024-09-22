import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase"; // Firebase dan import qilish
import { useNavigate } from "react-router-dom";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);  // Rolni olish
        } else {
          console.error("No such document!");
        }
      } else {
        navigate("/login");  // Agar foydalanuvchi yo'q bo'lsa, login sahifasiga yo'naltirish
      }
      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
};

export default useUserRole;

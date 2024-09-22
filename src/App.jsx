import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to='/login' />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path:'login',
    element:<Login/>
  },
  {
    path:'register',
    element:<Register/>
  }
]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

{/* <PrivateRoute>
  <AdminPanel />
</PrivateRoute>; */}

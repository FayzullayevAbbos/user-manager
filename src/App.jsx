import "./App.css";
import {
  BrowserRouter as Router,

  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import Teachers from "./pages/Teachers";

import Info from "./pages/Info";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to='/login' />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "",
    element: <Dashboard num={'1'} />,
  },
  {
    path: "/dashboard",
    element: (
      <Dashboard>
        <Teachers />,
      </Dashboard>
    ),
  },
 
  {
    path: "/info",
    element: (
      <Dashboard>
        <Info />,
      </Dashboard>
    ),
  },
]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

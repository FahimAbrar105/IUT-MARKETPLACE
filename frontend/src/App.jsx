import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import ChatInbox from './pages/ChatInbox';
import ChatRoom from './pages/ChatRoom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider

const PrivateRoute = ({ children }) => {
  //   const { user, loading } = useAuth(); // We'll implement this later
  //   if (loading) return <div>Loading...</div>;
  //   return user ? children : <Navigate to="/login" />;
  return children; // For now, bypass auth check in frontend routing to test connection
};

import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={
          <Dashboard />
        } />
        <Route path="/products" element={<Marketplace />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/chat" element={<ChatInbox />} />
        <Route path="/chat/start/:userId" element={<ChatRoom />} />
      </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;

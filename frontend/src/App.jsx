import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import CreateProduct from './pages/CreateProduct';
import ChatInbox from './pages/ChatInbox';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Marketplace />} />
        <Route path="/products/create" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/chat" element={<ChatInbox />} />
        <Route path="/chat/start/:userId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;

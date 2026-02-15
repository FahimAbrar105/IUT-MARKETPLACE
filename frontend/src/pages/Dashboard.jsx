import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/dashboard');
                setData(res.data);
            } catch (err) {
                console.error(err);
                // navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data || !data.user) return <div>Please <Link to="/login">Login</Link></div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome, {data.user.name}</h1>
            <nav style={{ marginBottom: '20px' }}>
                <Link to="/products" style={{ marginRight: '10px' }}>Marketplace</Link>
                <Link to="/products/create" style={{ marginRight: '10px' }}>Sell Item</Link>
                <Link to="/chat" style={{ marginRight: '10px' }}>Messages</Link>
                <button onClick={() => {
                    axios.get('/auth/logout').then(() => window.location.href = '/login');
                }}>Logout</button>
            </nav>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                    <h2>My Active Orders</h2>
                    {data.myOrders.length === 0 ? <p>No active orders.</p> : (
                        <ul>
                            {data.myOrders.map(order => (
                                <li key={order._id}>
                                    <strong>{order.sector}</strong> - Max: {order.maxPrice} Tk
                                    <br />Status: {order.status}
                                    {order.matches && order.matches.length > 0 && (
                                        <div style={{ marginTop: '5px', background: '#f0f0f0', padding: '5px' }}>
                                            <strong>Matches Found!</strong>
                                            {order.matches.map(m => (
                                                <div key={m._id}>
                                                    <Link to={`/products/${m._id}`}>{m.title} - {m.price} Tk</Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div style={{ flex: 1, border: '1px solid #ddd', padding: '10px' }}>
                    <h2>My Listings</h2>
                    {data.myProducts.length === 0 ? <p>No products listed.</p> : (
                        <ul>
                            {data.myProducts.map(prod => (
                                <li key={prod._id}>
                                    <Link to={`/products/${prod._id}`}>{prod.title}</Link> - {prod.price} Tk
                                    <br />
                                    <small>{prod.status}</small>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

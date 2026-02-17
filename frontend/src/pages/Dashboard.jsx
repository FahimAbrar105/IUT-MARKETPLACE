import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCircle, FaCircleNotch, FaGlobe, FaEnvelope, FaPowerOff,
    FaCube, FaTrash, FaCheckCircle, FaPlus, FaChartLine
} from 'react-icons/fa';
import LimitOrderForm from '../components/Portfolio/LimitOrderForm';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get('/dashboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.post(`/products/orders/${orderId}/delete`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.post(`/products/${productId}/delete`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnhold = async (productId) => {
        try {
            await axios.delete(`/products/${productId}/hold`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await axios.get('/auth/logout');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="portfolio-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#8b8d96' }}>
                    LOADING TERMINAL...
                </div>
            </div>
        );
    }

    if (!data || !data.user) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p>Session expired. <Link to="/login">Login</Link></p>
            </div>
        );
    }

    const user = data.user;
    const totalAssets = data.myProducts.reduce((sum, p) => sum + p.price, 0);
    const filledOrders = data.myOrders.filter(o => o.status === 'FILLED').length;
    const activeOrders = data.myOrders.filter(o => o.status === 'ACTIVE').length;

    return (
        <div className="portfolio-page">
            {/* ── Stock Market Navbar ── */}
            <nav className="navbar">
                <div className="nav-left">
                    <div className="logo-box">📈</div>
                    <div className="logo-text">
                        <h1>IUT MARKETPLACE</h1>
                        <span>SECURE STUDENT TRADING TERMINAL</span>
                    </div>
                </div>
                <div className="nav-right">
                    <Link to="/products">MARKETS</Link>
                    <Link to="/products/create">+ IPO</Link>
                    <Link to="/chat">COMMS</Link>
                    <div className="user-profile">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt="User"
                        />
                        <div className="user-info">
                            <span className="name">{user.name}</span>
                            <span className="status">
                                ONLINE <FaCircle style={{ fontSize: '6px', verticalAlign: 'middle', marginLeft: '4px' }} />
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Portfolio Layout ── */}
            <div className="portfolio-container">
                {/* ── Sidebar ── */}
                <aside className="sidebar">
                    <div className="terminal-card">
                        <div className="terminal-header">Terminal Commands</div>
                        <div className="terminal-menu">
                            <Link to="/products/create" className="menu-item active">
                                <FaCircleNotch /> New IPO Listing
                            </Link>
                            <Link to="/products" className="menu-item">
                                <FaGlobe /> Global Markets
                            </Link>
                            <Link to="/chat" className="menu-item">
                                <FaEnvelope /> Secure Comms
                            </Link>
                            <div className="menu-item danger" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                <FaPowerOff /> Terminate Session
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="main-content">

                    {/* ── Portfolio Header ── */}
                    <header className="section-header" style={{ borderBottom: 'none' }}>
                        <div>
                            <div className="section-title" style={{ fontSize: '1.5rem', borderLeft: 'none', paddingLeft: 0 }}>
                                <FaChartLine style={{ marginRight: '8px' }} /> PORTFOLIO MANAGER
                            </div>
                            <div className="section-info">
                                ACCOUNT: {user.name.toUpperCase()} // ID: {user.studentId || user._id.slice(-8).toUpperCase()}
                            </div>
                        </div>
                        <div className="header-stats">
                            <div className="stat-item">
                                <div className="stat-label">Credit Rating</div>
                                <div className="stat-value rating-nice">
                                    AAA <span style={{ fontSize: '0.7rem', fontWeight: 'normal', color: '#888' }}>(PRIME)</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-label">Assets Under Management</div>
                                <div className="stat-value">৳{totalAssets.toLocaleString()}</div>
                            </div>
                            <Link to="/products/create" className="btn-ipo" style={{ textDecoration: 'none' }}>
                                + INITIATE IPO
                            </Link>
                        </div>
                    </header>

                    {/* ── Active Positions (User's Listings) ── */}
                    <section>
                        <div className="section-header">
                            <div className="section-title">ACTIVE POSITIONS (listings)</div>
                            <div className="section-info">{data.myProducts.length} POSITIONS OPEN</div>
                        </div>

                        {data.myProducts.length === 0 ? (
                            <div className="empty-state">NO ACTIVE POSITIONS — INITIATE AN IPO TO LIST</div>
                        ) : (
                            <div className="positions-grid">
                                {data.myProducts.map(product => (
                                    <div className="position-card" key={product._id}>
                                        <div className="pos-image">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000/${product.images[0]}`}
                                                    alt={product.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}
                                                />
                                            ) : (
                                                <FaCube />
                                            )}
                                        </div>
                                        <div className="pos-details">
                                            <div className="pos-header">
                                                <div>
                                                    <div className="pos-name">{product.title}</div>
                                                    <div className="pos-sector">SECTOR: {product.category.toUpperCase()}</div>
                                                </div>
                                                <div className="pos-value">৳{product.price.toLocaleString()}</div>
                                            </div>
                                            <div className="pos-actions">
                                                <Link to={`/products/${product._id}`} className="btn-view">VIEW</Link>
                                                <button
                                                    className="btn-small btn-liquidate-small"
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                >
                                                    LIQUIDATE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── Open Orders (Limit Orders) ── */}
                    <section>
                        <div className="section-header">
                            <div className="section-title">OPEN ORDERS (bids)</div>
                            <div className="section-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span>{filledOrders} FILLED / {activeOrders} ACTIVE</span>
                                <button
                                    onClick={() => setShowOrderForm(!showOrderForm)}
                                    className="btn-ipo"
                                    style={{ fontSize: '0.65rem', padding: '4px 12px' }}
                                >
                                    <FaPlus style={{ marginRight: '4px' }} /> PLACE ORDER
                                </button>
                            </div>
                        </div>

                        {showOrderForm && (
                            <LimitOrderForm
                                onOrderCreated={() => { setShowOrderForm(false); fetchData(); }}
                                onClose={() => setShowOrderForm(false)}
                            />
                        )}

                        {data.myOrders.length === 0 ? (
                            <div className="empty-state">NO OPEN ORDERS — PLACE A LIMIT ORDER TO START</div>
                        ) : (
                            <div className="orders-table-container">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th width="20%">DATE</th>
                                            <th width="20%">SECTOR</th>
                                            <th width="20%">MAX STRIKE PRICE</th>
                                            <th width="20%">STATUS</th>
                                            <th width="20%" style={{ textAlign: 'right' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.myOrders.map(order => (
                                            <React.Fragment key={order._id}>
                                                <tr>
                                                    <td>
                                                        {new Date(order.createdAt).toLocaleDateString()}{' '}
                                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: '#4dabf7', fontWeight: 'bold' }}>{order.sector.toUpperCase()}</td>
                                                    <td style={{ fontWeight: 'bold' }}>৳{order.maxPrice}</td>
                                                    <td>
                                                        <span className={`order-status ${order.status === 'FILLED' ? 'status-filled' : 'status-active'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className="btn-icon" onClick={() => handleDeleteOrder(order._id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Show matches if FILLED */}
                                                {order.matches && order.matches.length > 0 && (
                                                    <tr className="match-row">
                                                        <td colSpan="5">
                                                            <div className="match-content" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                                                <div className="match-indicator">
                                                                    <FaCheckCircle style={{ marginRight: '5px' }} />
                                                                    MATCHING ASSETS FOUND ({order.matches.length})
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                    {order.matches.map(match => (
                                                                        <div className="match-item" key={match._id}>
                                                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                                                <FaCube style={{ color: '#555' }} />
                                                                                <div>
                                                                                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{match.title}</div>
                                                                                    <div style={{ fontSize: '0.7rem', color: '#00ff9d' }}>৳{match.price}</div>
                                                                                </div>
                                                                            </div>
                                                                            <Link
                                                                                to={`/products/${match._id}`}
                                                                                className="btn-view"
                                                                                style={{ fontSize: '0.6rem', padding: '2px 8px' }}
                                                                            >VIEW</Link>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* ── Saved Holdings (Watchlist) ── */}
                    <section>
                        <div className="section-header">
                            <div className="section-title">SAVED HOLDINGS & POSITIONS</div>
                            <div className="section-info">{data.watchlist.length} HOLDINGS</div>
                        </div>

                        {data.watchlist.length === 0 ? (
                            <div className="empty-state">NO LONG POSITIONS HELD — ACQUIRE POSITIONS FROM GLOBAL MARKETS</div>
                        ) : (
                            <div className="positions-grid">
                                {data.watchlist.map(item => (
                                    <div className="position-card" key={item._id}>
                                        <div className="pos-image">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:5000/${item.images[0]}`}
                                                    alt={item.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '3px' }}
                                                />
                                            ) : (
                                                <FaCube />
                                            )}
                                        </div>
                                        <div className="pos-details">
                                            <div className="pos-header">
                                                <div>
                                                    <div className="pos-name">{item.title}</div>
                                                    <div className="pos-sector">SECTOR: {item.category.toUpperCase()}</div>
                                                </div>
                                                <div className="pos-value">৳{item.price.toLocaleString()}</div>
                                            </div>
                                            <div className="pos-actions">
                                                <Link to={`/products/${item._id}`} className="btn-view">VIEW</Link>
                                                <button
                                                    className="btn-small btn-liquidate-small"
                                                    onClick={() => handleUnhold(item._id)}
                                                >
                                                    LIQUIDATE POSITION
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;

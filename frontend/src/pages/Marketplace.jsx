import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/products');
            setProducts(res.data.products);
            setWatchlist(res.data.watchlist || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleHold = async (productId) => {
        try {
            await axios.post(`/products/${productId}/hold`);
            setWatchlist(prev => [...prev, productId]);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to acquire position');
        }
    };

    const handleUnhold = async (productId) => {
        try {
            await axios.delete(`/products/${productId}/hold`);
            setWatchlist(prev => prev.filter(id => id !== productId));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Marketplace</h1>
            <Link to="/dashboard">Back to Dashboard</Link>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                {products.map(product => {
                    const isHeld = watchlist.includes(product._id);

                    return (
                        <div key={product._id} style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            position: 'relative'
                        }}>
                            {isHeld && (
                                <div style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: '#00ff9d',
                                    color: '#000',
                                    fontSize: '0.6rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    fontFamily: "'JetBrains Mono', monospace"
                                }}>HELD</div>
                            )}

                            {product.images && product.images.length > 0 && (
                                <img
                                    src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000/${product.images[0]}`}
                                    alt={product.title}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            )}
                            <h3 style={{ marginTop: '10px' }}>{product.title}</h3>
                            <p>Price: {product.price} Tk</p>
                            <p style={{ fontSize: '0.85rem', color: '#666' }}>Category: {product.category}</p>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                                <Link to={`/products/${product._id}`} style={{
                                    padding: '6px 12px',
                                    background: '#1a73e8',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    textDecoration: 'none'
                                }}>View Details</Link>

                                {isHeld ? (
                                    <button
                                        onClick={() => handleUnhold(product._id)}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#ff3366',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >LIQUIDATE POSITION</button>
                                ) : (
                                    <button
                                        onClick={() => handleHold(product._id)}
                                        style={{
                                            padding: '6px 12px',
                                            background: '#00c853',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >ACQUIRE POSITION</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Marketplace;

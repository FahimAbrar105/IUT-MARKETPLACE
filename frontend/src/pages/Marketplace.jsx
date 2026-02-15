import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/products');
                setProducts(res.data.products);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Marketplace</h1>
            <Link to="/dashboard">Back to Dashboard</Link>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {products.map(product => (
                    <div key={product._id} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:5000/${product.images[0]}`} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        )}
                        <h3>{product.title}</h3>
                        <p>Price: {product.price} Tk</p>
                        <p>Category: {product.category}</p>
                        <Link to={`/products/${product._id}`}>View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;

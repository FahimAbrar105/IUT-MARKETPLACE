import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/products/${id}`);
                setProduct(res.data.product);
                setUser(res.data.user);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleStartChat = () => {
        if (!user) return navigate('/login');
        if (product.user._id === user.id) return alert("You cannot chat with yourself");
        navigate(`/chat/start/${product.user._id}?productId=${product._id}`);
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/products">Back to Marketplace</Link>
            <h1>{product.title}</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    {product.images && product.images.map((img, idx) => (
                        <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000/${img}`} alt={product.title} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                    ))}
                </div>
                <div style={{ flex: 1 }}>
                    <h2>{product.price} Tk</h2>
                    <p>{product.description}</p>
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Seller:</strong> {product.isAnonymous ? 'Anonymous' : product.user.name}</p>

                    {user && product.user._id !== user.id && (
                        <button onClick={handleStartChat} style={{ padding: '10px 20px', background: 'blue', color: 'white' }}>
                            Message Seller
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

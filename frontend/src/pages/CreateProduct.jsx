import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const CreateProduct = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [images, setImages] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        if (isAnonymous) formData.append('isAnonymous', 'on');
        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        try {
            await axios.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to create product');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#646cff', marginBottom: '20px', display: 'inline-block' }}>&larr; Back</Link>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Sell Item</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000', minHeight: '100px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#000' }}
                    >
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Clothing</option>
                        <option>Stationery</option>
                        <option>Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={e => setIsAnonymous(e.target.checked)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer', margin: 0 }}
                    />
                    <label htmlFor="anonymous" style={{ cursor: 'pointer', userSelect: 'none', margin: 0 }}>Sell Anonymously</label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={e => setImages(e.target.files)}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#f9f9f9', border: '1px dashed #ccc', borderRadius: '4px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#2f81f7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>
                    Submit Listing
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;

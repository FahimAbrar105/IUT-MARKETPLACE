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
            <Link to="/dashboard">Back</Link>
            <h1>Sell Item</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Price</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%' }}>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Clothing</option>
                        <option>Stationery</option>
                        <option>Other</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                        Sell Anonymously
                    </label>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Images</label>
                    <input type="file" multiple onChange={e => setImages(e.target.files)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateProduct;

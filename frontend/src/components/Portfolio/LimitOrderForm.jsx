import React, { useState } from 'react';
import axios from 'axios';

const LimitOrderForm = ({ onOrderCreated, onClose }) => {
    const [sector, setSector] = useState('Electronics');
    const [maxPrice, setMaxPrice] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!maxPrice || Number(maxPrice) <= 0) {
            setError('Enter a valid strike price');
            return;
        }

        try {
            await axios.post('/products/orders', { sector, maxPrice: Number(maxPrice) });
            onOrderCreated();
        } catch (err) {
            setError(err.response?.data?.error || 'Order failed');
        }
    };

    return (
        <div className="limit-order-form">
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label>SECTOR</label>
                        <select value={sector} onChange={e => setSector(e.target.value)}>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Books">Books</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Stationery">Stationery</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label>MAX STRIKE PRICE (৳)</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            placeholder="0.00"
                            min="1"
                        />
                    </div>
                </div>
                {error && <div style={{ color: '#ff3366', fontSize: '0.7rem', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>{error}</div>}
                <div className="form-actions">
                    <button type="submit" className="btn-submit">EXECUTE ORDER</button>
                    <button type="button" className="btn-cancel" onClick={onClose}>CANCEL</button>
                </div>
            </form>
        </div>
    );
};

export default LimitOrderForm;

import React, { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Stationery', 'Other'];

const LimitOrderForm = ({ onOrderCreated, onClose }) => {
    const [sector, setSector] = useState('Electronics');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!maxPrice || isNaN(maxPrice) || Number(maxPrice) <= 0) {
            setError('Enter a valid strike price');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('/products/orders', { sector, maxPrice: Number(maxPrice) });
            onOrderCreated();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: '#1a1a24',
            border: '1px solid #2a2c35',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '20px'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
            }}>
                <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#4dabf7',
                    fontFamily: "'JetBrains Mono', monospace"
                }}>
                    PLACE LIMIT ORDER
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        color: '#8b8d96',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >✕</button>
            </div>

            {error && <div style={{
                color: '#ff3366',
                fontSize: '0.75rem',
                marginBottom: '10px',
                fontFamily: "'JetBrains Mono', monospace"
            }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        color: '#8b8d96',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        marginBottom: '5px',
                        letterSpacing: '0.5px'
                    }}>SECTOR</label>
                    <select
                        value={sector}
                        onChange={e => setSector(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#0b0c10',
                            border: '1px solid #2a2c35',
                            borderRadius: '4px',
                            color: '#fff',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8rem'
                        }}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        color: '#8b8d96',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        marginBottom: '5px',
                        letterSpacing: '0.5px'
                    }}>MAX STRIKE PRICE (৳)</label>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        placeholder="0"
                        min="1"
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: '#0b0c10',
                            border: '1px solid #2a2c35',
                            borderRadius: '4px',
                            color: '#fff',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.8rem'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#4dabf7',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        whiteSpace: 'nowrap',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? 'PLACING...' : 'EXECUTE ORDER'}
                </button>
            </form>
        </div>
    );
};

export default LimitOrderForm;

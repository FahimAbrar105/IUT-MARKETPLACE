import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChatInbox = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get('/chat');
                setConversations(res.data.conversations);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/dashboard">Back to Dashboard</Link>
            <h1>Messages</h1>
            {conversations.length === 0 ? <p>No messages yet.</p> : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {conversations.map((convo, idx) => (
                        <li key={idx} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                            <Link to={`/chat/start/${convo.userId}?productId=${convo.productId || ''}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '10px' }}>
                                        <strong>{convo.name}</strong>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>{convo.lastMessage}</div>
                                    </div>
                                    {convo.productImage && (
                                        <img src={convo.productImage.startsWith('http') ? convo.productImage : `http://localhost:5000/${convo.productImage}`} alt="Product" style={{ width: '40px', height: '40px', objectFit: 'cover', marginLeft: 'auto' }} />
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChatInbox;

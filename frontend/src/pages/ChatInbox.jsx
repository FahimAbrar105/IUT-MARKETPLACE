import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const ChatInbox = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {

                const res = await axios.get('/chat');
                setConversations(res.data.conversations || []);
            } catch (err) {
                console.error("Error fetching conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);
    const handleDelete = async (e, conversation) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('ERASE COMM LOG? This cannot be undone.')) return;

        try {
            await axios.post(`/chat/delete/${conversation.userId}?productId=${conversation.productId}`);
            setConversations(conversations.filter((c) => c.userId !== conversation.userId || c.productId !== conversation.productId));
        } catch (err) {
            console.error("Error deleting conversation", err);
        }
    };

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
                                    <button
                                        onClick={(e) => handleDelete(e, convo)}
                                        className="text-text-secondary hover:text-bear transition text-xs opacity-0 group-hover:opacity-100 p-2">

                                        <i className="fas fa-trash"></i>
                                    </button>
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

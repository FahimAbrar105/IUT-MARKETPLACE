import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const ChatRoom = () => {
    const { userId } = useParams();
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatPartner, setChatPartner] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); // Need to know who I am
    const socket = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Fetch initial chat data
        const fetchChat = async () => {
            try {
                const res = await axios.get(`/chat/start/${userId}?productId=${productId || ''}`);
                setMessages(res.data.messages);
                setChatPartner(res.data.chatPartner);

                // Also need my own ID for rendering, fetch dashboard or profile
                const meRes = await axios.get('/dashboard');
                setCurrentUser(meRes.data.user);

            } catch (err) {
                console.error(err);
            }
        };
        fetchChat();

        // Socket setup
        socket.current = io('/', {
            path: '/socket.io',
        });

        socket.current.on('connect', () => {
            // Try to join if we already know who we are
            if (currentUser) {
                socket.current.emit('join', currentUser.id || currentUser._id);
            }
        });

        socket.current.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.current.disconnect();
        };
    }, [userId, productId, currentUser]); // Added currentUser to ensure reconnection if user loads/changes

    // Dedicated effect to join room when currentUser availability changes while socket exists
    useEffect(() => {
        if (currentUser && socket.current && socket.current.connected) {
            socket.current.emit('join', currentUser.id || currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('/chat/send', {
                receiverId: userId,
                content: newMessage,
                productId
            });
            // Socket will receive the message back because of io.to(sender).emit defined in backend
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    if (!chatPartner || !currentUser) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: '600px', margin: 'auto' }}>
            <div style={{ padding: '10px', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/chat">Back</Link>
                <h3>{chatPartner.name} {chatPartner.isAnonymous && '(Anonymous)'}</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUser.id || msg.sender === currentUser._id;
                    return (
                        <div key={idx} style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            background: isMe ? '#007bff' : '#e9ecef',
                            color: isMe ? 'white' : 'black',
                            padding: '10px',
                            borderRadius: '10px',
                            marginBottom: '10px',
                            maxWidth: '70%'
                        }}>
                            {msg.content}
                            {msg.product && <div style={{ fontSize: '10px', opacity: 0.8 }}>Ref: Product</div>}
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: '10px', borderTop: '1px solid #ddd', display: 'flex' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    style={{ flex: 1, padding: '10px' }}
                    placeholder="Type a message..."
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
            </form>
        </div>
    );
};

export default ChatRoom;

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
        if (!user || !otherUserId) return;

        // Join room
        socket.emit('join', user._id);

        // Fetch Room Data
        const fetchRoomData = async () => {
            try {

                const res = await axios.get(`/chat/start/${otherUserId}?productId=${productId || ''}`);

                setMessages(res.data.messages || []);
                setOtherUser(res.data.otherUser);
                setTitle(res.data.title || 'Chat');
                setIsAnonymousContext(res.data.isAnonymousContext); // Ensure backend sends this
            } catch (err) {
                console.error("Error fetching chat room", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();

        const messageHandler = (msg) => {

            if ((msg.sender === otherUserId || msg.sender === user._id) && (
                !msg.productId || msg.productId === productId)) {
                // We need to format it like a Message object
                setMessages((prev) => [...prev, {
                    _id: Date.now().toString(),
                    sender: msg.sender === user._id ? { _id: user._id, name: user.name } : { _id: otherUserId, name: 'Remote' },
                    content: msg.content,
                    timestamp: new Date().toISOString()
                }]);
            }
        };

        socket.on('message', messageHandler);

        return () => {
            socket.off('message', messageHandler);
        };
    }, [user, otherUserId, productId]);

    // Dedicated effect to join room when currentUser availability changes while socket exists
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !otherUserId) return;

        socket.emit('chatMessage', {
            sender: user._id,
            receiver: otherUserId,
            content: newMessage,
            productId: productId
        });


        setNewMessage('');
    };

    if (loading) return <div className="text-center text-text-secondary py-20 font-mono">ESTABLISHING SECURE CONNECTION...</div>;

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

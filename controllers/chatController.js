const Message = require('../models/Message');
const User = require('../models/User');

exports.startChat = async (req, res) => {
    try {
        const otherUser = await User.findById(req.params.userId);
        if (!otherUser) return res.status(404).json({ error: 'User not found' });

        let chatPartnerName = otherUser.name;
        let isAnonymousContext = false;
        let productId = req.query.productId || null;

        // Check for anonymous context via productId
        if (productId) {
            const Product = require('../models/Product');
            const product = await Product.findById(productId);
            // If the chat is ABOUT this product, check if it's anonymous
            if (product && product.isAnonymous && product.user.toString() === otherUser._id.toString()) {
                chatPartnerName = "Anonymous Seller";
                isAnonymousContext = true;
            }
        }

        // Fetch valid previous messages
        let query = {
            $or: [
                { sender: req.user.id, receiver: otherUser._id },
                { sender: otherUser._id, receiver: req.user.id }
            ]
        };

        if (productId) {
            query.product = productId;
        }

        query.hiddenFor = { $ne: req.user.id };

        const messages = await Message.find(query).sort({ timestamp: 1 });

        await Message.updateMany(
            { sender: otherUser._id, receiver: req.user.id, read: false }, // Only from them to me
            { read: true }
        );

        res.json({
            chatPartner: {
                id: otherUser._id,
                name: chatPartnerName,
                isAnonymous: isAnonymousContext
            },
            messages,
            productId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

/*
 * Get all conversations
 * Logic: Aggregates messages to show unique conversations with last message preview.
 */
exports.getConversations = async (req, res) => {
    try {
        // Aggregation to group by (otherUser, product)
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
                    hiddenFor: { $ne: req.user._id } // Exclude hidden messages
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        otherUser: {
                            $cond: [
                                { $eq: ["$sender", req.user._id] },
                                "$receiver",
                                "$sender"
                            ]
                        },
                        product: "$product"
                    },
                    lastMessage: { $first: "$content" },
                    lastSenderId: { $first: "$sender" },
                    timestamp: { $first: "$timestamp" },
                    unreadCount: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ["$receiver", req.user._id] }, { $eq: ["$read", false] }] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.otherUser",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id.product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$userInfo._id",
                    name: "$userInfo.name",
                    studentId: "$userInfo.studentId",
                    avatar: "$userInfo.avatar",
                    productId: "$productInfo._id",
                    productTitle: "$productInfo.title",
                    productSellerId: "$productInfo.user",
                    productImage: { $arrayElemAt: ["$productInfo.images", 0] },
                    isAnonymous: "$productInfo.isAnonymous",
                    lastMessage: 1,
                    lastSenderId: 1,
                    timestamp: 1,
                    unreadCount: 1
                }
            },
            {
                $sort: { timestamp: -1 }
            }
        ]);

        // Post-process for display logic
        const formattedConversations = conversations.map(convo => {
            const isMyProduct = convo.productSellerId && convo.productSellerId.toString() === req.user.id;

            let displayName = convo.name;
            let displayAvatar = convo.avatar;
            let displayId = convo.studentId;

            // Logic for Anonymous Sellers
            let showAsAnonymous = false;

            if (!isMyProduct && convo.isAnonymous) {

                showAsAnonymous = true;

                displayName = "Anonymous Seller";
                displayAvatar = "default-avatar.png";
                displayId = null;
            }

            return {
                ...convo,
                name: displayName,
                avatar: displayAvatar,
                studentId: displayId,
                isAnonymous: showAsAnonymous // Override DB flag with view logic
            };
        });

        // Render the inbox
        res.json({
            count: formattedConversations.length,
            conversations: formattedConversations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

/*
 * Delete conversation (Hide for user)
 */
exports.deleteConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const productId = req.query.productId;

        let query = {
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        };

        if (productId) {
            query.product = productId;
        }

        await Message.updateMany(query, {
            $addToSet: { hiddenFor: req.user.id }
        });

        res.json({ success: true, message: 'Conversation deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

/*
 * Send Message (API Endpoint)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, productId } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver and Content are required' });
        }

        // Save to DB
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
            product: (productId && productId.length > 0) ? productId : null,
            read: false,
            timestamp: Date.now()
        });

        // Real-time dispatch via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to(receiverId).emit('message', newMessage);
            // Also emit to sender (for multi-device sync)
            if (req.user.id !== receiverId) {
                io.to(req.user.id).emit('message', newMessage);
            }
        }

        res.status(201).json({ message: 'Message sent', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

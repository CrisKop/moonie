import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    files: {
        type: String,
        default: null
    },
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chats',
        required: true
    },
    edited: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model('Messages', messageSchema);
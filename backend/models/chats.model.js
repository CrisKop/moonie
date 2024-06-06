import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },

    chatdata: {
        type: Object,
        default: null
    },

    members: {
        type: Array,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Chats', messageSchema);
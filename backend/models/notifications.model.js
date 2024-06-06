import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    chats: {
        type: Array,
        default: null
    },
})

export default mongoose.model('Notifications', messageSchema);
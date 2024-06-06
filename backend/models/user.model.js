import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    avatarURL: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: null
    },
    deletedchats: {
        type: Array,
        default: []
    },
    
    rank: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('User', userSchema);
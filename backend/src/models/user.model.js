import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },

  vaultAddress: {
    type: String,
    unique: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid vault address format']
  },
  walletAddress: {
    type: String,
    unique: true,
    match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format']
  },
  sessionId: {
    type: String,
    select: false
  },
  sessionExpiry: {
    type: Date,
    select: false
  }
}, 
{ timestamps: true });

// Add password comparison method
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export { User };
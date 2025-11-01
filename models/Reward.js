import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['badge', 'avatar', 'theme', 'discount'],
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Reward', rewardSchema);
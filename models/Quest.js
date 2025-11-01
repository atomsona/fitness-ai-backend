import mongoose from 'mongoose';

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    required: true
  },
  type: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'nutrition', 'habit'],
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  coinReward: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    duration: Number
  }],
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model('Quest', questSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function() { return this.provider === 'local'; }
  },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: String,
  avatar: String,
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: Date,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  coins: { type: Number, default: 0 },
  completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  refreshToken: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
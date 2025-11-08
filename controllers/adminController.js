import Quest from '../models/Quest.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

export const createQuest = async (req, res) => {
  try {
    const quest = await Quest.create({
      ...req.body,
      createdBy: req.user._id,
      image: req.file?.path
    });
    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuest = async (req, res) => {
  try {
    const quest = await Quest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: req.file?.path || req.body.image },
      { new: true }
    );
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findByIdAndDelete(req.params.id);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    res.json({ message: 'Quest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalQuests = await Quest.countDocuments();
    const completedQuests = await Progress.countDocuments({ status: 'completed' });

   
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newUsersLastWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const completionsLastWeek = await Progress.countDocuments({
      status: 'completed',
      completedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalUsers,
      premiumUsers,
      totalQuests,
      completedQuests,
      newUsersLastWeek,
      completionsLastWeek,
      conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
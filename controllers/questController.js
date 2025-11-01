// controllers/questController.js
import User from '../models/User.js';
import Quest from '../models/Quest.js'; // Assuming you have a Quest model

export const getAllQuests = async (req, res) => {
  try {
    const quests = await Quest.find();
    res.status(200).json(quests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestById = async (req, res) => {
  try {
    const { id } = req.params;
    const quest = await Quest.findById(id);
    
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    
    res.status(200).json(quest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeQuest = async (req, res) => {
  try {
    const { questId } = req.body;
    const userId = req.user._id; // Assuming you have auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates
    if (!user.completedQuests.includes(questId)) {
      user.completedQuests.push(questId);
      await user.save();
    }

    res.status(200).json({ 
      message: 'Quest completed successfully', 
      completedQuests: user.completedQuests 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have auth middleware
    
    const user = await User.findById(userId).select('completedQuests xp level coins');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      completedQuests: user.completedQuests,
      xp: user.xp,
      level: user.level,
      coins: user.coins
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
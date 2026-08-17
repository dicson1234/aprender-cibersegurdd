/* CyberLab Gamification Engine: XP, Levels, Achievements & Notifications */

class GamificationEngine {
  constructor() {
    this.storage = window.CyberStorage;
  }

  addXP(amount, reason = '') {
    const data = this.storage.data;
    data.xp += amount;

    // Calculate level: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 225 XP, Level 4 = 400 XP... Formula: Math.floor(Math.sqrt(XP / 25)) + 1
    const newLevel = Math.floor(Math.sqrt(data.xp / 25)) + 1;
    let leveledUp = false;

    if (newLevel > data.level) {
      data.level = newLevel;
      leveledUp = true;
    }

    this.storage.saveData();

    this.showToast(`+${amount} XP ${reason ? '· ' + reason : ''}`);

    if (leveledUp) {
      this.showToast(`🎉 ¡FELICITACIONES! Has ascendido al Nivel ${newLevel}`, 'purple');
    }

    this.checkAchievements();
  }

  showToast(message, type = 'cyan') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  checkAchievements() {
    const data = this.storage.data;
    const achievements = window.CyberData ? window.CyberData.achievements || [] : [];

    achievements.forEach(ach => {
      if (data.unlockedAchievements.includes(ach.id)) return;

      let unlock = false;
      const conceptsRead = Object.keys(data.masteryLevels).length;
      const quizzesPassed = data.passedQuizzes.length;
      const labsCompleted = data.completedLabs.length;
      const streakDays = data.streak;
      const challengesCompleted = data.completedChallenges.length;
      const notesCount = data.notes.length;
      const mistakesLogged = data.mistakes.length;

      if (ach.condition === 'conceptsRead >= 1' && conceptsRead >= 1) unlock = true;
      if (ach.condition === 'quizzesPassed >= 1' && quizzesPassed >= 1) unlock = true;
      if (ach.condition === 'labsCompleted >= 1' && labsCompleted >= 1) unlock = true;
      if (ach.condition === 'streakDays >= 7' && streakDays >= 7) unlock = true;
      if (ach.condition === 'challengesCompleted >= 1' && challengesCompleted >= 1) unlock = true;
      if (ach.condition === 'notesCount >= 5' && notesCount >= 5) unlock = true;
      if (ach.condition === 'mistakesLogged >= 1' && mistakesLogged >= 1) unlock = true;

      if (unlock) {
        data.unlockedAchievements.push(ach.id);
        this.storage.saveData();
        this.addXP(ach.xpReward, `Logro desbloqueado: ${ach.name}`);
        this.showToast(`🏆 LOGRO: ${ach.name} (+${ach.xpReward} XP)`, 'yellow');
      }
    });
  }
}

window.CyberGamification = new GamificationEngine();

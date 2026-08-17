/* CyberLab LocalStorage State Manager & Export/Import Manager */

const STORAGE_KEY = 'cyberlab_user_data_v1';

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hoursStudied: 0.5,
  masteryLevels: {}, // { conceptId: 0..6 }
  completedModules: [],
  passedQuizzes: [],
  completedLabs: [],
  completedChallenges: [],
  notes: [
    {
      id: 'note-sample-1',
      title: 'Diferencia entre TCP y UDP',
      area: 'Redes',
      tags: ['TCP', 'UDP', 'Networking'],
      content: 'TCP es orientado a conexión y garantiza entrega (Handshake 3 vías). UDP no es orientado a conexión y prioriza velocidad (VoIP, DNS, Streaming).',
      notUnderstood: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'note-sample-2',
      title: 'Investigar Handshake TLS 1.3',
      area: 'Internet',
      tags: ['TLS', 'HTTPS'],
      content: 'Aún no me queda 100% claro cómo se negocia la clave simétrica en 1 solo RTT en TLS 1.3.',
      notUnderstood: true,
      createdAt: new Date().toISOString()
    }
  ],
  mistakes: [], // [ { id, questionId, question, wrongAnswer, correctAnswer, explanation, date, reviewDueDate, reviewStage } ]
  resourceRatings: {},
  unlockedAchievements: [],
  goals: {
    dailyMinutes: 30,
    dailyCompleted: false,
    weeklyModules: 2,
    weeklyCompleted: false
  },
  primaryObjective: 'Convertirme en profesional de ciberseguridad.',
  secondaryObjective: 'Especializarme en Blue Team & SOC.'
};

class StorageManager {
  constructor() {
    this.data = this.loadData();
    this.checkStreak();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveData(DEFAULT_STATE);
        return { ...DEFAULT_STATE };
      }
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Error al cargar LocalStorage:', e);
      return { ...DEFAULT_STATE };
    }
  }

  saveData(data = this.data) {
    try {
      this.data = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('cyberlab_state_updated', { detail: this.data }));
    } catch (e) {
      console.error('Error al guardar en LocalStorage:', e);
    }
  }

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.data.lastActiveDate;

    if (!lastDate) {
      this.data.lastActiveDate = today;
      this.data.streak = 1;
      this.saveData();
      return;
    }

    const todayObj = new Date(today);
    const lastObj = new Date(lastDate);
    const diffTime = Math.abs(todayObj - lastObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.data.streak += 1;
      this.data.lastActiveDate = today;
      this.saveData();
    } else if (diffDays > 1) {
      this.data.streak = 1;
      this.data.lastActiveDate = today;
      this.saveData();
    }
  }

  exportBackup() {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `cyberlab_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackup(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed && typeof parsed === 'object') {
        this.saveData({ ...DEFAULT_STATE, ...parsed });
        alert('¡Progreso importado con éxito!');
        window.location.reload();
      } else {
        alert('Archivo de copia de seguridad no válido.');
      }
    } catch (e) {
      alert('Error al leer el archivo JSON.');
    }
  }

  resetAllData() {
    if (confirm('¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }
}

window.CyberStorage = new StorageManager();

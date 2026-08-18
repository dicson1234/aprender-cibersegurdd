/* CyberLab Gamification Engine — persistent guarded XP rewards */
class GamificationEngine{
  constructor(){this.storage=window.CyberStorage;}
  addXP(amount,reason='',rewardKey=''){
    const n=Math.max(0,Math.floor(Number(amount)||0));if(!n||!this.storage?.activeAccountId)return false;
    const d=this.storage.data;
    d.rewardedRewards=Array.isArray(d.rewardedRewards)?d.rewardedRewards:[];
    if(rewardKey&&d.rewardedRewards.includes(rewardKey))return false;
    if(rewardKey){d.rewardedRewards.push(String(rewardKey));d.rewardedRewards=d.rewardedRewards.slice(-500);}
    d.xp+=n;d.level=Math.floor(Math.sqrt(d.xp/25))+1;
    this.storage.saveData();
    this.showToast(`+${n} XP${reason?' · '+reason:''}`);
    this.checkAchievements();
    return true;
  }
  showToast(message,type='cyan'){let c=document.getElementById('toast-container');if(!c){c=document.createElement('div');c.id='toast-container';c.className='toast-container';document.body.appendChild(c);}const t=document.createElement('div');t.className=`toast ${type}`;const icon=document.createElement('span');icon.textContent='🛡️';const text=document.createElement('span');text.textContent=message;t.append(icon,text);c.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(100%)';setTimeout(()=>t.remove(),300);},3500);}
  checkAchievements(){const d=this.storage.data,achs=window.CyberData?.achievements||[];achs.forEach(a=>{if(d.unlockedAchievements.includes(a.id))return;const c=a.condition||'';let ok=false;if(c==='conceptsRead >= 1')ok=Object.keys(d.masteryLevels).length>=1;if(c==='quizzesPassed >= 1')ok=d.passedQuizzes.length>=1;if(c==='labsCompleted >= 1')ok=d.completedLabs.length>=1;if(c==='streakDays >= 7')ok=d.streak>=7;if(c==='challengesCompleted >= 1')ok=d.completedChallenges.length>=1;if(c==='notesCount >= 5')ok=d.notes.length>=5;if(c==='mistakesLogged >= 1')ok=d.mistakes.length>=1;if(ok){d.unlockedAchievements.push(a.id);this.storage.saveData();this.addXP(a.xpReward,`Logro: ${a.name}`,`achievement:${a.id}`);this.showToast(`🏆 ${a.name} (+${a.xpReward} XP)`,'yellow');}});}
}
window.CyberGamification=new GamificationEngine();

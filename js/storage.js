/* CyberLab LocalStorage & Cloud State Manager — isolated per account + validated backups */
const STORAGE_PREFIX='cyberlab_user_data_v4_';
const LEGACY_PREFIXES=['cyberlab_user_data_v3_'];
const LEGACY_KEYS=['cyberlab_user_data_v2','cyberlab_user_data_v1'];
const REVIEW_INTERVALS=[1,3,7,14,30];

function localDateKey(date=new Date()){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,'0');
  const d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

const DEFAULT_STATE={
  xp:0,level:1,streak:1,lastActiveDate:localDateKey(),hoursStudied:0,masteryLevels:{},
  completedModules:[],passedQuizzes:[],completedLabs:[],completedChallenges:[],notes:[],mistakes:[],
  resourceRatings:{},viewedResources:[],unlockedAchievements:[],quizAttempts:{},rewardedExams:[],
  goals:{dailyMinutes:30,dailyCompleted:false,weeklyModules:2,weeklyCompleted:false},
  primaryObjective:'Convertirme en profesional de ciberseguridad.',
  secondaryObjective:'Especializarme en Blue Team & SOC.',
  onboardingCompleted:false,userLevelPref:'zero'
};

function cloneDefaultState(){return JSON.parse(JSON.stringify(DEFAULT_STATE));}
function isObject(v){return v!==null&&typeof v==='object'&&!Array.isArray(v);}
function asArray(v){return Array.isArray(v)?v:[];}
function asNumber(v,f){return Number.isFinite(Number(v))?Number(v):f;}

function sanitizeState(input){
  const d=cloneDefaultState();
  if(!isObject(input))return d;
  d.xp=Math.max(0,asNumber(input.xp,0));
  d.level=Math.max(1,Math.floor(asNumber(input.level,1)));
  d.streak=Math.max(1,Math.floor(asNumber(input.streak,1)));
  d.lastActiveDate=typeof input.lastActiveDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(input.lastActiveDate)?input.lastActiveDate:d.lastActiveDate;
  d.hoursStudied=Math.max(0,asNumber(input.hoursStudied,0));
  d.masteryLevels=isObject(input.masteryLevels)?input.masteryLevels:{};
  ['completedModules','passedQuizzes','completedLabs','completedChallenges','notes','mistakes','unlockedAchievements','viewedResources','rewardedExams'].forEach(k=>d[k]=asArray(input[k]));
  d.resourceRatings=isObject(input.resourceRatings)?input.resourceRatings:{};
  d.quizAttempts=isObject(input.quizAttempts)?input.quizAttempts:{};
  d.goals=isObject(input.goals)?{...d.goals,...input.goals}:d.goals;
  if(typeof input.primaryObjective==='string')d.primaryObjective=input.primaryObjective.slice(0,500);
  if(typeof input.secondaryObjective==='string')d.secondaryObjective=input.secondaryObjective.slice(0,500);
  d.onboardingCompleted=Boolean(input.onboardingCompleted);
  if(typeof input.userLevelPref==='string')d.userLevelPref=input.userLevelPref;
  return d;
}

class StorageManager{
  constructor(){this.activeAccountId=null;this.data=cloneDefaultState();}
  key(id=this.activeAccountId){return id?`${STORAGE_PREFIX}${id}`:null;}

  legacyKeysFor(id){
    const keys=LEGACY_PREFIXES.map(prefix=>`${prefix}${id}`);
    if((window.CyberAccounts?.accounts||[]).length<=1)keys.push(...LEGACY_KEYS);
    return keys;
  }

  setActiveAccount(id){
    this.activeAccountId=id;
    if(!id){this.data=cloneDefaultState();return;}
    this.data=this.loadForAccount(id);
    this.checkStreak();
    window.dispatchEvent(new CustomEvent('cyberlab_state_updated',{detail:this.data}));
  }

  loadForAccount(id){
    try{
      const key=this.key(id);
      let stored=key?localStorage.getItem(key):null;
      if(!stored){
        for(const legacyKey of this.legacyKeysFor(id)){
          const legacy=localStorage.getItem(legacyKey);
          if(legacy){stored=legacy;localStorage.removeItem(legacyKey);break;}
        }
      }
      let source=cloneDefaultState();
      if(stored){
        const parsed=JSON.parse(stored);
        source=isObject(parsed)&&isObject(parsed.data)?parsed.data:parsed;
      }
      const data=sanitizeState(source);
      localStorage.setItem(key,JSON.stringify(data));
      return data;
    }catch(e){
      console.error('Error al cargar el perfil:',e);
      return cloneDefaultState();
    }
  }

  saveData(data=this.data,emit=true,{sync=true}={}){
    this.data=sanitizeState(data);
    if(!this.activeAccountId){console.warn('Se intentó guardar progreso sin cuenta activa.');return false;}
    try{localStorage.setItem(this.key(),JSON.stringify(this.data));}
    catch(e){console.error('Error al guardar:',e);return false;}
    if(emit)window.dispatchEvent(new CustomEvent('cyberlab_state_updated',{detail:this.data}));
    if(sync)window.CyberAccounts?.syncCloudProgress?.();
    return true;
  }

  importCloudProgress(cloudData){
    if(!isObject(cloudData)||!this.activeAccountId)return false;
    return this.saveData(sanitizeState(cloudData),true,{sync:false});
  }

  checkStreak(){
    if(!this.activeAccountId)return;
    const today=localDateKey(),last=this.data.lastActiveDate;
    if(!last||last===today)return;
    const diff=Math.round((Date.parse(today)-Date.parse(last))/86400000);
    this.data.streak=diff===1?this.data.streak+1:1;
    this.data.lastActiveDate=today;
    this.saveData(this.data,true);
  }

  exportBackup(){
    const account=window.CyberAccounts?.getActive();
    const payload={schemaVersion:4,exportedAt:new Date().toISOString(),account:account?{id:account.id,username:account.username,email:account.email||'',avatar:account.avatar||'🛡️',bio:account.bio||'',isCloud:Boolean(account.isCloud),privateProfile:account.privateProfile!==false}:null,data:this.data};
    const filename=`cyberlab_${account?.username||'usuario'}_${localDateKey()}.json`;
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }

  importBackup(text){
    try{
      const parsed=JSON.parse(text),candidate=isObject(parsed)&&isObject(parsed.data)?parsed.data:parsed;
      if(!isObject(candidate))throw new Error('Formato inválido');
      if(!this.activeAccountId)throw new Error('No hay cuenta activa');
      this.saveData(candidate,true,{sync:false});
      const importedAccount=parsed&&isObject(parsed.account)?parsed.account:null,active=window.CyberAccounts?.getActive?.();
      if(importedAccount&&active){
        const patch={};
        if(typeof importedAccount.username==='string')patch.username=importedAccount.username;
        if(typeof importedAccount.avatar==='string')patch.avatar=importedAccount.avatar;
        if(typeof importedAccount.bio==='string')patch.bio=importedAccount.bio;
        if(Object.keys(patch).length)window.CyberAccounts.updateActiveProfile(patch).catch(e=>console.warn('Perfil no sincronizado durante importación:',e));
      }
      window.CyberAccounts?.syncCloudProgress?.();
      alert('¡Copia importada correctamente! Se restauró el progreso y, cuando está presente, el perfil.');
      window.location.reload();
      return true;
    }catch(e){console.error(e);alert('La copia no es válida o está dañada.');return false;}
  }

  resetAllData(){if(confirm('¿Reiniciar todo el progreso de este usuario?')){if(this.activeAccountId)localStorage.removeItem(this.key());window.location.reload();}}
}

window.CyberStorage=new StorageManager();
window.CyberLabReviewIntervals=REVIEW_INTERVALS;

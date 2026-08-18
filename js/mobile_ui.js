/* Mobile shell + final UI/security compatibility patches. */
(function(){
  const THEME_KEY='cyberlab_mobile_theme';

  function setTheme(theme){const dark=theme!=='light';document.documentElement.classList.toggle('mobile-dark-mode',dark);localStorage.setItem(THEME_KEY,dark?'dark':'light');}

  function normalizeMobilePath(){
    if(window.innerWidth>700)return;
    document.querySelectorAll('.serpentine-path .node-wrapper').forEach((node,index)=>{node.style.transform=`translateX(${index%2===0?-24:24}px)`;});
  }

  function updateMobileNav(){
    const current=(location.hash||'#dashboard').slice(1);
    document.querySelectorAll('.mobile-nav-item').forEach(item=>item.classList.toggle('active',(item.getAttribute('href')||'')===`#${current}`));
  }

  function ensureSharedStyles(){
    if(document.getElementById('cyberlab-final-ui-styles'))return;
    const style=document.createElement('style');style.id='cyberlab-final-ui-styles';
    style.textContent=`
      .account-gate-card{width:min(480px,96vw);max-height:88vh;overflow:auto;background:var(--bg-card,#0f141d);border:1px solid var(--accent-cyan);border-radius:24px;padding:20px 16px;box-shadow:0 20px 60px rgba(0,0,0,.45);}
      .account-gate-head{text-align:center;margin-bottom:14px}.account-gate-icon{font-size:2.4rem;line-height:1;margin-bottom:6px}.account-gate-head h2{margin:2px 0 4px;font-size:1.3rem;color:var(--text-main)}.account-gate-head p{margin:0;color:var(--text-muted);font-size:.82rem}
      .account-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:14px;background:rgba(0,0,0,.28);padding:4px;border-radius:14px;border:1px solid var(--border-color)}.account-tabs .btn{width:100%;font-size:.78rem;padding:8px 5px;min-height:42px}
      .account-info-box{display:grid;gap:4px;padding:10px 12px;background:rgba(0,240,255,.05);border:1px solid rgba(0,240,255,.18);border-radius:12px;margin-bottom:12px}.account-info-box strong{color:var(--accent-cyan)}.account-info-box span{font-size:.76rem;color:var(--text-muted)}
      .account-gate-card label{display:block;margin:10px 0 4px;font-weight:700;font-size:.82rem;color:var(--text-main)}.account-gate-card .chat-input{width:100%;min-height:42px}.account-full-btn{width:100%;margin-top:10px}.account-status{min-height:18px;margin-top:7px;font-size:.78rem;text-align:center;color:var(--text-muted)}
      .account-section-title{font-size:1rem;color:var(--text-muted);margin:0 0 10px}.local-account-list{display:grid;gap:10px}.local-account-btn{width:100%;display:grid;grid-template-columns:42px 1fr;align-items:center;column-gap:10px;text-align:left;padding:11px 12px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;color:var(--text-main)}.local-account-btn img,.local-account-btn>span{grid-row:1/3;width:42px;height:42px;border-radius:50%;object-fit:cover;display:grid;place-items:center;font-size:1.6rem}.local-account-btn strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.local-account-btn small{color:var(--text-muted)}.account-empty{color:var(--text-muted);font-size:.85rem}
      .avatar-picker{display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px}.avatar-preview,.profile-editor-avatar{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#071019;border:2px solid var(--accent-cyan);overflow:hidden;flex:0 0 auto}.avatar-preview img,.profile-editor-avatar img{width:100%;height:100%;object-fit:cover}.avatar-picker-actions{flex:1;min-width:0}.avatar-presets{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.btn-avatar-preset,.btn-avatar-preset-edit{min-width:36px;min-height:34px;padding:4px 7px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:8px;color:var(--text-main);cursor:pointer}
      .profile-hero-card{display:grid;gap:16px}.profile-hero-main{display:flex;align-items:flex-start;gap:18px}.profile-avatar-wrap{flex:0 0 auto}.profile-avatar-img,.profile-avatar-fallback{border-radius:50%;object-fit:cover;display:grid;place-items:center;background:var(--bg-surface);border:3px solid var(--accent-cyan);box-shadow:0 0 20px rgba(0,240,255,.22)}.profile-identity{flex:1;min-width:0}.profile-title-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.profile-title-row h2{margin:0;overflow-wrap:anywhere}.profile-bio{color:var(--text-muted);margin:6px 0 10px;line-height:1.45}.profile-stats{display:flex;gap:7px;flex-wrap:wrap}.profile-actions{display:flex;gap:8px;flex-wrap:wrap}.profile-buttons{display:flex;gap:8px;flex-wrap:wrap}.profile-muted{color:var(--text-muted)}.achievement-card{padding:14px}.achievement-icon{font-size:2rem;margin-bottom:5px}.profile-editor-card{max-width:520px}.profile-editor-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}.profile-editor-head h3{margin:0}.profile-editor-head p{margin:4px 0 0;font-size:.78rem}.profile-avatar-editor{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px;background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px}.editor-presets{margin-top:0}.profile-editor-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
      @media(max-width:700px){.account-gate-card{width:min(470px,94vw);max-height:90dvh}.profile-hero-main{gap:12px}.profile-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.profile-buttons{display:grid;grid-template-columns:1fr 1fr}.profile-editor-card{max-width:none}.profile-editor-footer{display:grid;grid-template-columns:1fr 1.2fr}}
    `;
    document.head.appendChild(style);
  }

  function secureMarkdownPatch(){
    const tutor=window.CyberTutor;if(!tutor||tutor.__safeMarkdownPatched)return;
    tutor.parseMarkdown=function(text){
      let source=String(text??'');const codeBlocks=[];
      source=source.replace(/```([a-z0-9_-]*)\s*\n?([\s\S]*?)```/gi,(m,lang,code)=>{const safe=code.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));return `@@CODE${codeBlocks.push(`<pre><code>${safe.trim()}</code></pre>`)-1}@@`;});
      source=source.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      source=source.replace(/`([^`]+)`/g,(m,c)=>`<code>${c}</code>`).replace(/^### (.*)$/gim,'<h3>$1</h3>').replace(/^## (.*)$/gim,'<h2>$1</h2>').replace(/^# (.*)$/gim,'<h1>$1</h1>').replace(/^---$/gim,'<hr>').replace(/^&gt; (.*)$/gim,'<blockquote>$1</blockquote>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/^[\*-] (.*)$/gim,'<ul><li>$1</li></ul>').replace(/<\/ul>\s*<ul>/g,'').replace(/^\d+\. (.*)$/gim,'<ol><li>$1</li></ol>').replace(/<\/ol>\s*<ol>/g,'');
      return source.split(/\n{2,}/).map(block=>{const b=block.trim();if(!b)return '';if(/^<(h[1-3]|pre|blockquote|ul|ol|hr)/i.test(b))return b;return `<p>${b.replace(/\n/g,'<br>')}</p>`;}).join('').replace(/@@CODE(\d+)@@/g,(m,i)=>codeBlocks[Number(i)]||'');
    };
    tutor.__safeMarkdownPatched=true;
  }

  function secureHeaderPatch(){
    const app=window.CyberApp;if(!app||app.__safeHeaderPatched)return;const original=app.updateHeaderStats?.bind(app);if(!original)return;
    app.updateHeaderStats=function(){original();const account=window.CyberAccounts?.getActive?.(),box=document.getElementById('header-user-profile-badge');if(!box||!account)return;while(box.firstChild)box.removeChild(box.firstChild);const av=typeof account.avatar==='string'&&(/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(account.avatar)||account.avatar.startsWith('https://'))?account.avatar:null;if(av){const img=document.createElement('img');img.src=av;img.alt='';img.width=24;img.height=24;img.loading='lazy';img.style.cssText='border-radius:50%;object-fit:cover;border:1px solid var(--accent-cyan);';box.appendChild(img);}else{const span=document.createElement('span');span.textContent=account.avatar||'👤';span.style.fontSize='1.1rem';box.appendChild(span);}const name=document.createElement('span');name.textContent=account.username||'Estudiante';name.style.cssText='font-weight:700;font-size:.85rem';box.appendChild(name);};
    app.__safeHeaderPatched=true;app.updateHeaderStats();
  }

  function init(){
    setTheme(localStorage.getItem(THEME_KEY)||'dark');
    ensureSharedStyles();
    document.getElementById('mobile-dark-toggle')?.addEventListener('click',()=>setTheme(document.documentElement.classList.contains('mobile-dark-mode')?'light':'dark'));
    document.getElementById('mobile-profile-btn')?.addEventListener('click',()=>{window.location.hash='#profile';});
    document.querySelectorAll('.mobile-nav-item').forEach(item=>item.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));
    window.addEventListener('hashchange',updateMobileNav);window.addEventListener('resize',normalizeMobilePath);window.addEventListener('cyberlab_state_updated',normalizeMobilePath);
    const observer=new MutationObserver(()=>normalizeMobilePath());const root=document.getElementById('recorrido-root');if(root)observer.observe(root,{childList:true,subtree:true});
    setTimeout(()=>{normalizeMobilePath();updateMobileNav();secureMarkdownPatch();secureHeaderPatch();},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

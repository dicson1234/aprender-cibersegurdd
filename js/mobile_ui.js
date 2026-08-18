/* Mobile shell + final UI/security compatibility patches. */
(function(){
  const THEME_KEY='cyberlab_mobile_theme';

  function setTheme(theme){
    const dark=theme!=='light';
    document.documentElement.classList.toggle('mobile-dark-mode',dark);
    localStorage.setItem(THEME_KEY,dark?'dark':'light');
  }

  function normalizeMobilePath(){
    if(window.innerWidth>700)return;
    document.querySelectorAll('.serpentine-path .node-wrapper').forEach((node,index)=>{
      node.style.transform=`translateX(${index%2===0?-24:24}px)`;
    });
  }

  function updateMobileNav(){
    const current=(location.hash||'#dashboard').slice(1);
    document.querySelectorAll('.mobile-nav-item').forEach(item=>item.classList.toggle('active',(item.getAttribute('href')||'')===`#${current}`));
  }

  function secureMarkdownPatch(){
    const tutor=window.CyberTutor;
    if(!tutor||tutor.__safeMarkdownPatched)return;
    tutor.parseMarkdown=function(text){
      let source=String(text??'');
      const codeBlocks=[];
      source=source.replace(/```([a-z0-9_-]*)\s*\n?([\s\S]*?)```/gi,(m,lang,code)=>{
        const safe=code.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const index=codeBlocks.push(`<pre><code>${safe.trim()}</code></pre>`)-1;
        return `@@CODE${index}@@`;
      });
      source=source.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      source=source.replace(/`([^`]+)`/g,(m,c)=>`<code>${c}</code>`);
      source=source.replace(/^### (.*)$/gim,'<h3>$1</h3>').replace(/^## (.*)$/gim,'<h2>$1</h2>').replace(/^# (.*)$/gim,'<h1>$1</h1>');
      source=source.replace(/^---$/gim,'<hr>');
      source=source.replace(/^&gt; (.*)$/gim,'<blockquote>$1</blockquote>');
      source=source.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
      source=source.replace(/\*(.*?)\*/g,'<em>$1</em>');
      source=source.replace(/^[\*-] (.*)$/gim,'<ul><li>$1</li></ul>').replace(/<\/ul>\s*<ul>/g,'');
      source=source.replace(/^\d+\. (.*)$/gim,'<ol><li>$1</li></ol>').replace(/<\/ol>\s*<ol>/g,'');
      const html=source.split(/\n{2,}/).map(block=>{const b=block.trim();if(!b)return '';if(/^<(h[1-3]|pre|blockquote|ul|ol|hr)/i.test(b))return b;return `<p>${b.replace(/\n/g,'<br>')}</p>`;}).join('');
      return html.replace(/@@CODE(\d+)@@/g,(m,i)=>codeBlocks[Number(i)]||'');
    };
    tutor.__safeMarkdownPatched=true;
  }

  function secureHeaderPatch(){
    const app=window.CyberApp;
    if(!app||app.__safeHeaderPatched)return;
    const original=app.updateHeaderStats?.bind(app);
    if(!original)return;
    app.updateHeaderStats=function(){
      original();
      const account=window.CyberAccounts?.getActive?.();
      const box=document.getElementById('header-user-profile-badge');
      if(!box||!account)return;
      while(box.firstChild)box.removeChild(box.firstChild);
      const av=typeof account.avatar==='string'&&(/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(account.avatar)||account.avatar.startsWith('https://'))?account.avatar:null;
      if(av){const img=document.createElement('img');img.src=av;img.alt='';img.width=24;img.height=24;img.loading='lazy';img.style.cssText='border-radius:50%;object-fit:cover;border:1px solid var(--accent-cyan);';box.appendChild(img);}
      else{const span=document.createElement('span');span.textContent=account.avatar||'👤';span.style.fontSize='1.1rem';box.appendChild(span);}
      const name=document.createElement('span');name.textContent=account.username||'Estudiante';name.style.fontWeight='700';name.style.fontSize='.85rem';box.appendChild(name);
    };
    app.__safeHeaderPatched=true;
    app.updateHeaderStats();
  }

  function init(){
    setTheme(localStorage.getItem(THEME_KEY)||'dark');
    document.getElementById('mobile-dark-toggle')?.addEventListener('click',()=>setTheme(document.documentElement.classList.contains('mobile-dark-mode')?'light':'dark'));
    document.getElementById('mobile-profile-btn')?.addEventListener('click',()=>{window.location.hash='#profile';});
    document.querySelectorAll('.mobile-nav-item').forEach(item=>item.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'})));
    window.addEventListener('hashchange',updateMobileNav);
    window.addEventListener('resize',normalizeMobilePath);
    window.addEventListener('cyberlab_state_updated',normalizeMobilePath);
    const observer=new MutationObserver(()=>normalizeMobilePath());
    const root=document.getElementById('recorrido-root');if(root)observer.observe(root,{childList:true,subtree:true});
    setTimeout(()=>{normalizeMobilePath();updateMobileNav();secureMarkdownPatch();secureHeaderPatch();},100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

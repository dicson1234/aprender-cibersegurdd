/* Mobile-only app shell controls. Desktop remains unchanged. */
(function(){
  const THEME_KEY='cyberlab_mobile_theme';

  function setTheme(theme){
    const dark=theme!=='light';
    document.documentElement.classList.toggle('mobile-dark-mode',dark);
    localStorage.setItem(THEME_KEY,dark?'dark':'light');
  }

  function normalizeMobilePath(){
    if(window.innerWidth>700)return;
    const nodes=document.querySelectorAll('.serpentine-path .node-wrapper');
    nodes.forEach((node,index)=>{node.style.transform=`translateX(${index%2===0?-24:24}px)`;});
  }

  function updateMobileNav(){
    const current=(location.hash||'#dashboard').slice(1);
    document.querySelectorAll('.mobile-nav-item').forEach(item=>{
      const href=item.getAttribute('href')||'';
      item.classList.toggle('active',href===`#${current}`);
    });
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
    setTimeout(()=>{normalizeMobilePath();updateMobileNav();},50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

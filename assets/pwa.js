// Hosted site only (the offline single file leaves this out): registers the service worker (sw.js) so the guide
// opens with no internet, and keeps the browser's "add to home screen" offer for app.js's install button.
(function(){
'use strict';
if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
window.BG_PWA=true;
const say=()=>dispatchEvent(new Event('bg-install'));
addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(e=>console.warn('service worker not registered',e))});
// Chrome only offers this while the guide is not installed, so the offer itself says "not installed yet".
addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.BG_INSTALL=e;try{localStorage.removeItem('bg-installed')}catch(x){}say()});
addEventListener('appinstalled',()=>{window.BG_INSTALL=null;try{localStorage.setItem('bg-installed','1')}catch(x){}say()});
})();

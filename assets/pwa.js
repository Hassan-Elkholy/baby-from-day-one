// Hosted site only (the offline single file leaves this out): registers the service worker (sw.js) so the guide
// opens with no internet, and keeps the browser's "add to home screen" offer for app.js to show as a hint.
(function(){
'use strict';
if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(e=>console.warn('service worker not registered',e))});
addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.BG_INSTALL=e;dispatchEvent(new Event('bg-install'))});
addEventListener('appinstalled',()=>{window.BG_INSTALL=null});
})();

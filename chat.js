function mallen(){
 document.querySelectorAll(".highlight-chat:not(.mallen-ok)").forEach(e=>{
  let m=e.querySelector(".hl-message");
  let n=e.querySelector(".hl-name");
  if(!m||!n)return;

  e.classList.add("mallen-ok");
  e.querySelectorAll(".time-arrived").forEach(x=>x.remove());

  let h=document.createElement("div");
  h.className="mallen-header";

  let els=[...e.children];

  els.forEach(x=>{
   if(
    x===n||
    x.classList.contains("icon")||
    x.classList.contains("hl-source-type")||
    x.classList.contains("hl-profile-pic")||
    x.classList.contains("hl-badges")
   )h.appendChild(x);
  });

  if(!h.contains(n))h.appendChild(n);

  e.insertBefore(h,m);
 });
}
new MutationObserver(mallen).observe(document.body,{childList:true,subtree:true});
mallen();

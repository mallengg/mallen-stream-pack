function mallen(){
 document.querySelectorAll(".highlight-chat").forEach(e=>{
  if(e.dataset.mallen)return;
  let m=e.querySelector(".hl-message");
  if(!m)return;

  e.dataset.mallen=1;

  e.querySelectorAll(".time-arrived").forEach(x=>x.remove());

  let h=document.createElement("div");
  h.className="mallen-header";

  [...e.children].forEach(x=>{
   if(x!==m&&!x.contains(m))h.appendChild(x);
  });

  e.insertBefore(h,e.firstChild);
 });
}

new MutationObserver(mallen).observe(document.body,{
 childList:true,
 subtree:true
});

mallen();

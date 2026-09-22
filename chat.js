function mallenChat(){
 document.querySelectorAll(".highlight-chat:not(.mallen-ready)").forEach(c=>{
  let name=c.querySelector(":scope>.hl-name");
  let msg=c.querySelector(":scope>.hl-message");
  if(!name||!msg)return;

  c.classList.add("mallen-ready");

  c.querySelectorAll(":scope>.time-arrived").forEach(e=>e.remove());
  c.querySelectorAll(":scope>.queueid").forEach(e=>e.remove());

  let h=document.createElement("div");
  h.className="mallen-header";

  let source=c.querySelector(":scope>.hl-source-type");
  let avatar=c.querySelector(":scope>.hl-profile-pic");

  if(source)h.appendChild(source);
  if(avatar)h.appendChild(avatar);
  h.appendChild(name);

  c.insertBefore(h,msg);
 });
}

new MutationObserver(mallenChat).observe(document.body,{
 childList:true,
 subtree:true
});

mallenChat();

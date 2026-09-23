const button = document.querySelector(".theme-toggle");

if (button) {
  const saved = localStorage.getItem("theme");
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");

  document.documentElement.dataset.theme = theme;
  button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

  button.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    button.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    localStorage.setItem("theme", next);
  });
}

// Hamburger menu functionality
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navigation nav ul");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
  });

  // Close menu when clicking a link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Slowly rotating contour sculpture for the homepage.
(() => {
  const canvas=document.querySelector('.hero__canvas');
  if (!canvas) return;
  const ctx=canvas.getContext('2d');
  if (!ctx) return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle=document.querySelector('.hero__motion');
  motionToggle.hidden=false;
  let width=0,height=0,pointer=0,target=0,tilt=0,targetTilt=0,visible=false,frame=0,time=0,last=0;
  let paused=reduced.matches;
  function syncMotion() {
    motionToggle.textContent=paused?'Play motion':'Pause motion';
  }
  function resize() { const rect=canvas.getBoundingClientRect(); width=rect.width; height=rect.height; const dpr=Math.min(devicePixelRatio||1,2); canvas.width=width*dpr; canvas.height=height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); render(); }
  function render() {
    if(!width||!height) return;
    ctx.clearRect(0,0,width,height);
    const lightTheme=document.documentElement.dataset.theme==='light';
    const mobile=matchMedia('(max-width:650px)').matches;
    const cx=width*(mobile?.5:.75), cy=mobile?height*.72:(height-56)*.5;
    // Reserve space for the control and the widest point of every fold.
    const scale=Math.min(width*(mobile?.36:.205),height*(mobile?.20:.355));
    const glow=ctx.createRadialGradient(cx,cy,scale*.1,cx,cy,scale*1.3);
    glow.addColorStop(0,'rgba(230,180,106,.075)');
    glow.addColorStop(.65,'rgba(126,163,179,.025)');
    glow.addColorStop(1,'rgba(126,163,179,0)');
    ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
    // Batch short contour segments by depth and light, preserving the dark far side.
    const paths=Array.from({length:48},()=>new Path2D());
    const breath=Math.sin(time*.19);
    const rotation=.42+time*.09+pointer*.22, lean=-.48+Math.sin(time*.11)*.07+tilt*.10;
    const cr=Math.cos(rotation), sr=Math.sin(rotation), cl=Math.cos(lean), sl=Math.sin(lean);
    const sweep=Math.sin(time*.23)*.78;
    for(let j=0;j<84;j++) {
      const lat=((j+.5)/84-.5)*Math.PI, r=Math.cos(lat), z=Math.sin(lat);
      const light=Math.exp(-Math.pow((z-sweep)/.075,2));
      let previous;
      for(let k=0;k<=144;k++) {
        const a=k/144*Math.PI*2;
        const fold=(.25+breath*.025)*Math.sin(a*3+z*5+breath*.5)+.06*Math.cos(a*5-z*3-breath*.35);
        const radius=r*(1+fold*r);
        const twist=z*(.62+pointer*.3)+time*.075;
        const x=radius*Math.cos(a+twist), y=radius*Math.sin(a+twist);
        const zz=z*.93+.12*r*r*Math.sin(a*3+breath*.45);
        const xx=x*cr-zz*sr, rz=x*sr+zz*cr;
        const yy=y*.48-rz*.877, depth=y*.877+rz*.48;
        const px=cx+(xx*cl-yy*sl)*scale, py=cy+(xx*sl+yy*cl)*scale;
        if(previous) {
          const shade=Math.min(15,Math.max(0,Math.floor((depth+1.3)/2.6*16)));
          const warmth=light>.65?2:light>.18?1:0;
          const path=paths[warmth*16+shade];
          path.moveTo(previous[0],previous[1]); path.lineTo(px,py);
        }
        previous=[px,py];
      }
    }
    ctx.lineCap='round';
    for(let warmth=0;warmth<3;warmth++) {
      for(let shade=0;shade<16;shade++) {
        const depth=shade/15;
        const front=Math.max(0,(depth-.4)/.6);
        const alpha=.018+Math.pow(front,1.35)*.88;
        const cool=lightTheme?'56,76,91':'191,212,224';
        const warm=lightTheme?'155,96,28':'230,180,106';
        const crest=lightTheme?'174,103,18':'255,204,129';
        ctx.strokeStyle=warmth===2?`rgba(${crest},${Math.min(1,alpha*1.45)})`:warmth===1?`rgba(${warm},${alpha})`:`rgba(${cool},${alpha*.82})`;
        ctx.lineWidth=warmth===2?1.3:.6+front*.4;
        ctx.stroke(paths[warmth*16+shade]);
      }
    }
  }
  function tick(now) {
    frame=0;
    if(!visible||document.hidden||paused) return;
    if(last) time+=Math.min(now-last,40)/1000;
    last=now; pointer+=(target-pointer)*.035; tilt+=(targetTilt-tilt)*.035;
    render(); frame=requestAnimationFrame(tick);
  }
  function start() { if(!frame&&visible&&!document.hidden&&!paused) { last=0; frame=requestAnimationFrame(tick); } }
  canvas.parentElement.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    const rect=canvas.getBoundingClientRect();
    target=(e.clientX-rect.left)/width*2-1;
    targetTilt=(e.clientY-rect.top)/height*2-1;
  });
  canvas.parentElement.addEventListener('pointerleave',()=>{target=0;targetTilt=0;});
  motionToggle.addEventListener('click',()=>{paused=!paused;syncMotion();start();});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting; start();}).observe(canvas);
  document.addEventListener('visibilitychange',start);
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();render();start();});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  syncMotion();
})();

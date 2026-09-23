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

// The mobile navigation is a disclosure; closed links cannot receive focus.
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");

if (menuToggle && navMenu) {
  const mobileMenu = matchMedia("(max-width: 768px)");
  const setMenuOpen = (open, returnFocus = false) => {
    menuToggle.classList.toggle("active", open);
    navMenu.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navMenu.inert = mobileMenu.matches && !open;
    if (returnFocus) menuToggle.focus();
  };
  setMenuOpen(false);
  mobileMenu.addEventListener("change", () => setMenuOpen(false));
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuOpen(open);
    if (open) navMenu.querySelector("a")?.focus();
  });
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false, mobileMenu.matches));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });
  document.addEventListener("click", event => {
    if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
      setMenuOpen(false, navMenu.contains(document.activeElement));
    }
  });
  navMenu.addEventListener("focusout", () => {
    queueMicrotask(() => {
      if (!navMenu.contains(document.activeElement) && document.activeElement !== menuToggle) {
        setMenuOpen(false);
      }
    });
  });
}

// A rotating network whose connections follow a shared, folded surface.
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
  // Sample the surface once: uneven clusters, stable geometry, no per-frame jitter.
  let seed=7319;
  function random() {
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    return seed/4294967296;
  }
  const nodes=[], connections=[], pairs=new Set();
  const clusters=Array.from({length:5},()=>({lat:(random()-.5)*2,angle:random()*Math.PI*2}));
  for(let attempt=0;nodes.length<360&&attempt<3000;attempt++) {
    const cluster=clusters[Math.floor(random()*clusters.length)];
    const clustered=random()<.28;
    const lat=clustered?Math.max(-1.35,Math.min(1.35,cluster.lat+(random()-.5)*.8)):Math.asin((random()-.5)*1.94);
    const angle=clustered?cluster.angle+(random()-.5)*1.1:random()*Math.PI*2;
    const position=[Math.cos(lat)*Math.cos(angle),Math.cos(lat)*Math.sin(angle),Math.sin(lat)];
    const distance=node=>Math.hypot(...position.map((value,i)=>value-node.position[i]));
    if(nodes.some(node=>distance(node)<.07)) continue;
    nodes.push({lat,angle,position,size:.7+random()*.65,firedAt:-100,decay:.5+random()*.8});
  }
  nodes.forEach((node,index)=>{
    const neighbors=nodes.map((other,i)=>({i,d:Math.hypot(...node.position.map((value,k)=>value-other.position[k]))}))
      .filter(other=>other.i!==index).sort((a,b)=>a.d-b.d);
    for(const neighbor of neighbors.slice(0,5+Math.floor(random()*3))) {
      const from=Math.min(index,neighbor.i), to=Math.max(index,neighbor.i), key=`${from}:${to}`;
      if(pairs.has(key)) continue;
      pairs.add(key);
      // Sample a curved route on the sphere before applying the shared deformation.
      const route=Array.from({length:13},(_,step)=>{
        const t=step/12;
        const position=node.position.map((value,k)=>value*(1-t)+nodes[neighbor.i].position[k]*t);
        const length=Math.hypot(...position);
        return {lat:Math.asin(position[2]/length),angle:Math.atan2(position[1],position[0])};
      });
      // Routes must always run from the stored source to the stored destination.
      if(index!==from) route.reverse();
      connections.push({from,to,route,nextAt:random()*60-1,duration:1.1+random()*2,reverse:random()<.5});
    }
  });
  // Signals keep a color for their whole journey, including any short cascade.
  const signalPalette={
    dark:['248,199,126','245,238,218','90,178,255'],
    light:['155,96,28','104,91,70','26,105,181'],
  };
  function chooseColor() {
    const value=random();
    return value<.67?0:value<.84?1:2;
  }
  function signalDuration() {
    const value=random();
    if(value<.22) return .4+random()*.45;
    if(value<.78) return 1.1+random()*1.4;
    return 3+random()*1.8;
  }
  const neighbors=nodes.map(()=>[]);
  for(const edge of connections) {
    edge.nextAt=Infinity;
    neighbors[edge.from].push(edge);
    neighbors[edge.to].push(edge);
  }
  function launch(edge,from,at,color,hops) {
    edge.reverse=from===edge.to;
    edge.nextAt=at;
    edge.duration=signalDuration();
    edge.color=color;
    edge.hops=hops;
  }
  let nextSpontaneousAt=0;
  function advanceSignals() {
    let scheduled=connections.filter(edge=>Number.isFinite(edge.nextAt)).length;
    for(const edge of connections) {
      if(!Number.isFinite(edge.nextAt)||time<edge.nextAt+edge.duration) continue;
      const destination=edge.reverse?edge.from:edge.to;
      const arrivedAt=edge.nextAt+edge.duration;
      nodes[destination].firedAt=arrivedAt;
      nodes[destination].color=edge.color;
      edge.nextAt=Infinity;
      scheduled--;
      // A bounded cascade follows actual neighboring connections; never an all-over flash.
      if(edge.hops>0&&random()<.75&&scheduled<12) {
        const candidates=neighbors[destination].filter(next=>next!==edge&&!Number.isFinite(next.nextAt));
        const count=random()<.18?2:1;
        for(let branch=0;branch<count&&candidates.length&&scheduled<12;branch++) {
          const index=Math.floor(random()*candidates.length);
          const next=candidates.splice(index,1)[0];
          launch(next,destination,arrivedAt+.15+random()*.4,edge.color,edge.hops-1);
          scheduled++;
        }
      }
    }
    if(time>=nextSpontaneousAt) {
      const edge=connections[Math.floor(random()*connections.length)];
      if(!Number.isFinite(edge.nextAt)&&scheduled<12) {
        launch(edge,random()<.5?edge.from:edge.to,time,chooseColor(),random()<.35?2:0);
      }
      // A shifting rhythm of isolated impulses and longer quiet intervals.
      nextSpontaneousAt=time+(random()<.08?1.8+random()*1.8:.12+random()*.35);
    }
  }
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
    const scale=Math.min(width*(mobile?.34:.195),height*(mobile?.19:.335));
    const glow=ctx.createRadialGradient(cx,cy,scale*.1,cx,cy,scale*1.3);
    glow.addColorStop(0,'rgba(230,180,106,.075)');
    glow.addColorStop(.65,'rgba(126,163,179,.025)');
    glow.addColorStop(1,'rgba(126,163,179,0)');
    ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
    const breath=Math.sin(time*.19);
    const rotation=.42+time*.09+Math.sin(time*.17)*.065+pointer*.22, lean=-.48+Math.sin(time*.11)*.07+tilt*.10;
    const cr=Math.cos(rotation), sr=Math.sin(rotation), cl=Math.cos(lean), sl=Math.sin(lean);
    function project(lat,a) {
      const r=Math.cos(lat), z=Math.sin(lat);
      const fold=(.25+breath*.025)*Math.sin(a*3+z*5+breath*.5)+.06*Math.cos(a*5-z*3-breath*.35);
      const radius=r*(1+fold*r);
      const twist=z*(.62+pointer*.3)+time*.075;
      const x=radius*Math.cos(a+twist), y=radius*Math.sin(a+twist);
      const zz=z*.93+.12*r*r*Math.sin(a*3+breath*.45);
      const xx=x*cr-zz*sr, rz=x*sr+zz*cr;
      const yy=y*.48-rz*.877, depth=y*.877+rz*.48;
      // A restrained perspective lens lets near strands pass in front of the far side.
      const perspective=4.5/(4.5-depth);
      return {x:cx+(xx*cl-yy*sl)*scale*perspective,y:cy+(xx*sl+yy*cl)*scale*perspective,depth,perspective};
    }
    // The connections define the form; there is no separate contour shell.
    ctx.lineCap='round';
    const points=nodes.map(node=>project(node.lat,node.angle));
    const silver=lightTheme?'56,76,91':'191,212,224';
    const colors=signalPalette[lightTheme?'light':'dark'];
    const visibility=depth=>.025+Math.pow(Math.max(0,(depth+.1)/1.4),1.4)*.6;
    const activations=nodes.map(node=>Math.exp(-Math.max(0,time-node.firedAt)/node.decay));
    const nodeColors=nodes.map(node=>node.color??0);
    const strands=Array.from({length:16},()=>new Path2D());
    const signals=[];
    connections.forEach(edge=>{
      const route=edge.route.map(point=>project(point.lat,point.angle));
      for(let step=1;step<route.length;step++) {
        const a=route[step-1], b=route[step];
        const shade=Math.min(15,Math.max(0,Math.floor(((a.depth+b.depth)/2+1.3)/2.6*16)));
        strands[shade].moveTo(a.x,a.y);strands[shade].lineTo(b.x,b.y);
      }
      const elapsed=time-edge.nextAt;
      if(elapsed<0||elapsed>=edge.duration) return;
      const from=edge.reverse?edge.to:edge.from, to=edge.reverse?edge.from:edge.to;
      const progress=elapsed/edge.duration;
      const departure=Math.exp(-elapsed/.45), arrival=Math.pow(progress,5);
      if(departure>activations[from]) {activations[from]=departure;nodeColors[from]=edge.color;}
      if(arrival>activations[to]) {activations[to]=arrival;nodeColors[to]=edge.color;}
      if(edge.reverse) route.reverse();
      signals.push({route,progress,color:colors[edge.color],blue:edge.color===2});
    });
    for(let shade=0;shade<16;shade++) {
      const depth=shade/15, front=Math.max(0,(depth-.35)/.65);
      const tone=lightTheme?silver:`${Math.round(160+front*65)},${Math.round(183+front*49)},${Math.round(199+front*39)}`;
      ctx.strokeStyle=`rgba(${tone},${.025+Math.pow(front,1.6)*.85})`;
      ctx.lineWidth=.45+front*.9;
      ctx.stroke(strands[shade]);
    }
    for(const {route,progress,color,blue} of signals) {
      const pointAt=t=>{
        const index=t*(route.length-1), step=Math.min(route.length-2,Math.floor(index)), fraction=index-step;
        const a=route[step],b=route[step+1];
        return {x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction,depth:a.depth+(b.depth-a.depth)*fraction};
      };
      const start=Math.max(0,progress-.24), head=pointAt(progress);
      const strength=Math.sin(progress*Math.PI)*visibility(head.depth);
      ctx.beginPath();
      for(let step=0;step<=8;step++) {
        const point=pointAt(start+(progress-start)*step/8);
        if(step===0) ctx.moveTo(point.x,point.y); else ctx.lineTo(point.x,point.y);
      }
      // Low-opacity concentric strokes soften the light without blurring the structure.
      if(!lightTheme) {
        ctx.strokeStyle=`rgba(${color},${strength*(blue?.22:.09)})`;
        ctx.lineWidth=7;ctx.stroke();
        ctx.strokeStyle=`rgba(${color},${strength*(blue?.35:.18)})`;
        ctx.lineWidth=3.5;ctx.stroke();
      }
      ctx.strokeStyle=`rgba(${color},${Math.min(1,strength*2)})`;
      ctx.lineWidth=blue?1.9:1.6;ctx.stroke();
      ctx.fillStyle=`rgba(${color},${Math.min(1,strength*2.4)})`;
      ctx.beginPath();ctx.arc(head.x,head.y,1.25,0,Math.PI*2);ctx.fill();
    }
    points.forEach((point,index)=>{
      const activation=activations[index];
      const color=colors[nodeColors[index]];
      const opacity=visibility(point.depth);
      const radius=(((mobile?.65:.8)+opacity*.85)*nodes[index].size+activation*.65)*point.perspective;
      if(activation>.1&&point.depth>0) {
        const halo=ctx.createRadialGradient(point.x,point.y,0,point.x,point.y,radius*5);
        halo.addColorStop(0,`rgba(${color},${activation*opacity*(nodeColors[index]===2?.6:.35)})`);
        halo.addColorStop(1,`rgba(${color},0)`);
        ctx.fillStyle=halo;ctx.beginPath();ctx.arc(point.x,point.y,radius*5,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=`rgba(${activation>.35?color:silver},${Math.min(1,opacity*(1.2+activation))})`;
      ctx.beginPath();ctx.arc(point.x,point.y,radius,0,Math.PI*2);ctx.fill();
    });
  }
  function tick(now) {
    frame=0;
    if(!visible||document.hidden||paused) return;
    if(last) time+=Math.min(now-last,40)/1000;
    last=now; pointer+=(target-pointer)*.035; tilt+=(targetTilt-tilt)*.035;
    advanceSignals(); render(); frame=requestAnimationFrame(tick);
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

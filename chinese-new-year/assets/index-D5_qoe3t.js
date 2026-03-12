import{s as m,t as D,w as e,z as $,G as J,I as B,C,J as L,K as R,Q as ee,S as te,X as oe,Y as se,Z as re,_ as ae,$ as ne,a0 as ie,a1 as ce,y as H,a2 as le,a3 as he,a4 as de}from"./three-vendor-DprTmcNs.js";import{d as ue,w as me,q as fe,A as pe,B as ge}from"./postprocessing-vendor-CE15J9Rv.js";import"./react-vendor-Bzgz95E1.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function h(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(a){if(a.ep)return;a.ep=!0;const l=h(a);fetch(a.href,l)}})();var S=(s=>(s.CHAOS="CHAOS",s.FORMED="FORMED",s))(S||{});const xe=`
  uniform float uTime;
  uniform float uProgress;
  
  attribute vec3 aChaosPos;
  attribute vec3 aTargetPos;
  attribute float aRandom;
  
  varying vec3 vColor;
  varying float vAlpha;

  // Cubic Ease In Out
  float cubicInOut(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Add some individual variation to the progress so they don't all move at once
    float localProgress = clamp(uProgress * 1.2 - aRandom * 0.2, 0.0, 1.0);
    float easedProgress = cubicInOut(localProgress);

    // Interpolate position
    vec3 newPos = mix(aChaosPos, aTargetPos, easedProgress);
    
    // Add a slight "breathing" wind effect when formed
    float formedStrength = smoothstep(0.8, 1.0, easedProgress);
    newPos.x += sin(uTime * 2.0 + newPos.y) * 0.05 * formedStrength;
    newPos.z += cos(uTime * 1.5 + newPos.y) * 0.05 * formedStrength;

    // Add drifting effect when in chaos mode (so it doesn't look paused)
    float chaosStrength = 1.0 - smoothstep(0.0, 0.2, easedProgress);
    newPos.y += sin(uTime * 0.5 + aRandom * 10.0) * 0.5 * chaosStrength;
    newPos.x += cos(uTime * 0.3 + aRandom * 5.0) * 0.3 * chaosStrength;
    newPos.z += sin(uTime * 0.4 + aRandom * 8.0) * 0.3 * chaosStrength;

    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    
    // Size attenuation
    gl_PointSize = (8.0 * aRandom + 5.0) * (20.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Color logic: Mix between Chaos Gold and Formed Cake Colors
    vec3 goldColor = vec3(1.0, 0.84, 0.0);
    vec3 redColor = vec3(0.9, 0.1, 0.2); // Bright Red
    vec3 creamColor = vec3(1.0, 0.95, 0.85); // Cream
    
    vec3 finalFormedColor;
    if (aRandom > 0.7) {
        finalFormedColor = creamColor; // Cream sprinkles/frosting
    } else {
        finalFormedColor = mix(redColor, goldColor, aRandom * 0.3); // Red with gold tint
    }
    
    // Sparkle effect
    float sparkle = sin(uTime * 5.0 + aRandom * 100.0);
    
    vColor = mix(goldColor, finalFormedColor, easedProgress);
    
    // Add sparkle to the tips
    if (sparkle > 0.9) {
      vColor += vec3(0.5);
    }

    vAlpha = 1.0;
  }
`,Me=`
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;

    // Soft edge
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);

    gl_FragColor = vec4(vColor, vAlpha * glow);
  }
`,ve=({mode:s,count:t})=>{const h=m.useRef(null),i=m.useRef(0),{chaosPositions:a,targetPositions:l,randoms:o}=m.useMemo(()=>{const u=new Float32Array(t*3),d=new Float32Array(t*3),c=new Float32Array(t);for(let r=0;r<t;r++){const f=25*Math.cbrt(Math.random()),g=Math.random()*2*Math.PI,M=Math.acos(2*Math.random()-1);u[r*3]=f*Math.sin(M)*Math.cos(g),u[r*3+1]=f*Math.sin(M)*Math.sin(g)+5,u[r*3+2]=f*Math.cos(M);const x=6,w=5,v=6,p=Math.random(),b=Math.random(),n=2*Math.PI*p,y=Math.acos(2*b-1),P=.8+.2*Math.cbrt(Math.random()),F=x*P*Math.sin(y)*Math.cos(n),A=v+w*P*Math.cos(y),O=x*P*Math.sin(y)*Math.sin(n);d[r*3]=F,d[r*3+1]=A,d[r*3+2]=O,c[r]=Math.random()}return{chaosPositions:u,targetPositions:d,randoms:c}},[t]),j=m.useMemo(()=>({uTime:{value:0},uProgress:{value:0}}),[]);return D((u,d)=>{if(h.current){const c=h.current.material;c.uniforms.uTime.value=u.clock.elapsedTime;const r=s===S.FORMED?1:0;i.current=J.lerp(i.current,r,d*1.5),c.uniforms.uProgress.value=i.current}}),e.jsxs("points",{ref:h,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:t,array:a,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aChaosPos",count:t,array:a,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aTargetPos",count:t,array:l,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aRandom",count:t,array:o,itemSize:1})]}),e.jsx("shaderMaterial",{vertexShader:xe,fragmentShader:Me,uniforms:j,transparent:!0,depthWrite:!1,blending:$})]})},be=({mode:s,count:t})=>{const h=m.useRef(null),i=m.useRef(null),a=m.useRef(null),l=m.useRef(null),o=m.useMemo(()=>new B,[]),{lanternsData:j,giftsData:u,lightsData:d}=m.useMemo(()=>{const c=[],r=[],f=[],g=new C("#E60012"),M=new C("#8B0000"),x=[g,g,M],v=[new C("#FFD700"),new C("#FFF8DC")];for(let p=0;p<t;p++){const b=Math.random();let n="ball";b>.9&&(n="gift"),b>.95&&(n="light");const y=6,P=5,F=6,A=Math.random(),O=Math.random(),G=2*Math.PI*A,T=Math.acos(2*O-1),z=1.05+Math.random()*.1,V=y*z*Math.sin(T)*Math.cos(G),X=F+P*z*Math.cos(T),K=y*z*Math.sin(T)*Math.sin(G),W=new R(V,X,K),k=15+Math.random()*15,Y=Math.random()*Math.PI*2,I=Math.acos(2*Math.random()-1),Z=new R(k*Math.sin(I)*Math.cos(Y),k*Math.sin(I)*Math.sin(Y)+5,k*Math.cos(I)),Q=n==="ball"?.3+Math.random()*.15:.2+Math.random()*.2;let E;n==="ball"?E=x[Math.floor(Math.random()*x.length)]:n==="light"?E=new C("#FFFFAA"):E=v[Math.floor(Math.random()*v.length)];const N={chaosPos:Z,targetPos:W,type:n,color:E,scale:Q,speed:.5+Math.random()*1.5,rotationOffset:new L(0,Math.random()*Math.PI*2,0)};n==="ball"?c.push(N):n==="gift"?r.push(N):f.push(N)}return{lanternsData:c,giftsData:r,lightsData:f}},[t]);return m.useLayoutEffect(()=>{h.current&&(j.forEach((c,r)=>{h.current.setColorAt(r,c.color)}),h.current.instanceColor.needsUpdate=!0),a.current&&(u.forEach((c,r)=>a.current.setColorAt(r,c.color)),a.current.instanceColor.needsUpdate=!0),l.current&&(d.forEach((c,r)=>l.current.setColorAt(r,c.color)),l.current.instanceColor.needsUpdate=!0)},[j,u,d]),D((c,r)=>{const f=s===S.FORMED,g=c.clock.elapsedTime,M=(x,w,v=!1,p)=>{if(!x.current)return;let b=!1;w.forEach((n,y)=>{x.current.getMatrixAt(y,o.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale);const P=f?n.targetPos:n.chaosPos,F=r*n.speed;if(o.position.lerp(P,F),f?o.position.distanceTo(n.targetPos)<.5&&(o.position.y+=Math.sin(g*2+n.chaosPos.x)*.002):o.position.distanceTo(n.chaosPos)<10&&(o.position.x+=Math.sin(g*.5+n.chaosPos.y)*.02,o.position.y+=Math.cos(g*.3+n.chaosPos.x)*.02,o.position.z+=Math.sin(g*.4+n.chaosPos.z)*.02),v?o.rotation.set(0,0,0):(o.rotation.x+=r*.5,o.rotation.y+=r*.2),o.scale.setScalar(n.scale),v&&(o.scale.y*=.85),o.updateMatrix(),x.current.setMatrixAt(y,o.matrix),v&&p&&p.current){const A=n.scale;o.scale.set(A*.5,A*.1,A*.5),o.position.y+=A*.8,o.updateMatrix(),p.current.setMatrixAt(y*2,o.matrix),o.position.y-=A*1.6,o.updateMatrix(),p.current.setMatrixAt(y*2+1,o.matrix)}b=!0}),b&&(x.current.instanceMatrix.needsUpdate=!0,p&&p.current&&(p.current.instanceMatrix.needsUpdate=!0))};M(h,j,!0,i),M(a,u),M(l,d)}),e.jsxs(e.Fragment,{children:[e.jsxs("instancedMesh",{ref:h,args:[void 0,void 0,j.length],children:[e.jsx("sphereGeometry",{args:[1,32,32]}),e.jsx("meshStandardMaterial",{roughness:.7,metalness:0,envMapIntensity:.5})]}),e.jsxs("instancedMesh",{ref:i,args:[void 0,void 0,j.length*2],children:[e.jsx("cylinderGeometry",{args:[1,1,1,16]}),e.jsx("meshStandardMaterial",{color:"#FFD700",roughness:.2,metalness:.8})]}),e.jsxs("instancedMesh",{ref:a,args:[void 0,void 0,u.length],children:[e.jsx("boxGeometry",{args:[1,1,1]}),e.jsx("meshStandardMaterial",{roughness:.3,metalness:.5,color:"white"})]}),e.jsxs("instancedMesh",{ref:l,args:[void 0,void 0,d.length],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshStandardMaterial",{emissive:"white",emissiveIntensity:2,toneMapped:!1,color:"white"})]})]})},ye=({data:s,mode:t,index:h})=>{const i=m.useRef(null),[a,l]=m.useState(null),[o,j]=m.useState(!1);m.useEffect(()=>{new ee().load(s.url,c=>{c.colorSpace=te,l(c),j(!1)},void 0,c=>{console.warn(`Failed to load image: ${s.url}`,c),j(!0)})},[s.url]);const u=m.useMemo(()=>Math.random()*100,[]);return D((d,c)=>{if(!i.current)return;const r=t===S.FORMED,f=d.clock.elapsedTime,g=r?s.targetPos:s.chaosPos,M=c*s.speed;if(i.current.position.lerp(g,M),r){const x=new B;x.position.copy(i.current.position),x.lookAt(0,i.current.position.y,0),x.rotateY(Math.PI),i.current.quaternion.slerp(x.quaternion,M);const w=Math.sin(f*2+u)*.08,v=Math.cos(f*1.5+u)*.05,p=new L().setFromQuaternion(i.current.quaternion);i.current.rotation.z=p.z+w*.05,i.current.rotation.x=p.x+v*.05}else{const x=new R(0,9,20),w=new B;w.position.copy(i.current.position),w.lookAt(x),i.current.quaternion.slerp(w.quaternion,c*3);const v=Math.sin(f*1.5+u)*.03,p=Math.cos(f*1.2+u)*.03,b=new L().setFromQuaternion(i.current.quaternion);i.current.rotation.x=b.x+v,i.current.rotation.z=b.z+p}}),e.jsxs("group",{ref:i,children:[e.jsxs("mesh",{position:[0,1.2,-.1],children:[e.jsx("cylinderGeometry",{args:[.005,.005,1.5]}),e.jsx("meshStandardMaterial",{color:"#D4AF37",metalness:1,roughness:.2,transparent:!0,opacity:.6})]}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("boxGeometry",{args:[1.2,1.5,.02]}),e.jsx("meshStandardMaterial",{color:"#A60000",roughness:.6})]}),e.jsxs("mesh",{position:[0,.15,.025],children:[e.jsx("planeGeometry",{args:[1,1]}),a&&!o?e.jsx("meshBasicMaterial",{map:a}):e.jsx("meshStandardMaterial",{color:o?"#550000":"#cccccc"})]}),e.jsxs("mesh",{position:[0,.7,.025],rotation:[0,0,0],children:[e.jsx("boxGeometry",{args:[.1,.05,.05]}),e.jsx("meshStandardMaterial",{color:"#FFD700",metalness:1,roughness:.2})]}),e.jsx(oe,{position:[0,-.55,.03],fontSize:.12,color:"#FFD700",anchorX:"center",anchorY:"middle",children:o?"Image not found":"新年快乐"})]})]})},je=({mode:s,uploadedPhotos:t})=>{const h=m.useMemo(()=>{if(t.length===0)return[];const i=[],a=t.length;for(let l=0;l<a;l++){const d=Math.random(),c=Math.random(),r=2*Math.PI*d,f=Math.acos(2*c-1),g=1.15,M=6*g*Math.sin(f)*Math.cos(r),x=6+5*g*Math.cos(f),w=6*g*Math.sin(f)*Math.sin(r),v=new R(M,x,w),p=Math.random()*Math.PI*2,b=5+Math.random()*10,n=0,y=4,P=20,F=new R(n+(Math.random()-.5)*15,y+(Math.random()-.5)*10,P-4+b*Math.sin(p)*.5);i.push({id:l,url:t[l],chaosPos:F,targetPos:v,speed:.8+Math.random()*1.5})}return i},[t]);return e.jsx("group",{children:h.map((i,a)=>e.jsx(ye,{index:a,data:i,mode:s},a))})},we=({mode:s})=>{const t=m.useRef(null),h=m.useRef(null),i=se(ae,"/chinese-new-year/logo.svg"),a=m.useMemo(()=>i.paths.flatMap(u=>u.toShapes(!0)),[i]),l={depth:5,bevelEnabled:!0,bevelThickness:2,bevelSize:1,bevelSegments:5},o=new R(0,11.5,0),j=new R(Math.random()*20-10,15+Math.random()*10,Math.random()*20-10);return D((u,d)=>{if(!t.current)return;const c=s===S.FORMED,r=u.clock.elapsedTime,f=c?o:j;if(t.current.position.lerp(f,d*1.5),c?(t.current.rotation.y=r*.5,t.current.position.y=13+Math.sin(r*2)*.1):(t.current.rotation.x+=d*2,t.current.rotation.y+=d*3),h.current){const g=2+Math.sin(r*3)*.5;h.current.intensity=g}}),e.jsxs("group",{ref:t,position:[0,12,0],children:[e.jsx(re,{scale:[.02,.02,.02],rotation:[0,0,0],children:e.jsx("group",{scale:[1,-1,1],children:a.map((u,d)=>e.jsxs("mesh",{rotation:[0,0,0],children:[e.jsx("extrudeGeometry",{args:[u,l]}),e.jsx("meshStandardMaterial",{color:"#D4AF37",emissive:"#FFD700",emissiveIntensity:2,metalness:.9,roughness:.1,toneMapped:!1})]},d))})}),e.jsx("pointLight",{ref:h,color:"#FFD700",intensity:2,distance:5,decay:2})]})},q=50,_=200,Pe=`
  uniform float uTime;
  attribute float aTimeOffset;
  attribute vec3 aVelocity;
  attribute vec3 aColor;
  attribute vec3 aBasePos; // New: Each firework needs its own base position passed in or calculated
  
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float time = mod(uTime - aTimeOffset, 5.0); // 5 seconds loop for more variation
    
    vec3 pos = vec3(0.0);
    float progress = 0.0;
    
    // Launch phase (0.0 to 1.5s)
    if (time < 1.5 && time > 0.0) {
        float t = time / 1.5;
        // Launch from aBasePos.y - 10 to aBasePos.y
        pos = mix(vec3(aBasePos.x, -10.0, aBasePos.z), aBasePos, t);
        pos.x += sin(time * 10.0 + aTimeOffset) * 0.2;
        progress = 1.0;
    } 
    // Explosion phase (1.5s to 4.0s)
    else if (time >= 1.5 && time < 4.0) {
        float explosionTime = time - 1.5;
        vec3 startPos = aBasePos;
        
        // Physics: pos = p0 + v*t - 0.5*g*t^2
        pos = startPos + aVelocity * explosionTime * 4.0;
        pos.y -= 1.5 * explosionTime * explosionTime; // Soft gravity
        
        progress = 1.0 - (explosionTime / 2.5);
        progress = pow(progress, 0.5); // Stay visible longer
    } else {
        // Hidden
        pos = vec3(10000.0);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Size attenuation
    gl_PointSize = 750.0 * (1.0 / -mvPosition.z) * progress;
    
    vColor = aColor;
    vOpacity = progress;
  }
`,Fe=`
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(vColor, vOpacity * glow);
  }
`,Ce=()=>{const s=m.useRef(null),{positions:t,timeOffsets:h,velocities:i,colors:a,basePositions:l}=m.useMemo(()=>{const o=q*_,j=new Float32Array(o*3),u=new Float32Array(o),d=new Float32Array(o*3),c=new Float32Array(o*3),r=new Float32Array(o*3),f=[new C("#FF0000"),new C("#FFD700"),new C("#FF3366"),new C("#00FFCC"),new C("#FFFFFF"),new C("#FF8800")];for(let g=0;g<q;g++){const M=Math.random()*5,x=(Math.random()-.5)*70,w=5+Math.random()*20,v=-15-Math.random()*25,p=f[Math.floor(Math.random()*f.length)];for(let b=0;b<_;b++){const n=g*_+b;r[n*3]=x,r[n*3+1]=w,r[n*3+2]=v,u[n]=M;const y=Math.random()*Math.PI*2,P=Math.acos(Math.random()*2-1),F=.8+Math.random()*2.2;d[n*3]=F*Math.sin(P)*Math.cos(y),d[n*3+1]=F*Math.sin(P)*Math.sin(y),d[n*3+2]=F*Math.cos(P),c[n*3]=p.r,c[n*3+1]=p.g,c[n*3+2]=p.b}}return{positions:j,timeOffsets:u,velocities:d,colors:c,basePositions:r}},[]);return D(({clock:o})=>{s.current&&(s.current.uniforms.uTime.value=o.getElapsedTime())}),e.jsxs("points",{frustumCulled:!1,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:t.length/3,array:t,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aTimeOffset",count:h.length,array:h,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-aVelocity",count:i.length/3,array:i,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aColor",count:a.length/3,array:a,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-aBasePos",count:l.length/3,array:l,itemSize:3})]}),e.jsx("shaderMaterial",{ref:s,vertexShader:Pe,fragmentShader:Fe,uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,blending:$})]})},Se=({mode:s,uploadedPhotos:t})=>{const h=m.useRef(null);return e.jsxs(e.Fragment,{children:[e.jsx(ne,{ref:h,enablePan:!1,minPolarAngle:Math.PI/4,maxPolarAngle:Math.PI/1.8,minDistance:15,maxDistance:30,enableDamping:!0,dampingFactor:.05,enabled:!0}),e.jsx(ie,{preset:"lobby",background:!1,blur:.8}),e.jsx("ambientLight",{intensity:.2,color:"#440000"}),e.jsx("spotLight",{position:[10,20,10],angle:.2,penumbra:1,intensity:2,color:"#fff5cc",castShadow:!0}),e.jsx("pointLight",{position:[-10,5,-10],intensity:1,color:"#D4AF37"}),e.jsxs("group",{position:[0,-5,0],children:[e.jsx(ve,{mode:s,count:1500}),e.jsx(be,{mode:s,count:800}),e.jsx(je,{mode:s,uploadedPhotos:t}),e.jsx(we,{mode:s}),e.jsx(Ce,{}),e.jsx(ce,{opacity:.7,scale:30,blur:2,far:4.5,color:"#000000"})]}),e.jsxs(ue,{enableNormalPass:!1,children:[e.jsx(me,{luminanceThreshold:.8,mipmapBlur:!0,intensity:1.5,radius:.6}),e.jsx(fe,{eskil:!1,offset:.1,darkness:.7}),e.jsx(pe,{opacity:.02,blendFunction:ge.OVERLAY})]})]})},Ae=({mode:s,onToggle:t})=>{const h=s===S.FORMED;return e.jsxs("div",{className:"absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 z-10",children:[e.jsx("header",{className:"flex flex-col items-center",children:e.jsx("h1",{className:"text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5E6BF] to-[#D4AF37] font-serif drop-shadow-lg tracking-wider text-center",children:"Happy Chinese New Year"})}),e.jsx("div",{className:"flex flex-col items-center mb-8 pointer-events-auto",children:e.jsxs("button",{onClick:t,className:`
            group relative px-12 py-4 border-2 border-[#D4AF37] 
            bg-black/50 backdrop-blur-md overflow-hidden transition-all duration-500
            hover:shadow-[0_0_30px_#D4AF37] hover:border-[#fff]
          `,children:[e.jsx("div",{className:`absolute inset-0 bg-[#D4AF37] transition-transform duration-500 ease-in-out origin-left ${h?"scale-x-0":"scale-x-100"} opacity-10`}),e.jsx("span",{className:"relative z-10 font-serif text-xl md:text-2xl text-[#D4AF37] tracking-[0.2em] group-hover:text-white transition-colors",children:"恭喜发财 · 岁岁平安"})]})}),e.jsx("div",{className:"absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-50"}),e.jsx("div",{className:"absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] opacity-50"}),e.jsx("div",{className:"absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] opacity-50"}),e.jsx("div",{className:"absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-50"})]})};class Re extends H.Component{constructor(t){super(t),this.state={hasError:!1}}static getDerivedStateFromError(t){return{hasError:!0}}componentDidCatch(t,h){console.error("Error loading 3D scene:",t,h)}render(){return this.state.hasError?e.jsx("div",{className:"absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-[#D4AF37] font-serif p-8 text-center",children:e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl mb-2",children:"Something went wrong"}),e.jsx("p",{className:"opacity-70",children:"A resource failed to load (likely a missing image). Check the console for details."}),e.jsx("button",{onClick:()=>this.setState({hasError:!1}),className:"mt-4 px-4 py-2 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors",children:"Try Again"})]})}):this.props.children}}[...Array.from({length:60},(s,t)=>`/photos/${t+3}.png`).filter((s,t)=>!0)];const De=["3.png","4.png","5.png","6.png","7.png","8.png","9.png",...Array.from({length:53},(s,t)=>`${t+10}.png`)].map(s=>`/chinese-new-year/photos/${s}`);function Ee(){const[s,t]=m.useState(S.FORMED),h=()=>{s===S.FORMED?(t(S.CHAOS),window.parent.postMessage("navigate-home","*")):t(S.FORMED)};return e.jsxs("div",{className:"w-full h-screen relative bg-black",children:[e.jsx(Re,{children:e.jsx(le,{dpr:[1,2],camera:{position:[0,4,35],fov:45},gl:{antialias:!1,stencil:!1,alpha:!1},shadows:!0,children:e.jsx(m.Suspense,{fallback:null,children:e.jsx(Se,{mode:s,uploadedPhotos:De})})})}),e.jsx(he,{containerStyles:{background:"#000"},innerStyles:{width:"300px",height:"10px",background:"#333"},barStyles:{background:"#D4AF37",height:"10px"},dataStyles:{color:"#D4AF37",fontFamily:"Cinzel"}}),e.jsx(Ae,{mode:s,onToggle:h})]})}const U=document.getElementById("root");if(!U)throw new Error("Could not find root element to mount to");const Oe=de.createRoot(U);Oe.render(e.jsx(H.StrictMode,{children:e.jsx(Ee,{})}));

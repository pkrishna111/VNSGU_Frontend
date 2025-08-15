/* ===== Reveal on Scroll ===== */
function onScrollReveal(){
  document.querySelectorAll('.reveal').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 100) el.classList.add('show');
  });
}
document.addEventListener('scroll', onScrollReveal);
document.addEventListener('DOMContentLoaded', onScrollReveal);

/* ===== Auth (Frontend "session") =====
  - Users saved in localStorage under key "users" (array of {name,email,password})
  - Current session name saved as "currentUser"
*/
function getUsers(){ return JSON.parse(localStorage.getItem('users') || '[]'); }
function setUsers(users){ localStorage.setItem('users', JSON.stringify(users)); }
function setCurrentUser(name){ localStorage.setItem('currentUser', name); }
function getCurrentUser(){ return localStorage.getItem('currentUser'); }
function logout(){ localStorage.removeItem('currentUser'); location.href = 'index.html'; }

/* Navbar auth area render (on every page) */
function renderAuthUI(){
  const slot = document.getElementById('auth-area');
  if(!slot) return;
  const name = getCurrentUser();
  if(name){
    slot.innerHTML = `
      <span class="nav-link text-warning">Hi, ${name}</span>
    `;
    // add logout button to the right of links if space available
    const right = document.getElementById('auth-right');
    if(right){
      right.innerHTML = `<button class="btn btn-auth ms-lg-2" id="logout-btn">Logout</button>`;
      document.getElementById('logout-btn').addEventListener('click', logout);
    }
  }else{
    slot.innerHTML = `<a class="nav-link btn btn-auth" href="login.html">Login</a>`;
    const right = document.getElementById('auth-right');
    if(right) right.innerHTML = `<a class="nav-link" href="register.html">Register</a>`;
  }
}
document.addEventListener('DOMContentLoaded', renderAuthUI);

/* ===== Login / Register Handlers (only used on those pages) ===== */
function handleRegister(e){
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;

  if(pass !== pass2) return alert('Passwords do not match');
  let users = getUsers();
  if(users.find(u=>u.email===email)) return alert('Email already registered. Please login.');
  users.push({name, email, password: pass});
  setUsers(users);
  setCurrentUser(name);
  alert('Registered successfully. Welcome!');
  location.href = 'index.html';
}

function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;
  const user = getUsers().find(u=>u.email===email && u.password===pass);
  if(!user) return alert('Invalid credentials or user not registered.');
  setCurrentUser(user.name);
  alert(`Welcome back, ${user.name}!`);
  location.href = 'index.html';
}

/* ===== Academics Canvas Diagram ===== */
function drawAcademicsChart(){
  const c = document.getElementById('academicsCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  const W = c.width = c.offsetWidth;
  const H = c.height = 340;

  // boxes
  const boxes = [
    {x:W*0.1, y:40,  w:W*0.8, h:56, text:'ICT Programs', fill:'#eef3ff', stroke:'#9db4ff'},
    {x:W*0.08, y:130, w:W*0.26, h:52, text:'B.Sc. ICT', fill:'#e7f7ff', stroke:'#7cd1ff'},
    {x:W*0.37, y:130, w:W*0.26, h:52, text:'M.Sc. ICT', fill:'#efe7ff', stroke:'#c2a8ff'},
    {x:W*0.66, y:130, w:W*0.26, h:52, text:'Ph.D. ICT', fill:'#fff3e6', stroke:'#ffd08a'},
  ];

  // draw boxes
  ctx.lineWidth = 2;
  boxes.forEach(b=>{
    ctx.fillStyle = b.fill;
    roundRect(ctx, b.x, b.y, b.w, b.h, 14, true, false);
    ctx.strokeStyle = b.stroke;
    roundRect(ctx, b.x, b.y, b.w, b.h, 14, false, true);
    ctx.fillStyle = '#26304b';
    ctx.font = '600 16px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.text, b.x + b.w/2, b.y + b.h/2);
  });

  // arrows
  arrow(ctx, W*0.5, 96, W*0.21, 130, '#6a11cb');
  arrow(ctx, W*0.5, 96, W*0.5, 130, '#2575fc');
  arrow(ctx, W*0.5, 96, W*0.79, 130, '#f7b733');

  function roundRect(ctx,x,y,w,h,r,fill,stroke){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }
  function arrow(ctx, x1,y1,x2,y2,color){
    ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    const ang = Math.atan2(y2-y1,x2-x1);
    const size = 8;
    ctx.beginPath();
    ctx.moveTo(x2,y2);
    ctx.lineTo(x2-size*Math.cos(ang - Math.PI/6), y2-size*Math.sin(ang - Math.PI/6));
    ctx.lineTo(x2-size*Math.cos(ang + Math.PI/6), y2-size*Math.sin(ang + Math.PI/6));
    ctx.closePath(); ctx.fill();
  }
}
window.addEventListener('DOMContentLoaded', drawAcademicsChart);
window.addEventListener('resize', drawAcademicsChart);

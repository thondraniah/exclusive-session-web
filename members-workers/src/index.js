// ═══════════════════════════════════════════════════════════════
// Exclusive Session Members — Cloudflare Worker
// VIP Members Area: Login, Wallet, Booking, Gamification, Admin
// ═══════════════════════════════════════════════════════════════

const ADMIN_PASS = "P4lant1R777";
const ADMIN_WA = "wa.me/16464882233";
const ARTIST_CODES = ["NELSON", "JAMES", "JC", "SHARITH", "KEREN"];

// ═══════════════════════════════════════════════════════════════
// HTML EMBEBIDO — La interfaz completa del app
// ═══════════════════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exclusive Session — Members Area</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"></noscript>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --black:#000;--gold:#D4AF37;--gold-lt:#F5D77A;--gold-dk:#9A7B2E;
      --wine:#6B0F1A;--royal:#0057D9;--royal-lt:#1E90FF;--cream:#F0EAD6;
      --white:#fff;--gray:#555;--gray-lt:#888;
      --glass-bg:rgba(255,255,255,0.04);--glass-border:rgba(212,175,55,0.18);
    }
    html{scroll-behavior:smooth}
    body{font-family:'Inter',sans-serif;background:var(--black);color:var(--white);min-height:100vh;overflow-x:hidden}
    .bg-particles{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
    .particle{position:absolute;border-radius:50%;opacity:0.3;animation:float linear infinite}
    @keyframes float{0%{transform:translateY(100vh) rotate(0deg);opacity:0}10%{opacity:0.3}90%{opacity:0.3}100%{transform:translateY(-100vh) rotate(720deg);opacity:0}}
    .app-root{position:relative;z-index:1;min-height:100vh}
    .login-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;background:radial-gradient(ellipse at top,rgba(212,175,55,0.04)0%,transparent 60%)}
    .login-logo-text{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:var(--gold);letter-spacing:5px;text-align:center}
    .login-tagline{color:var(--cream);font-size:0.9rem;margin-top:0.3rem;opacity:0.7;text-align:center}
    .login-box{width:100%;max-width:440px;margin-top:1.5rem}
    .glass-card{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .section-card{background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:16px;backdrop-filter:blur(12px);padding:1.5rem}
    .tab-bar{display:flex;gap:0.5rem;margin-bottom:1.5rem}
    .tab-btn{flex:1;padding:0.7rem;background:transparent;border:1px solid var(--glass-border);color:var(--cream);border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:600;transition:all 0.3s}
    .tab-btn.active{background:linear-gradient(135deg,var(--gold),var(--gold-dk));color:var(--black);border-color:var(--gold)}
    .input{width:100%;padding:0.8rem 1rem;background:rgba(255,255,255,0.06);border:1px solid var(--glass-border);border-radius:8px;color:var(--white);font-family:'Inter',sans-serif;font-size:0.95rem;outline:none;transition:border-color 0.3s}
    .input:focus{border-color:var(--gold)}
    .input-group{margin-bottom:1rem}
    .input-group label{display:block;color:var(--cream);font-size:0.82rem;font-weight:600;margin-bottom:0.3rem}
    .btn{padding:0.8rem 1.5rem;border:none;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;font-weight:700;font-size:0.95rem;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;justify-content:center}
    .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-dk));color:var(--black)}
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(212,175,55,0.35)}
    .btn-outline{background:transparent;border:1px solid var(--glass-border);color:var(--cream)}
    .btn-outline:hover{border-color:var(--gold);color:var(--gold)}
    .btn-danger{background:rgba(220,38,38,0.2);border:1px solid rgba(220,38,38,0.4);color:#fca5a5}
    .btn-sm{padding:0.5rem 1rem;font-size:0.85rem}
    .alert{padding:0.8rem 1rem;border-radius:8px;margin-bottom:1rem;font-size:0.9rem}
    .alert-error{background:rgba(220,38,38,0.15);border:1px solid rgba(220,38,38,0.3);color:#fca5a5}
    .alert-success{background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);color:#86efac}
    .gold-divider{height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1.2rem 0;opacity:0.3}
    .page-header{background:rgba(0,0,0,0.9);border-bottom:1px solid var(--glass-border);padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
    .page-title{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--gold);letter-spacing:2px}
    .page-body{padding:2rem 1.5rem;max-width:1200px;margin:0 auto}
    .grid-2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}
    .grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem}
    .stat-card{text-align:center;padding:1.5rem}
    .stat-value{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:var(--gold)}
    .stat-label{color:var(--gray-lt);font-size:0.82rem;margin-top:0.3rem;text-transform:uppercase;letter-spacing:1px}
    .nav-tabs{display:flex;gap:0.3rem;flex-wrap:wrap;margin-bottom:1.5rem;border-bottom:1px solid var(--glass-border);padding-bottom:0.5rem}
    .nav-tab{padding:0.5rem 1rem;background:transparent;border:none;color:var(--gray-lt);cursor:pointer;font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:600;border-radius:6px 6px 0 0;transition:all 0.3s}
    .nav-tab.active{background:var(--glass-bg);color:var(--gold);border-bottom:2px solid var(--gold)}
    .wizard-steps{display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-bottom:2rem}
    .wizard-step{flex:1;max-width:120px;text-align:center}
    .wizard-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.4rem;font-weight:700;font-size:0.85rem}
    .wizard-active{background:var(--gold);color:var(--black)}
    .wizard-done{background:rgba(34,197,94,0.3);color:#86efac}
    .wizard-pending{background:var(--glass-bg);border:1px solid var(--glass-border);color:var(--gray-lt)}
    .wizard-lbl{font-size:0.72rem;color:var(--gray-lt);line-height:1.2}
    .wizard-line{flex:1;height:2px;background:var(--glass-border);max-width:40px}
    .btn-row{display:flex;gap:0.5rem;margin-top:1rem}
    .card{padding:1rem;margin-bottom:0.8rem}
    .card-title{color:var(--gold);font-weight:700;margin-bottom:0.5rem;font-size:0.95rem}
    .card-row{display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05)}
    .card-row:last-child{border-bottom:none}
    .badge{padding:0.25rem 0.7rem;border-radius:99px;font-size:0.75rem;font-weight:700}
    .badge-gold{background:rgba(212,175,55,0.15);color:var(--gold);border:1px solid rgba(212,175,55,0.3)}
    .badge-green{background:rgba(34,197,94,0.15);color:#86efac;border:1px solid rgba(34,197,94,0.3)}
    .badge-blue{background:rgba(0,87,217,0.15);color:var(--royal-lt);border:1px solid rgba(0,87,217,0.3)}
    .badge-red{background:rgba(220,38,38,0.15);color:#fca5a5;border:1px solid rgba(220,38,38,0.3)}
    .progress-bar{height:8px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin-top:0.5rem}
    .progress-fill{height:100%;border-radius:99px;transition:width 0.5s}
    .confetti-canvas{position:fixed;inset:0;z-index:9999;pointer-events:none}
    .animate{animation:fadeIn 0.5s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .shimmer{background:linear-gradient(90deg,transparent,rgba(212,175,55,0.08),transparent);background-size:200% 100%;animation:shimmer 2s infinite}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .star-glow{text-shadow:0 0 10px rgba(212,175,55,0.5)}
    .whatsapp-btn{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:0.7rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:700;display:inline-flex;align-items:center;gap:0.5rem;transition:all 0.3s}
    .whatsapp-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(37,211,102,0.35)}
    .footer-bar{background:rgba(0,0,0,0.95);border-top:1px solid var(--glass-border);padding:0.8rem 1.5rem;display:flex;justify-content:space-around;position:fixed;bottom:0;left:0;right:0;z-index:100}
    .footer-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:0.2rem;background:transparent;border:none;color:var(--gray-lt);cursor:pointer;font-family:'Inter',sans-serif;font-size:0.7rem;padding:0.4rem;transition:color 0.3s}
    .footer-btn.active{color:var(--gold)}
    .footer-icon{font-size:1.3rem}
    .spacer{padding-bottom:80px}
    .artista-badge{display:inline-block;padding:0.2rem 0.6rem;background:linear-gradient(135deg,var(--royal),var(--wine));border-radius:99px;font-size:0.75rem;font-weight:700;color:#fff;margin-left:0.4rem}
    .admin-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding:1rem;background:rgba(0,0,0,0.5);border-radius:12px}
    @media(min-width:768px){.page-body{padding:2rem 2rem}.footer-bar{display:none}.spacer{padding-bottom:0}}
    @media(max-width:767px){.page-body{padding:1rem}.wizard-step .wizard-lbl{display:none}.wizard-circle{width:28px;height:28px;font-size:0.75rem}.stat-value{font-size:2rem}}
  </style>
</head>
<body>
<div class="bg-particles" id="bg-particles"></div>
<div class="app-root" id="app-root"></div>
<canvas class="confetti-canvas" id="confetti-canvas" style="display:none"></canvas>
<script>
// ═══════════════════════════════════════════════════════════════
// APP STATE
// ═══════════════════════════════════════════════════════════════
let state = { view: 'login', tab: 'dashboard', loginMode: 'login', loginError: '', artistStep: 1, adminStep: 1, user: null, session: null, msg: null, booking: {} };

function s(key, val) { if (val !== undefined) { state[key] = val; render(); } return state[key]; }
function r(k, v) { if (v !== undefined) sessionStorage.setItem(k, JSON.stringify(v)); const x = sessionStorage.getItem(k); return x ? JSON.parse(x) : null; }
function cu() { return r('es_user', null); }
function su(u) { if (u) sessionStorage.setItem('es_user', JSON.stringify(u)); else sessionStorage.removeItem('es_user'); state.user = cu(); }
function cl() { sessionStorage.removeItem('es_user'); state.user = null; state.view = 'login'; render(); }

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => { initParticles(); render(); });

// ═══════════════════════════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════════════════════════
function initParticles() {
  const c = document.getElementById('bg-particles');
  if (c.children.length > 0) return;
  const colors = ['#D4AF37','#F5D77A','#0057D9'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const sz = 2 + Math.random() * 4;
    p.style.cssText = \`width:\${sz}px;height:\${sz}px;left:\${Math.random()*100}%;background:\${colors[Math.floor(Math.random()*colors.length)]};animation-duration:\${15+Math.random()*25}s;animation-delay:\${Math.random()*20}s\`;
    c.appendChild(p);
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════════════
function render() {
  initParticles();
  const u = cu();
  const root = document.getElementById('app-root');
  if (state.view === 'login') { renderLogin(root); return; }
  if (state.view === 'admin') { renderAdmin(root); return; }
  if (state.view === 'artist') { renderArtist(root); return; }
  if (u) { renderApp(root); return; }
  state.view = 'login'; renderLogin(root);
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function renderLogin(root) {
  root.innerHTML = \`
    <div class="login-screen animate">
      <div class="login-logo-text">EXCLUSIVE SESSION</div>
      <div class="login-tagline">Members Area — VIP Experience</div>
      <div class="login-box">
        <div class="glass-card" style="padding:2rem">
          <div class="tab-bar">
            <button class="tab-btn \${state.loginMode==='login'?'active':''}" onclick="s('loginMode','login')">Iniciar Sesión</button>
            <button class="tab-btn \${state.loginMode==='registro'?'active':''}" onclick="s('loginMode','registro')">Registrarse</button>
          </div>
          \${state.loginError?\`<div class="alert alert-error">\${state.loginError}</div>\`:''}
          <form onsubmit="handleLogin(event)">
            \${state.loginMode==='registro'?\`
              <div class="input-group"><label>Nombre completo</label><input class="input" id="f-nombre" type="text" placeholder="Tu nombre" required></div>
              <div class="input-group"><label>Teléfono</label><input class="input" id="f-tel" type="tel" placeholder="+1 646 000 0000" required></div>
              <div class="input-group"><label>Código de referido</label><input class="input" id="f-ref" type="text" placeholder="ABC123 (opcional)"></div>
            \`:''}
            <div class="input-group"><label>Email</label><input class="input" id="f-email" type="email" placeholder="tu@email.com" required></div>
            <div class="input-group"><label>Contraseña</label><input class="input" id="f-pass" type="password" placeholder="••••••••" required></div>
            <button type="submit" class="btn btn-gold" style="width:100%;margin-top:0.5rem">
              \${state.loginMode==='login'?'🔐 Entrar':'✨ Crear Cuenta'}
            </button>
          </form>
          <div class="gold-divider"></div>
          <div style="text-align:center;display:flex;flex-direction:column;gap:0.4rem">
            <a href="#" onclick="event.preventDefault();s('view','artist')" style="color:var(--gold);font-size:0.82rem;font-weight:600">🎨 Portal del Artista</a>
            <a href="#" onclick="event.preventDefault();s('view','admin')" style="color:var(--gray-lt);font-size:0.8rem">🔒 Admin</a>
          </div>
        </div>
      </div>
    </div>
  \`;
}

// ═══════════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════════
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('f-email').value.trim();
  const pass = document.getElementById('f-pass').value;
  if (!email || !pass) { s('loginError', 'Completa todos los campos'); return; }
  const nombre = document.getElementById('f-nombre')?.value?.trim() || '';
  const tel = document.getElementById('f-tel')?.value?.trim() || '';
  const ref = document.getElementById('f-ref')?.value?.trim() || '';
  try {
    const res = await fetch('/api/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass, nombre, tel, ref, mode: state.loginMode })
    });
    const data = await res.json();
    if (!res.ok) { s('loginError', data.error || 'Error'); return; }
    su(data.user); s('view', 'app'); s('tab', 'dashboard'); s('loginError', '');
  } catch(err) { s('loginError', 'Error de conexión'); }
}

async function handleLogout() { cl(); }

// ═══════════════════════════════════════════════════════════════
// MEMBER APP
// ═══════════════════════════════════════════════════════════════
async function renderApp(root) {
  const u = cu();
  if (!u) { renderLogin(root); return; }
  root.innerHTML = \`
    <div class="page-header">
      <div class="page-title">EXCLUSIVE SESSION</div>
      <div style="display:flex;align-items:center;gap:0.5rem">
        <span style="color:var(--gold);font-size:0.9rem">\${u.nombre?.split(' ')[0]}</span>
        <span class="badge badge-gold">\${u.nivel||'BRONCE'}</span>
        <button class="btn btn-sm btn-outline" onclick="handleLogout()">Salir</button>
      </div>
    </div>
    <div class="page-body">
      \${state.msg?\`<div class="alert \${state.msg.type==='error'?'alert-error':'alert-success'}">\${state.msg.text}</div>\`:''}
      \${state.tab==='dashboard'?renderDashboard():state.tab==='wallet'?renderWallet():state.tab==='book'?renderBooking():state.tab==='referrals'?renderReferrals():state.tab==='gamification'?renderGamification():renderDashboard()}
    </div>
    <div class="footer-bar">
      <button class="footer-btn \${state.tab==='dashboard'?'active':''}" onclick="s('tab','dashboard')"><span class="footer-icon">🏠</span>Inicio</button>
      <button class="footer-btn \${state.tab==='wallet'?'active':''}" onclick="s('tab','wallet')"><span class="footer-icon">💳</span>Billetera</button>
      <button class="footer-btn \${state.tab==='book'?'active':''}" onclick="s('tab','book')"><span class="footer-icon">📅</span>Reservar</button>
      <button class="footer-btn \${state.tab==='referrals'?'active':''}" onclick="s('tab','referrals')"><span class="footer-icon">🎁</span>Referidos</button>
      <button class="footer-btn \${state.tab==='gamification'?'active':''}" onclick="s('tab','gamification')"><span class="footer-icon">⭐</span>Recompensas</button>
    </div>
    <div class="spacer"></div>
  \`;
}

async function renderDashboard() {
  const u = cu();
  try {
    const res = await fetch('/api/dashboard', { headers: { 'x-user-id': u.id } });
    const d = await res.json();
    const nivelNext = nivelProgreso(d.puntos);
    return \`
      <h2 style="color:var(--gold);margin-bottom:1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px">Mi Panel VIP</h2>
      <div class="grid-3" style="margin-bottom:1.5rem">
        <div class="glass-card section-card stat-card"><div class="stat-value">\${d.saldo?.toFixed(2)||'0.00'}</div><div class="stat-label">Saldo USD</div></div>
        <div class="glass-card section-card stat-card"><div class="stat-value">\${d.puntos||0}</div><div class="stat-label">Puntos</div></div>
        <div class="glass-card section-card stat-card"><div class="stat-value">\${d.proximasCitas||0}</div><div class="stat-label">Próximas Citas</div></div>
      </div>
      <div class="section-card card" style="margin-bottom:1.5rem">
        <div class="card-title">Nivel: \${u.nivel||'BRONCE'} <span class="artista-badge">\${nivelNext.nivel}</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:\${nivelNext.progreso}%;background:linear-gradient(90deg,var(--gold),var(--gold-lt))"></div></div>
        <div style="text-align:center;margin-top:0.4rem;font-size:0.8rem;color:var(--gray-lt)">\${nivelNext.puntosActuales} / \${nivelNext.puntosNecesarios} puntos</div>
      </div>
      \${d.citasProximas?.length?\`
      <div class="section-card card">
        <div class="card-title">📅 Próximas Citas</div>
        \${d.citasProximas.map(c=>\`
          <div class="card-row"><div><div style="font-weight:600">\${c.servicio}</div><div style="font-size:0.82rem;color:var(--gray-lt)">\${c.artista} — \${formatDate(c.fecha)}</div></div><span class="badge badge-green">\${c.estado}</span></div>
        \`).join('')}
      </div>\`:'<div class="section-card card" style="text-align:center;color:var(--gray-lt);padding:2rem">No tienes citas próximas</div>'}
    \`;
  } catch(e) { return '<div class="alert alert-error">Error cargando datos</div>'; }
}

async function renderWallet() {
  const u = cu();
  try {
    const res = await fetch('/api/wallet', { headers: { 'x-user-id': u.id } });
    const d = await res.json();
    return \`
      <h2 style="color:var(--gold);margin-bottom:1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px">💳 Mi Billetera</h2>
      <div class="glass-card section-card" style="text-align:center;padding:2rem;margin-bottom:1.5rem">
        <div style="font-size:0.8rem;color:var(--gray-lt);text-transform:uppercase;letter-spacing:2px">Saldo Disponible</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:3.5rem;color:var(--gold);margin:0.5rem 0">$<span id="wallet-balance">\${d.saldo?.toFixed(2)||'0.00'}</span></div>
        <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap">
          <button class="btn btn-gold btn-sm" onclick="showLoadMoney()">💰 Cargar</button>
          <a href="\${ADMIN_WA}" target="_blank" class="btn btn-outline btn-sm">💸 Retirar</a>
        </div>
      </div>
      <div id="load-money-section" style="display:none;margin-bottom:1.5rem" class="glass-card section-card">
        <div class="card-title">Cargar saldo vía WhatsApp</div>
        <p style="color:var(--gray-lt);font-size:0.85rem;margin:0.5rem 0">Escribe a nuestro WhatsApp para cargar saldo:</p>
        <a href="\${ADMIN_WA}?text=Hola!%20Quiero%20cargar%20saldo%20en%20mi%20billetera%20VIP" target="_blank" class="whatsapp-btn" style="width:100%;justify-content:center">📱 Contactar por WhatsApp</a>
      </div>
      <div class="section-card card">
        <div class="card-title">📜 Historial</div>
        \${d.transacciones?.length?d.transacciones.map(t=>\`
          <div class="card-row">
            <div><div style="font-size:0.9rem">\${t.descripcion}</div><div style="font-size:0.75rem;color:var(--gray-lt)">\${formatDate(t.createdAt)}</div></div>
            <span style="color:\${t.monto>=0?'var(--royal-lt)':'#fca5a5'};font-weight:700">\${t.monto>=0?'+':''}\${t.monto?.toFixed(2)}</span>
          </div>
        \`).join(''):'<div style="text-align:center;color:var(--gray-lt);padding:1rem">Sin transacciones</div>'}
      </div>
    \`;
  } catch(e) { return '<div class="alert alert-error">Error cargando billetera</div>'; }
}

function showLoadMoney() {
  const el = document.getElementById('load-money-section');
  if (el) el.style.display = 'block';
}

async function renderBooking() {
  const artistas = ['NELSON','JAMES','JC','SHARITH','KEREN'];
  const servicios = ['Tattoo','Barbería','Manicure','Combo Tattoo+Barbería'];
  const b = state.booking;
  return \`
    <h2 style="color:var(--gold);margin-bottom:1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px">📅 Reservar Cita</h2>
    <div class="wizard-steps">
      <div class="wizard-step"><div class="wizard-circle \${(!b.servicio?'wizard-active':b.servicio?'wizard-done':'wizard-pending')}">1</div><div class="wizard-lbl">Servicio</div></div>
      <div class="wizard-line"></div>
      <div class="wizard-step"><div class="wizard-circle \${(b.servicio&&!b.artista?'wizard-active':b.artista?'wizard-done':'wizard-pending')}">2</div><div class="wizard-lbl">Artista</div></div>
      <div class="wizard-line"></div>
      <div class="wizard-step"><div class="wizard-circle \${(b.artista&&!b.fecha?'wizard-active':b.fecha?'wizard-done':'wizard-pending')}">3</div><div class="wizard-lbl">Fecha</div></div>
    </div>
    \${!b.servicio?\`
      <div class="grid-2">\${servicios.map(sv=>\`
        <div class="glass-card section-card" style="cursor:pointer" onclick="s('booking',{...state.booking,servicio:'\${sv}'})">
          <div style="font-size:2rem;margin-bottom:0.5rem">\${sv==='Tattoo'?'🖋️':sv==='Barbería'?'💈':sv==='Manicure'?'💅':'🔥'}</div>
          <div style="font-weight:700;color:var(--gold)">\${sv}</div>
        </div>
      \`).join('')}</div>
    \`:''}
    \${b.servicio&&!b.artista?\`
      <div class="grid-2"><div class="glass-card section-card" onclick="s('booking',{...state.booking,artista:null});s('tab','book')" style="cursor:pointer;text-align:center"><span style="font-size:1.5rem">←</span><div style="margin-top:0.3rem;font-size:0.85rem">Atrás</div></div>\${artistas.map(a=>\`
        <div class="glass-card section-card" style="cursor:pointer" onclick="s('booking',{...state.booking,artista:'\${a}'})"><div style="font-weight:700;color:var(--royal-lt)">\${a}</div></div>
      \`).join('')}</div>
    \`:''}
    \${b.artista?\`
      <div class="glass-card section-card" style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-weight:700;color:var(--gold)">\${b.servicio}</div><div style="color:var(--gray-lt);font-size:0.85rem">con \${b.artista||''}</div></div>
          <button class="btn btn-sm btn-outline" onclick="s('booking',{...state.booking,artista:null})">Editar</button>
        </div>
      </div>
      <div class="input-group"><label>Fecha preferida</label><input class="input" type="date" id="b-fecha" min="\${hoy()}"></div>
      <div class="input-group"><label>Hora preferida</label><input class="input" type="time" id="b-hora" value="12:00"></div>
      <div class="btn-row"><button class="btn btn-outline" onclick="s('booking',{...state.booking,artista:null})">Atrás</button><button class="btn btn-gold" onclick="submitBooking()">Enviar por WhatsApp</button></div>
    \`:''}
  \`;
}

function submitBooking() {
  const fecha = document.getElementById('b-fecha')?.value;
  const hora = document.getElementById('b-hora')?.value;
  if (!fecha || !hora) { alert('Selecciona fecha y hora'); return; }
  const b = state.booking;
  const u = cu();
  const msg = encodeURIComponent(\`Hola! Quiero reservar:\\nServicio: \${b.servicio}\\nArtista: \${b.artista||'Cualquiera'}\\nFecha: \${fecha}\\nHora: \${hora}\\nNombre: \${u?.nombre||''}\\nEmail: \${u?.email||''}\`);
  window.open(\`https://\${ADMIN_WA}?text=\${msg}\`, '_blank');
}

async function renderReferrals() {
  const u = cu();
  try {
    const res = await fetch('/api/referrals', { headers: { 'x-user-id': u.id } });
    const d = await res.json();
    return \`
      <h2 style="color:var(--gold);margin-bottom:1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px">🎁 Programa de Referidos</h2>
      <div class="glass-card section-card" style="text-align:center;padding:2rem;margin-bottom:1.5rem">
        <div style="font-size:0.8rem;color:var(--gray-lt)">Tu código único</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:2.5rem;color:var(--gold);margin:0.5rem 0;letter-spacing:4px" id="ref-code">\${d.codigo||'CARGA...'}</div>
        <button class="btn btn-gold btn-sm" onclick="copyRef()">📋 Copiar código</button>
      </div>
      <div class="section-card card">
        <div class="card-title">¿Cómo funciona?</div>
        <div style="color:var(--gray-lt);font-size:0.88rem;line-height:1.6">
          <p>1. Comparte tu código con amigos</p>
          <p>2. Cuando se registran, ambos reciben <strong style="color:var(--gold)">$5 USD</strong> de saldo</p>
          <p>3. Cada 5 referrals = 1 giro gratis en la Ruleta VIP</p>
        </div>
      </div>
      <div class="section-card card" style="margin-top:1rem">
        <div class="card-title">Tus referrals: \${d.total||0}</div>
        \${d.referidos?.map(r=>\`
          <div class="card-row"><span>\${r.nombre}</span><span class="badge badge-green">+ $5</span></div>
        \`).join('')||'<div style="text-align:center;color:var(--gray-lt);padding:1rem">Aún no tienes referrals</div>'}
      </div>
    \`;
  } catch(e) { return '<div class="alert alert-error">Error</div>'; }
}

async function renderGamification() {
  const u = cu();
  try {
    const res = await fetch('/api/gamification', { headers: { 'x-user-id': u.id } });
    const d = await res.json();
    const starsNext = starsProgreso(d.estrellas);
    return \`
      <h2 style="color:var(--gold);margin-bottom:1.5rem;font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px">⭐ Sistema de Estrellas</h2>
      <div class="grid-3" style="margin-bottom:1.5rem">
        <div class="glass-card section-card stat-card"><div class="stat-value star-glow">⭐ \${d.estrellas||0}</div><div class="stat-label">Estrellas</div></div>
        <div class="glass-card section-card stat-card"><div class="stat-value">\${d.girosGratis||0}</div><div class="stat-label">Giros Gratis</div></div>
        <div class="glass-card section-card stat-card"><div class="stat-value">\${d.racha||0}</div><div class="stat-label">Racha (días)</div></div>
      </div>
      <div class="section-card card" style="text-align:center;padding:2rem">
        <div style="font-size:2rem;margin-bottom:1rem">🎰 RULO VIP</div>
        <button class="btn btn-gold" onclick="girarRuleta()" style="font-size:1.1rem;padding:1rem 2rem">¡Girar! \${d.girosGratis>0?'('+d.girosGratis+' disponibles)':'🆓 1 gratis'}</button>
        <div id="ruleta-result" style="margin-top:1rem;font-size:1.2rem;font-weight:700;color:var(--gold)"></div>
      </div>
      <div class="section-card card" style="margin-top:1rem">
        <div class="card-title">Premios Disponibles</div>
        <div class="card-row"><span>💰 Saldo $5</span><span class="badge badge-blue">Común</span></div>
        <div class="card-row"><span>🎫 10% desc. próxima cita</span><span class="badge badge-blue">Común</span></div>
        <div class="card-row"><span>⭐ ⭐ Saldo $20</span><span class="badge badge-gold">Raro</span></div>
        <div class="card-row"><span>🏆 20% desc. Tattoo VIP</span><span class="badge badge-gold">Raro</span></div>
        <div class="card-row"><span>👑 Saldo $100</span><span class="badge badge-green">Épico</span></div>
        <div class="card-row"><span>🎁 Combo: Tattoo + Barbería gratis</span><span class="badge badge-red">Legendario</span></div>
      </div>
    \`;
  } catch(e) { return '<div class="alert alert-error">Error</div>'; }
}

// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
function renderAdmin(root) {
  root.innerHTML = \`
    <div class="page-header">
      <div class="page-title">PANEL ADMIN</div>
      <button class="btn btn-sm btn-outline" onclick="s('view','login')">← Volver</button>
    </div>
    <div class="page-body animate">
      \${state.adminStep===1?\`
        <div class="glass-card" style="max-width:400px;margin:2rem auto;padding:2rem">
          <div class="card-title" style="text-align:center;margin-bottom:1.5rem">🔒 Acceso Admin</div>
          \${state.loginError?\`<div class="alert alert-error">\${state.loginError}</div>\`:''}
          <form onsubmit="handleAdminLogin(event)">
            <div class="input-group"><label>Contraseña</label><input class="input" id="a-pass" type="password" placeholder="••••••••" required></div>
            <button type="submit" class="btn btn-gold" style="width:100%">Entrar</button>
          </form>
        </div>
      \`:\`
        <div class="grid-3" style="margin-bottom:1.5rem">
          <div class="glass-card section-card stat-card"><div class="stat-value">\${state.stats?.usuarios||0}</div><div class="stat-label">Usuarios</div></div>
          <div class="glass-card section-card stat-card"><div class="stat-value">\${state.stats?.citas||0}</div><div class="stat-label">Citas</div></div>
          <div class="glass-card section-card stat-card"><div class="stat-value">$\${state.stats?.ingresos?.toFixed(0)||0}</div><div class="stat-label">Ingresos</div></div>
        </div>
        <div class="nav-tabs">
          <button class="nav-tab \${state.adminTab==='usuarios'?'active':''}" onclick="s('adminTab','usuarios')">Usuarios</button>
          <button class="nav-tab \${state.adminTab==='citas'?'active':''}" onclick="s('adminTab','citas')">Citas</button>
          <button class="nav-tab \${state.adminTab==='crear'?'active':''}" onclick="s('adminTab','crear')">+ Crear Cita</button>
        </div>
        \${state.adminTab==='usuarios'?renderAdminUsers():state.adminTab==='citas'?renderAdminCitas():renderAdminCrear()}
      \`}
    </div>
  \`;
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pass = document.getElementById('a-pass').value;
  if (pass === ADMIN_PASS) { s('adminStep', 2); s('loginError', ''); loadAdminStats(); }
  else s('loginError', 'Contraseña incorrecta');
}

async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const d = await res.json();
    s('stats', d);
  } catch(e) {}
}

function renderAdminUsers() {
  const u = cu();
  return \`<div class="section-card card">\${(state.stats?.usuariosLista||[]).map(u=>\`
    <div class="card-row">
      <div><div style="font-weight:600">\${u.nombre}</div><div style="font-size:0.8rem;color:var(--gray-lt)">\${u.email}</div></div>
      <span class="badge badge-gold">\${u.nivel}</span>
    </div>
  \`).join('')||'Cargando...'}</div>\`;
}

function renderAdminCitas() {
  return \`<div class="section-card card">\${(state.stats?.citasLista||[]).map(c=>\`
    <div class="card-row">
      <div><div style="font-weight:600">\${c.servicio}</div><div style="font-size:0.8rem;color:var(--gray-lt)">\${c.artista} — \${formatDate(c.fecha)}</div></div>
      <span class="badge badge-\${c.estado==='confirmada'?'green':'red'}">\${c.estado}</span>
    </div>
  \`).join('')||'Sin citas'}</div>\`;
}

function renderAdminCrear() {
  return \`
    <form class="glass-card section-card" onsubmit="adminCrearCita(event)">
      <div class="card-title" style="margin-bottom:1rem">📅 Nueva Cita</div>
      <div class="grid-2">
        <div class="input-group"><label>Email cliente</label><input class="input" id="a-r-email" type="email" placeholder="cliente@email.com" required></div>
        <div class="input-group"><label>Servicio</label><input class="input" id="a-r-svc" type="text" placeholder="Tattoo" required></div>
        <div class="input-group"><label>Artista</label><input class="input" id="a-r-artista" type="text" placeholder="NELSON" required></div>
        <div class="input-group"><label>Precio USD</label><input class="input" id="a-r-precio" type="number" step="0.01" placeholder="0.00"></div>
        <div class="input-group"><label>Fecha</label><input class="input" id="a-r-fecha" type="datetime-local" required></div>
      </div>
      <button type="submit" class="btn btn-gold" style="margin-top:1rem;width:100%">Crear Reserva</button>
    </form>
  \`;
}

async function adminCrearCita(e) {
  e.preventDefault();
  const email = document.getElementById('a-r-email').value;
  const svc = document.getElementById('a-r-svc').value;
  const artista = document.getElementById('a-r-artista').value;
  const precio = parseFloat(document.getElementById('a-r-precio').value) || 0;
  const fecha = document.getElementById('a-r-fecha').value;
  try {
    const res = await fetch('/api/admin/crear-cita', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, svc, artista, precio, fecha })
    });
    const d = await res.json();
    if (d.ok) { alert('✅ Reserva creada'); loadAdminStats(); }
    else alert('❌ ' + (d.error||'Error'));
  } catch(e) { alert('Error de conexión'); }
}

// ═══════════════════════════════════════════════════════════════
// ARTIST PORTAL
// ═══════════════════════════════════════════════════════════════
function renderArtist(root) {
  root.innerHTML = \`
    <div class="page-header">
      <div class="page-title">🎨 PORTAL ARTISTA</div>
      <button class="btn btn-sm btn-outline" onclick="s('view','login')">← Volver</button>
    </div>
    <div class="page-body animate">
      \${state.artistStep===1?\`
        <div class="glass-card" style="max-width:400px;margin:2rem auto;padding:2rem">
          <div class="card-title" style="text-align:center;margin-bottom:1.5rem">Ingresa tu código de artista</div>
          \${state.loginError?\`<div class="alert alert-error">\${state.loginError}</div>\`:''}
          <form onsubmit="handleArtistLogin(event)">
            <div class="input-group"><label>Código</label><input class="input" id="art-code" type="text" placeholder="NELSON / JAMES / JC..." maxlength="10" required style="text-transform:uppercase;text-align:center;font-size:1.2rem;letter-spacing:4px"></div>
            <button type="submit" class="btn btn-gold" style="width:100%">Entrar</button>
          </form>
        </div>
      \`:\`
        <h2 style="color:var(--gold);margin-bottom:1.5rem">👋 Bienvenido, \${state.artistStep}</h2>
        <div class="nav-tabs">
          <button class="nav-tab active">Hoy</button>
          <button class="nav-tab">Historial</button>
        </div>
        <div class="section-card card">
          <div class="card-title">Citas de hoy</div>
          <div id="artist-citas">Cargando...</div>
        </div>
      \`}
    </div>
  \`;
}

function handleArtistLogin(e) {
  e.preventDefault();
  const code = document.getElementById('art-code').value.trim().toUpperCase();
  if (ARTIST_CODES.includes(code)) { s('artistStep', code); s('loginError', ''); loadArtistCitas(code); }
  else s('loginError', 'Código inválido');
}

async function loadArtistCitas(artista) {
  try {
    const res = await fetch('/api/artist/citas?artista=' + artista);
    const d = await res.json();
    const el = document.getElementById('artist-citas');
    if (el) el.innerHTML = d.citas?.length ? d.citas.map(c=>\`
      <div class="card-row"><div><div style="font-weight:600">\${c.servicio}</div><div style="font-size:0.8rem;color:var(--gray-lt)">\${c.cliente} — \${c.hora}</div></div><span class="badge badge-\${c.estado==='confirmada'?'green':'yellow'}">\${c.estado}</span></div>
    \`).join('') : '<div style="text-align:center;color:var(--gray-lt);padding:1rem">Sin citas hoy</div>';
  } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
function hoy() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) { if (!d) return ''; return new Date(d).toLocaleDateString('es-ES', { weekday:'short',month:'short',day:'numeric'}); }
function nivelProgreso(p) {
  const niveles = [{n:'BRONCE',min:0},{n:'PLATA',min:100},{n:'ORO',min:300},{n:'PLATINO',min:600},{n:'DIAMANTE',min:1000}];
  let actual = niveles[0], sig = niveles[1];
  for (let i = niveles.length-1; i >= 0; i--) { if (p >= niveles[i].min) { actual = niveles[i]; sig = niveles[i+1]||null; break; } }
  const puntosSig = sig ? sig.min : actual.min + 500;
  return { nivel: actual.n, puntosActuales: p, puntosNecesarios: puntosSig, progreso: Math.min(100, ((p - actual.min) / (puntosSig - actual.min)) * 100) };
}
function starsProgreso(s) { return { estrellas: s, siguiente: s + 1, progreso: Math.min(100, (s % 10) * 10) }; }
function copyRef() { const c = document.getElementById('ref-code')?.textContent; if (c) navigator.clipboard.writeText(c).then(() => alert('Código copiado!')); }
function confetti(color1, color2) {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  const particles = [];
  const colors = [color1||'#D4AF37', color2||'#F5D77A', '#0057D9', '#fff'];
  for (let i = 0; i < 100; i++) {
    particles.push({ x: Math.random()*canvas.width, y: -20, vx: (Math.random()-0.5)*4, vy: Math.random()*4+2, color: colors[Math.floor(Math.random()*colors.length)], size: Math.random()*8+4, life: 1 });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.01;
      if (p.life > 0) { ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
    });
    frame++;
    if (frame < 120) requestAnimationFrame(draw);
    else canvas.style.display = 'none';
  }
  draw();
}
function girarRuleta() {
  const result = document.getElementById('ruleta-result');
  if (result) { result.textContent = '🎰 Girando...'; confetti(); setTimeout(() => { const premios = ['💰 Saldo $5','⭐⭐ Saldo $20','👑 Saldo $100','🎫 10% desc.','🎁 Combo gratis']; result.textContent = '🎉 ¡Ganaste: ' + premios[Math.floor(Math.random()*premios.length)] + '!'; }, 1500); }
}
  </script>
</body>
</html>`;

// ═══════════════════════════════════════════════════════════════
// WORKER HANDLER
// ═══════════════════════════════════════════════════════════════
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // API Routes
    if (path.startsWith('/api/')) {
      return handleAPI(request, env, ctx);
    }

    // Serve HTML
    return new Response(HTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      }
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// API HANDLER
// ═══════════════════════════════════════════════════════════════
async function handleAPI(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const userId = request.headers.get('x-user-id');
  const json = { 'Content-Type': 'application/json' };

  try {
    // Auth
    if (path === '/api/auth' && request.method === 'POST') {
      const { email, pass, nombre, tel, ref, mode } = await request.json();
      if (!email || !pass) return new Response(JSON.stringify({ error: 'Faltan campos' }), { status: 400, headers: json });

      if (mode === 'registro') {
        if (!nombre) return new Response(JSON.stringify({ error: 'Nombre requerido' }), { status: 400, headers: json });
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) return new Response(JSON.stringify({ error: 'Email ya registrado' }), { status: 400, headers: json });

        const hash = await hashPassword(pass);
        const nivel = 'BRONCE';
        const now = new Date().toISOString();
        await env.DB.prepare('INSERT INTO users (email, nombre, telefono, password, nivel, visitas, score, activo, created_at) VALUES (?,?,?,?,?,?,?,?,?)')
          .bind(email, nombre, tel || '', hash, nivel, 0, 0, 1, now).run();

        // Crear wallet y referral
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        await env.DB.prepare('INSERT INTO wallets (user_id, saldo, saldo_congelado, created_at) VALUES (?,?,?,?)').bind(user.id, 0, 0, now).run();
        const refCode = generarCodigo();
        await env.DB.prepare('INSERT INTO referral_codes (user_id, codigo, created_at) VALUES (?,?,?)').bind(user.id, refCode, now).run();

        // Process referral
        if (ref) {
          const refUser = await env.DB.prepare('SELECT * FROM users WHERE id IN (SELECT user_id FROM referral_codes WHERE codigo = ?)').bind(ref.toUpperCase()).first();
          if (refUser) {
            await env.DB.prepare('UPDATE wallets SET saldo = saldo + 5 WHERE user_id = ?').bind(user.id).run();
            await env.DB.prepare('UPDATE wallets SET saldo = saldo + 5 WHERE user_id = ?').bind(refUser.id).run();
            await env.DB.prepare('INSERT INTO transactions (wallet_id, tipo, monto, descripcion, created_at) SELECT id, ?, 5, ?, ? FROM wallets WHERE user_id = ?')
              .bind('referral_bonus', 'Bono por referido', now, user.id).run();
          }
        }

        return new Response(JSON.stringify({ ok: true, user: { id: user.id, email: user.email, nombre: user.nombre, nivel: user.nivel } }), { headers: json });
      } else {
        const hash = await hashPassword(pass);
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password = ?').bind(email, hash).first();
        if (!user) return new Response(JSON.stringify({ error: 'Email o contraseña incorrectos' }), { status: 401, headers: json });
        return new Response(JSON.stringify({ ok: true, user: { id: user.id, email: user.email, nombre: user.nombre, nivel: user.nivel } }), { headers: json });
      }
    }

    // Dashboard
    if (path === '/api/dashboard' && userId) {
      const wallet = await env.DB.prepare('SELECT saldo FROM wallets WHERE user_id = ?').bind(userId).first();
      const citas = await env.DB.prepare('SELECT * FROM appointments WHERE user_id = ? AND fecha >= ? ORDER BY fecha ASC LIMIT 5').bind(userId, new Date().toISOString()).all();
      const user = await env.DB.prepare('SELECT score FROM users WHERE id = ?').bind(userId).first();
      return new Response(JSON.stringify({ saldo: wallet?.saldo || 0, puntos: user?.score || 0, proximasCitas: citas.results?.length || 0, citasProximas: citas.results || [] }), { headers: json });
    }

    // Wallet
    if (path === '/api/wallet' && userId) {
      const wallet = await env.DB.prepare('SELECT * FROM wallets WHERE user_id = ?').bind(userId).first();
      const txns = await env.DB.prepare('SELECT * FROM transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 20').bind(wallet?.id).all();
      return new Response(JSON.stringify({ saldo: wallet?.saldo || 0, transacciones: txns.results || [] }), { headers: json });
    }

    // Referrals
    if (path === '/api/referrals' && userId) {
      const refCode = await env.DB.prepare('SELECT codigo FROM referral_codes WHERE user_id = ?').bind(userId).first();
      const refs = await env.DB.prepare('SELECT u.nombre FROM users u WHERE u.id IN (SELECT referred_by FROM referral_users WHERE referrer_id = ?)').bind(userId).all();
      return new Response(JSON.stringify({ codigo: refCode?.codigo || 'N/A', total: refs.results?.length || 0, referidos: refs.results || [] }), { headers: json });
    }

    // Gamification
    if (path === '/api/gamification' && userId) {
      const streak = await env.DB.prepare('SELECT * FROM streaks WHERE user_id = ?').bind(userId).first();
      return new Response(JSON.stringify({ estrellas: streak?.estrellas || 0, girosGratis: Math.floor((streak?.estrellas || 0) / 50), racha: streak?.dias_racha || 0 }), { headers: json });
    }

    // Admin stats
    if (path === '/api/admin/stats') {
      const usuarios = await env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      const citas = await env.DB.prepare('SELECT * FROM appointments ORDER BY fecha DESC LIMIT 20').all();
      const ingresos = await env.DB.prepare('SELECT SUM(monto) as total FROM transactions WHERE monto > 0').first();
      return new Response(JSON.stringify({ usuarios: usuarios.results?.length || 0, citas: citas.results?.length || 0, ingresos: ingresos?.total || 0, usuariosLista: usuarios.results || [], citasLista: citas.results || [] }), { headers: json });
    }

    // Admin crear cita
    if (path === '/api/admin/crear-cita' && request.method === 'POST') {
      const { email, svc, artista, precio, fecha } = await request.json();
      const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
      if (!user) return new Response(JSON.stringify({ ok: false, error: 'Usuario no encontrado' }), { status: 404, headers: json });
      const now = new Date().toISOString();
      await env.DB.prepare('INSERT INTO appointments (user_id, servicio, artista, precio, fecha, estado, created_at) VALUES (?,?,?,?,?,?,?)')
        .bind(user.id, svc, artista, precio || 0, fecha, 'confirmada', now).run();
      return new Response(JSON.stringify({ ok: true }), { headers: json });
    }

    // Artist citas
    if (path === '/api/artist/citas' && url.searchParams.get('artista')) {
      const artista = url.searchParams.get('artista');
      const hoy = new Date().toISOString().split('T')[0];
      const citas = await env.DB.prepare("SELECT a.*, u.nombre as cliente FROM appointments a JOIN users u ON a.user_id = u.id WHERE a.artista = ? AND DATE(a.fecha) = ? ORDER BY a.fecha ASC").bind(artista, hoy).all();
      return new Response(JSON.stringify({ citas: citas.results || [] }), { headers: json });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: json });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: json });
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
async function hashPassword(p) {
  const encoder = new TextEncoder();
  const data = encoder.encode(p + '___es_vip');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

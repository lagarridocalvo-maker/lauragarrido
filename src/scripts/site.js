// Interacciones de la web: botones con punto, luces que siguen al ratón,
// formularios hacia Google Sheets y aviso de cookies.

const puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- Botones "hablamos": el punto sigue al ratón ----------
document.querySelectorAll('.hablamos').forEach((btn) => {
  const punto = btn.querySelector('.punto');
  const txt = btn.querySelector('.txt');
  if (!punto || !txt) return;
  const reposo = () => {
    punto.style.transform = 'translate(0px,0px) scale(0.45)';
    txt.style.transform = 'translate(0px,0px)';
  };
  reposo();
  if (!puedeHover) return;
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const dx = Math.round((e.clientX - (r.right - 44)) * 0.5);
    const dy = Math.round((e.clientY - (r.top + r.height / 2)) * 0.5);
    punto.style.transform = `translate(${dx}px,${dy}px) scale(1.7)`;
    txt.style.transform = `translate(${dx * 0.35}px,${dy * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', reposo);
});

// ---------- Luz dentro de cada punto 01–03 ----------
document.querySelectorAll('.punto3').forEach((el) => {
  const luz = el.querySelector('.luz3');
  if (!luz || !puedeHover) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    luz.style.opacity = '1';
    luz.style.transform = `translate(${Math.round(e.clientX - r.left)}px,${Math.round(e.clientY - r.top)}px)`;
  });
  el.addEventListener('mouseleave', () => {
    luz.style.opacity = '0';
  });
});

// ---------- Luz que sigue al ratón en un contenedor (FAQ y listas) ----------
function luzContenedor(contSel, luzSel, itemSel) {
  document.querySelectorAll(contSel).forEach((cont) => {
    const luz = cont.querySelector(luzSel);
    if (!luz || !puedeHover) return;
    cont.querySelectorAll(itemSel).forEach((item) => {
      item.addEventListener('mousemove', (e) => {
        const r = cont.getBoundingClientRect();
        luz.style.opacity = '1';
        luz.style.transform = `translate(${Math.round(e.clientX - r.left)}px,${Math.round(e.clientY - r.top)}px)`;
      });
      item.addEventListener('mouseleave', () => {
        luz.style.opacity = '0';
      });
    });
  });
}
luzContenedor('.faq', '.luzfaq', 'summary');
luzContenedor('.lista', '.luzlista', '.suelto');

// ---------- Formularios → Google Sheets ----------
document.querySelectorAll('form[data-form] input[name="privacidad"]').forEach((chk) => {
  const aviso = () => chk.setCustomValidity(chk.checked ? '' : 'Marca esta casilla para poder enviarlo.');
  aviso();
  chk.addEventListener('change', aviso);
});

document.querySelectorAll('form[data-form]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const error = form.querySelector('.form-error');
    const boton = form.querySelector('button[type="submit"]');
    if (error) error.hidden = true;
    if (boton) boton.disabled = true;
    const datos = new URLSearchParams(new FormData(form));
    if (!datos.has('emails')) datos.set('emails', 'no');
    try {
      await fetch(form.action, { method: 'POST', mode: 'no-cors', body: datos });
      window.location.href = '/gracias';
    } catch (err) {
      if (error) error.hidden = false;
      if (boton) boton.disabled = false;
    }
  });
});

// ---------- Cookies ----------
const CLAVE = 'lg_cookies_v1';
const ajustes = window.LG_AJUSTES || {};
const aviso = document.getElementById('ck-aviso');
const config = document.getElementById('ck-config');
const chkAnalitica = document.getElementById('ck-analitica');
const chkPublicidad = document.getElementById('ck-publicidad');

function leerEleccion() {
  try {
    const e = JSON.parse(localStorage.getItem(CLAVE) || 'null');
    // La elección dura 12 meses; después se vuelve a preguntar.
    if (e && Date.now() - new Date(e.fecha).getTime() > 365 * 24 * 3600 * 1000) return null;
    return e;
  } catch (e) {
    return null;
  }
}

function guardarEleccion(analitica, publicidad) {
  const eleccion = { analitica, publicidad, fecha: new Date().toISOString() };
  try {
    localStorage.setItem(CLAVE, JSON.stringify(eleccion));
  } catch (e) { /* sin almacenamiento: se aplica solo en esta visita */ }
  aplicar(eleccion);
  aviso.hidden = true;
  config.hidden = true;
}

let gaCargado = false;
let pixelCargado = false;

function aplicar(eleccion) {
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      analytics_storage: eleccion.analitica ? 'granted' : 'denied',
      ad_storage: eleccion.publicidad ? 'granted' : 'denied',
      ad_user_data: eleccion.publicidad ? 'granted' : 'denied',
      ad_personalization: eleccion.publicidad ? 'granted' : 'denied',
    });
  }
  if (eleccion.analitica && ajustes.ga4 && !gaCargado) {
    gaCargado = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ajustes.ga4);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', ajustes.ga4);
  }
  if (eleccion.publicidad && ajustes.pixel && !pixelCargado) {
    pixelCargado = true;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', ajustes.pixel);
    window.fbq('track', 'PageView');
  }
}

function abrirConfig() {
  const e = leerEleccion() || { analitica: false, publicidad: false };
  chkAnalitica.checked = !!e.analitica;
  chkPublicidad.checked = !!e.publicidad;
  aviso.hidden = true;
  config.hidden = false;
  config.querySelector('button').focus();
}

document.querySelectorAll('[data-ck]').forEach((b) => {
  b.addEventListener('click', () => {
    const accion = b.dataset.ck;
    if (accion === 'aceptar') guardarEleccion(true, true);
    else if (accion === 'rechazar') guardarEleccion(false, false);
    else if (accion === 'configurar') abrirConfig();
    else if (accion === 'guardar') guardarEleccion(chkAnalitica.checked, chkPublicidad.checked);
  });
});

document.querySelectorAll('a[href="#configurar-cookies"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    abrirConfig();
  });
});

const previa = leerEleccion();
if (previa) aplicar(previa);
else aviso.hidden = false;

// ---------- Menú móvil (tres rayas) ----------
(() => {
  const barra = document.querySelector('header > div');
  const nav = barra && barra.querySelector('nav');
  if (!nav) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-btn';
  btn.setAttribute('aria-label', 'Abrir menú');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'menu-movil');
  btn.innerHTML = '<span aria-hidden="true"></span>';
  barra.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'menu-movil';
  panel.id = 'menu-movil';
  const enlaces = [...nav.querySelectorAll('a')].map((a) => {
    const actual = a.getAttribute('href') !== '/' && location.pathname.startsWith(a.getAttribute('href'));
    return `<a href="${a.getAttribute('href')}"${actual ? ' aria-current="page"' : ''}>${a.textContent}</a>`;
  }).join('');
  const hablamos = document.getElementById('hablamos') ? '#hablamos' : '/#hablamos';
  panel.innerHTML = `<nav aria-label="Menú">${enlaces}</nav>
    <div><a class="menu-hablamos" href="${hablamos}">Hablamos <span aria-hidden="true">↘</span></a>
    <p class="menu-contacto">WhatsApp <a href="https://wa.me/34665130173">+34 665 130 173</a></p></div>`;
  document.body.appendChild(panel);

  const abrir = (si) => {
    document.documentElement.classList.toggle('menu-abierto', si);
    btn.setAttribute('aria-expanded', String(si));
    btn.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
  };
  btn.addEventListener('click', () => abrir(!document.documentElement.classList.contains('menu-abierto')));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) abrir(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') abrir(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) abrir(false); });
})();

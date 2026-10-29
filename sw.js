/* sw.js — CBVI Revisiones Técnicas · caché v1-6
   ESTRATEGIA: network-first para los archivos propios (siempre la versión más
   nueva cuando hay señal) y caché como respaldo cuando no hay red — Inírida
   tiene cobertura parcial y zonas rurales sin señal por días.
   index.html solo se usa como respaldo en NAVEGACIONES (req.mode==='navigate'),
   nunca para JS/CSS: devolver HTML donde se espera un script rompe la app.
   REGLA: subir la versión del CACHE en cada cambio del front (v1-0, v1-1, …). */
var CACHE = "cbvi-revisiones-v1-6";
var ASSETS = [
  "./", "./index.html", "./verificar.html", "./manifest.json",
  "./form-inspeccion.js?v=1.6", "./guias.js?v=1.6", "./logos.js?v=1.6",
  "./form-inspeccion.js", "./guias.js", "./logos.js",
  "./icon192.png", "./icon512.png", "./iconmaskable192.png", "./iconmaskable512.png"
];

/* Librerias externas: SIN ellas no hay PDF, ni QR, ni mapa, ni firmas.
   Son direcciones con version fija (nunca cambian), asi que se guardan una
   vez y se sirven desde la tablet. Sin esto, en zona sin senal el inspector
   se queda sin certificado — justo donde mas falta hace. */
var LIBS = [
  "https://cdnjs.cloudflare.com/ajax/libs/signature_pad/4.1.7/signature_pad.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
];
function esLib(url){ return LIBS.indexOf(url) >= 0 || url.indexOf("cdnjs.cloudflare.com") > -1
  || url.indexOf("fonts.googleapis.com") > -1 || url.indexOf("fonts.gstatic.com") > -1; }

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll falla entero si un archivo falta; se agregan uno por uno
      return Promise.all(ASSETS.concat(LIBS).map(function (u) {
        return c.add(u).catch(function () { return null; });
      }));
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;                       // nunca cachear POST al backend
  var url = new URL(req.url);

  /* Librerias y tipografias externas: CACHE PRIMERO.
     Las URL llevan version fija, asi que lo guardado siempre sirve; y si no
     hay senal, el PDF, el QR, el mapa y las firmas siguen funcionando. */
  if (url.origin !== self.location.origin) {
    if (!esLib(req.url)) return;                          // Apps Script y mapas: directo a la red
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) {
            var copia = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copia); });
          }
          return res;
        });
      })
    );
    return;
  }

  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Sin conexión" });
      });
    })
  );
});

self.addEventListener("message", function (e) {
  if (e.data === "skipWaiting") self.skipWaiting();
});

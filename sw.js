/* sw.js — CBVI Revisiones Técnicas · caché v1-24
   ESTRATEGIA: network-first para los archivos propios (siempre la versión más
   nueva cuando hay señal) y caché como respaldo cuando no hay red — Inírida
   tiene cobertura parcial y zonas rurales sin señal por días.
   index.html solo se usa como respaldo en NAVEGACIONES (req.mode==='navigate'),
   nunca para JS/CSS: devolver HTML donde se espera un script rompe la app.
   REGLA: subir la versión del CACHE en cada cambio del front (v1-0, v1-1, …). */
var CACHE = "cbvi-revisiones-v1-24";
var ASSETS = [
  "./", "./index.html", "./verificar.html", "./landing.html", "./manifest.json",
  "./form-inspeccion.js?v=1.24", "./guias.js?v=1.24", "./logos.js?v=1.24", "./fuentes-pdf.js?v=1.24",
  "./form-inspeccion.js", "./guias.js", "./logos.js", "./fuentes-pdf.js",
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
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"       // lector de QR (v1.23: archivo real, con huella)
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
        /* v1.23: la página pide las librerías con verificación de integridad
           (modo cors). Una copia vieja "opaca" no sirve para eso: se baja de nuevo. */
        if (hit && !(hit.type === "opaque" && req.mode === "cors")) return hit;
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

  /* v1.23: red primero, pero sin esperar para siempre. Con señal débil la
     petición quedaba colgada y la app tardaba en abrir. Si en 3,5 s no hay
     respuesta y hay copia guardada, se usa la copia; la red sigue y deja la
     copia al día para la próxima vez. */
  /* v1.23: los .js propios van con ?v=X.Y y no cambian dentro de una versión:
     si ya están guardados se sirven al instante (antes cada uno esperaba otros
     3,5 s con señal débil). Al subir la versión cambia la dirección y se bajan. */
  if (/[?&]v=/.test(url.search)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); }
        return res;
      });
    }));
    return;
  }
  var nav = req.mode === "navigate";
  var red = fetch(req).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  });
  e.waitUntil(red.catch(function () {}));
  var copia = function () {
    return caches.match(req, { ignoreSearch: nav }).then(function (hit) {
      if (hit || !nav) return hit;
      return caches.match(url.pathname.indexOf("verificar.html") > -1 ? "./verificar.html" : "./index.html");
    });
  };
  e.respondWith(new Promise(function (resolver) {
    var listo = false;
    var dar = function (r) { if (!listo) { listo = true; resolver(r); } };
    var tope = setTimeout(function () { copia().then(function (hit) { if (hit) dar(hit); }); }, 3500);
    red.then(function (res) { clearTimeout(tope); dar(res); })
      .catch(function () {
        clearTimeout(tope);
        copia().then(function (hit) { dar(hit || new Response("", { status: 504, statusText: "Sin conexión" })); });
      });
  }));
});

self.addEventListener("message", function (e) {
  if (e.data === "skipWaiting") self.skipWaiting();
});

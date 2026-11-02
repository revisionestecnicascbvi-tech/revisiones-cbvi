/* guias.js — Ayudas para el inspector (y para cualquier bombero).
   GUIAS: texto gris de orientación por ítem.
   DIAGRAMS: {titulo, svg, tips} por tema — diagrama claro + explicación.
   ITEM_TOPIC: qué diagrama mostrar en cada ítem.
   OCUP_QUICK: atajos por tipo de negocio -> ocupación NSR-10 + riesgo sugerido.
   Los SVG usan currentColor para el trazo (se adaptan al tema). */

window.GUIAS = {
  "ocupacion":"Es el USO del local. Si no lo sabes, usa los atajos de abajo (tienda, restaurante, hotel…) y la app pone el código.",
  "clasifRiesgo":"Qué tan peligroso es por lo que guarda y hace: Bajo (oficina, tienda pequeña), Moderado (restaurante, bodega, hotel), Alto/Especial (bar lleno, gas, químicos).",
  "m2_num":"Cuenta cuántas personas trabajan en el establecimiento.",
  "m2_comp":"Marca la composición del personal; influye en la evacuación.",
  "m3_cumple":"¿Arreglaron lo recomendado en la visita anterior? Si es la primera visita, marca «Primera visita»: no suma, no resta ni sale como hallazgo.",
  "m3_emerg":"¿Hubo incendio u otra emergencia en el último año?",
  "m3_sistemas":"Si hubo emergencia, ¿funcionaron extintores/alarmas/salidas?",
  "m4_tipo":"Mira de qué está hecha la estructura: concreto resiste más; madera/aglomerado, menos. Si hay más de un material (ej. paredes de cemento y techo de madera), marca 'Mixta': puntúa igual que el menos resistente de los que tenga.",
  "m4_propv":"¿Qué tan fácil subiría el fuego entre pisos? (ductos, vacíos, escaleras sin puerta).",
  "m4_proph":"¿Qué tan fácil se correría el fuego en el mismo piso? (mucho material junto, sin muros).",
  "m4_suelo":"¿El uso del suelo permite esta actividad aquí? (consulta POT/planeación).",
  "m4_altura":"Número de pisos sobre el nivel de la calle.",
  "m4_areapiso":"Área aproximada de cada piso en m² (usa el flexómetro).",
  "m5_almac":"Altura a la que apilan la mercancía. Más de 3 m dificulta apagar y evacuar.",
  "m5_fuentes":"Marca SOLO lo que veas presente. Si no hay ninguna fuente, no marques nada (suma el punto) y la pregunta de activación se da por Bajo.",
  "m5_activ":"¿Qué tan probable es que esas fuentes enciendan algo? (cercanía a combustibles).",
  "m5_inflam":"¿Los materiales del local arden fácil? (telas, papel, espuma = alta).",
  "m6_deter":"Busca cables pelados, tomas quemadas, cajas sin tapa.",
  "m6_estado":"Instalación ordenada, entubada, sin empalmes a la vista = buen estado.",
  "m6_uso":"¿Usan bien la instalación o hay 'pulpos'/extensiones sobrecargadas?",
  "m6_sobre":"¿Hay breakers/tacos (protección contra sobrecarga)?",
  "m6_retie":"¿Tienen dictamen o revisión eléctrica RETIE reciente?",
  "m7_requiere":"Casi todo comercio requiere extintores según NSR-10.",
  "m7_cuenta":"¿Hay extintores en el local? Si respondes NO, las demás preguntas de extintores se omiten y cuentan como NO.",
  "m7_aprop":"El tipo (ABC, CO₂…) debe servir para el riesgo del lugar (cocina, eléctrico…).",
  "m7_distrib":"Deben alcanzarse caminando poco (recorrido máx. ~15 m).",
  "m7_senal":"Señal visible sobre cada extintor.",
  "m7_visible":"Nada tapándolos ni cajas encima; a la vista.",
  "m7_instal":"Colgados a la altura correcta (ver diagrama).",
  "m7_recarga":"Mira la etiqueta: recarga de menos de 1 año y manómetro en verde.",
  "m7_fisico":"Sin golpes, óxido, manguera rota ni seguro suelto.",
  "m8_aplica":"Si el local es muy pequeño y de bajo aforo, puede no aplicar; marca 'No aplica'.",
  "m8_egreso":"Salidas/puertas por donde la gente puede salir en emergencia.",
  "m8_visible":"Señal de SALIDA visible (ver diagrama).",
  "m8_despej":"Rutas y salidas sin cajas, mesas ni candados (ver diagrama).",
  "m8_ilum":"Luz que prende sola si se va la energía (ver diagrama).",
  "m8_movil":"¿Puede salir alguien en silla de ruedas o con muletas?",
  "m8_aforo":"Cuántas personas caben/atienden al tiempo.",
  "m8_anchocorr":"Mide el ancho del pasillo. Ideal ≥ 1,20 m (ver diagrama).",
  "m8_anchopuerta":"Mide el ancho libre de la puerta. Ideal ≥ 1,20 m.",
  "m8_luces":"¿Hay lámparas de emergencia instaladas?",
  "m8_descext":"La gente debe terminar saliendo a la calle o a un sitio seguro.",
  "m9_aplica":"Locales grandes o de alto riesgo deben tener plan. Pequeños pueden no aplicar.",
  "m9_plan":"Documento con qué hacer en emergencia, rutas y responsables.",
  "m9_simul":"¿Han hecho un simulacro de evacuación en el último año?",
  "m9_brigada":"¿Hay personas capacitadas para primera respuesta?",
  "m10_seguro":"¿Tienen póliza de incendio vigente? Si respondes NO, la cobertura y la aseguradora se omiten."
};

/* Atajos: el inspector elige el tipo de negocio y la app pone ocupación + riesgo */
window.OCUP_QUICK = [
  {label:"Tienda / minimercado", ocup:"C-1", riesgo:"Bajo"},
  {label:"Restaurante / comidas", ocup:"C-1", riesgo:"Moderado"},
  {label:"Droguería", ocup:"C-1", riesgo:"Bajo"},
  {label:"Oficina / servicios", ocup:"C-1", riesgo:"Bajo"},
  {label:"Bodega / depósito", ocup:"A-2", riesgo:"Moderado"},
  {label:"Ferretería", ocup:"A-2", riesgo:"Moderado"},
  {label:"Taller", ocup:"A-2", riesgo:"Moderado"},
  {label:"Hotel / hospedaje", ocup:"R-3", riesgo:"Moderado"},
  {label:"Colegio / jardín", ocup:"I-3", riesgo:"Moderado"},
  {label:"Iglesia", ocup:"L-4", riesgo:"Moderado"},
  {label:"Bar / discoteca", ocup:"L-3", riesgo:"Alto"},
  {label:"Gas / combustibles", ocup:"P", riesgo:"Especial"}
];

/* =========================================================================
   GUÍAS VISUALES "¿Cómo lo reviso?" (v1.19)
   Cada tema: {titulo, svg, pasos[], cumple[], noCumple[], okT?, noT?, ref?}
     pasos     = cómo revisarlo en el local, en orden.
     cumple    = lo que el inspector debe ver para marcar la opción buena.
     noCumple  = lo que obliga a marcar la opción mala.
     okT / noT = rótulos de las dos columnas cuando no es SI/NO (ej. riesgo
                 Bajo / Alto). Por defecto "Cumple si" / "No cumple si".
     ref       = norma de referencia (texto corto).
   Los SVG son estáticos (sin datos del usuario) y usan currentColor y los
   tokens del tema (--verde, --rojo, --ambar, --azul, --muted), así se ven
   bien en claro, oscuro y modo sol. Los helpers van dentro de un IIFE (no
   quedan globales); solo S y T siguen globales por compatibilidad.
   ========================================================================= */
window.ITEM_TOPIC = {
  /* M3 */ "m3_cumple":"antecedentes","m3_reporte":"antecedentes",
  /* M4 */ "m4_nueva":"licencias","m4_nsr":"licencias","m4_remod":"licencias","m4_lic":"licencias","m4_suelo":"licencias",
           "m4_tipo":"estructura","m4_propv":"propagacion","m4_proph":"propagacion",
           "m4_altura":"edificacion","m4_areapiso":"edificacion","m4_nsub":"edificacion","m4_areasub":"edificacion","m4_actsub":"edificacion",
           "m4_ocup500":"aforo","m4_ocup100":"edificacion",
  /* M5 */ "m5_almac":"almacenamiento","m5_fuentes":"fuentes","m5_activ":"activacion","m5_inflam":"inflamabilidad",
  /* M6 */ "m6_deter":"electrico","m6_estado":"electrico","m6_uso":"electrico_uso","m6_sobre":"electrico_proteccion","m6_retie":"retie",
  /* M7 */ "m7_requiere":"extintor_tipo","m7_cuenta":"extintor_tipo","m7_aprop":"extintor_tipo",
           "m7_distrib":"extintor_distrib","m7_senal":"senalizacion","m7_visible":"extintor_visible","m7_instal":"extintor_altura",
           "m7_recarga":"extintor_recarga","m7_fisico":"extintor_fisico","m7_superv":"extintor_control",
  /* M8 */ "m8_egreso":"evacuacion","m8_visible":"senalizacion","m8_despej":"evacuacion","m8_movil":"movilidad",
           "m8_aforo":"aforo","m8_aforonsr":"aforo","m8_descaforo":"descarga","m8_egresoevac":"evacuacion",
           "m8_anchocorr":"salida_ancho","m8_corrnorma":"salida_ancho","m8_anchopuerta":"salida_ancho","m8_puertanorma":"salida_ancho",
           "m8_anchoesc":"salida_ancho","m8_escnorma":"salida_ancho","m8_anchoramp":"salida_ancho","m8_rampnorma":"salida_ancho",
           "m8_anchosalida":"salida_ancho","m8_salidanorma":"salida_ancho","m8_anchopsalida":"salida_ancho","m8_psalidanorma":"salida_ancho",
           "m8_cantdesc":"descarga","m8_descext":"descarga","m8_escext":"descarga",
           "m8_cortafuego":"puerta_cortafuego","m8_cierre":"puerta_cortafuego",
           "m8_luces":"ilum_emergencia","m8_ilum":"ilum_emergencia","m8_autoensayo":"ilum_emergencia","m8_ilumnorma":"ilum_emergencia",
           "m8_proced":"mantenimiento","m8_procaño":"mantenimiento","m8_monitoreo":"mantenimiento",
  /* M9 */ "m9_plan":"plan_emergencia","m9_r_inc":"plan_emergencia","m9_r_fugas":"plan_emergencia","m9_r_derr":"plan_emergencia",
           "m9_r_expl":"plan_emergencia","m9_r_bleve":"plan_emergencia","m9_s_emp":"plan_emergencia","m9_s_bom":"plan_emergencia",
           "m9_s_com":"plan_emergencia","m9_s_soc":"plan_emergencia","m9_simul":"plan_emergencia",
           "m9_brigada":"brigada","m9_bricert":"brigada","m9_briclase":"brigada","m9_brinivel":"brigada","m9_bribom":"brigada","m9_s_bri":"brigada",
  /* M10 */"m10_seguro":"seguro","m10_poliza":"seguro","m10_aseg":"seguro"
};

/* Compatibilidad: S y T existían como globales en versiones anteriores. */
var S='stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
var T='stroke="none" font-family="sans-serif" font-weight="600"';

window.DIAGRAMS = (function(){
  var VE="var(--verde)", RO="var(--rojo)", AM="var(--ambar)", AZ="var(--azul)", MU="var(--muted)", EX="var(--ember)";
  function svg(b,h){return '<svg viewBox="0 0 320 '+(h||170)+'" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+b+'</svg>'}
  function tx(x,y,t,o){o=o||{};return '<text x="'+x+'" y="'+y+'" stroke="none" font-family="Public Sans,sans-serif" font-size="'+(o.s||11)+'" font-weight="'+(o.w||600)+'" fill="'+(o.c||"currentColor")+'"'+(o.a?' text-anchor="'+o.a+'"':'')+'>'+t+'</text>'}
  function ln(x1,y1,x2,y2,o){o=o||{};return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"'+(o.c?' stroke="'+o.c+'"':'')+(o.w?' stroke-width="'+o.w+'"':'')+(o.d?' stroke-dasharray="'+o.d+'"':'')+'/>'}
  function rc(x,y,w,h,o){o=o||{};return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.r||0)+'"'+(o.f?' fill="'+o.f+'"':'')+(o.c?' stroke="'+o.c+'"':'')+(o.w?' stroke-width="'+o.w+'"':'')+(o.d?' stroke-dasharray="'+o.d+'"':'')+'/>'}
  /* Sello de veredicto: icono + palabra (nunca solo color). */
  function si(x,y,t){return '<g><circle cx="'+(x+8)+'" cy="'+(y-4)+'" r="8" fill="'+VE+'" stroke="none"/><path d="M'+(x+4)+' '+(y-4)+' l3 3 l5 -6" stroke="#fff" stroke-width="2"/>'+tx(x+21,y,t||"Así sí",{c:VE,s:12,w:700})+'</g>'}
  function no(x,y,t){return '<g><circle cx="'+(x+8)+'" cy="'+(y-4)+'" r="8" fill="'+RO+'" stroke="none"/><path d="M'+(x+5)+' '+(y-7)+' l6 6 M'+(x+11)+' '+(y-7)+' l-6 6" stroke="#fff" stroke-width="2"/>'+tx(x+21,y,t||"Así no",{c:RO,s:12,w:700})+'</g>'}
  /* Divisor de comparación (dos mitades de 150 px). */
  var MID=ln(160,10,160,160,{c:MU,d:"3 4",w:1});
  function persona(x,y,s,c){s=s||1;c=c||"currentColor";return '<g stroke="'+c+'" stroke-width="2"><circle cx="'+x+'" cy="'+(y-22*s)+'" r="'+(5*s)+'"/><path d="M'+x+' '+(y-17*s)+' V'+(y-6*s)+' M'+(x-7*s)+' '+y+' L'+x+' '+(y-8*s)+' L'+(x+7*s)+' '+y+' M'+(x-7*s)+' '+(y-13*s)+' H'+(x+7*s)+'"/></g>'}
  function ext(x,y,s){s=s||1;/* x,y = base centro */
    return '<g stroke="'+EX+'" stroke-width="2"><rect x="'+(x-8*s)+'" y="'+(y-34*s)+'" width="'+(16*s)+'" height="'+(34*s)+'" rx="'+(6*s)+'" fill="'+EX+'"/>'+
      '<rect x="'+(x-3*s)+'" y="'+(y-40*s)+'" width="'+(6*s)+'" height="'+(6*s)+'" fill="'+EX+'"/>'+
      '<path d="M'+(x-3*s)+' '+(y-40*s)+' h-'+(7*s)+' M'+(x+3*s)+' '+(y-38*s)+' q'+(10*s)+' 4 '+(9*s)+' '+(18*s)+'" fill="none"/></g>'}
  function caja(x,y,w,h){return rc(x,y,w,h,{c:AM,f:"var(--ambar-bg)"})+ln(x,y,x+w,y+h,{c:AM,w:1})}
  function flecha(x1,y,x2,c){c=c||"currentColor";var d=x2>x1?-7:7;return '<path d="M'+x1+' '+y+' H'+x2+' M'+(x2+d)+' '+(y-5)+' L'+x2+' '+y+' L'+(x2+d)+' '+(y+5)+'" stroke="'+c+'"/>'}
  function doc(x,y,w,h,tit){return rc(x,y,w,h,{r:2,f:"var(--surface)"})+'<path d="M'+(x+w-14)+' '+y+' v14 h14" />'+tx(x+10,y+18,tit,{s:10,w:700})}
  function lineas(x,y,w,n,gap){var o="";for(var i=0;i<n;i++)o+=ln(x,y+i*(gap||12),x+w-(i%2?18:0),y+i*(gap||12),{c:MU,w:1.5});return o}
  function cota(x,y1,y2,t,lado){/* cota vertical */var tx0=lado==="izq"?x-6:x+6, an=lado==="izq"?"end":"start";
    return ln(x,y1,x,y2,{w:1.4})+'<path d="M'+(x-4)+' '+(y1+6)+' L'+x+' '+y1+' L'+(x+4)+' '+(y1+6)+' M'+(x-4)+' '+(y2-6)+' L'+x+' '+y2+' L'+(x+4)+' '+(y2-6)+'" stroke-width="1.4"/>'+tx(tx0,(y1+y2)/2+4,t,{s:11,a:an})}
  function cotah(y,x1,x2,t){return ln(x1,y,x2,y,{w:1.4})+'<path d="M'+(x1+6)+' '+(y-4)+' L'+x1+' '+y+' L'+(x1+6)+' '+(y+4)+' M'+(x2-6)+' '+(y-4)+' L'+x2+' '+y+' L'+(x2-6)+' '+(y+4)+'" stroke-width="1.4"/>'+tx((x1+x2)/2,y-6,t,{s:11,a:"middle"})}

  return {
  antecedentes:{titulo:"Visita anterior",
    svg:svg(doc(24,18,130,134,"CONCEPTO ANTERIOR")+tx(34,52,"Hallazgos:",{s:10,c:MU})+
      '<path d="M36 70 l4 4 l7 -8" stroke="'+VE+'"/>'+ln(54,70,140,70,{c:MU,w:1.5})+
      '<path d="M36 92 l4 4 l7 -8" stroke="'+VE+'"/>'+ln(54,92,128,92,{c:MU,w:1.5})+
      '<path d="M37 109 l8 8 M45 109 l-8 8" stroke="'+RO+'"/>'+ln(54,114,136,114,{c:MU,w:1.5})+
      persona(232,150,1.6)+'<path d="M250 96 h28 v34 h-28 z" fill="var(--surface)"/>'+ln(255,106,272,106,{w:1.4})+ln(255,116,268,116,{w:1.4})+
      tx(200,40,"Verifica uno",{s:11})+tx(200,54,"por uno",{s:11})),
    pasos:["Busca el negocio en la app (renovación) o pide al dueño el concepto de la visita pasada.","Toma la lista de hallazgos de esa visita y revísalos uno por uno en el local.","Si es la primera vez que el CBVI lo revisa, marca «Primera visita»: no suma, no resta y no sale como hallazgo."],
    cumple:["Todo lo pedido la vez pasada está corregido.","Hay evidencia: factura de recarga, señal instalada, foto, documento."],
    noCumple:["Uno o más hallazgos de la visita anterior siguen igual.","Dicen que lo arreglaron pero no hay cómo comprobarlo."]},

  licencias:{titulo:"Documentos de la edificación",
    svg:svg(doc(18,20,128,128,"LICENCIA")+tx(28,58,"de construcción",{s:10,c:MU})+lineas(28,78,100,3,14)+
      '<circle cx="118" cy="128" r="12" stroke="'+AZ+'"/>'+tx(118,132,"✓",{s:12,c:AZ,a:"middle"})+
      doc(174,20,128,128,"USO DEL SUELO")+tx(184,58,"Planeación / POT",{s:10,c:MU})+lineas(184,78,100,3,14)+
      tx(184,136,"Actividad: comercio",{s:10})),
    pasos:["Pregunta por la licencia de construcción o de la última reforma; pide verla.","Pide el concepto de uso del suelo (Planeación) o revisa que la actividad esté permitida en esa dirección.","Nueva: construida hace pocos años. Remodelada: tuvo ampliaciones o cambios de muros, pisos o techo."],
    cumple:["Muestran el documento y corresponde a esta dirección.","La actividad que se hace hoy es la que aparece en el uso del suelo."],
    noCumple:["No existe documento o es de otra dirección.","El local cambió de actividad (ej. de vivienda a bodega) sin trámite."],
    ref:"Decreto 1077 de 2015 · POT municipal"},

  estructura:{titulo:"Tipo de construcción",
    svg:svg(
      /* aporticado */ rc(10,24,56,70)+ln(10,46,66,46)+ln(10,70,66,70)+ln(28,24,28,94)+ln(48,24,48,94)+tx(38,112,"Aporticado",{s:9,a:"middle"})+
      /* muros */ rc(72,24,56,70)+'<path d="M72 38 h56 M72 52 h56 M72 66 h56 M72 80 h56 M86 24 v14 M114 24 v14 M100 38 v14 M86 52 v14 M114 52 v14 M100 66 v14 M86 80 v14 M114 80 v14" stroke-width="1.2"/>'+tx(100,112,"Muros",{s:9,a:"middle"})+tx(100,123,"de carga",{s:9,a:"middle"})+
      /* madera */ '<g stroke="'+AM+'">'+rc(134,24,56,70)+'<path d="M148 24 v70 M162 24 v70 M176 24 v70" stroke-width="1.4"/></g>'+tx(162,112,"Madera",{s:10,a:"middle"})+
      /* metálica */ rc(196,24,56,70)+'<path d="M196 94 L210 24 L224 94 L238 24 L252 94" stroke-width="1.4"/>'+tx(224,112,"Metálica",{s:10,a:"middle"})+
      /* aglomerado */ '<g stroke="'+RO+'">'+rc(258,24,56,70)+'</g><g fill="'+RO+'" stroke="none"><circle cx="270" cy="38" r="2"/><circle cx="292" cy="50" r="2"/><circle cx="280" cy="66" r="2"/><circle cx="300" cy="80" r="2"/><circle cx="268" cy="84" r="2"/><circle cx="302" cy="34" r="2"/></g>'+tx(286,112,"Aglomerado",{s:9,a:"middle"})+
      '<path d="M14 136 H306" stroke="'+MU+'" stroke-width="1.4"/><path d="M300 131 L306 136 L300 141" stroke="'+MU+'" stroke-width="1.4"/>'+
      tx(14,154,"resiste más el fuego",{s:10,c:VE})+tx(306,154,"resiste menos",{s:10,c:RO,a:"end"})),
    pasos:["Mira las columnas y vigas: si son de concreto armado formando una retícula, es Aporticado.","Si no hay columnas y las paredes de ladrillo o bloque sostienen el techo, es Muros de carga.","Revisa también techo y entrepiso. Si combina materiales (ej. paredes de cemento y techo de madera), marca «Mixta»: puntúa como el más débil."],
    okT:"Resiste más", noT:"Resiste menos",
    cumple:["Concreto (aporticado) o ladrillo/bloque en toda la estructura.","Techo y entrepiso no combustibles."],
    noCumple:["Madera, aglomerado o láminas sin protección en paredes, entrepiso o techo.","Estructura metálica sin pintura ni recubrimiento contra fuego."]},

  propagacion:{titulo:"Por dónde se correría el fuego",
    svg:svg(rc(30,20,150,130)+ln(30,85,180,85)+
      /* escalera abierta */ '<path d="M140 150 h12 v-13 h12 v-13 h12 v-13" stroke="'+MU+'"/>'+rc(130,85,40,0)+
      '<path d="M150 135 V40" stroke="'+RO+'" stroke-width="3"/><path d="M143 48 L150 38 L157 48" stroke="'+RO+'" stroke-width="3"/>'+tx(186,46,"Vertical",{s:12,c:RO,w:700})+tx(186,60,"escalera abierta,",{s:10})+tx(186,72,"ducto, vacío",{s:10})+
      caja(42,124,18,26)+caja(62,130,18,20)+caja(82,120,18,30)+
      '<path d="M44 112 H118" stroke="'+AM+'" stroke-width="3"/><path d="M110 106 L120 112 L110 118" stroke="'+AM+'" stroke-width="3"/>'+tx(186,112,"Horizontal",{s:12,c:AM,w:700})+tx(186,126,"material junto,",{s:10})+tx(186,138,"sin muros que corten",{s:10})),
    pasos:["Vertical: busca escaleras sin puerta, ductos, vacíos entre pisos y entrepisos de madera.","Horizontal: mira si el piso es un solo espacio grande lleno de mercancía o si hay muros y puertas que lo dividan.","Revisa lo que se comparte con el vecino: pared de madera, cielo raso o techo corrido."],
    okT:"Baja si", noT:"Alta si",
    cumple:["Un solo piso, o pisos separados por placa de concreto y escalera con puerta.","Áreas divididas por muros de ladrillo/concreto hasta el techo."],
    noCumple:["Escalera abierta, ductos o vacíos que conectan pisos.","Todo es un salón continuo con material combustible, o comparte techo de madera con el vecino."]},

  edificacion:{titulo:"Pisos y subniveles",
    svg:svg(ln(10,104,310,104,{w:2.4})+tx(304,98,"nivel de la calle",{s:10,c:MU,a:"end"})+
      rc(60,26,100,78)+ln(60,52,160,52)+ln(60,78,160,78)+tx(110,44,"Piso 3",{s:10,a:"middle"})+tx(110,70,"Piso 2",{s:10,a:"middle"})+tx(110,96,"Piso 1",{s:10,a:"middle"})+
      rc(60,104,100,30,{c:AZ,d:"5 4"})+tx(110,123,"Subnivel (sótano)",{s:10,c:AZ,a:"middle"})+
      cota(44,26,104,"altura","izq")+cotah(160,60,160,"largo × ancho = m²"),172),
    pasos:["Pisos: cuenta desde el nivel de la calle hacia arriba (incluye mezanine).","Subniveles: solo lo que queda POR DEBAJO de la calle (sótano, semisótano). Si no hay, marca «Ninguno» y la app omite sus preguntas.","Área: largo × ancho de cada piso con flexómetro, o el dato del predial."],
    okT:"Menor riesgo", noT:"Mayor riesgo",
    cumple:["1 a 3 pisos y menos de 300 m² por piso.","Sin subniveles, o subniveles pequeños sin otra actividad comercial."],
    noCumple:["Más de 3 pisos: el rescate y la evacuación son más lentos.","Sótanos con público o con otra actividad: el humo sube y atrapa."]},

  almacenamiento:{titulo:"Altura de almacenamiento",
    svg:svg(ln(20,150,300,150,{w:2.4})+
      rc(40,40,90,110)+ln(40,76,130,76)+ln(40,112,130,112)+caja(48,116,30,34)+caja(84,122,38,28)+caja(50,82,34,30)+caja(90,86,32,26)+caja(52,50,28,26)+
      ln(30,48,150,48,{c:RO,d:"6 4"})+tx(154,52,"3 m",{s:12,c:RO,w:700})+cota(26,48,150,"","izq")+
      rc(190,22,90,128)+caja(196,118,40,32)+caja(238,118,36,32)+caja(198,84,38,34)+caja(238,86,36,32)+caja(200,52,34,32)+caja(240,54,32,32)+caja(204,24,30,28)+
      ln(184,48,290,48,{c:RO,d:"6 4"})+no(196,166,"Más de 3 m")+si(40,166,"Hasta 3 m"),180),
    pasos:["Mide del piso hasta lo más alto de la mercancía apilada (no la estantería vacía).","Mira los arrumes: estables, sin inclinarse ni tocar techo o lámparas.","Fíjate que quede espacio libre entre la mercancía y las luces o el techo."],
    cumple:["Mercancía a 3 m o menos.","Arrumes estables y separados de lámparas y techo."],
    noCumple:["Arrumes de más de 3 m.","Cajas recostadas a lámparas, cableado o al techo."]},

  fuentes:{titulo:"Fuentes de ignición",
    svg:svg(
      /* llama */ '<path d="M40 64 C26 52 36 40 40 26 C48 38 58 44 50 60 C48 66 43 67 40 64 Z" fill="'+EX+'" stroke="'+EX+'"/>'+tx(42,86,"Llama abierta",{s:10,a:"middle"})+tx(42,98,"estufa, vela",{s:9,c:MU,a:"middle",w:500})+
      /* chispa */ '<path d="M120 26 L110 48 H124 L114 68" stroke="'+AM+'" stroke-width="3"/><path d="M130 36 l6 -4 M132 50 l7 0 M128 62 l6 4" stroke="'+AM+'"/>'+tx(122,86,"Chispas",{s:10,a:"middle"})+tx(122,98,"soldadura, esmeril",{s:9,c:MU,a:"middle",w:500})+
      /* cigarrillo */ rc(180,48,44,8,{r:1})+rc(216,48,8,8,{f:AM,c:AM})+'<path d="M228 44 q4 -8 0 -14 q-4 -6 2 -12" stroke="'+MU+'" stroke-width="1.5"/>'+tx(202,86,"Fumadores",{s:10,a:"middle"})+
      /* electrica */ rc(266,30,30,34,{r:4})+ln(275,40,275,48,{w:2.6})+ln(287,40,287,48,{w:2.6})+'<path d="M281 64 v12" />'+tx(281,86,"Eléctricas",{s:10,a:"middle"})+tx(281,98,"tomas, equipos",{s:9,c:MU,a:"middle",w:500})+
      /* superficie caliente */ rc(18,118,48,22,{r:3})+'<path d="M26 115 q3 -4 0 -8 M40 115 q3 -4 0 -8 M54 115 q3 -4 0 -8" stroke="'+RO+'" stroke-width="1.5"/>'+tx(42,154,"Superficie",{s:10,a:"middle"})+tx(42,166,"caliente",{s:10,a:"middle"})+
      /* horno */ rc(100,112,44,34,{r:3})+rc(108,120,28,16,{r:2})+'<path d="M112 132 q4 -6 8 0 q4 -6 8 0" stroke="'+EX+'" stroke-width="1.5"/>'+tx(122,160,"Hornos",{s:10,a:"middle"})+
      /* quimicos */ '<path d="M192 110 h16 M196 110 v12 L186 144 h28 L204 122 V110" />'+'<path d="M189 136 h22" stroke="'+AZ+'"/>'+tx(202,160,"Químicos",{s:10,a:"middle"})+
      /* fosforos */ ln(266,146,290,118,{w:2.4})+'<circle cx="292" cy="115" r="4" fill="'+EX+'" stroke="'+EX+'"/>'+tx(281,160,"Fósforos",{s:10,a:"middle"}),172),
    pasos:["Recorre todo el local: atención al público, cocina, bodega, taller, patio y baños.","Marca SOLO lo que veas presente o en uso, no lo que «podría» haber.","Cada fuente marcada resta 1 punto. Si marcas alguna, la app te pregunta qué tan fácil se activa."],
    okT:"Suma el punto si", noT:"Resta si",
    cumple:["La fuente NO está en el local."],
    noCumple:["La ves presente o en uso durante la visita (o el encargado confirma que se usa)."]},

  activacion:{titulo:"Riesgo de que la fuente encienda algo",
    svg:svg(MID+
      rc(20,82,44,40,{r:3})+'<path d="M32 78 q4 -8 0 -14 M48 78 q4 -8 0 -14" stroke="'+EX+'" stroke-width="1.6"/>'+caja(110,90,32,32)+cotah(110,64,110,"≥ 1 m")+ln(12,122,150,122,{w:2.4})+si(24,152,"Bajo")+
      rc(178,82,44,40,{r:3})+'<path d="M190 78 q4 -8 0 -14 M206 78 q4 -8 0 -14" stroke="'+EX+'" stroke-width="1.6"/>'+caja(224,86,30,36)+caja(256,96,28,26)+'<path d="M262 92 q6 -10 14 -2" stroke="'+AM+'"/>'+ln(170,122,310,122,{w:2.4})+no(182,152,"Alto")),
    pasos:["Por cada fuente marcada, mira qué material combustible tiene cerca.","Calcula la distancia a cartón, tela, plástico, aceite o cilindros de gas.","Pregunta cuánto tiempo pasa encendida y si alguien la vigila."],
    okT:"Bajo si", noT:"Alto si",
    cumple:["Fuentes separadas más de 1 m de cualquier combustible.","Se usan con alguien pendiente y se apagan al cerrar."],
    noCumple:["Estufa, soldadura o resistencias junto a cartón, telas o gas.","Equipos calientes encendidos sin vigilancia o toda la noche."]},

  inflamabilidad:{titulo:"Qué tan fácil arden los materiales",
    svg:svg(rc(16,54,96,30,{f:"var(--verde-bg)",c:VE})+rc(112,54,96,30,{f:"var(--ambar-bg)",c:AM})+rc(208,54,96,30,{f:"var(--rojo-bg)",c:RO})+
      tx(64,74,"Baja",{s:13,c:VE,w:700,a:"middle"})+tx(160,74,"Media",{s:13,c:AM,w:700,a:"middle"})+tx(256,74,"Alta",{s:13,c:RO,w:700,a:"middle"})+
      tx(64,104,"metal, vidrio,",{s:10,a:"middle",w:500})+tx(64,118,"cerámica, concreto",{s:10,a:"middle",w:500})+
      tx(160,104,"madera maciza,",{s:10,a:"middle",w:500})+tx(160,118,"cartón ordenado",{s:10,a:"middle",w:500})+
      tx(256,104,"espuma, colchón,",{s:10,a:"middle",w:500})+tx(256,118,"tela, plástico,",{s:10,a:"middle",w:500})+tx(256,132,"pintura, alcohol",{s:10,a:"middle",w:500})+
      tx(16,36,"Mira lo que más abunda en el local",{s:11,c:MU})),
    pasos:["Mira qué material abunda: el de la mercancía, los muebles, el cielo raso y las divisiones.","Fíjate en la cantidad: poco cartón ordenado no es lo mismo que una bodega llena.","Busca líquidos inflamables: pinturas, solventes, alcohol, combustibles."],
    okT:"Baja si", noT:"Alta si",
    cumple:["Predominan metal, vidrio, cerámica o concreto.","Poca mercancía combustible y bien ordenada."],
    noCumple:["Espuma, colchones, telas sintéticas, plásticos o icopor en cantidad.","Pinturas, solventes, alcohol o combustibles almacenados."]},

  electrico:{titulo:"Estado de la instalación eléctrica",
    svg:svg(MID+
      rc(22,24,52,70,{r:3})+'<g stroke-width="1.5">'+rc(30,34,36,8)+rc(30,48,36,8)+rc(30,62,36,8)+'</g>'+tx(48,86,"tapa",{s:9,c:MU,a:"middle"})+
      rc(96,28,10,110,{r:2,c:MU})+ln(74,60,96,60)+rc(112,100,24,30,{r:3})+'<circle cx="120" cy="115" r="2" fill="currentColor"/><circle cx="128" cy="115" r="2" fill="currentColor"/>'+si(18,158,"Entubado")+
      '<path d="M176 40 C200 30 214 60 236 46 S270 30 300 50" />'+rc(226,40,14,12,{f:AM,c:AM})+tx(233,32,"cinta",{s:9,c:AM,a:"middle"})+
      '<path d="M262 44 l6 -6 M268 48 l8 -2 M262 52 l6 6" stroke="'+AM+'"/>'+
      rc(200,92,30,34,{r:3})+'<circle cx="208" cy="107" r="2" fill="currentColor"/><circle cx="222" cy="107" r="2" fill="currentColor"/><path d="M200 96 q14 -10 30 4" stroke="'+RO+'" stroke-width="3"/>'+tx(244,112,"toma",{s:10})+tx(244,124,"quemada",{s:10})+no(176,158,"Pelado")),
    pasos:["Recorre las tomas, interruptores y lámparas a la vista; no toques partes internas.","Busca cables pelados, empalmes con cinta, tomas flojas o con marcas negras.","Mira el tablero: con tapa, sin cables sueltos y con cada circuito marcado."],
    cumple:["Cables entubados o en canaleta, sin empalmes a la vista.","Tomas firmes, sin manchas de quemado; tablero con tapa."],
    noCumple:["Cables pelados, colgando o empalmados con cinta.","Tomas quemadas, cajas sin tapa o tablero abierto."],
    ref:"RETIE"},

  electrico_uso:{titulo:"Uso de las tomas",
    svg:svg(MID+
      rc(30,30,34,42,{r:4})+ln(41,44,41,54,{w:2.6})+ln(53,44,53,54,{w:2.6})+'<path d="M47 72 V112 H96" />'+rc(96,92,44,40,{r:3})+tx(118,116,"nevera",{s:9,a:"middle"})+si(20,160,"Un equipo por toma")+
      rc(176,30,34,42,{r:4})+'<path d="M193 72 V90" />'+rc(180,90,60,20,{r:3,c:RO})+
      '<g stroke="'+RO+'"><path d="M188 110 C186 130 180 136 176 146 M200 110 C200 130 204 136 206 146 M212 110 C214 130 224 132 236 140 M224 110 C232 124 254 120 268 132 M234 100 C258 96 270 100 290 112"/></g>'+
      rc(282,106,22,14,{r:2,c:RO})+tx(293,136,"otra",{s:9,c:RO,a:"middle"})+tx(293,147,"extensión",{s:9,c:RO,a:"middle"})+no(176,166,"«Pulpo»"),174),
    pasos:["Mira detrás de neveras, mostradores y equipos de cocina.","Cuenta los aparatos conectados a cada toma y busca extensiones o multitomas encadenadas.","Toca el enchufe de equipos grandes (nevera, horno): no debe estar caliente."],
    cumple:["Equipos grandes cada uno en su toma.","Extensiones solo temporales y con su capacidad."],
    noCumple:["«Pulpos»: multitomas con muchos aparatos o encadenadas.","Extensiones bajo tapetes, pisadas o enrolladas mientras se usan."]},

  electrico_proteccion:{titulo:"Protección contra sobrecargas",
    svg:svg(MID+
      rc(20,18,120,108,{r:3})+'<g stroke-width="1.6">'+rc(32,30,22,34)+rc(69,30,22,34)+rc(106,30,22,34)+'</g>'+
      '<g fill="currentColor" stroke="none">'+rc(38,34,10,12)+rc(75,34,10,12)+rc(112,34,10,12)+'</g>'+
      tx(43,82,"cocina",{s:10,a:"middle"})+tx(80,82,"tomas",{s:10,a:"middle"})+tx(117,82,"luces",{s:10,a:"middle"})+
      tx(80,112,"breakers rotulados",{s:10,c:MU,a:"middle"})+si(24,156,"Breakers")+
      rc(180,18,120,108,{r:3})+'<g stroke-width="1.6">'+rc(194,34,22,40)+rc(262,34,22,40)+'</g>'+
      '<path d="M205 30 V80 M205 50 q10 6 0 12" stroke="'+RO+'" stroke-width="2.4"/>'+tx(205,96,"alambre",{s:9,c:RO,a:"middle"})+
      rc(258,46,30,14,{f:AM,c:AM})+tx(273,96,"cinta",{s:9,c:AM,a:"middle"})+no(184,156,"Puenteado")),
    pasos:["Pide que abran el tablero; mira sin tocar el interior.","Cuenta los breakers (tacos) y revisa que cada uno tenga rótulo.","Busca fusibles cambiados por alambre o breakers amarrados para que no salten."],
    cumple:["Tablero con breakers que cortan solos ante una sobrecarga.","Cada circuito marcado; diferencial en baño y cocina."],
    noCumple:["Fusibles reemplazados por alambre o monedas.","Breakers amarrados, pegados con cinta o sin tablero."],
    ref:"RETIE · NTC 2050"},

  retie:{titulo:"Revisión eléctrica (RETIE)",
    svg:svg(doc(60,14,150,142,"DICTAMEN RETIE")+tx(70,50,"Dirección: la del local",{s:10,c:MU})+tx(70,66,"Fecha de inspección",{s:10,c:MU})+lineas(70,84,110,2,14)+
      ln(70,136,140,136,{w:1.4})+tx(70,148,"firma + matrícula",{s:9,c:MU})+'<circle cx="182" cy="128" r="16" stroke="'+AZ+'"/>'+tx(182,132,"OK",{s:10,c:AZ,a:"middle",w:700})+
      tx(222,60,"o la declaración",{s:10})+tx(222,74,"de cumplimiento",{s:10})+tx(222,88,"del electricista",{s:10})),
    pasos:["Pide el dictamen de inspección RETIE o la declaración de cumplimiento del electricista que hizo la instalación.","Revisa que diga la dirección de este local y tenga fecha y firma con matrícula profesional.","Si no hay documento, pregunta cuándo vino por última vez un electricista matriculado y qué hizo."],
    cumple:["Documento de este local, firmado por profesional con matrícula.","Revisión reciente o posterior a la última reforma eléctrica."],
    noCumple:["No hay ningún documento ni revisión.","El documento es de otra dirección o de antes de ampliar el local."]},

  extintor_tipo:{titulo:"Extintor según lo que puede arder",
    svg:svg(
      '<path d="M40 22 L64 62 H16 Z" stroke="'+VE+'" stroke-width="2.4"/>'+tx(40,56,"A",{s:18,c:VE,w:700,a:"middle"})+tx(40,82,"Sólidos",{s:11,a:"middle"})+tx(40,96,"papel, madera,",{s:9,c:MU,a:"middle",w:500})+tx(40,108,"tela, plástico",{s:9,c:MU,a:"middle",w:500})+tx(40,132,"ABC · agua",{s:10,a:"middle",w:700})+
      rc(98,24,38,38,{c:RO,w:2.4})+tx(117,51,"B",{s:18,c:RO,w:700,a:"middle"})+tx(117,82,"Líquidos",{s:11,a:"middle"})+tx(117,96,"gasolina, ACPM,",{s:9,c:MU,a:"middle",w:500})+tx(117,108,"pintura, alcohol",{s:9,c:MU,a:"middle",w:500})+tx(117,132,"ABC · CO₂",{s:10,a:"middle",w:700})+
      '<circle cx="196" cy="43" r="20" stroke="'+AZ+'" stroke-width="2.4"/>'+tx(196,50,"C",{s:18,c:AZ,w:700,a:"middle"})+tx(196,82,"Eléctricos",{s:11,a:"middle"})+tx(196,96,"con energía",{s:9,c:MU,a:"middle",w:500})+tx(196,108,"nunca agua",{s:9,c:RO,a:"middle",w:700})+tx(196,132,"CO₂ · ABC",{s:10,a:"middle",w:700})+
      '<path d="M264 23 L282 33 V53 L264 63 L246 53 V33 Z" stroke-width="2.4"/>'+tx(264,50,"K",{s:18,w:700,a:"middle"})+tx(264,82,"Cocina",{s:11,a:"middle"})+tx(264,96,"aceite, grasa,",{s:9,c:MU,a:"middle",w:500})+tx(264,108,"freidoras",{s:9,c:MU,a:"middle",w:500})+tx(264,132,"Clase K",{s:10,a:"middle",w:700})+
      tx(160,160,"Lee las letras en la etiqueta del extintor",{s:10,c:MU,a:"middle"}),168),
    pasos:["Identifica qué puede arder en cada zona: mercancía, cocina, tablero, combustibles.","Lee en la etiqueta del extintor las letras que trae (ej. «ABC»).","Comprueba que cada zona tenga un extintor con la letra de su riesgo."],
    cumple:["Zona de mercancía, oficina o atención: extintor ABC (multipropósito).","Tablero o equipos eléctricos: CO₂ o ABC cerca.","Cocina con freidoras o mucho aceite: extintor clase K."],
    noCumple:["Solo extintores de agua donde hay equipos eléctricos o combustibles.","Cocina con freidora sin extintor clase K.","El local no tiene ningún extintor (responde NO en «cuenta con extintores» y las demás se omiten)."],
    ref:"NTC 2885 / NFPA 10"},

  extintor_distrib:{titulo:"Dónde van los extintores",
    svg:svg(rc(14,14,292,124,{r:2})+ln(150,14,150,80)+ln(150,104,150,138)+tx(80,32,"Atención",{s:10,c:MU,a:"middle"})+tx(228,32,"Cocina / bodega",{s:10,c:MU,a:"middle"})+
      ext(26,96,0.7)+ext(286,96,0.7)+persona(186,126,0.9)+
      '<path d="M178 104 C150 92 110 92 34 80" stroke="'+AZ+'" stroke-dasharray="6 5"/>'+tx(102,74,"≤ 15 m caminando",{s:12,c:AZ,w:700,a:"middle"})+
      ln(14,138,306,138,{w:2.4})+tx(160,160,"Desde cualquier punto, el extintor más cercano",{s:10,c:MU,a:"middle"}),168),
    pasos:["Párate en el punto más alejado del local.","Camina hasta el extintor más cercano contando pasos (1 paso ≈ 0,75 m; 15 m ≈ 20 pasos).","Repite en cocina, bodega y junto al tablero eléctrico."],
    cumple:["Desde cualquier punto hay un extintor a 15 m o menos caminando (en zonas solo de papel, madera o tela la norma permite hasta 22,9 m).","Hay uno cerca de cada zona de riesgo: cocina, tablero, bodega."],
    noCumple:["Todos los extintores están juntos en un solo sitio.","Para llegar hay que atravesar una puerta con llave o una bodega."],
    ref:"NTC 2885 / NFPA 10"},

  extintor_visible:{titulo:"Extintor despejado y a la vista",
    svg:svg(MID+ln(20,140,150,140,{w:2.4})+ln(30,20,30,140)+
      ext(56,92,1.1)+rc(42,32,30,14,{f:EX,c:EX})+tx(57,43,"EXT",{s:10,c:"#fff",a:"middle",w:700})+cotah(116,70,140,"1 m libre")+si(24,162,"Despejado")+
      ln(170,140,300,140,{w:2.4})+ln(180,20,180,140)+ext(206,92,1.1)+caja(196,76,44,64)+caja(242,96,40,44)+no(174,162,"Tapado")),
    pasos:["Desde el pasillo, busca el extintor con la vista: debe verse sin buscarlo.","Revisa que nada esté delante, encima o colgado de él.","Intenta descolgarlo (sin dispararlo): debe salir en segundos."],
    cumple:["Se ve desde el pasillo y se descuelga en segundos.","Espacio libre al frente de alrededor de 1 m."],
    noCumple:["Tapado por cajas, mercancía, ropa o cortinas.","Dentro de un cuarto con llave o detrás del mostrador cerrado."]},

  extintor_altura:{titulo:"Altura de instalación",
    svg:svg(MID+ln(20,150,150,150,{w:2.4})+ln(30,14,30,150)+
      '<path d="M30 58 h14 v8" stroke-width="2.4"/>'+ext(54,136,1.5)+cota(100,74,150,"máx. 1,53 m")+ln(70,74,104,74,{d:"3 3",w:1})+
      cota(60,136,150,"")+tx(66,147,"≥10 cm",{s:9,c:MU})+si(24,168,"En su soporte")+
      ln(170,150,300,150,{w:2.4})+ln(180,14,180,150)+ext(240,150,1.5)+no(174,168,"En el piso"),176),
    pasos:["Mide del piso a la parte más alta del extintor (la manija).","Lee la capacidad en la etiqueta: hasta 18 kg o más de 18 kg.","Confirma que cuelga de su soporte, no del piso ni encima de un mueble."],
    cumple:["Hasta 18 kg: la parte de arriba a 1,53 m o menos del piso.","Más de 18 kg: la parte de arriba a 1,07 m o menos.","Queda al menos 10 cm entre el fondo y el piso."],
    noCumple:["Está en el piso, sobre una silla o dentro de un mueble.","Cuelga tan alto que una persona baja no lo alcanza."],
    ref:"NTC 2885 / NFPA 10"},

  extintor_recarga:{titulo:"Extintor cargado y vigente",
    svg:svg('<circle cx="80" cy="82" r="56"/>'+
      '<path d="M36 82 A44 44 0 0 1 52 48" stroke="'+RO+'" stroke-width="8"/><path d="M58 43 A44 44 0 0 1 102 43" stroke="'+VE+'" stroke-width="8"/><path d="M108 48 A44 44 0 0 1 124 82" stroke="'+RO+'" stroke-width="8"/>'+
      '<path d="M80 82 L88 46" stroke-width="3"/><circle cx="80" cy="82" r="4" fill="currentColor"/>'+tx(80,112,"aguja en verde",{s:11,c:VE,a:"middle",w:700})+
      tx(30,36,"vacío",{s:9,c:RO,a:"middle"})+tx(132,36,"exceso",{s:9,c:RO,a:"middle"})+
      rc(176,30,128,96,{r:3,f:"var(--surface)"})+tx(188,50,"MANTENIMIENTO",{s:10,w:700})+tx(188,72,"Recarga: 03/2026",{s:11})+tx(188,90,"Próxima: 03/2027",{s:11})+tx(188,112,"Empresa · firma",{s:10,c:MU})+
      '<circle cx="290" cy="110" r="5" fill="'+AM+'" stroke="none"/>'+tx(240,146,"precinto puesto",{s:10,c:AM,a:"middle"})),
    pasos:["Mira el manómetro: la aguja debe estar en la franja verde.","Lee la etiqueta o tarjeta: fecha de la última recarga o mantenimiento.","Revisa que el pasador tenga su precinto (sello plástico) sin romper.","Los de CO₂ no traen manómetro: se revisan por la etiqueta y el peso."],
    cumple:["Aguja en verde y precinto intacto.","Mantenimiento o recarga hace menos de 1 año."],
    noCumple:["Aguja en rojo: descargado o con sobrepresión.","Sin etiqueta, o con fecha de más de 1 año.","Precinto roto: pudo usarse y no se recargó."],
    ref:"NTC 2885"},

  extintor_fisico:{titulo:"Estado físico del extintor",
    svg:svg(ext(110,156,3.4)+
      '<g stroke-width="1.4">'+ln(122,24,196,24)+ln(140,88,196,72)+ln(124,120,196,118)+ln(100,40,60,40)+'</g>'+
      '<g fill="var(--surface)">'+'<circle cx="208" cy="24" r="10"/><circle cx="208" cy="72" r="10"/><circle cx="208" cy="118" r="10"/><circle cx="48" cy="40" r="10"/></g>'+
      tx(208,28,"1",{s:11,a:"middle",w:700})+tx(208,76,"2",{s:11,a:"middle",w:700})+tx(208,122,"3",{s:11,a:"middle",w:700})+tx(48,44,"4",{s:11,a:"middle",w:700})+
      tx(224,28,"Manija y pasador",{s:10})+tx(224,76,"Manguera",{s:10})+tx(224,122,"Cilindro",{s:10})+tx(30,64,"Etiqueta",{s:10})),
    pasos:["Manija y pasador: completos, el pasador con su precinto.","Manguera y boquilla: sin grietas, sin tapones de suciedad.","Cilindro: sin óxido, abolladuras ni pintura levantada.","Etiqueta de instrucciones: legible."],
    cumple:["Los cuatro puntos en buen estado."],
    noCumple:["Óxido, golpes, manguera rota o pasador faltante.","Etiqueta borrada: nadie sabría usarlo."]},

  extintor_control:{titulo:"Revisión periódica de extintores",
    svg:svg(rc(40,14,150,142,{r:3,f:"var(--surface)"})+tx(52,34,"TARJETA DE INSPECCIÓN",{s:10,w:700})+
      (function(){var o="",m=["Ene","Feb","Mar","Abr","May","Jun"];for(var i=0;i<6;i++){var y=56+i*16;o+=tx(54,y,m[i],{s:10})+ln(88,y-4,176,y-4,{c:MU,w:1});if(i<5)o+='<path d="M150 '+(y-6)+' l4 4 l7 -8" stroke="'+VE+'"/>'}return o})()+
      ext(244,140,1.6)+'<path d="M210 70 L232 92" stroke-width="1.4"/>'),
    pasos:["Pide la tarjeta colgada del extintor o la bitácora de revisiones.","Mira que tenga revisiones recientes, con fecha y firma.","Pregunta quién es el responsable de revisarlos."],
    cumple:["Revisión cada mes (o con frecuencia fija) con responsable.","La última anotación es reciente."],
    noCumple:["Nadie los revisa entre recargas.","La última firma tiene muchos meses."]},

  senalizacion:{titulo:"Señalización de salida y equipos",
    svg:svg(rc(16,30,130,58,{r:3,f:VE,c:VE})+persona(54,78,1.3,"#fff")+'<path d="M82 60 H124 M114 50 L124 60 L114 70" stroke="#fff" stroke-width="3"/>'+
      rc(98,36,20,0)+tx(81,108,"SALIDA · verde",{s:11,a:"middle",c:VE,w:700})+
      rc(184,30,58,58,{r:3,f:RO,c:RO})+'<g stroke="#fff" stroke-width="2"><rect x="205" y="44" width="14" height="34" rx="5" fill="#fff"/><path d="M210 44 v-6 h4 v6 M216 40 q10 4 8 16" fill="none"/></g>'+
      '<path d="M252 59 H296 M286 49 L296 59 L286 69" stroke="'+RO+'" stroke-width="3"/>'+tx(240,108,"EXTINTOR · rojo",{s:11,a:"middle",c:RO,w:700})+
      tx(160,144,"Visibles desde lejos, sin tapar, flecha hacia la salida real",{s:10,c:MU,a:"middle"}),156),
    pasos:["Desde el fondo del local, busca la señal de salida: debe verse sin buscarla.","Sigue las flechas: deben llevarte a una salida que abre.","Sobre cada extintor busca su señal roja."],
    cumple:["Salida y ruta: señal verde con flecha, visible desde cualquier punto.","Cada extintor con su señal roja encima, visible aunque haya gente.","Si el local se queda a oscuras: señales fotoluminiscentes o iluminadas."],
    noCumple:["La flecha apunta a una puerta cerrada o a una bodega.","Señal tapada, desteñida o detrás de publicidad.","Hay extintor sin señal, o señal sin extintor."],
    ref:"NTC 1461 · NSR-10 Título K"},

  evacuacion:{titulo:"Ruta de evacuación",
    svg:svg(MID+rc(14,24,136,110,{r:2})+rc(138,62,12,34,{f:VE,c:VE})+persona(40,100,0.9)+
      '<path d="M54 86 H126" stroke="'+VE+'" stroke-dasharray="6 5" stroke-width="2.4"/><path d="M118 80 L128 86 L118 92" stroke="'+VE+'" stroke-width="2.4"/>'+si(20,156,"Libre hasta la calle")+
      rc(170,24,136,110,{r:2})+rc(294,62,12,34,{f:RO,c:RO})+persona(196,100,0.9)+caja(236,72,26,30)+caja(250,96,30,24)+
      '<path d="M210 86 H232" stroke="'+RO+'" stroke-dasharray="6 5" stroke-width="2.4"/>'+
      '<g stroke="'+RO+'" stroke-width="2"><rect x="282" y="74" width="14" height="12" rx="2" fill="var(--surface)"/><path d="M285 74 v-5 a4 4 0 0 1 8 0 v5"/></g>'+no(176,156,"Bloqueada")),
    pasos:["Recorre la ruta desde el fondo hasta la calle, como lo haría un cliente.","Abre cada puerta de salida: debe abrir sin llave mientras haya gente adentro.","Mira el piso: sin escalones sueltos, cables ni mercancía en el camino."],
    cumple:["Ruta continua y libre hasta la calle.","Puertas sin candado, cadena ni reja cerrada en horario de atención.","Local grande o con mucha gente: más de una salida, alejadas entre sí."],
    noCumple:["Cajas, mesas, motos o exhibidores en el pasillo.","Salida con candado, reja o cortina metálica a medio bajar.","La única salida pasa por la cocina o la bodega."],
    ref:"NSR-10 Título K"},

  movilidad:{titulo:"Salida para personas con movilidad reducida",
    svg:svg(MID+ln(10,140,30,140,{w:2.4})+'<path d="M30 140 L112 112 H150" stroke-width="2.4"/>'+rc(132,52,14,60,{c:VE})+
      '<circle cx="74" cy="118" r="10"/><path d="M66 92 v16 h16 l6 8" /><circle cx="64" cy="84" r="4"/>'+tx(40,104,"rampa",{s:10,c:MU})+si(20,164,"Rampa o a nivel")+
      ln(170,140,220,140,{w:2.4})+'<path d="M220 140 V124 H240 V108 H300" stroke-width="2.4"/>'+rc(286,48,14,60,{c:RO})+
      '<circle cx="196" cy="128" r="10"/><path d="M188 102 v16 h16 l6 8" /><circle cx="186" cy="94" r="4"/>'+tx(250,130,"escalones",{s:10,c:RO})+no(176,164,"Solo escalones"),172),
    pasos:["Mira la entrada y la salida: ¿hay escalones, desniveles o rejillas?","Si hay rampa, verifica que sea suave, firme y con pasamanos.","Mide el ancho libre de la puerta: una silla de ruedas necesita 0,80 m o más."],
    cumple:["Acceso a nivel o con rampa hasta la calle.","Puerta de 0,80 m o más y sin torniquetes que impidan el paso."],
    noCumple:["Solo se sale por escalones.","Puerta angosta, torniquete o mostrador que bloquea una silla de ruedas."],
    ref:"NTC 4143 · NSR-10 Título K"},

  aforo:{titulo:"Aforo (cuántas personas caben)",
    svg:svg(rc(20,24,140,96,{r:2})+cotah(140,20,160,"8 m")+cota(176,24,120,"7 m")+
      persona(48,80,0.8)+persona(76,80,0.8)+persona(104,80,0.8)+persona(132,80,0.8)+persona(62,112,0.8)+persona(90,112,0.8)+persona(118,112,0.8)+
      tx(214,50,"Área ÷ índice",{s:13,w:700})+tx(214,66,"de ocupación",{s:11})+tx(214,84,"(m² por persona",{s:10,c:MU})+tx(214,98,"según el uso,",{s:10,c:MU})+tx(214,112,"NSR-10 Título K)",{s:10,c:MU}),156),
    pasos:["Mide el área donde está el público (largo × ancho).","Busca el índice de ocupación del uso en el Título K de la NSR-10 (m² por persona).","Aforo = área ÷ índice. Compáralo con las sillas y mesas y con lo que dice el encargado de las horas pico."],
    cumple:["El aforo está calculado y lo conocen (aviso, plan o constancia).","En hora pico no se pasa de ese número."],
    noCumple:["Nadie sabe cuántas personas caben.","En eventos o fines de semana llenan muy por encima."],
    ref:"NSR-10 Título K"},

  salida_ancho:{titulo:"Ancho libre de salidas",
    svg:svg(MID+
      rc(14,40,30,14,{f:"currentColor"})+rc(116,40,30,14,{f:"currentColor"})+'<path d="M116 54 L116 100" stroke-width="2.4"/><path d="M116 100 A46 46 0 0 0 70 54" stroke="'+MU+'" stroke-dasharray="3 4" stroke-width="1.2"/>'+
      cotah(80,44,116,"ancho libre")+tx(80,124,"de marco a hoja abierta",{s:10,c:MU,a:"middle"})+si(20,156,"Medir lo que pasa")+
      ln(178,40,300,40,{w:2.4})+ln(178,112,300,112,{w:2.4})+rc(232,40,40,22,{c:AM,f:"var(--ambar-bg)"})+tx(252,55,"estante",{s:9,c:AM,a:"middle"})+
      cota(214,40,112,"pared")+cota(252,62,112,"real")+no(176,156,"Pared a pared")),
    pasos:["Mide con flexómetro el paso LIBRE: en puertas, del marco a la hoja abierta; no de pared a pared.","En pasillos, mide el punto más angosto (estantes, exhibidores, mostrador).","En escaleras y rampas mide entre pasamanos. Si el local no tiene escaleras o rampas, marca N/A y la pregunta de norma desaparece."],
    cumple:["1,20 m o más de paso libre: puntaje completo.","Entre 0,80 y 1,20 m: aceptable para locales pequeños, puntaje parcial."],
    noCumple:["Menos de 0,80 m en cualquier punto de la ruta.","Exhibidores, mesas o mercancía que angostan el paso."],
    ref:"NSR-10 Título K"},

  descarga:{titulo:"Hacia dónde descarga la salida",
    svg:svg(MID+rc(20,30,100,80,{r:2})+'<path d="M120 70 H146" stroke="'+VE+'" stroke-width="2.4"/><path d="M138 64 L148 70 L138 76" stroke="'+VE+'" stroke-width="2.4"/>'+
      ln(150,20,150,140,{c:MU,w:1})+tx(60,134,"sale a la calle",{s:10,c:MU,a:"middle"})+si(20,160,"Al exterior")+
      rc(176,30,80,80,{r:2})+rc(256,40,46,60,{d:"4 3"})+tx(279,116,"patio",{s:10,c:MU,a:"middle"})+tx(279,128,"cerrado",{s:10,c:MU,a:"middle"})+
      '<path d="M256 70 H276" stroke="'+RO+'" stroke-width="2.4"/><path d="M268 64 L278 70 L268 76" stroke="'+RO+'" stroke-width="2.4"/>'+no(176,160,"A un encierro")),
    pasos:["Sigue cada salida hasta el final: ¿terminas en la calle o en un espacio abierto y seguro?","Cuenta cuántas salidas distintas llegan al exterior: esa es la cantidad de descargas.","Si hay segundo piso, mira si hay escalera exterior o una segunda escalera."],
    cumple:["Todas las salidas terminan en la calle o en un espacio abierto amplio.","Con mucho público: dos o más descargas separadas."],
    noCumple:["La salida termina en un patio cerrado, un parqueadero con reja o dentro de otro local.","Una sola salida para un local con mucha gente."],
    ref:"NSR-10 Título K"},

  puerta_cortafuego:{titulo:"Puertas cortafuego",
    svg:svg(rc(80,14,110,146)+rc(90,24,90,136,{f:"var(--surface)"})+
      '<path d="M96 24 h40 l16 -8" stroke-width="2.4"/>'+tx(206,24,"cierrapuertas",{s:10})+ln(156,18,200,20,{w:1})+
      rc(150,90,20,6,{f:"currentColor"})+rc(94,130,46,20,{c:AZ})+tx(117,144,"60 min",{s:9,c:AZ,a:"middle",w:700})+
      tx(206,140,"placa de",{s:10})+tx(206,152,"certificación",{s:10})+ln(140,140,200,140,{w:1})+
      tx(30,90,"se cierra",{s:10,a:"middle"})+tx(30,102,"sola",{s:10,a:"middle"}),170),
    pasos:["Busca la placa o etiqueta de certificación en el canto de la puerta o en el marco.","Ábrela y suéltala: debe cerrarse sola y quedar cerrada (brazo cierrapuertas).","Si el local no tiene ni necesita puertas cortafuego (ej. un solo piso sin escalera encerrada), marca N/A."],
    cumple:["Placa visible con su resistencia (ej. 60 o 90 min).","Cierra sola y ajusta en el marco."],
    noCumple:["Puerta cortafuego amarrada, con cuña o siempre abierta.","Sin placa, o cambiada por una puerta común."],
    ref:"NSR-10 Título J"},

  ilum_emergencia:{titulo:"Iluminación de emergencia",
    svg:svg(rc(96,20,128,34,{r:4})+'<circle cx="120" cy="37" r="9" fill="'+AM+'" stroke="'+AM+'"/><circle cx="200" cy="37" r="9" fill="'+AM+'" stroke="'+AM+'"/>'+
      '<circle cx="160" cy="31" r="3" fill="'+VE+'" stroke="none"/>'+tx(160,50,"TEST",{s:10,a:"middle",w:700})+
      '<g stroke="'+AM+'" stroke-width="1.6"><path d="M116 58 L70 120 M124 58 L120 120 M196 58 L200 120 M204 58 L250 120"/></g>'+
      ln(30,130,290,130,{w:2.4})+'<path d="M80 122 H230" stroke="'+VE+'" stroke-dasharray="6 5"/><path d="M222 116 L232 122 L222 128" stroke="'+VE+'"/>'+
      tx(236,20,"piloto verde",{s:10})+tx(236,32,"= cargando",{s:10,c:MU})+ln(163,31,232,22,{w:1})+
      tx(30,24,"≥ 90 min",{s:13,w:700})+tx(30,38,"de autonomía",{s:10,c:MU})+tx(160,152,"Prende sola y alumbra la ruta hasta la salida",{s:10,c:MU,a:"middle"}),160),
    pasos:["Ubica las lámparas: deben estar en la ruta y junto a cada salida.","Mira el piloto (luz pequeña): encendido = conectada y cargando.","Presiona el botón TEST o pide que bajen el breaker: deben prender solas en segundos.","Autoensayo: la lámpara se prueba sola periódicamente y avisa con el piloto si falla (viene escrito en la etiqueta)."],
    cumple:["Prenden solas al cortar la energía y alumbran el camino hasta la salida.","Autonomía mínima de 90 minutos (dato de la etiqueta)."],
    noCumple:["No prenden, prenden débil o hay que conectarlas a mano.","Piloto apagado, batería hinchada o lámpara guardada en un cajón.","No tiene luces de emergencia (responde NO y las demás se omiten)."],
    ref:"NSR-10 Título K · NFPA 101"},

  mantenimiento:{titulo:"Inspección y mantenimiento",
    svg:svg(doc(30,14,160,142,"BITÁCORA")+
      (function(){var o="",r=["Salidas libres","Señales","Luces emerg.","Extintores"];for(var i=0;i<4;i++){var y=56+i*22;o+=tx(42,y,r[i],{s:10})+'<path d="M150 '+(y-6)+' l4 4 l7 -8" stroke="'+VE+'"/>'}return o})()+
      ln(42,142,120,142,{w:1.2})+tx(42,152,"fecha · firma",{s:9,c:MU})+
      tx(206,60,"Procedimiento",{s:11,w:700})+tx(206,74,"escrito + registro",{s:10})+tx(206,88,"de cada revisión",{s:10})),
    pasos:["Pide el procedimiento escrito de revisión de salidas, señales e iluminación.","Pide el registro (bitácora o formatos) del último año, con fechas y firmas.","Monitoreo: pregunta si alguien vigila los sistemas todo el tiempo (vigilancia, panel o cámara)."],
    cumple:["Procedimiento escrito y registros del último año.","Responsable con nombre."],
    noCumple:["«Se revisa cuando se daña».","No hay registros o son de hace más de un año."]},

  plan_emergencia:{titulo:"Plan de emergencias",
    svg:svg(doc(24,12,150,148,"PLAN DE EMERGENCIAS")+
      (function(){var o="",r=["Riesgos del local","Rutas y encuentro","Responsables","Teléfonos de emergencia","Simulacros"];for(var i=0;i<5;i++){var y=46+i*22;o+=rc(34,y-9,10,10,{r:1})+'<path d="M35 '+(y-4)+' l3 3 l6 -7" stroke="'+VE+'" stroke-width="1.6"/>'+tx(52,y,r[i],{s:10})}return o})()+
      persona(226,120,1.2)+persona(256,120,1.2)+persona(286,120,1.2)+tx(256,146,"socializado",{s:10,a:"middle"})+tx(256,158,"con todos",{s:10,a:"middle"}),168),
    pasos:["Pide el documento escrito (impreso o digital).","Revisa que nombre los riesgos reales del local: incendio siempre; fugas, derrames, explosión o BLEVE si hay gas, químicos o combustibles (si no hay, N/A).","Pregunta a un empleado al azar qué haría si hay un incendio: así sabes si lo socializaron.","Simulacro: pide fecha y evidencia (fotos, lista de asistencia)."],
    cumple:["Plan escrito, actualizado y con los riesgos reales del local.","Los empleados saben la ruta, el punto de encuentro y a quién llamar."],
    noCumple:["No existe plan (responde NO y las preguntas del plan se omiten).","Existe en papel pero nadie lo conoce."],
    ref:"Decreto 1072 de 2015 · Ley 1523 de 2012"},

  brigada:{titulo:"Brigada de emergencias",
    svg:svg(persona(60,120,1.6,AM)+persona(110,120,1.6,AM)+persona(160,120,1.6,AM)+
      ln(52,104,68,96,{c:AM,w:4})+ln(102,104,118,96,{c:AM,w:4})+ln(152,104,168,96,{c:AM,w:4})+
      doc(200,30,104,110,"CERTIFICADO")+tx(210,64,"Curso brigada",{s:10})+tx(210,78,"Nivel / clase",{s:10,c:MU})+'<circle cx="276" cy="114" r="14" stroke="'+AZ+'"/>'+tx(276,118,"CB",{s:10,c:AZ,a:"middle",w:700})+
      tx(110,150,"con nombre y certificado",{s:10,c:MU,a:"middle"}),160),
    pasos:["Pregunta quiénes son la brigada y anota cuántos son.","Pide los certificados de los cursos (primeros auxilios, control de fuego, evacuación).","Revisa quién los certificó y el nivel; si fue un cuerpo de bomberos, márcalo.","Si no hay brigada, responde NO: las preguntas de certificación se omiten y cuentan como NO."],
    cumple:["Brigadistas con nombre, certificados vigentes y del nivel que pide el local.","Conocen el plan y lo han practicado."],
    noCumple:["«Todos somos brigada» sin capacitación ni nombres.","Certificados vencidos o de un nivel menor al requerido."]},

  seguro:{titulo:"Póliza contra incendio",
    svg:svg(doc(40,10,180,150,"PÓLIZA")+
      tx(52,48,"Amparo:",{s:10,c:MU})+tx(100,48,"Incendio",{s:11,w:700})+
      tx(52,70,"Vigencia:",{s:10,c:MU})+tx(104,70,"desde – hasta",{s:11})+
      tx(52,92,"Riesgo:",{s:10,c:MU})+tx(98,92,"dirección del local",{s:11})+
      tx(52,114,"Actividad:",{s:10,c:MU})+tx(108,114,"la que hace",{s:11})+
      tx(52,136,"Aseguradora",{s:10,c:MU})+
      '<path d="M240 48 l4 4 l7 -8 M240 70 l4 4 l7 -8 M240 92 l4 4 l7 -8 M240 114 l4 4 l7 -8" stroke="'+VE+'" stroke-width="2.2"/>'+tx(258,84,"revisa",{s:10})+tx(258,96,"los 4",{s:10}),170),
    pasos:["Pide la póliza o su carátula (primera hoja).","Mira las fechas de vigencia: el día de hoy debe estar dentro.","Verifica que «incendio» esté en los amparos y que la dirección y la actividad sean las de este local.","Anota la aseguradora. Si no tienen póliza, responde NO: las demás preguntas del seguro se omiten."],
    cumple:["Póliza vigente con amparo de incendio.","Dirección y actividad asegurada coinciden con el local."],
    noCumple:["Póliza vencida o solo de otros riesgos (robo, responsabilidad civil).","Asegura otra dirección u otra actividad (ej. vivienda cuando es bodega)."]}
  };
})();

window.EJEMPLOS = {
  "m2_num":"Pregunta: «¿Cuántas personas trabajan aquí normalmente?»",
  "m3_cumple":"Ej.: «En la visita pasada se pidió señalizar la salida; hoy verifico si ya la hicieron.» Pide el informe anterior.",
  "m3_emerg":"Pregunta al encargado: «¿En el último año hubo algún incendio, conato o fuga en el local?»",
  "m3_reporte":"Pregunta: «¿Reportaron a bomberos o a la autoridad alguna condición de riesgo del local?»",
  "m3_tipo":"Si hubo emergencia, marca cuál: incendio, fuga/derrame (MATPEL), accidente laboral…",
  "m3_detuvo":"Pregunta: «¿Por esa emergencia tuvieron que cerrar o parar el negocio?»",
  "m3_sistemas":"Pregunta: «Cuando pasó, ¿el extintor / la alarma / la salida funcionaron bien?»",
  "m4_nueva":"Pregunta: «¿La construcción es reciente o es antigua?»",
  "m4_nsr":"Ej.: construcciones nuevas o con licencia reciente suelen cumplir NSR-10.",
  "m4_remod":"Pregunta: «¿Han hecho reformas o ampliaciones al local?»",
  "m4_lic":"Pide la licencia de construcción o pregunta si la tienen.",
  "m4_suelo":"Ej.: en cámara de comercio o planeación: que el uso (comercio, bodega…) esté permitido en esa dirección.",
  "m5_almac":"Mira la altura de estanterías/arrumes. Más de 3 m es alto.",
  "m5_activ":"Ej.: si hay estufa o soldadura junto a cartón/telas, la activación es alta.",
  "m6_deter":"Ej.: cables pelados, tomas quemadas, cajas sin tapa, empalmes con cinta.",
  "m6_estado":"Ej.: cableado entubado, ordenado, tablero rotulado = buen estado.",
  "m6_uso":"Ej.: muchos aparatos en una sola toma con «pulpo» = mal uso.",
  "m6_sobre":"Mira el tablero: ¿tiene breakers/tacos que corten ante una sobrecarga?",
  "m6_retie":"Pregunta: «¿La instalación eléctrica tiene certificación o dictamen RETIE, o revisión de un electricista reciente?» Pide ver el documento (certificado RETIE, fecha y nombre del profesional).",
  "m7_requiere":"Casi todo comercio con público o mercancía requiere extintores.",
  "m7_aprop":"Ej.: en cocina, extintor para grasa/eléctrico (ABC o K/CO₂), no solo agua.",
  "m7_superv":"Pregunta: «¿Alguien revisa periódicamente los extintores?»",
  "m8_movil":"Pregunta: «¿Podría salir alguien en silla de ruedas o con muletas por aquí?»",
  "m8_aforo":"Cuenta sillas/mesas o pregunta cuántos clientes atienden al tiempo.",
  "m9_plan":"Pregunta: «¿Tienen un plan de emergencia escrito con rutas y responsables?» Pide verlo.",
  "m9_simul":"Pregunta: «¿Han hecho un simulacro de evacuación este año?»",
  "m9_brigada":"Pregunta: «¿Hay personas capacitadas para primera respuesta (brigada)?»",
  "m10_seguro":"Pregunta: «¿Tienen seguro contra incendio vigente?» Pide ver la póliza.",
  "m10_poliza":"Ej.: que la póliza cubra la actividad real del local (comercio, bodega…)."
};

/* =========================================================================
   ACCIONES — qué debe hacer el propietario cuando un ítem NO cumple.
   Es el texto que sale impreso en el PDF junto a la foto del hallazgo, para
   que el dueño del establecimiento sepa exactamente qué corregir.
   Si un ítem no está aquí, se usa ACCION_MODULO por el prefijo (m7_, m8_…).
   ========================================================================= */
window.ACCIONES = {
  /* --- M3 · Antecedentes --- */
  m3_reporte:  "Reporte toda emergencia al Cuerpo de Bomberos (línea 119) apenas ocurra; el reporte tardío agrava el riesgo.",
  m3_sistemas: "Revise y reponga los equipos de protección que fallaron durante la emergencia anterior.",
  m3_cumple:   "Cumpla las recomendaciones del informe anterior antes de la próxima revisión.",

  /* --- M4 · Construcción y uso del suelo --- */
  m4_lic:      "Tramite la licencia de construcción ante Planeación Municipal.",
  m4_suelo:    "Solicite el certificado de uso del suelo ante Planeación Municipal.",
  m4_nsr:      "La edificación debe cumplir la NSR-10. Haga evaluar la estructura por un ingeniero civil.",
  m4_remod:    "Toda remodelación debe contar con licencia y respaldo técnico.",

  /* --- M5 · Carga de fuego y fuentes de ignición --- */
  m5_fuentes:  "Controle las fuentes de ignición detectadas: aléjelas de los materiales combustibles y manténgalas señalizadas.",
  m5_inflam:   "Almacene los líquidos inflamables en recipientes cerrados y rotulados, en zona ventilada y lejos de fuentes de calor.",
  m5_almac:    "Ordene el almacenamiento: separe pasillos, no obstruya salidas y mantenga 60 cm libres bajo el techo.",
  m5_activ:    "Delimite y señalice las áreas donde se realiza la actividad de riesgo.",

  /* --- M6 · Instalaciones eléctricas --- */
  m6_retie:    "Obtenga el certificado RETIE del electricista o ingeniero que ejecutó la instalación.",
  m6_estado:   "Contrate a un electricista certificado para corregir la instalación: tablero cerrado y rotulado, sin cables expuestos ni empalmes improvisados.",
  m6_deter:    "Reemplace el cableado, tomas e interruptores deteriorados. El material envejecido es causa frecuente de incendio.",
  m6_sobre:    "Elimine la sobrecarga: no conecte varios equipos en una sola toma ni use extensiones como instalación permanente.",
  m6_uso:      "Use los equipos eléctricos conforme a su diseño y capacidad.",

  /* --- M7 · Extintores --- */
  m7_cuenta:   "Dote el establecimiento con extintores adecuados al riesgo (NTC 2885 / NFPA 10).",
  m7_aprop:    "Cambie los extintores por el agente apropiado al tipo de fuego presente en el lugar.",
  m7_distrib:  "Redistribuya los extintores: el recorrido hasta el más cercano no debe superar 15 m (riesgo bajo) o 23 m según clase.",
  m7_instal:   "Instale los extintores entre 10 cm y 1,50 m del piso, sobre soporte firme y sin obstáculos delante.",
  m7_visible:  "Deje los extintores a la vista y de fácil acceso; no los tape con mercancía, muebles ni puertas.",
  m7_senal:    "Señalice cada extintor con la placa reglamentaria visible a distancia.",
  m7_recarga:  "Recargue o haga mantenimiento a los extintores vencidos. La recarga es anual.",
  m7_fisico:   "Reemplace los extintores con daño físico: manómetro fuera de rango, manguera rota, cilindro golpeado u oxidado.",
  m7_superv:   "Lleve la hoja de vida de los extintores con la inspección mensual firmada.",

  /* --- M8 · Evacuación y seguridad humana --- */
  m8_salidanorma:  "Adecue las salidas de emergencia al ancho y número exigidos por la NSR-10 Título J y K según el aforo.",
  m8_anchosalida:  "Amplíe el ancho libre de la salida; no debe reducirse con muebles, cajas ni puertas que invadan el paso.",
  m8_puertanorma:  "Las puertas de evacuación deben abrir en el sentido de la salida y sin llave ni candado durante la jornada.",
  m8_anchopuerta:  "Amplíe el ancho libre de la puerta de evacuación.",
  m8_cierre:       "Instale cierrapuertas y herrajes antipánico donde la norma los exija.",
  m8_despej:       "Mantenga permanentemente despejadas las rutas de evacuación. Retire todo lo que obstruya el paso.",
  m8_visible:      "Señalice las rutas de evacuación y salidas con señales fotoluminiscentes visibles desde cualquier punto.",
  m8_ilum:         "Instale iluminación de emergencia con batería de respaldo en rutas y salidas.",
  m8_ilumnorma:    "Ajuste la iluminación de emergencia: autonomía mínima de 90 minutos y nivel suficiente en el piso.",
  m8_luces:        "Reponga o repare las luces de emergencia que no encienden al cortar la energía.",
  m8_corrnorma:    "Adecue el ancho y la altura libre de los corredores de evacuación.",
  m8_anchocorr:    "Despeje y amplíe el corredor: debe permitir el paso del aforo sin estrechamientos.",
  m8_escnorma:     "Adecue las escaleras: huella, contrahuella, pasamanos a ambos lados y superficie antideslizante.",
  m8_anchoesc:     "Amplíe el ancho libre de la escalera de evacuación.",
  m8_escext:       "Habilite o repare la escalera exterior de emergencia.",
  m8_rampnorma:    "Adecue la rampa: pendiente máxima, pasamanos y piso antideslizante.",
  m8_anchoramp:    "Amplíe el ancho libre de la rampa.",
  m8_psalidanorma: "Adecue el punto de salida: debe desembocar en zona segura a nivel de la vía pública.",
  m8_anchopsalida: "Amplíe el ancho del punto de salida.",
  m8_descext:      "Garantice que la descarga de la evacuación llegue al exterior sin pasar por zonas de riesgo.",
  m8_descaforo:    "La descarga debe tener capacidad suficiente para el aforo total del establecimiento.",
  m8_cantdesc:     "Habilite el número de descargas que exige la norma para este aforo.",
  m8_egreso:       "Garantice al menos dos medios de egreso independientes y remotos entre sí.",
  m8_egresoevac:   "Verifique que los medios de egreso permitan evacuar a todo el aforo en el tiempo seguro.",
  m8_aforo:        "Calcule y publique el aforo máximo en un aviso visible en la entrada.",
  m8_aforonsr:     "Ajuste el aforo real al que permite la NSR-10 para esta ocupación y área.",
  m8_cortafuego:   "Instale o repare los elementos cortafuego (muros, puertas, sellos) exigidos para separar áreas de riesgo.",
  m8_movil:        "Retire o asegure el mobiliario que reduce el ancho de evacuación.",
  m8_proced:       "Documente y divulgue el procedimiento de evacuación entre todo el personal.",
  m8_autoensayo:   "Realice al menos un simulacro de evacuación al año y deje acta.",
  m8_monitoreo:    "Instale detección y alarma de incendio conforme al riesgo, con monitoreo permanente.",

  /* --- M9 · Preparación ante emergencias --- */
  m9_plan:     "Elabore el Plan de Emergencias y Contingencias del establecimiento (Decreto 1072/2015) y manténgalo actualizado.",
  m9_brigada:  "Conforme la brigada de emergencias con personal del establecimiento.",
  m9_bricert:  "Capacite y certifique a los brigadistas en primeros auxilios, control de incendios y evacuación.",
  m9_brinivel: "Eleve el nivel de formación de la brigada según el riesgo del establecimiento.",
  m9_briclase: "Complete la brigada con las clases que faltan (incendios, primeros auxilios, evacuación).",
  m9_bribom:   "Coordine con el Cuerpo de Bomberos la capacitación de la brigada.",
  m9_simul:    "Realice simulacros periódicos y registre los resultados.",
  m9_s_bom:    "Registre y divulgue la línea del Cuerpo de Bomberos (119) en un lugar visible.",
  m9_s_bri:    "Publique los nombres y contactos de la brigada en cartelera.",
  m9_s_com:    "Defina el canal de comunicación con la comunidad vecina ante una emergencia.",
  m9_s_emp:    "Informe y entrene a todos los empleados sobre el plan de emergencias.",
  m9_s_soc:    "Socialice el plan de emergencias con todos los ocupantes del establecimiento.",

  /* --- M10 · Seguros --- */
  m10_seguro:  "Contrate una póliza de incendio que ampare el inmueble y su contenido.",
  m10_poliza:  "Mantenga la póliza vigente y a disposición en el establecimiento.",
  m10_aseg:    "Ajuste el valor asegurado al valor real del inmueble y su contenido.",
  m8_procaño:  "Realice la inspección, prueba y mantenimiento anual de salidas, señalización e iluminación de emergencia y deje el registro firmado.",
  m9_r_inc:    "Incluya el riesgo de incendio en el plan de emergencias, con su procedimiento de respuesta y responsables.",
  m9_r_fugas:  "Incluya en el plan de emergencias el procedimiento ante fugas de gas u otras sustancias: corte, ventilación y evacuación.",
  m9_r_derr:   "Incluya en el plan de emergencias el procedimiento ante derrames: contención, material absorbente y disposición segura.",
  m9_r_expl:   "Incluya en el plan de emergencias el riesgo de explosión, con las zonas de exclusión y la ruta de evacuación.",
  m9_r_bleve:  "Incluya en el plan el riesgo BLEVE (cilindros de gas a presión): ubicación ventilada, lejos de calor, y distancia de evacuación."
};

/* Acción por defecto según el módulo, cuando el ítem no tiene una específica. */
window.ACCION_MODULO = {
  m2:  "Corrija lo observado en los datos del establecimiento.",
  m3:  "Atienda las recomendaciones derivadas de la emergencia anterior.",
  m4:  "Regularice la situación constructiva ante Planeación Municipal.",
  m5:  "Controle la carga de fuego y las fuentes de ignición del establecimiento.",
  m6:  "Haga revisar y corregir la instalación eléctrica por personal certificado.",
  m7:  "Adecue los extintores conforme a la NTC 2885 / NFPA 10.",
  m8:  "Adecue los medios de evacuación conforme a la NSR-10 Títulos J y K.",
  m9:  "Fortalezca la preparación del establecimiento ante emergencias.",
  m10: "Revise la cobertura de seguros del establecimiento."
};

/* =========================================================================
   TIPOS DE ESTABLECIMIENTO — lista desplegable del censo de barrido.
   ========================================================================= */
window.TIPOS_ESTABLECIMIENTO = [
  "Tienda / minimercado",
  "Supermercado / autoservicio",
  "Restaurante / comidas rápidas",
  "Panadería / repostería",
  "Bar / discoteca / estanco",
  "Hotel / hospedaje / residencia",
  "Droguería / farmacia",
  "Papelería / miscelánea",
  "Almacén de ropa / calzado",
  "Ferretería / depósito de materiales",
  "Bodega / almacenamiento",
  "Taller mecánico / lubricentro",
  "Estación de servicio / combustibles",
  "Depósito de gas (GLP)",
  "Institución educativa",
  "Centro de salud / consultorio / laboratorio",
  "Oficina / entidad pública",
  "Banco / cooperativa / giros",
  "Iglesia / centro de culto",
  "Salón de eventos / centro recreativo",
  "Gimnasio / centro deportivo",
  "Peluquería / barbería / estética",
  "Internet / videojuegos / telecomunicaciones",
  "Carpintería / ebanistería",
  "Industria / planta de procesamiento",
  "Vivienda con actividad comercial",
  "Otro"
];

/* Estados posibles del certificado al momento del censo. */
window.ESTADOS_CENSO = [
  { v:"vigente",   t:"Tiene certificado vigente",      k:"vigente"   },
  { v:"porvencer", t:"Lo tiene, pero vence pronto",    k:"porvencer" },
  { v:"vencido",   t:"Lo tuvo, está vencido",          k:"vencido"   },
  { v:"notiene",   t:"Nunca ha tenido certificado",    k:"sinrev"    },
  { v:"nomostro",  t:"No lo quiso o no lo pudo mostrar", k:"sinrev"  },
  { v:"cerrado",   t:"Cerrado / no atendieron",        k:"sinrev"    }
];

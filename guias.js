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
  "m3_cumple":"¿Arreglaron lo recomendado en la visita anterior? Si es la primera visita, marca NO.",
  "m3_emerg":"¿Hubo incendio u otra emergencia en el último año?",
  "m3_sistemas":"Si hubo emergencia, ¿funcionaron extintores/alarmas/salidas?",
  "m4_tipo":"Mira de qué está hecha la estructura: concreto resiste más; madera/aglomerado, menos.",
  "m4_propv":"¿Qué tan fácil subiría el fuego entre pisos? (ductos, vacíos, escaleras sin puerta).",
  "m4_proph":"¿Qué tan fácil se correría el fuego en el mismo piso? (mucho material junto, sin muros).",
  "m4_suelo":"¿El uso del suelo permite esta actividad aquí? (consulta POT/planeación).",
  "m4_altura":"Número de pisos sobre el nivel de la calle.",
  "m4_areapiso":"Área aproximada de cada piso en m² (usa el flexómetro).",
  "m5_almac":"Altura a la que apilan la mercancía. Más de 3 m dificulta apagar y evacuar.",
  "m5_fuentes":"Marca SOLO lo que veas presente. Si no hay ninguna fuente, no marques nada (suma el punto).",
  "m5_activ":"¿Qué tan probable es que esas fuentes enciendan algo? (cercanía a combustibles).",
  "m5_inflam":"¿Los materiales del local arden fácil? (telas, papel, espuma = alta).",
  "m6_deter":"Busca cables pelados, tomas quemadas, cajas sin tapa.",
  "m6_estado":"Instalación ordenada, entubada, sin empalmes a la vista = buen estado.",
  "m6_uso":"¿Usan bien la instalación o hay 'pulpos'/extensiones sobrecargadas?",
  "m6_sobre":"¿Hay breakers/tacos (protección contra sobrecarga)?",
  "m6_retie":"¿Tienen dictamen o revisión eléctrica RETIE reciente?",
  "m7_requiere":"Casi todo comercio requiere extintores según NSR-10.",
  "m7_cuenta":"¿Hay extintores instalados?",
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
  "m10_seguro":"¿Tienen póliza de incendio vigente?"
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

window.ITEM_TOPIC = {
  "m7_instal":"extintor_altura","m7_distrib":"extintor_distrib","m7_recarga":"extintor_recarga","m7_senal":"senalizacion","m7_visible":"extintor_distrib",
  "m8_visible":"senalizacion","m8_despej":"evacuacion","m8_ilum":"ilum_emergencia","m8_luces":"ilum_emergencia",
  "m8_anchocorr":"salida_ancho","m8_anchopuerta":"salida_ancho","m8_anchoesc":"salida_ancho","m8_anchosalida":"salida_ancho","m8_anchopsalida":"salida_ancho","m8_aforo":"aforo",
  "m6_deter":"electrico","m6_estado":"electrico","m6_uso":"electrico","m6_sobre":"electrico",
  "m5_fuentes":"fuentes","m4_tipo":"estructura"
};

var S='stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
var T='stroke="none" font-family="sans-serif" font-weight="600"';
window.DIAGRAMS = {
  extintor_altura:{titulo:"Altura del extintor",
    tips:["La parte de arriba del extintor: máx. 1,50 m del piso.","Si es muy pesado (>18 kg): máx. 1,00 m.","Nunca tirado en el piso."],
    svg:'<svg viewBox="0 0 220 130" '+S+'><line x1="30" y1="15" x2="30" y2="120"/><line x1="30" y1="120" x2="210" y2="120"/>'+
      '<g fill="var(--ember)" stroke="var(--ember)"><rect x="92" y="48" width="30" height="52" rx="10"/><rect x="103" y="38" width="8" height="12" rx="2"/><path d="M103 42 L85 42" fill="none"/></g>'+
      '<line x1="55" y1="38" x2="55" y2="120" stroke-dasharray="5 5"/><path d="M55 38 L92 38" stroke-dasharray="5 5"/>'+
      '<path d="M50 120 L55 112 M50 120 L60 115 M55 38 L50 46 M55 38 L60 46"/>'+
      '<text x="130" y="62" fill="currentColor" font-size="13" '+T+'>máx</text><text x="130" y="80" fill="currentColor" font-size="13" '+T+'>1,50 m</text></svg>'},
  extintor_distrib:{titulo:"Dónde van los extintores",
    tips:["Desde cualquier punto, un extintor a máx. ~15 m caminando.","Repartidos, no todos juntos.","Cerca de salidas y zonas de riesgo (cocina, tablero)."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="18" y="16" width="184" height="86" rx="5"/>'+
      '<g fill="var(--ember)" stroke="var(--ember)"><rect x="46" y="48" width="12" height="20" rx="4"/><rect x="162" y="48" width="12" height="20" rx="4"/></g>'+
      '<path d="M60 58 L160 58" stroke-dasharray="6 5"/><text x="92" y="50" fill="currentColor" font-size="13" '+T+'>≤ 15 m</text>'+
      '<path d="M26 92 h20 M174 92 h20"/></svg>'},
  extintor_recarga:{titulo:"Extintor vigente",
    tips:["Etiqueta de recarga de menos de 1 año.","Manómetro con la aguja en VERDE.","Sello/seguro intacto."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><circle cx="62" cy="60" r="36"/><path d="M62 60 L84 42"/>'+
      '<path d="M34 60 A28 28 0 0 1 90 60" stroke="var(--verde)" stroke-width="5"/><text x="48" y="104" fill="var(--verde)" font-size="12" '+T+'>verde</text>'+
      '<rect x="128" y="40" width="74" height="40" rx="5"/><text x="140" y="58" fill="currentColor" font-size="12" '+T+'>RECARGA</text><text x="140" y="74" fill="currentColor" font-size="12" '+T+'>&lt; 1 año</text></svg>'},
  salida_ancho:{titulo:"Ancho de salida",
    tips:["Mide el ancho LIBRE con el flexómetro.","Ideal ≥ 1,20 m.","Sin objetos que reduzcan el paso."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><line x1="48" y1="18" x2="48" y2="104"/><line x1="172" y1="18" x2="172" y2="104"/>'+
      '<g stroke="currentColor"><circle cx="110" cy="46" r="9"/><path d="M110 55 L110 82 M96 98 L110 78 L124 98"/></g>'+
      '<path d="M48 104 L172 104"/><path d="M48 104 L60 98 M48 104 L60 110 M172 104 L160 98 M172 104 L160 110"/>'+
      '<text x="84" y="100" fill="currentColor" font-size="13" '+T+'>≥ 1,20 m</text></svg>'},
  evacuacion:{titulo:"Ruta de evacuación despejada",
    tips:["Pasillos y salidas sin cajas ni mesas.","Puertas sin candado en horario.","La ruta lleva a la calle o a sitio seguro."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="16" y="18" width="188" height="84" rx="5"/>'+
      '<path d="M40 60 L150 60" stroke-dasharray="7 5"/><path d="M150 60 L138 53 M150 60 L138 67"/>'+
      '<rect x="168" y="40" width="26" height="40" rx="3" fill="var(--verde)" stroke="var(--verde)"/><text x="170" y="64" fill="#fff" font-size="10" '+T+'>SAL</text>'+
      '<g stroke="currentColor"><circle cx="60" cy="52" r="7"/><path d="M60 59 L60 78 M50 90 L60 74 L70 90"/></g></svg>'},
  ilum_emergencia:{titulo:"Luz de emergencia",
    tips:["Enciende SOLA cuando se va la energía.","Apunta a la ruta de salida.","Pruébala: córtale la luz y debe prender."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="78" y="30" width="64" height="26" rx="5"/>'+
      '<circle cx="94" cy="43" r="6" fill="var(--ambar)" stroke="var(--ambar)"/><circle cx="126" cy="43" r="6" fill="var(--ambar)" stroke="var(--ambar)"/>'+
      '<g stroke="var(--ambar)"><path d="M80 60 L66 82 M94 58 L94 80 M110 58 L110 80 M126 58 L126 80 M140 60 L154 82"/></g>'+
      '<text x="150" y="46" fill="currentColor" font-size="12" '+T+'>auto</text></svg>'},
  senalizacion:{titulo:"Señalización",
    tips:["SALIDA (verde) visible desde lejos.","Señal de extintor (roja) sobre cada equipo.","A buena altura, sin tapar."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="22" y="38" width="76" height="44" rx="5" fill="var(--verde)" stroke="var(--verde)"/>'+
      '<text x="31" y="66" fill="#fff" font-size="15" '+T+'>SALIDA</text>'+
      '<rect x="124" y="38" width="74" height="44" rx="5" fill="var(--rojo)" stroke="var(--rojo)"/>'+
      '<g fill="#fff" stroke="#fff"><rect x="150" y="50" width="12" height="20" rx="4"/><text x="166" y="66" fill="#fff" font-size="11" '+T+'>EXT</text></g></svg>'},
  aforo:{titulo:"Aforo (cuántas personas)",
    tips:["Número máximo de personas al tiempo.","Se calcula según el área y el uso (NSR-10).","Más gente = salidas más anchas y más señales."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="16" y="18" width="188" height="84" rx="5"/>'+
      '<g stroke="currentColor"><circle cx="46" cy="48" r="7"/><path d="M46 55 L46 74 M37 86 L46 70 L55 86"/></g>'+
      '<g stroke="currentColor"><circle cx="74" cy="48" r="7"/><path d="M74 55 L74 74 M65 86 L74 70 L83 86"/></g>'+
      '<text x="112" y="68" fill="currentColor" font-size="22" '+T+'>× 50</text></svg>'},
  electrico:{titulo:"Instalación eléctrica",
    tips:["Tablero con breakers (no fusibles improvisados).","Sin 'pulpos' ni extensiones sobrecargadas.","Cables entubados, tomas en buen estado."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="30" y="26" width="58" height="64" rx="5"/>'+
      '<g stroke="currentColor"><line x1="44" y1="40" x2="74" y2="40"/><line x1="44" y1="54" x2="74" y2="54"/><line x1="44" y1="68" x2="74" y2="68"/></g>'+
      '<text x="36" y="104" fill="currentColor" font-size="11" '+T+'>tablero</text>'+
      '<g stroke="var(--rojo)" stroke-width="3"><circle cx="150" cy="56" r="22"/><path d="M135 71 L165 41"/></g><text x="126" y="104" fill="var(--rojo)" font-size="11" '+T+'>no pulpos</text></svg>'},
  fuentes:{titulo:"Fuentes de ignición",
    tips:["Marca solo lo que realmente veas.","Ej.: estufa, soldadura, chispas, fumadores.","Si no hay ninguna, no marques (suma el punto)."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><path d="M70 96 C46 78 64 60 70 40 C82 58 100 66 84 92 C81 99 73 100 70 96 Z" fill="var(--ember)" stroke="var(--ember)"/>'+
      '<path d="M140 92 L158 54 L150 72 L172 60 L150 96" stroke="var(--ambar)" stroke-width="3"/><text x="120" y="110" fill="currentColor" font-size="11" '+T+'>llama / chispa</text></svg>'},
  estructura:{titulo:"Tipo de construcción",
    tips:["Concreto / muros = resiste más al fuego.","Metálica = media.","Madera o aglomerado = arde fácil."],
    svg:'<svg viewBox="0 0 220 120" '+S+'><rect x="26" y="34" width="48" height="58"/><line x1="26" y1="50" x2="74" y2="50"/><line x1="50" y1="34" x2="50" y2="92"/><text x="24" y="106" fill="var(--verde)" font-size="10" '+T+'>concreto</text>'+
      '<path d="M100 92 L100 50 L148 50 L148 92" /><text x="104" y="106" fill="currentColor" font-size="10" '+T+'>metálica</text>'+
      '<path d="M170 92 L170 52 L196 52 L196 92 M170 62 h26 M170 72 h26" stroke="var(--ambar)"/><text x="166" y="106" fill="var(--ambar)" font-size="10" '+T+'>madera</text></svg>'}
};

/* Ejemplos para guiar al inspector (puede leerlos o preguntarlos al encargado del local). */
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
  m10_aseg:    "Ajuste el valor asegurado al valor real del inmueble y su contenido."
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

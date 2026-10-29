/*
 * form-inspeccion.js
 * Definición del formulario oficial de inspección técnica (DNBC — "Formato de
 * inspección técnica", Versión 1 - 2022, Curso Inspector de Seguridad Básico).
 * Fuente: Leccin_10_MD_Formato_de_inspeccin_tcnica_nivel_bsico_3.xlsx
 *
 * Método de puntaje (MESERI simplificado adoptado por la DNBC):
 *   X = suma de factores AGRAVANTES (módulos 2-6), máx 64
 *   Y = suma de factores REDUCTORES/protectores (módulos 7-10), máx 84
 *   TOTAL = X + Y (máx 148) -> se normaliza a 0-100.
 *   En todos los ítems: más puntos = más seguro (menor riesgo).
 *
 * Matriz de concepto (sobre 0-100):
 *   0 - 50  : riesgo ALTO  -> NO favorable, remitir a autoridades, mejora inmediata
 *   51 - 80 : riesgo MEDIO -> NO favorable, remitir a autoridades, mejora inmediata
 *   81 - 100: riesgo BAJO  -> FAVORABLE con observaciones a subsanar a corto plazo
 *
 * NOTA (confirmar con rúbrica DNBC): la normalización a 100 es la interpretación
 * razonable del formato; el puntaje crudo X+Y llega a 148. Parametrizable abajo.
 */
window.FORM_META = {
  titulo: "Formato de inspección técnica",
  version_formato: "V1 - 2022 (DNBC)",
  maxAgravantes: 64,   // X
  maxReductores: 84,   // Y
  maxTotal: 148,
  normalizarA100: true,
  matriz: [
    { min: 0,  max: 50,  riesgo: "ALTO",  favorable: false, texto: "Condición de riesgo de incendio ALTA. No se genera concepto favorable; desarrollar plan de mejoramiento inmediato. Remitir informe a autoridades competentes." },
    { min: 51, max: 80,  riesgo: "MEDIO", favorable: false, texto: "Condición de riesgo de incendio MEDIA. No se genera concepto favorable; desarrollar plan de mejoramiento inmediato. Remitir informe a autoridades competentes." },
    { min: 81, max: 100, riesgo: "BAJO",  favorable: true,  texto: "Condición de riesgo de incendio BAJA. Se genera concepto FAVORABLE con observaciones que deben ser subsanadas a corto plazo." }
  ]
};

/* Clasificación de la ocupación NSR-10 (Módulo 1) */
window.OCUPACIONES_NSR10 = [
  { c: "A-1", t: "Riesgo moderado" }, { c: "A-2", t: "Riesgo bajo" },
  { c: "C-1", t: "Servicios" }, { c: "C-2", t: "Bienes" },
  { c: "E",   t: "Especiales" },
  { c: "F-1", t: "Riesgo moderado" }, { c: "F-2", t: "Riesgo bajo" },
  { c: "I-1", t: "Reclusión" }, { c: "I-2", t: "Salud" }, { c: "I-3", t: "Educación" },
  { c: "I-4", t: "Seguridad pública" }, { c: "I-5", t: "Servicio público" },
  { c: "L-1", t: "Deportivos" }, { c: "L-2", t: "Culturales" }, { c: "L-3", t: "Sociales" },
  { c: "L-4", t: "Religiosos" }, { c: "L-5", t: "De transporte" },
  { c: "M",   t: "Mixtos" }, { c: "P", t: "Alta peligrosidad" }, { c: "T", t: "Temporales" },
  { c: "R-1", t: "Uni / Bifamiliar" }, { c: "R-2", t: "Multifamiliar" }, { c: "R-3", t: "Hoteles" }
];

/* Helpers de opciones */
function SINO(pSi, pNo){ return [{v:"SI",p:pSi},{v:"NO",p:pNo}]; }
function SINONA(pSi, pNo, pNa){ return [{v:"SI",p:pSi},{v:"NO",p:pNo},{v:"N/A",p:pNa}]; }

window.MODULOS = [
  /* ===================== FACTORES AGRAVANTES (X) ===================== */
  {
    id: "m2", titulo: "Módulo 2. Datos de empleados", clase: "agravante", max: 8,
    items: [
      { id:"m2_num",  label:"Número de empleados", tipo:"select",
        opts:[{v:"< 10",p:5},{v:"11 a 50",p:3},{v:"> 51",p:0}] },
      { id:"m2_comp", label:"Composición del personal", tipo:"select",
        opts:[{v:"Son solo hombres",p:3},{v:"Son solo mujeres",p:3},
              {v:"Son hombres y mujeres",p:2},
              {v:"Hay hombres y mujeres con dificultades de movilidad",p:0}] }
    ]
  },
  {
    id: "m3", titulo: "Módulo 3. Antecedentes de la estructura", clase: "agravante", max: 9,
    items: [
      { id:"m3_cumple", label:"Se evidencia el cumplimiento de los requerimientos generados en la inspección anterior.", tipo:"sino", opts:SINO(1,0) },
      { id:"m3_emerg",  label:"El establecimiento o edificación presentó emergencias en el último año.", tipo:"sino", opts:SINO(0,1) },
      { id:"m3_reporte",label:"Se evidencia reporte a la autoridad competente por el riesgo del establecimiento.", tipo:"sino", opts:SINO(1,0) },
      { id:"m3_tipo",   label:"Tipo de emergencia ocurrida en el establecimiento o edificación.", tipo:"select", score:false, dependsOn:{item:"m3_emerg",value:"SI"},
        opts:[{v:"Incendios",p:0},{v:"Emergencias MATPEL",p:0},{v:"Accidentes laborales",p:0},{v:"Otro tipo de emergencias",p:0}] },
      { id:"m3_detuvo", label:"Se detuvo la actividad económica del establecimiento o edificación.", tipo:"sino", opts:SINO(0,1), dependsOn:{item:"m3_emerg",value:"SI"} },
      { id:"m3_sistemas",label:"Los sistemas o equipos para supresión de fuego y seguridad humana funcionaron adecuadamente.", tipo:"sino", opts:SINO(5,0), dependsOn:{item:"m3_emerg",value:"SI"} }
    ]
  },
  {
    id: "m4", titulo: "Módulo 4. Características de la edificación", clase: "agravante", max: 23,
    items: [
      { id:"m4_nueva", label:"La edificación es nueva.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_nsr",   label:"Aplica NSR-10.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_remod", label:"La edificación tiene modificación / remodelación.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_lic",   label:"La edificación cuenta con licencia de construcción.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_tipo",  label:"Tipo de construcción (alta o baja resistencia al fuego).", tipo:"select",
        opts:[{v:"Aporticado",p:4},{v:"Muros de carga",p:3},{v:"Madera",p:2},{v:"Metálica",p:1},{v:"Material aglomerado",p:0}] },
      { id:"m4_propv", label:"Facilidad de la propagabilidad vertical del fuego.", tipo:"select",
        opts:[{v:"Alta",p:0},{v:"Media",p:1},{v:"Baja",p:2}] },
      { id:"m4_proph", label:"Facilidad de la propagabilidad horizontal del fuego.", tipo:"select",
        opts:[{v:"Alta",p:0},{v:"Media",p:1},{v:"Baja",p:2}] },
      { id:"m4_suelo", label:"Aplica el uso del suelo para la actividad desarrollada.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_altura",label:"Altura edificación.", tipo:"select",
        opts:[{v:"1 a 3 pisos (9 m)",p:1},{v:"> 3 pisos (> 9 m)",p:0}] },
      { id:"m4_areapiso",label:"Área construida por piso.", tipo:"select",
        opts:[{v:"Hasta 299 m²",p:2},{v:"300 a 999 m²",p:1},{v:"1000 a >1100 m²",p:0}] },
      { id:"m4_nsub",  label:"Número de subniveles del establecimiento o edificación.", tipo:"select",
        opts:[{v:"1 a 2",p:1},{v:"> 3",p:0}] },
      { id:"m4_areasub",label:"Área construida por subnivel.", tipo:"select",
        opts:[{v:"0 a 100 m²",p:3},{v:"101 a 200 m²",p:2},{v:"> 200 m²",p:0}] },
      { id:"m4_actsub",label:"Se realiza alguna otra actividad comercial en los subniveles.", tipo:"sino", opts:SINO(0,1) },
      { id:"m4_ocup500",label:"La carga de ocupantes de todo el establecimiento es mayor a 500 personas.", tipo:"sino", opts:SINO(0,1) },
      { id:"m4_ocup100",label:"Se tienen cargas de ocupación mayores a 100 personas por encima o por debajo del nivel de descarga de la salida.", tipo:"sino", opts:SINO(0,1) }
    ]
  },
  {
    id: "m5", titulo: "Módulo 5. Condiciones generales de riesgo de incendio", clase: "agravante", max: 19,
    items: [
      { id:"m5_almac", label:"Altura de almacenamiento de las mercancías.", tipo:"select",
        opts:[{v:"0 - 3 m",p:1},{v:"> 3 m",p:0}] },
      { id:"m5_fuentes", label:"Fuentes de ignición que se pueden observar.", tipo:"fuentes",
        maxPuntos:14, puntosPorAusencia:1,
        nota:"1 punto por cada fuente NO presente (máx 14). Marque las fuentes observadas.",
        fuentes:["Eléctricas","Roces y fricción","Chispas mecánicas","Fumadores","Ignición espontánea",
                 "Superficies calientes","Generación de brasas","Manipulación llamas abiertas","Soldadura y corte",
                 "Recalentamiento mercancías","Electricidad estática","Hornos","Mecheros, fósforos o candelas","Manejo de químicos"] },
      { id:"m5_activ", label:"Riesgos de activación de las fuentes de ignición.", tipo:"select",
        opts:[{v:"Alto",p:0},{v:"Medio",p:1},{v:"Bajo",p:2}] },
      { id:"m5_inflam",label:"Inflamabilidad de los materiales de la edificación o establecimiento.", tipo:"select",
        opts:[{v:"Baja",p:2},{v:"Media",p:1},{v:"Alta",p:0}] }
    ]
  },
  {
    id: "m6", titulo: "Módulo 6. Condición y protección de los sistemas eléctricos", clase: "agravante", max: 5,
    items: [
      { id:"m6_deter", label:"Cuenta con equipos y/o componentes eléctricos deteriorados.", tipo:"sino", opts:SINO(0,1) },
      { id:"m6_estado",label:"Se observa que el estado de las instalaciones eléctricas es bueno.", tipo:"sino", opts:SINO(1,0) },
      { id:"m6_uso",   label:"Se observa un uso adecuado de las instalaciones eléctricas.", tipo:"sino", opts:SINO(0,1), nota:"Puntaje según formato oficial (revisar posible inversión SI/NO)." },
      { id:"m6_sobre", label:"Se cuenta con sistemas de protección de sobrecargas.", tipo:"sino", opts:SINO(1,0) },
      { id:"m6_retie", label:"El sistema eléctrico ha sido revisado con base en el RETIE en los últimos años.", tipo:"sino", opts:SINO(1,0) }
    ]
  },

  /* ===================== FACTORES REDUCTORES (Y) ===================== */
  {
    id: "m7", titulo: "Módulo 7. Extintores portátiles", clase: "reductor", max: 11,
    items: [
      { id:"m7_requiere", label:"El establecimiento y/o edificación requiere extintores según la norma (NSR-10).", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_cuenta",   label:"El establecimiento y/o edificación cuenta con extintores.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_aprop",    label:"Los extintores son los apropiados para el riesgo existente.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_distrib",  label:"Los extintores están distribuidos según la norma (NTC 2885 - NFPA 10).", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_senal",    label:"Los extintores están adecuadamente señalizados.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_visible",  label:"Los extintores están despejados y visibles.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_instal",   label:"Los extintores están adecuadamente instalados (altura).", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_recarga",  label:"Los extintores se observan recargados y vigentes.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_fisico",   label:"Los extintores se observan físicamente buenos.", tipo:"sino", opts:SINO(1,0) },
      { id:"m7_superv",   label:"Los extintores cuentan con supervisión permanente.", tipo:"sino", opts:SINO(2,0) }
    ]
  },
  {
    id: "m8", titulo: "Módulo 8. Seguridad humana (medios de evacuación, señalización e iluminación)", clase: "reductor", max: 45,
    toggle: { id:"m8_aplica", label:"Para el establecimiento aplican los requerimientos de evacuación, señalización e iluminación por el aforo generado.",
              siItems:true, noScore:45,
              nota:"Si NO aplica por aforo: puntúa 45 automático y se omiten los demás ítems." },
    items: [
      { id:"m8_egreso", label:"Cuenta con medios de egreso.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_visible",label:"Están visibles y señalizados.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_despej", label:"Están despejados, libres de obstáculos.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_ilum",   label:"Están iluminados con luces de emergencia de acuerdo a la norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_movil",  label:"Los medios de egreso permiten la evacuación de personas con movilidad reducida.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_aforo",  label:"Aforo del establecimiento.", tipo:"select", opts:[{v:"1 a 50 personas",p:1},{v:"≥ 51 personas",p:0}] },
      { id:"m8_aforonsr",label:"El aforo está calculado con base en la carga de ocupación (NSR-10).", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_descaforo",label:"Las descargas del establecimiento garantizan el aforo.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_egresoevac",label:"Los medios de egreso garantizan la evacuación requerida.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchocorr",label:"Anchos de acceso a las salidas (corredores).", tipo:"select", opts:[{v:"0,80 m < 1,20",p:1},{v:"≥ 1,20 m",p:2},{v:"N/A",p:0}] },
      { id:"m8_corrnorma",label:"Corredores: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchopuerta",label:"Anchos (puertas).", tipo:"select", opts:[{v:"0,80 < 1,20 m",p:1},{v:"≥ 1,20 m",p:2},{v:"N/A",p:2}] },
      { id:"m8_puertanorma",label:"Puertas: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchoesc",label:"Anchos (escaleras).", tipo:"select", opts:[{v:"0,90 a 1,20 m",p:1},{v:"≥ 1,20 m",p:2},{v:"N/A",p:2}] },
      { id:"m8_escnorma",label:"Escaleras: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchoramp",label:"Ancho (rampas).", tipo:"select", opts:[{v:"0,90 a 1,20 m",p:1},{v:"≥ 1,20 m",p:2},{v:"N/A",p:2}] },
      { id:"m8_rampnorma",label:"Rampas: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchosalida",label:"Ancho de salida (escalera, corredor, rampa).", tipo:"select", opts:[{v:"0,90 a 1,20 m",p:1},{v:"≥ 1,20 m",p:2}] },
      { id:"m8_salidanorma",label:"Salida: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_anchopsalida",label:"Anchos puerta de salida.", tipo:"select", opts:[{v:"0,90 a 1,20 m",p:1},{v:"≥ 1,20 m",p:2}] },
      { id:"m8_psalidanorma",label:"Puerta de salida: es el ancho requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_cantdesc",label:"Cantidad de descargas.", tipo:"select", opts:[{v:"1",p:1},{v:"2",p:2},{v:"3",p:3},{v:"Más de 3",p:4}] },
      { id:"m8_descext",label:"La descarga es al exterior del establecimiento o edificación.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_cortafuego",label:"Tiene puertas cortafuego certificadas.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m8_cierre",  label:"Las puertas cuentan con mecanismos de cierre.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m8_escext",  label:"La estructura cuenta con escaleras exteriores.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_luces",   label:"Cuenta con luces de emergencia.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_autoensayo",label:"El sistema de iluminación de emergencia cuenta con auto-ensayo.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_ilumnorma",label:"El sistema de iluminación de emergencia es el requerido por norma.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_proced", label:"Cuenta con procedimiento de inspección para los componentes de evacuación, señalización e iluminación.", tipo:"sino", opts:SINO(2,0) },
      { id:"m8_procaño",label:"Se ha realizado el procedimiento de inspección, prueba y mantenimiento el último año.", tipo:"sino", opts:SINO(2,0) },
      { id:"m8_monitoreo",label:"El sistema cuenta con vigilancia - monitoreo permanente.", tipo:"sino", opts:SINO(2,0) }
    ]
  },
  {
    id: "m9", titulo: "Módulo 9. Organización interna para la atención de incendios y emergencias", clase: "reductor", max: 18,
    toggle: { id:"m9_aplica", label:"Para el establecimiento aplican los requerimientos sobre planes de emergencia.",
              siItems:true, noScore:18,
              nota:"Si NO aplica: puntúa 18 automático y se omiten los demás ítems." },
    items: [
      { id:"m9_plan",   label:"Cuenta con plan de emergencias.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_r_inc",  label:"Riesgo contemplado: Incendio.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_r_fugas",label:"Riesgo contemplado: Fugas.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m9_r_derr", label:"Riesgo contemplado: Derrames.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m9_r_expl", label:"Riesgo contemplado: Explosiones.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m9_r_bleve",label:"Riesgo contemplado: BLEVEs.", tipo:"sino_na", opts:SINONA(1,0,1) },
      { id:"m9_s_emp",  label:"Plan socializado con: Empleados.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_s_bom",  label:"Plan socializado con: Bomberos.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_s_com",  label:"Plan socializado con: Comunidad.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_s_soc",  label:"Plan socializado con: Organismos de socorro.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_s_bri",  label:"Plan socializado con: Brigada de emergencias.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_simul",  label:"Se han realizado simulacros en el último año.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_brigada",label:"Tiene brigada de emergencias.", tipo:"sino", opts:SINO(1,0), extra:"num_integrantes" },
      { id:"m9_bricert",label:"La brigada de emergencias está certificada por niveles o clases.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_briclase",label:"Clase de brigada o nivel con que se cuenta.", tipo:"select", opts:[{v:"1",p:1},{v:"2",p:0}] },
      { id:"m9_brinivel",label:"Este es el nivel adecuado y requerido por la edificación.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_bribom", label:"La brigada es certificada por el cuerpo de bomberos.", tipo:"sino", opts:SINO(1,0) }
    ]
  },
  {
    id: "m10", titulo: "Módulo 10. Transferencia del riesgo del establecimiento", clase: "reductor", max: 10,
    items: [
      { id:"m10_seguro", label:"Tienen seguro contra incendios vigente.", tipo:"sino", opts:SINO(5,0) },
      { id:"m10_poliza", label:"La póliza cubre la actividad desarrollada en la edificación.", tipo:"sino", opts:SINO(5,0) },
      { id:"m10_aseg",   label:"Compañía aseguradora.", tipo:"texto", score:false }
    ]
  }
];

/* Subconjunto "intermedio" para Inírida: ni tan básico ni tan técnico.
   Ítems observables y esenciales que el inspector revisa rápido en un comercio.
   Ajustable: Jeferson marcará qué más incluir/quitar.
   En modo intermedio el puntaje se calcula sobre estos ítems (normalizado a 100). */
window.ITEMS_INTERMEDIO = [
  // Riesgo de incendio (M5)
  "m5_fuentes","m5_inflam",
  // Sistemas eléctricos (M6)
  "m6_deter","m6_estado","m6_sobre","m6_retie",
  // Extintores (M7) — el corazón de una revisión básica
  "m7_requiere","m7_cuenta","m7_aprop","m7_senal","m7_visible","m7_instal","m7_recarga","m7_fisico",
  // Seguridad humana (M8) — lo esencial de evacuación/señalización/iluminación
  "m8_egreso","m8_visible","m8_despej","m8_ilum","m8_movil","m8_aforo","m8_luces","m8_descext",
  // Plan de emergencias / brigada (M9)
  "m9_plan","m9_simul","m9_brigada",
  // Transferencia del riesgo (M10)
  "m10_seguro"
];
/* Módulos con toggle que siguen aplicando en modo intermedio */
window.TOGGLES_INTERMEDIO = ["m8_aplica","m9_aplica"];

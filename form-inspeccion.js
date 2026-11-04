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
function SINONA(pSi, pNo){ return [{v:"SI",p:pSi},{v:"NO",p:pNo},NA("N/A","No aplica")]; }
/* Dependencias entre preguntas (v1.19). dependsOn puede ser un objeto o una
   lista (todas deben cumplirse). Qué pasa cuando la pregunta madre la oculta:
     sin "oculto"   -> NO APLICA: se quita del máximo (ej. sin subniveles no
                       hay "área del subnivel").
     oculto:"cero"  -> CONSECUENCIA: se oculta pero cuenta como NO (0 puntos)
                       y el hallazgo queda solo en la pregunta madre. Ej.: sin
                       seguro, la póliza no cubre nada. Si se quitara del
                       máximo, NO tener extintores puntuaría MEJOR que tenerlos
                       en mal estado.
     oculto:"max"   -> se oculta y cuenta el puntaje máximo (ej. sin fuentes
                       de ignición no hay riesgo de que se activen).
   DEP(item, valor, modo)   = visible solo si item === valor.
   DEPNO(item, valor, modo) = visible solo si ya se respondió y es distinto. */
function DEP(item, value, oculto){ var d={item:item, value:value}; if(oculto)d.oculto=oculto; return d; }
function DEPNO(item, value, oculto){ var d=DEP(item, value, oculto); d.not=true; return d; }
/* Opción que deja la pregunta FUERA del puntaje (ni suma ni resta, no es
   hallazgo) aunque quede respondida. v se guarda; l es el texto del botón.
   El papel DNBC da puntaje completo a casi todo N/A; "ni suma ni resta" es
   adaptación del CBVI. Solo va donde la cosa puede no existir sin ser falta. */
function NA(v, l){ var o={v:v, na:true}; if(l)o.l=l; return o; }
/* Medida bajo el mínimo (v1.21): 0 puntos y SÍ sale como hallazgo, aunque el ítem
   sea de caracterización. Antes no había cómo registrarla. */
function BAJOMIN(v){ return {v:v, p:0, hallazgo:true}; }
/* Una de estas tres medidas: las preguntas "¿cumple la norma?" dependen de ella.
   Si no existe sale del máximo; si está bajo el mínimo ya se sabe que no cumple. */
function DEPANCHO(item, bajoMin){ return [DEPNO(item,"N/A"), DEPNO(item,bajoMin,"cero")]; }
/* Detalle de extintores: si no hay extintores cuentan como NO, SALVO que el
   local no los requiera (m7_requiere = NO): ahí todo M7 sale del máximo.
   (noAplicaSi lo lee depEstado.) */
var DEP_EXT = {item:"m7_cuenta", value:"SI", oculto:"cero", noAplicaSi:{item:"m7_requiere", value:"NO"}};

window.MODULOS = [
  /* ===================== FACTORES AGRAVANTES (X) ===================== */
  {
    id: "m2", titulo: "Módulo 2. Datos de empleados", clase: "agravante", max: 8,
    items: [
      { id:"m2_num",  label:"Número de empleados", tipo:"select",
        opts:[{v:"< 10",p:5,l:"Hasta 10"},{v:"11 a 50",p:3},{v:"> 51",p:0,l:"51 o más"}] },
      { id:"m2_comp", label:"Composición del personal", tipo:"select",
        opts:[{v:"Son solo hombres",p:3},{v:"Son solo mujeres",p:3},
              {v:"Son hombres y mujeres",p:2},
              {v:"Hay hombres y mujeres con dificultades de movilidad",p:0,l:"Hay personal con dificultades de movilidad"}] }
    ]
  },
  {
    id: "m3", titulo: "Módulo 3. Antecedentes de la estructura", clase: "agravante", max: 9,
    items: [
      /* "Primera visita" (v1.19): antes había que marcar NO y salía en el
         certificado como hallazgo "no cumplió lo de la visita anterior" a un
         negocio que nunca había tenido visita. Ahora queda fuera del puntaje. */
      { id:"m3_cumple", label:"Se evidencia el cumplimiento de los requerimientos generados en la inspección anterior.", tipo:"sino",
        opts:[{v:"SI",p:1},{v:"NO",p:0},NA("Primera visita")] },
      { id:"m3_emerg",  label:"El establecimiento o edificación presentó emergencias en el último año.", tipo:"sino", opts:SINO(0,1) },
      { id:"m3_reporte",label:"Hay evidencia de que la emergencia o el riesgo del establecimiento se reportó a la autoridad competente.", tipo:"sino", opts:[{v:"SI",p:1},{v:"NO",p:0},NA("N/A","No aplica")] },
      { id:"m3_tipo",   label:"Tipo de emergencia ocurrida en el establecimiento o edificación.", tipo:"select", score:false, dependsOn:{item:"m3_emerg",value:"SI"},
        opts:[{v:"Incendios",p:0},{v:"Emergencias MATPEL",p:0},{v:"Accidentes laborales",p:0},{v:"Otro tipo de emergencias",p:0}] },
      { id:"m3_detuvo", label:"Por esa emergencia se detuvo la actividad económica del establecimiento.", tipo:"sino", opts:SINO(0,1), dependsOn:{item:"m3_emerg",value:"SI"} },
      { id:"m3_sistemas",label:"En esa emergencia, los sistemas o equipos de supresión de fuego y seguridad humana funcionaron adecuadamente.", tipo:"sino",
        /* Si no hicieron falta (ej. accidente laboral) no hay nada que calificar: antes se perdían 5 puntos sin falta alguna. */
        opts:[{v:"SI",p:5},{v:"NO",p:0},NA("N/A","No se necesitaron")], dependsOn:{item:"m3_emerg",value:"SI"} }
    ]
  },
  {
    id: "m4", titulo: "Módulo 4. Características de la edificación", clase: "agravante", max: 23,
    items: [
      { id:"m4_nueva", label:"La edificación es nueva (construida con la NSR-10 ya vigente, desde diciembre de 2010).", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_nsr",   label:"A la edificación le aplica la NSR-10 (se diseñó, construyó o reforzó con esa norma).", tipo:"sino", opts:SINO(1,0) },
      /* v1.21: antes un NO significaba tanto "nunca se ha reformado" (no es falta) como
         "se reformó sin respaldo". "NO" sigue guardado como "no ha tenido" para que las
         respuestas viejas conserven su sentido. */
      { id:"m4_remod", label:"La edificación ha tenido modificación o remodelación.", tipo:"select",
        opts:[{v:"SI",p:1,l:"Sí, con licencia o respaldo técnico"},{v:"SIN",p:0,l:"Sí, sin respaldo técnico"},NA("NO","No ha tenido")] },
      { id:"m4_lic",   label:"La edificación cuenta con licencia de construcción.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_tipo",  label:"Tipo de construcción (alta o baja resistencia al fuego).", tipo:"select",
        /* Si combina materiales se marca el menos resistente (no un promedio): el
           fuego usa la parte más débil. "Mixta" prometía eso pero siempre daba 0, así
           que cemento con techo de madera perdía 2 puntos de más. Queda oculta: solo
           se ve en un borrador viejo que ya la tenga marcada. */
        opts:[{v:"Aporticado",p:4,l:"Aporticado (columnas y vigas)"},{v:"Muros de carga",p:3,l:"Muros de carga (sin columnas)"},{v:"Madera",p:2},{v:"Metálica",p:1},
              {v:"Material aglomerado",p:0},{v:"Mixta (dos o más materiales)",p:0,oculta:true}] },
      { id:"m4_propv", label:"Facilidad de la propagabilidad vertical del fuego.", tipo:"select",
        opts:[{v:"Alta",p:0},{v:"Media",p:1},{v:"Baja",p:2}] },
      { id:"m4_proph", label:"Facilidad de la propagabilidad horizontal del fuego.", tipo:"select",
        opts:[{v:"Alta",p:0},{v:"Media",p:1},{v:"Baja",p:2}] },
      { id:"m4_suelo", label:"El uso del suelo permite la actividad que se desarrolla aquí.", tipo:"sino", opts:SINO(1,0) },
      { id:"m4_altura",label:"Altura edificación.", tipo:"select",
        opts:[{v:"1 a 3 pisos (9 m)",p:1,l:"1 a 3 pisos (hasta 9 m)"},{v:"> 3 pisos (> 9 m)",p:0,l:"Más de 3 pisos (más de 9 m)"}] },
      { id:"m4_areapiso",label:"Área construida por piso.", tipo:"select",
        opts:[{v:"Hasta 299 m²",p:2},{v:"300 a 999 m²",p:1},{v:"1000 a >1100 m²",p:0,l:"1000 m² o más"}] },
      { id:"m4_nsub",  label:"Número de subniveles (pisos por debajo de la calle).", tipo:"select",
        opts:[{v:"Ninguno",p:1},{v:"1 a 2",p:1},{v:"> 3",p:0,l:"3 o más"}] },
      { id:"m4_areasub",label:"Área construida por subnivel.", tipo:"select",
        opts:[{v:"0 a 100 m²",p:3},{v:"101 a 200 m²",p:2},{v:"> 200 m²",p:0}],
        dependsOn:{item:"m4_nsub",value:"Ninguno",not:true} },
      { id:"m4_actsub",label:"En los subniveles se realiza otra actividad comercial, distinta a la principal.", tipo:"sino", opts:SINO(0,1),
        dependsOn:{item:"m4_nsub",value:"Ninguno",not:true} },
      { id:"m4_ocup500",label:"La carga de ocupantes de todo el establecimiento es mayor a 500 personas.", tipo:"sino", opts:SINO(0,1) },
      { id:"m4_ocup100",label:"Hay más de 100 personas en algún piso distinto al de la salida a la calle (arriba o abajo).", tipo:"sino", opts:SINO(0,1) }
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
      { id:"m5_activ", label:"Riesgo de que las fuentes de ignición marcadas enciendan algo.", tipo:"select",
        dependsOn:{item:"m5_fuentes", fuentes:true, oculto:"max"},
        opts:[{v:"Alto",p:0},{v:"Medio",p:1},{v:"Bajo",p:2}] },
      { id:"m5_inflam",label:"Inflamabilidad de lo que hay en el local: mercancía, muebles y acabados.", tipo:"select",
        opts:[{v:"Baja",p:2},{v:"Media",p:1},{v:"Alta",p:0}] }
    ]
  },
  {
    id: "m6", titulo: "Módulo 6. Condición y protección de los sistemas eléctricos", clase: "agravante", max: 5,
    items: [
      { id:"m6_deter", label:"Hay equipos o componentes eléctricos deteriorados.", tipo:"sino", opts:SINO(0,1) },
      { id:"m6_estado",label:"Se observa que el estado de las instalaciones eléctricas es bueno.", tipo:"sino", opts:SINO(1,0) },
      /* CORREGIDO v1.1: el formato oficial DNBC V1-2022 (fila 124) puntúa
         "uso adecuado" con SI=0 y NO=1, al revés de lo que dice la pregunta:
         un buen uso restaba. Se corrige a SI=1 / NO=0. El máximo del ítem
         sigue siendo 1, así que el total (148) y la escala no cambian. */
      { id:"m6_uso",   label:"Se observa un uso adecuado de las instalaciones eléctricas.", tipo:"sino", opts:SINO(1,0) },
      { id:"m6_sobre", label:"Se cuenta con sistemas de protección de sobrecargas.", tipo:"sino", opts:SINO(1,0) },
      { id:"m6_retie", label:"El sistema eléctrico tiene revisión con base en el RETIE de los últimos 10 años (5 si es instalación especial).", tipo:"sino", opts:SINO(1,0) }
    ]
  },

  /* ===================== FACTORES REDUCTORES (Y) ===================== */
  {
    id: "m7", titulo: "Módulo 7. Extintores portátiles", clase: "reductor", max: 11,
    intro: "Si hay varios extintores, responde por el peor: marca NO cuando al menos uno no cumpla.",
    items: [
      { id:"m7_requiere", label:"El establecimiento y/o edificación requiere extintores según la norma (NSR-10).", tipo:"sino", opts:[{v:"SI",p:1},NA("NO")] },
      { id:"m7_cuenta",   label:"El establecimiento y/o edificación cuenta con extintores.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m7_requiere","SI") },
      { id:"m7_aprop",    label:"Los extintores son los apropiados para el riesgo existente.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_distrib",  label:"Los extintores están distribuidos según la norma (NTC 2885 - NFPA 10).", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_senal",    label:"Los extintores están adecuadamente señalizados.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_visible",  label:"Los extintores están despejados y visibles.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_instal",   label:"Los extintores están adecuadamente instalados (altura).", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_recarga",  label:"Los extintores se observan recargados y vigentes.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_fisico",   label:"Los extintores se observan físicamente buenos.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP_EXT },
      { id:"m7_superv",   label:"Los extintores cuentan con supervisión permanente (revisión periódica y un responsable).", tipo:"sino", opts:SINO(2,0), dependsOn:DEP_EXT }
    ]
  },
  {
    id: "m8", titulo: "Módulo 8. Seguridad humana (medios de evacuación, señalización e iluminación)", clase: "reductor", max: 45,
    intro: "Si hay varias salidas o rutas, responde por la peor. Mide siempre en el punto más angosto.",
    toggle: { id:"m8_aplica", label:"Para el establecimiento aplican los requerimientos de evacuación, señalización e iluminación por el aforo generado.",
              siItems:true, noScore:45,
              nota:"Si NO aplica por aforo: puntúa 45 automático y se omiten los demás ítems." },
    items: [
      { id:"m8_egreso", label:"Cuenta con medios de egreso.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_visible",label:"Los medios de egreso están visibles y señalizados.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_egreso","SI","cero") },
      { id:"m8_despej", label:"Los medios de egreso están despejados, libres de obstáculos.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_egreso","SI","cero") },
      { id:"m8_movil",  label:"Los medios de egreso permiten la evacuación de personas con movilidad reducida.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_egreso","SI","cero") },
      { id:"m8_aforo",  label:"Aforo del establecimiento.", tipo:"select", opts:[{v:"1 a 50 personas",p:1},{v:"≥ 51 personas",p:0,l:"51 personas o más"}] },
      { id:"m8_aforonsr",label:"El aforo está calculado con base en la carga de ocupación (NSR-10).", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_descaforo",label:"Las descargas (salidas finales al exterior) alcanzan para el aforo del establecimiento.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_egresoevac",label:"Los medios de egreso tienen las salidas y el recorrido que exige la norma para este aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_egreso","SI","cero") },
      { id:"m8_anchocorr",label:"Ancho de los corredores que llevan a la salida.", tipo:"select", /* Adaptación CBVI: el papel DNBC corta en 0,80 m, pero el manual (K.3.3.4) exige 900 mm
           en el acceso a las salidas: por debajo es hallazgo. El rango viejo solo se ve en un
           borrador que ya lo tenga marcado. */
        opts:[BAJOMIN("Menos de 0,90 m"),{v:"0,80 m < 1,20",p:1,l:"0,80 a menos de 1,20 m",oculta:true},{v:"0,90 m < 1,20",p:1,l:"0,90 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"},NA("N/A","No aplica")] },
      { id:"m8_corrnorma",label:"Corredores: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPANCHO("m8_anchocorr","Menos de 0,90 m") },
      { id:"m8_anchopuerta",label:"Ancho de las puertas interiores de la ruta.", tipo:"select", opts:[BAJOMIN("Menos de 0,80 m"),{v:"0,80 < 1,20 m",p:1,l:"0,80 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"},NA("N/A","No aplica")] },
      { id:"m8_puertanorma",label:"Puertas interiores: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPANCHO("m8_anchopuerta","Menos de 0,80 m") },
      { id:"m8_anchoesc",label:"Ancho de las escaleras.", tipo:"select", opts:[BAJOMIN("Menos de 0,90 m"),{v:"0,90 a 1,20 m",p:1,l:"0,90 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"},NA("N/A","No aplica")] },
      { id:"m8_escnorma",label:"Escaleras: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPANCHO("m8_anchoesc","Menos de 0,90 m") },
      { id:"m8_anchoramp",label:"Ancho de las rampas.", tipo:"select", opts:[BAJOMIN("Menos de 0,90 m"),{v:"0,90 a 1,20 m",p:1,l:"0,90 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"},NA("N/A","No aplica")] },
      { id:"m8_rampnorma",label:"Rampas: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPANCHO("m8_anchoramp","Menos de 0,90 m") },
      { id:"m8_anchosalida",label:"Ancho del último tramo hacia el exterior (escalera, corredor o rampa de salida).", tipo:"select", /* Una puerta directa a la calle no tiene tramo: se mide solo como puerta de salida
           y no descuenta dos veces. */
        opts:[BAJOMIN("Menos de 0,90 m"),{v:"0,90 a 1,20 m",p:1,l:"0,90 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"},NA("N/A","No hay: sale directo a la calle")] },
      { id:"m8_salidanorma",label:"Último tramo: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPANCHO("m8_anchosalida","Menos de 0,90 m") },
      { id:"m8_anchopsalida",label:"Ancho de la puerta de salida al exterior.", tipo:"select", opts:[BAJOMIN("Menos de 0,90 m"),{v:"0,90 a 1,20 m",p:1,l:"0,90 a menos de 1,20 m"},{v:"≥ 1,20 m",p:2,l:"1,20 m o más"}] },
      { id:"m8_psalidanorma",label:"Puerta de salida: el ancho cumple lo que exige la norma para este uso y aforo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEPNO("m8_anchopsalida","Menos de 0,90 m","cero") },
      { id:"m8_cantdesc",label:"Cantidad de descargas (salidas finales al exterior).", tipo:"select", opts:[{v:"1",p:1},{v:"2",p:2},{v:"3",p:3},{v:"Más de 3",p:4}] },
      { id:"m8_descext",label:"La descarga es al exterior del establecimiento o edificación.", tipo:"sino", opts:SINO(1,0) },
      { id:"m8_cortafuego",label:"Tiene puertas cortafuego certificadas.", tipo:"sino_na", opts:SINONA(1,0) },
      /* v1.21: es el cierre de la puerta cortafuego. Sin esa puerta no hay qué preguntar:
         si faltaba cuenta 0 y el hallazgo queda en la madre; si no aplica, sale del máximo. */
      { id:"m8_cierre",  label:"Las puertas cortafuego cuentan con mecanismo de cierre automático.", tipo:"sino",
        opts:[{v:"SI",p:1},{v:"NO",p:0},{v:"N/A",na:true,l:"No aplica",oculta:true}],
        dependsOn:{item:"m8_cortafuego",value:"SI",oculto:"cero",noAplicaSi:{item:"m8_cortafuego",value:"N/A"}} },
      { id:"m8_escext",  label:"La estructura cuenta con escaleras exteriores.", tipo:"sino_na", opts:SINONA(1,0) },
      { id:"m8_luces",   label:"Cuenta con luces de emergencia.", tipo:"sino", opts:SINO(1,0) },
      /* Movida debajo de "luces de emergencia" (v1.19): sin luces no puede
         haber egreso iluminado por ellas. */
      { id:"m8_ilum",   label:"Los medios de egreso están iluminados con luces de emergencia en todo su recorrido.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_luces","SI","cero") },
      { id:"m8_autoensayo",label:"El sistema de iluminación de emergencia cuenta con auto-ensayo.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_luces","SI","cero") },
      { id:"m8_ilumnorma",label:"Las luces de emergencia cumplen lo que exige la norma (autonomía y nivel de luz).", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m8_luces","SI","cero") },
      { id:"m8_proced", label:"Cuenta con procedimiento de inspección para los componentes de evacuación, señalización e iluminación.", tipo:"sino", opts:SINO(2,0) },
      { id:"m8_procaño",label:"Se ha realizado el procedimiento de inspección, prueba y mantenimiento el último año.", tipo:"sino", opts:SINO(2,0), dependsOn:DEP("m8_proced","SI","cero") },
      { id:"m8_monitoreo",label:"Los sistemas de evacuación, señalización e iluminación tienen vigilancia o monitoreo permanente.", tipo:"sino", opts:SINO(2,0) }
    ]
  },
  {
    id: "m9", titulo: "Módulo 9. Organización interna para la atención de incendios y emergencias", clase: "reductor", max: 18,
    toggle: { id:"m9_aplica", label:"Para el establecimiento aplican los requerimientos sobre planes de emergencia.",
              siItems:true, noScore:18,
              nota:"Si NO aplica: puntúa 18 automático y se omiten los demás ítems." },
    items: [
      { id:"m9_plan",   label:"Cuenta con plan de emergencias.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_r_inc",  label:"Riesgo contemplado: Incendio.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_r_fugas",label:"Riesgo contemplado: Fugas de gas u otras sustancias.", tipo:"sino_na", opts:SINONA(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_r_derr", label:"Riesgo contemplado: Derrames.", tipo:"sino_na", opts:SINONA(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_r_expl", label:"Riesgo contemplado: Explosiones.", tipo:"sino_na", opts:SINONA(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_r_bleve",label:"Riesgo contemplado: BLEVE (explosión de cilindros o tanques a presión).", tipo:"sino_na", opts:SINONA(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_s_emp",  label:"Plan socializado con: Empleados.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_s_bom",  label:"Plan socializado con: Bomberos.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_s_com",  label:"Plan socializado con: Comunidad.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_s_soc",  label:"Plan socializado con: Organismos de socorro.", tipo:"sino", opts:SINO(1,0), dependsOn:DEP("m9_plan","SI","cero") },
      { id:"m9_simul",  label:"Se han realizado simulacros en el último año.", tipo:"sino", opts:SINO(1,0) },
      { id:"m9_brigada",label:"Tiene brigada de emergencias.", tipo:"sino", opts:SINO(1,0), extra:"num_integrantes" },
      { id:"m9_bricert",label:"La brigada de emergencias está certificada por niveles o clases.", tipo:"sino", opts:SINO(1,0),
        dependsOn:DEP("m9_brigada","SI","cero") },
      /* v1.21: clase, nivel y quién certifica solo existen si la brigada está certificada.
         Sin certificación cuentan 0 y el hallazgo queda en esa pregunta. */
      { id:"m9_briclase",label:"Clase o nivel de la brigada, según su certificado.", tipo:"select", opts:[{v:"1",p:1},{v:"2",p:0}],
        dependsOn:DEP("m9_bricert","SI","cero") },
      { id:"m9_brinivel",label:"Ese nivel es el requerido para esta edificación.", tipo:"sino", opts:SINO(1,0),
        dependsOn:DEP("m9_bricert","SI","cero") },
      { id:"m9_bribom", label:"La brigada es certificada por el cuerpo de bomberos.", tipo:"sino", opts:SINO(1,0),
        dependsOn:DEP("m9_bricert","SI","cero") },
      /* Necesita plan Y brigada: no se socializa un plan que no existe ni con
         una brigada que no hay. Va al final para que aparezca debajo de
         "Tiene brigada", no arriba. */
      { id:"m9_s_bri",  label:"Plan socializado con: Brigada de emergencias.", tipo:"sino", opts:SINO(1,0),
        dependsOn:[DEP("m9_plan","SI","cero"), DEP("m9_brigada","SI","cero")] }
    ]
  },
  {
    id: "m10", titulo: "Módulo 10. Transferencia del riesgo del establecimiento", clase: "reductor", max: 10,
    items: [
      { id:"m10_seguro", label:"Tienen seguro contra incendios vigente.", tipo:"sino", opts:SINO(5,0) },
      { id:"m10_poliza", label:"La póliza cubre la actividad desarrollada en la edificación.", tipo:"sino", opts:SINO(5,0), dependsOn:DEP("m10_seguro","SI","cero") },
      { id:"m10_aseg",   label:"Compañía aseguradora.", tipo:"texto", score:false, dependsOn:DEP("m10_seguro","SI") }
    ]
  }
];

/* Subconjunto "intermedio" para Inírida: ni tan básico ni tan técnico.
   Ítems observables y esenciales que el inspector revisa rápido en un comercio.
   Ajustable: Jeferson marcará qué más incluir/quitar.
   En modo intermedio el puntaje se calcula sobre estos ítems (normalizado a 100). */
/* ITEMS DE CARACTERIZACIÓN — describen el establecimiento y SUMAN al
   puntaje, pero NO son un "no cumple" que el propietario pueda corregir:
   no salen como hallazgo en el certificado (una edificación vieja o un
   área grande no se "arreglan" con un plan de mejoramiento).
   Todo lo demás que no tenga el puntaje máximo SÍ es hallazgo y lleva
   su recomendación ("Qué hacer") y su foto si la hay. */
window.ITEMS_CONTEXTO = [
  "m2_num","m2_comp",
  "m3_emerg","m3_reporte","m3_tipo","m3_detuvo","m3_sistemas",
  "m4_nueva","m4_nsr","m4_remod","m4_tipo","m4_propv","m4_proph",
  "m4_altura","m4_areapiso","m4_nsub","m4_areasub","m4_actsub","m4_ocup500","m4_ocup100",
  /* m4_lic / m4_suelo: no son un "no cumple" que se corrija con un plan de
     mejoramiento a corto plazo — tramitar licencia o uso del suelo de una
     edificación existente es un proceso legal/técnico de meses, a veces
     imposible sin reconstruir. Van con sus hermanos m4_nsr/m4_remod. */
  "m4_lic","m4_suelo",
  "m5_fuentes",
  "m7_requiere",
  "m8_aforo","m8_anchocorr","m8_anchopuerta","m8_anchoesc","m8_anchoramp",
  "m8_anchosalida","m8_anchopsalida","m8_cantdesc","m8_escext",
  /* Las 6 preguntas "¿es el ancho exigido por la norma?" son hermanas de las
     medidas de arriba (m8_anchoX, ya en esta lista): exigir el cambio es
     obra estructural (tumbar pared, rehacer escalera), no una corrección
     de visita. */
  "m8_salidanorma","m8_puertanorma","m8_corrnorma","m8_escnorma","m8_rampnorma","m8_psalidanorma",
  "m9_briclase",
  "m10_aseg"
];

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

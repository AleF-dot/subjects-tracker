// UTN FRRo — ISI — Plan 2023
// Solo correlatives (para cursar), sin correlativesParaFinal
// Columna "Regular" = regular para cursar, "Aprobada" = aprobada para cursar

const ISI_UTN_SUBJECTS = [
  { id: "isi-1",  name: "Análisis Matemático I",              year: 1 },
  { id: "isi-2",  name: "Álgebra y Geometría Analítica",      year: 1 },
  { id: "isi-3",  name: "Física I",                           year: 1 },
  { id: "isi-4",  name: "Inglés I",                           year: 1 },
  { id: "isi-5",  name: "Lógica y Estructuras Discretas",     year: 1 },
  { id: "isi-6",  name: "Algoritmos y Estructuras de Datos",  year: 1 },
  { id: "isi-7",  name: "Arquitectura de Computadoras",       year: 1 },
  { id: "isi-8",  name: "Sistemas y Procesos de Negocio",     year: 1 },
  { id: "isi-9",  name: "Análisis Matemático II",             year: 2,
    correlatives: [{ subjectId: "isi-1", type: "regular" }, { subjectId: "isi-2", type: "regular" }] },
  { id: "isi-10", name: "Física II",                          year: 2,
    correlatives: [{ subjectId: "isi-1", type: "regular" }, { subjectId: "isi-3", type: "regular" }] },
  { id: "isi-11", name: "Ingeniería y Sociedad",              year: 2 },
  { id: "isi-12", name: "Inglés II",                          year: 2,
    correlatives: [{ subjectId: "isi-4", type: "regular" }] },
  { id: "isi-13", name: "Sintaxis y Semántica de los Lenguajes", year: 2,
    correlatives: [{ subjectId: "isi-5", type: "regular" }, { subjectId: "isi-6", type: "regular" }] },
  { id: "isi-14", name: "Paradigmas de Programación",         year: 2,
    correlatives: [{ subjectId: "isi-5", type: "regular" }, { subjectId: "isi-6", type: "regular" }] },
  { id: "isi-15", name: "Sistemas Operativos",                year: 2,
    correlatives: [{ subjectId: "isi-7", type: "regular" }] },
  { id: "isi-16", name: "Análisis de Sistemas de Información",year: 2,
    correlatives: [{ subjectId: "isi-6", type: "regular" }, { subjectId: "isi-8", type: "regular" }] },
  { id: "isi-17", name: "Probabilidad y Estadística",         year: 3,
    correlatives: [{ subjectId: "isi-1", type: "regular" }, { subjectId: "isi-2", type: "regular" }] },
  { id: "isi-18", name: "Economía",                           year: 3,
    correlatives: [{ subjectId: "isi-1", type: "aprobada" }, { subjectId: "isi-2", type: "aprobada" }] },
  { id: "isi-19", name: "Base de Datos",                      year: 3,
    correlatives: [{ subjectId: "isi-13", type: "regular" }, { subjectId: "isi-16", type: "regular" }, { subjectId: "isi-5", type: "aprobada" }, { subjectId: "isi-6", type: "aprobada" }] },
  { id: "isi-20", name: "Desarrollo de Software",             year: 3,
    correlatives: [{ subjectId: "isi-14", type: "regular" }, { subjectId: "isi-16", type: "regular" }, { subjectId: "isi-5", type: "aprobada" }, { subjectId: "isi-6", type: "aprobada" }] },
  { id: "isi-21", name: "Comunicación de Datos",              year: 3,
    correlatives: [{ subjectId: "isi-3", type: "aprobada" }, { subjectId: "isi-7", type: "aprobada" }] },
  { id: "isi-22", name: "Análisis Numérico",                  year: 3,
    correlatives: [{ subjectId: "isi-9", type: "regular" }, { subjectId: "isi-1", type: "aprobada" }, { subjectId: "isi-2", type: "aprobada" }] },
  { id: "isi-23", name: "Diseño de Sistemas de Información",  year: 3,
    correlatives: [{ subjectId: "isi-14", type: "regular" }, { subjectId: "isi-16", type: "regular" }, { subjectId: "isi-4", type: "aprobada" }, { subjectId: "isi-6", type: "aprobada" }, { subjectId: "isi-8", type: "aprobada" }] },
  { id: "isi-adusi", name: "Seminario Integrador (ADUSI)",    year: 3,
    correlatives: [{ subjectId: "isi-16", type: "regular" }, { subjectId: "isi-6", type: "aprobada" }, { subjectId: "isi-8", type: "aprobada" }, { subjectId: "isi-13", type: "aprobada" }, { subjectId: "isi-14", type: "aprobada" }] },
  { id: "isi-24", name: "Legislación",                        year: 4,
    correlatives: [{ subjectId: "isi-11", type: "regular" }] },
  { id: "isi-25", name: "Ingeniería y Calidad de Software",   year: 4,
    correlatives: [{ subjectId: "isi-19", type: "regular" }, { subjectId: "isi-20", type: "regular" }, { subjectId: "isi-23", type: "regular" }, { subjectId: "isi-13", type: "aprobada" }, { subjectId: "isi-14", type: "aprobada" }] },
  { id: "isi-26", name: "Redes de Datos",                     year: 4,
    correlatives: [{ subjectId: "isi-15", type: "regular" }, { subjectId: "isi-21", type: "regular" }] },
  { id: "isi-27", name: "Investigación Operativa",            year: 4,
    correlatives: [{ subjectId: "isi-17", type: "regular" }, { subjectId: "isi-22", type: "regular" }] },
  { id: "isi-28", name: "Simulación",                         year: 4,
    correlatives: [{ subjectId: "isi-17", type: "regular" }, { subjectId: "isi-9", type: "aprobada" }] },
  { id: "isi-29", name: "Tecnologías para la Automatización", year: 4,
    correlatives: [{ subjectId: "isi-10", type: "regular" }, { subjectId: "isi-22", type: "regular" }, { subjectId: "isi-9", type: "aprobada" }] },
  { id: "isi-30", name: "Administración de Sistemas de Información", year: 4,
    correlatives: [{ subjectId: "isi-18", type: "regular" }, { subjectId: "isi-23", type: "regular" }, { subjectId: "isi-16", type: "aprobada" }] },
  { id: "isi-31", name: "Inteligencia Artificial",            year: 5,
    correlatives: [{ subjectId: "isi-28", type: "regular" }, { subjectId: "isi-17", type: "aprobada" }, { subjectId: "isi-22", type: "aprobada" }] },
  { id: "isi-32", name: "Ciencia de Datos",                   year: 5,
    correlatives: [{ subjectId: "isi-28", type: "regular" }, { subjectId: "isi-17", type: "aprobada" }, { subjectId: "isi-19", type: "aprobada" }] },
  { id: "isi-33", name: "Sistemas de Gestión",                year: 5,
    correlatives: [{ subjectId: "isi-18", type: "regular" }, { subjectId: "isi-27", type: "regular" }, { subjectId: "isi-23", type: "aprobada" }] },
  { id: "isi-34", name: "Gestión Gerencial",                  year: 5,
    correlatives: [{ subjectId: "isi-24", type: "regular" }, { subjectId: "isi-30", type: "regular" }, { subjectId: "isi-18", type: "aprobada" }] },
  { id: "isi-35", name: "Seguridad en los Sistemas de Información", year: 5,
    correlatives: [{ subjectId: "isi-26", type: "regular" }, { subjectId: "isi-30", type: "regular" }, { subjectId: "isi-20", type: "aprobada" }, { subjectId: "isi-21", type: "aprobada" }] },
  { id: "isi-36", name: "Proyecto Final",                     year: 5,
    correlatives: [{ subjectId: "isi-25", type: "regular" }, { subjectId: "isi-26", type: "regular" }, { subjectId: "isi-30", type: "regular" }, { subjectId: "isi-12", type: "aprobada" }, { subjectId: "isi-20", type: "aprobada" }, { subjectId: "isi-23", type: "aprobada" }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// UNR FCA — Ingeniería Agrónoma — Plan 2023
// 4 columnas: cursar/regular | cursar/aprobada | rendir/regular | rendir/aprobada
// ─────────────────────────────────────────────────────────────────────────────

const AGR_UNR_SUBJECTS = [
  // PRIMER AÑO — sin correlativas
  { id: "agr-1",  name: "Introducción a los Sistemas de Producción Agropecuarios", year: 1 },
  { id: "agr-2",  name: "Física",                          year: 1 },
  { id: "agr-3",  name: "Matemática I",                    year: 1 },
  { id: "agr-4",  name: "Biología",                        year: 1 },
  { id: "agr-5",  name: "Química General e Inorgánica",    year: 1 },
  // 6: cursar regular 3 | rendir aprobada 3
  { id: "agr-6",  name: "Matemática II",                   year: 1,
    correlatives: [{ subjectId: "agr-3", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-3", type: "aprobada" }] },
  // 7: cursar regular 5 | rendir aprobada 5
  { id: "agr-7",  name: "Química Orgánica",                year: 1,
    correlatives: [{ subjectId: "agr-5", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-5", type: "aprobada" }] },
  { id: "agr-47", name: "Inglés",                          year: 1 },
  { id: "agr-48", name: "Informática",                     year: 1 },

  // SEGUNDO AÑO
  // 8: cursar regular 7 | cursar aprobada 4 | rendir aprobada 4,7
  { id: "agr-8",  name: "Química Biológica",               year: 2,
    correlatives: [{ subjectId: "agr-7", type: "regular" }, { subjectId: "agr-4", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-4", type: "aprobada" }, { subjectId: "agr-7", type: "aprobada" }] },
  // 9: cursar regular 3 | rendir regular 1 | rendir aprobada 3
  { id: "agr-9",  name: "Economía General",                year: 2,
    correlatives: [{ subjectId: "agr-3", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-1", type: "regular" }, { subjectId: "agr-3", type: "aprobada" }] },
  // 10: cursar regular 3 | rendir aprobada 6
  { id: "agr-10", name: "Estadística",                     year: 2,
    correlatives: [{ subjectId: "agr-3", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-6", type: "aprobada" }] },
  // 11: cursar regular 4 | rendir aprobada 4
  { id: "agr-11", name: "Botánica Morfológica",            year: 2,
    correlatives: [{ subjectId: "agr-4", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-4", type: "aprobada" }] },
  // 12: cursar regular 1,4 | cursar aprobada 5 | rendir regular 7 | rendir aprobada 1,4,5
  { id: "agr-12", name: "Anatomía y Fisiología Animal",    year: 2,
    correlatives: [{ subjectId: "agr-1", type: "regular" }, { subjectId: "agr-4", type: "regular" }, { subjectId: "agr-5", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-7", type: "regular" }, { subjectId: "agr-1", type: "aprobada" }, { subjectId: "agr-4", type: "aprobada" }, { subjectId: "agr-5", type: "aprobada" }] },
  // 13: cursar regular 3 | cursar aprobada — | rendir aprobada 9 (y rendir regular —)
  // imagen: cursar regular: 3 | rendir aprobada: 1,3  (PDF dice 9 en rendir aprobada pero 9 no existe en 1er año, debe ser error tipográfico del PDF; la imagen dice 1,3)
  { id: "agr-13", name: "Economía y Política Agraria",     year: 2,
    correlatives: [{ subjectId: "agr-3", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-1", type: "aprobada" }, { subjectId: "agr-3", type: "aprobada" }] },
  // 14: cursar regular 1,2,3 | rendir aprobada 1,2,3
  { id: "agr-14", name: "Maquinaria Agrícola I",           year: 2,
    correlatives: [{ subjectId: "agr-1", type: "regular" }, { subjectId: "agr-2", type: "regular" }, { subjectId: "agr-3", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-1", type: "aprobada" }, { subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-3", type: "aprobada" }] },
  // 15: cursar regular 11 | rendir aprobada 11
  { id: "agr-15", name: "Botánica Sistemática Agronómica", year: 2,
    correlatives: [{ subjectId: "agr-11", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-11", type: "aprobada" }] },
  // 16: cursar regular 2,6 | rendir regular 6,10 | rendir aprobada 2
  { id: "agr-16", name: "Agroclimatología",                year: 2,
    correlatives: [{ subjectId: "agr-2", type: "regular" }, { subjectId: "agr-6", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-6", type: "regular" }, { subjectId: "agr-10", type: "regular" }, { subjectId: "agr-2", type: "aprobada" }] },
  // 17: cursar regular 1,4 | rendir regular 10 | rendir aprobada 1
  { id: "agr-17", name: "Taller de Integración I",         year: 2,
    correlatives: [{ subjectId: "agr-1", type: "regular" }, { subjectId: "agr-4", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-10", type: "regular" }, { subjectId: "agr-1", type: "aprobada" }] },

  // TERCER AÑO
  // 18: cursar regular 8,12 | rendir regular 11 | rendir aprobada 6,8,12
  { id: "agr-18", name: "Nutrición Animal",                year: 3,
    correlatives: [{ subjectId: "agr-8", type: "regular" }, { subjectId: "agr-12", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-11", type: "regular" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-8", type: "aprobada" }, { subjectId: "agr-12", type: "aprobada" }] },
  // 19: cursar regular 8,1 | rendir aprobada 6,8,10
  { id: "agr-19", name: "Genética",                        year: 3,
    correlatives: [{ subjectId: "agr-8", type: "regular" }, { subjectId: "agr-1", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-8", type: "aprobada" }, { subjectId: "agr-10", type: "aprobada" }] },
  // 20: cursar regular 16 | cursar aprobada 2,6,7 | rendir regular — | rendir aprobada 2,6,7,16
  { id: "agr-20", name: "Edafología",                      year: 3,
    correlatives: [{ subjectId: "agr-16", type: "regular" }, { subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-7", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-7", type: "aprobada" }, { subjectId: "agr-16", type: "aprobada" }] },
  // 21: cursar regular 1,10,9,13 | rendir regular 10 | rendir aprobada 9,13
  { id: "agr-21", name: "Sociología Rural",                year: 3,
    correlatives: [{ subjectId: "agr-1", type: "regular" }, { subjectId: "agr-10", type: "regular" }, { subjectId: "agr-9", type: "regular" }, { subjectId: "agr-13", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-10", type: "regular" }, { subjectId: "agr-9", type: "aprobada" }, { subjectId: "agr-13", type: "aprobada" }] },
  // 22: cursar regular 9,13 | cursar aprobada 1 | rendir regular 9,13 | rendir aprobada 1
  { id: "agr-22", name: "Legislación Agropecuaria",        year: 3,
    correlatives: [{ subjectId: "agr-9", type: "regular" }, { subjectId: "agr-13", type: "regular" }, { subjectId: "agr-1", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-9", type: "regular" }, { subjectId: "agr-13", type: "regular" }, { subjectId: "agr-1", type: "aprobada" }] },
  // 23: cursar regular 8,15,16 | cursar aprobada 2,6,11 | rendir aprobada 2,6,8,11
  { id: "agr-23", name: "Fisiología Vegetal",              year: 3,
    correlatives: [{ subjectId: "agr-8", type: "regular" }, { subjectId: "agr-15", type: "regular" }, { subjectId: "agr-16", type: "regular" }, { subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-11", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-8", type: "aprobada" }, { subjectId: "agr-11", type: "aprobada" }] },
  // 24: cursar regular 10,15 | cursar aprobada 16 | rendir regular 20,23 | rendir aprobada 10,15,16
  { id: "agr-24", name: "Ecología",                        year: 3,
    correlatives: [{ subjectId: "agr-10", type: "regular" }, { subjectId: "agr-15", type: "regular" }, { subjectId: "agr-16", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-20", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-10", type: "aprobada" }, { subjectId: "agr-15", type: "aprobada" }, { subjectId: "agr-16", type: "aprobada" }] },
  // 25: cursar regular 2,6,8 | cursar aprobada 4,7 | rendir aprobada 2,6,8,10
  { id: "agr-25", name: "Microbiología Agrícola",          year: 3,
    correlatives: [{ subjectId: "agr-2", type: "regular" }, { subjectId: "agr-6", type: "regular" }, { subjectId: "agr-8", type: "regular" }, { subjectId: "agr-4", type: "aprobada" }, { subjectId: "agr-7", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-2", type: "aprobada" }, { subjectId: "agr-6", type: "aprobada" }, { subjectId: "agr-8", type: "aprobada" }, { subjectId: "agr-10", type: "aprobada" }] },
  // 26: cursar regular 14 | rendir aprobada 14
  { id: "agr-26", name: "Maquinaria Agrícola II",          year: 3,
    correlatives: [{ subjectId: "agr-14", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-14", type: "aprobada" }] },
  // 27: cursar regular 17 | rendir regular 21 | rendir aprobada 17
  { id: "agr-27", name: "Taller de Integración II",        year: 3,
    correlatives: [{ subjectId: "agr-17", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-21", type: "regular" }, { subjectId: "agr-17", type: "aprobada" }] },

  // CUARTO AÑO
  // Nota global: para rendir 4° año además de correlativas específicas → 1° y 2° año aprobados
  // 28: cursar regular 20 | cursar aprobada 14,16 | rendir regular 26 | rendir aprobada 20,25
  { id: "agr-28", name: "Manejo de Tierras",               year: 4,
    correlatives: [{ subjectId: "agr-20", type: "regular" }, { subjectId: "agr-14", type: "aprobada" }, { subjectId: "agr-16", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-26", type: "regular" }, { subjectId: "agr-20", type: "aprobada" }, { subjectId: "agr-25", type: "aprobada" }] },
  // 29: cursar regular 19,23,24 | cursar aprobada 10 | rendir aprobada 19,23,24
  { id: "agr-29", name: "Mejoramiento Vegetal y Producción de Semillas", year: 4,
    correlatives: [{ subjectId: "agr-19", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-24", type: "regular" }, { subjectId: "agr-10", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-19", type: "aprobada" }, { subjectId: "agr-23", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 30: cursar regular 18,20,23,24 | cursar aprobada 8,12,14 | rendir regular 26 | rendir aprobada 18,20,23,24
  { id: "agr-30", name: "Forrajes",                        year: 4,
    correlatives: [{ subjectId: "agr-18", type: "regular" }, { subjectId: "agr-20", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-24", type: "regular" }, { subjectId: "agr-8", type: "aprobada" }, { subjectId: "agr-12", type: "aprobada" }, { subjectId: "agr-14", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-26", type: "regular" }, { subjectId: "agr-18", type: "aprobada" }, { subjectId: "agr-20", type: "aprobada" }, { subjectId: "agr-23", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 31: cursar regular 15,16 | rendir aprobada 23,24
  { id: "agr-31", name: "Fruticultura",                    year: 4,
    correlatives: [{ subjectId: "agr-15", type: "regular" }, { subjectId: "agr-16", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-23", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 32: cursar regular 15,19 | rendir regular 19 | rendir aprobada 23,24
  { id: "agr-32", name: "Malezas",                         year: 4,
    correlatives: [{ subjectId: "agr-15", type: "regular" }, { subjectId: "agr-19", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-19", type: "regular" }, { subjectId: "agr-23", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 33: cursar regular 10,20 | cursar aprobada 15,16,23 | rendir regular 28,32,34,35 | rendir aprobada 1°,2°,3° año
  // (los requisitos de año completo no los modelamos por materia, solo las correlativas específicas)
  { id: "agr-33", name: "Sistemas de Cultivos Extensivos", year: 4,
    correlatives: [{ subjectId: "agr-10", type: "regular" }, { subjectId: "agr-20", type: "regular" }, { subjectId: "agr-15", type: "aprobada" }, { subjectId: "agr-16", type: "aprobada" }, { subjectId: "agr-23", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-28", type: "regular" }, { subjectId: "agr-32", type: "regular" }, { subjectId: "agr-34", type: "regular" }, { subjectId: "agr-35", type: "regular" }] },
  // 34: cursar regular 20,23,24 | rendir regular 20,23,24 | rendir aprobada —
  { id: "agr-34", name: "Zoología Agrícola",               year: 4,
    correlatives: [{ subjectId: "agr-20", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-24", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-20", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-24", type: "regular" }] },
  // 35: cursar regular 19,23,24 | rendir aprobada 19,23,24
  { id: "agr-35", name: "Fitopatología",                   year: 4,
    correlatives: [{ subjectId: "agr-19", type: "regular" }, { subjectId: "agr-23", type: "regular" }, { subjectId: "agr-24", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-19", type: "aprobada" }, { subjectId: "agr-23", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 36: cursar regular 27 | rendir regular — | rendir aprobada 27
  // (1° y 2° año aprobados es requisito global de 4°, no lo modelamos por materia)
  { id: "agr-36", name: "Taller de Integración III",       year: 4,
    correlatives: [{ subjectId: "agr-27", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-27", type: "aprobada" }] },

  // QUINTO AÑO
  // 38: cursar regular 34,35 | cursar aprobada 20 | rendir aprobada 34,35
  { id: "agr-38", name: "Horticultura",                    year: 5,
    correlatives: [{ subjectId: "agr-34", type: "regular" }, { subjectId: "agr-35", type: "regular" }, { subjectId: "agr-20", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-34", type: "aprobada" }, { subjectId: "agr-35", type: "aprobada" }] },
  // 39: cursar regular 21,22,28,30 | cursar aprobada 18,19,27 | rendir regular 36 | rendir aprobada 28,30
  { id: "agr-39", name: "Sistemas de Producción Porcina",  year: 5,
    correlatives: [{ subjectId: "agr-21", type: "regular" }, { subjectId: "agr-22", type: "regular" }, { subjectId: "agr-28", type: "regular" }, { subjectId: "agr-30", type: "regular" }, { subjectId: "agr-18", type: "aprobada" }, { subjectId: "agr-19", type: "aprobada" }, { subjectId: "agr-27", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-36", type: "regular" }, { subjectId: "agr-28", type: "aprobada" }, { subjectId: "agr-30", type: "aprobada" }] },
  // 40: cursar regular 18,19,24 | cursar aprobada — | rendir regular — | rendir aprobada 18,19,24
  // imagen dice cursar: 18,19,24 — rendir: 18,19,24
  { id: "agr-40", name: "Sistemas de Producción Bovina",   year: 5,
    correlatives: [{ subjectId: "agr-18", type: "regular" }, { subjectId: "agr-19", type: "regular" }, { subjectId: "agr-24", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-18", type: "aprobada" }, { subjectId: "agr-19", type: "aprobada" }, { subjectId: "agr-24", type: "aprobada" }] },
  // 41: cursar regular 26,31,32,33,34,35 | cursar aprobada — | rendir regular 38 | rendir aprobada 28,31,32,33,34,35
  { id: "agr-41", name: "Terapéutica Vegetal",             year: 5,
    correlatives: [{ subjectId: "agr-26", type: "regular" }, { subjectId: "agr-31", type: "regular" }, { subjectId: "agr-32", type: "regular" }, { subjectId: "agr-33", type: "regular" }, { subjectId: "agr-34", type: "regular" }, { subjectId: "agr-35", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-38", type: "regular" }, { subjectId: "agr-28", type: "aprobada" }, { subjectId: "agr-31", type: "aprobada" }, { subjectId: "agr-32", type: "aprobada" }, { subjectId: "agr-33", type: "aprobada" }, { subjectId: "agr-34", type: "aprobada" }, { subjectId: "agr-35", type: "aprobada" }] },
  // 42: cursar regular 28,36 | cursar aprobada 21,22,27 | rendir aprobada 28,36
  { id: "agr-42", name: "Extensión Rural",                 year: 5,
    correlatives: [{ subjectId: "agr-28", type: "regular" }, { subjectId: "agr-36", type: "regular" }, { subjectId: "agr-21", type: "aprobada" }, { subjectId: "agr-22", type: "aprobada" }, { subjectId: "agr-27", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-28", type: "aprobada" }, { subjectId: "agr-36", type: "aprobada" }] },
  // 43: cursar regular 31,33,38,39 | rendir aprobada 31,33,38,39,40
  { id: "agr-43", name: "Comercialización Agropecuaria",   year: 5,
    correlatives: [{ subjectId: "agr-31", type: "regular" }, { subjectId: "agr-33", type: "regular" }, { subjectId: "agr-38", type: "regular" }, { subjectId: "agr-39", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-31", type: "aprobada" }, { subjectId: "agr-33", type: "aprobada" }, { subjectId: "agr-38", type: "aprobada" }, { subjectId: "agr-39", type: "aprobada" }, { subjectId: "agr-40", type: "aprobada" }] },
  // 44: cursar regular 28,30 | rendir aprobada 4° año, 33,38,39,40
  { id: "agr-44", name: "Administración Rural",            year: 5,
    correlatives: [{ subjectId: "agr-28", type: "regular" }, { subjectId: "agr-30", type: "regular" }],
    correlativesParaFinal: [{ subjectId: "agr-33", type: "aprobada" }, { subjectId: "agr-38", type: "aprobada" }, { subjectId: "agr-39", type: "aprobada" }, { subjectId: "agr-40", type: "aprobada" }] },
  // 45: cursar regular 36 | cursar aprobada 27 | rendir aprobada 36
  { id: "agr-45", name: "Taller de Integración IV",        year: 5,
    correlatives: [{ subjectId: "agr-36", type: "regular" }, { subjectId: "agr-27", type: "aprobada" }],
    correlativesParaFinal: [{ subjectId: "agr-36", type: "aprobada" }] },
  { id: "agr-49", name: "Práctica Social Educativa",       year: 5 },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTN FRRo — IEE — Ingeniería en Energía Eléctrica — Plan 2023
// Solo correlatives (UTN): Regular = regular para cursar, Aprobada = aprobada para cursar
// NOTA: La materia nº 18 aparece referenciada en correlativas de 30, 32, 37, 38, 39, 41
// pero NO figura en la grilla de materias troncales del PDF. Posible error tipográfico
// del plan oficial. Se mantiene la referencia tal como aparece en el PDF.
// ─────────────────────────────────────────────────────────────────────────────
const IEE_UTN_SUBJECTS = [
  // 1ER NIVEL
  { id: "iee-1",  name: "Análisis Matemático I",                    year: 1 },
  { id: "iee-2",  name: "Álgebra y Geometría Analítica",            year: 1 },
  { id: "iee-3",  name: "Ingeniería y Sociedad",                    year: 1 },
  { id: "iee-4",  name: "Sistemas de Representación",               year: 1 },
  { id: "iee-5",  name: "Física I",                                 year: 1 },
  { id: "iee-6",  name: "Química General",                          year: 1 },
  { id: "iee-7",  name: "Integración Eléctrica I (INT)",            year: 1 },
  { id: "iee-8",  name: "Fundamentos de Informática",               year: 1 },

  // 2DO NIVEL
  { id: "iee-9",  name: "Física II",                                year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-5", type: "regular" }] },
  { id: "iee-10", name: "Probabilidad y Estadística",               year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-2", type: "regular" }] },
  { id: "iee-11", name: "Electrotecnia I",                          year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-2", type: "regular" }, { subjectId: "iee-5", type: "regular" }] },
  { id: "iee-12", name: "Estabilidad",                              year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-2", type: "regular" }, { subjectId: "iee-5", type: "regular" }] },
  { id: "iee-14", name: "Integración Eléctrica II (INT)",           year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-5", type: "regular" }, { subjectId: "iee-7", type: "regular" }] },
  { id: "iee-15", name: "Inglés I",                                 year: 2 },
  { id: "iee-16", name: "Análisis Matemático II",                   year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-2", type: "regular" }] },
  { id: "iee-17", name: "Cálculo Numérico",                         year: 2,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-2", type: "regular" }, { subjectId: "iee-5", type: "regular" }, { subjectId: "iee-8", type: "regular" }] },
  // Materia 18: presente en correlativas del plan pero omitida en la grilla del PDF del Gradiente.
  // Figura en el régimen oficial del Dpto. de Eléctrica como "Tecnologías y Ensayos de Mat. Eléctricos".
  { id: "iee-18", name: "Tecnologías y Ensayos de Materiales Eléctricos", year: 2,
    correlatives: [{ subjectId: "iee-6", type: "regular" }, { subjectId: "iee-9", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },

  // 3ER NIVEL
  { id: "iee-27", name: "Inglés II",                                year: 3,
    correlatives: [{ subjectId: "iee-15", type: "aprobada" }] },
  { id: "iee-28", name: "Economía",                                 year: 3,
    correlatives: [{ subjectId: "iee-3", type: "aprobada" }] },
  { id: "iee-19", name: "Instrumentos y Mediciones Eléctricas",     year: 3,
    correlatives: [{ subjectId: "iee-10", type: "regular" }, { subjectId: "iee-11", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-20", name: "Teoría de los Campos",                     year: 3,
    correlatives: [{ subjectId: "iee-9", type: "regular" }, { subjectId: "iee-16", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-21", name: "Física III",                               year: 3,
    correlatives: [{ subjectId: "iee-9", type: "regular" }, { subjectId: "iee-16", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-22", name: "Máquinas Eléctricas I",                    year: 3,
    correlatives: [{ subjectId: "iee-9", type: "regular" }, { subjectId: "iee-11", type: "regular" }, { subjectId: "iee-16", type: "regular" }, { subjectId: "iee-17", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-23", name: "Electrotecnia II",                         year: 3,
    correlatives: [{ subjectId: "iee-9", type: "regular" }, { subjectId: "iee-11", type: "regular" }, { subjectId: "iee-16", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-24", name: "Termodinámica",                            year: 3,
    correlatives: [{ subjectId: "iee-9", type: "regular" }, { subjectId: "iee-16", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  { id: "iee-25", name: "Fundamentos para el Análisis de Señales",  year: 3,
    correlatives: [{ subjectId: "iee-16", type: "regular" }, { subjectId: "iee-17", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }] },
  { id: "iee-26", name: "Taller Interdisciplinario",                year: 3,
    correlatives: [{ subjectId: "iee-6", type: "aprobada" }] },
    // (*) para cursar: requisitos según inscripción a Máquinas Eléctricas I

  // 4TO NIVEL
  { id: "iee-29", name: "Electrónica I",                            year: 4,
    correlatives: [{ subjectId: "iee-11", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }] },
  // Máquinas Eléctricas II: regular 18-19-20-22-23 | aprobada 6-9-10-11-15-16
  // La materia 18 no figura en el plan (ver nota arriba) — se incluye de todas formas
  { id: "iee-30", name: "Máquinas Eléctricas II",                   year: 4,
    correlatives: [{ subjectId: "iee-18", type: "regular" }, { subjectId: "iee-19", type: "regular" }, { subjectId: "iee-20", type: "regular" }, { subjectId: "iee-22", type: "regular" }, { subjectId: "iee-23", type: "regular" }, { subjectId: "iee-6", type: "aprobada" }, { subjectId: "iee-9", type: "aprobada" }, { subjectId: "iee-10", type: "aprobada" }, { subjectId: "iee-11", type: "aprobada" }, { subjectId: "iee-15", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  { id: "iee-13", name: "Mecánica Técnica (1er Cuatrimestre)",      year: 4,
    correlatives: [{ subjectId: "iee-1", type: "regular" }, { subjectId: "iee-5", type: "regular" }] },
  // Instalaciones Eléctricas y Luminotecnia: regular 18-22-23 | aprobada 6-9-10-11-15-16
  { id: "iee-32", name: "Instalaciones Eléctricas y Luminotecnia",  year: 4,
    correlatives: [{ subjectId: "iee-18", type: "regular" }, { subjectId: "iee-22", type: "regular" }, { subjectId: "iee-23", type: "regular" }, { subjectId: "iee-6", type: "aprobada" }, { subjectId: "iee-9", type: "aprobada" }, { subjectId: "iee-10", type: "aprobada" }, { subjectId: "iee-11", type: "aprobada" }, { subjectId: "iee-15", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  { id: "iee-33", name: "Control Automático",                       year: 4,
    correlatives: [{ subjectId: "iee-23", type: "regular" }, { subjectId: "iee-25", type: "regular" }, { subjectId: "iee-11", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  { id: "iee-34", name: "Máquinas Térmicas, Hidráulicas y de Fluído (2do Cuatri.)", year: 4,
    correlatives: [{ subjectId: "iee-12", type: "regular" }, { subjectId: "iee-13", type: "regular" }, { subjectId: "iee-24", type: "regular" }, { subjectId: "iee-9", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  { id: "iee-35", name: "Legislación",                              year: 4,
    correlatives: [{ subjectId: "iee-3", type: "aprobada" }] },

  // 5TO NIVEL
  // Seguridad, Riesgo Eléctrico y Medio Ambiente: regular 6-11-18x-20 | aprobada 1-2-5-9-16
  { id: "iee-31", name: "Seguridad, Riesgo Eléctrico y Medio Ambiente", year: 5,
    correlatives: [{ subjectId: "iee-6", type: "regular" }, { subjectId: "iee-11", type: "regular" }, { subjectId: "iee-18", type: "regular" }, { subjectId: "iee-20", type: "regular" }, { subjectId: "iee-1", type: "aprobada" }, { subjectId: "iee-2", type: "aprobada" }, { subjectId: "iee-5", type: "aprobada" }, { subjectId: "iee-9", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  { id: "iee-36", name: "Electrónica II",                           year: 5,
    correlatives: [{ subjectId: "iee-23", type: "regular" }, { subjectId: "iee-29", type: "regular" }, { subjectId: "iee-11", type: "aprobada" }, { subjectId: "iee-26", type: "aprobada" }] },
  // Generación, Transmisión y Distribución: regular 21-30-34 | aprobada 12-13-18x-22-23-24
  { id: "iee-37", name: "Generación, Transmisión y Distribución de la Energía Eléctrica", year: 5,
    correlatives: [{ subjectId: "iee-21", type: "regular" }, { subjectId: "iee-30", type: "regular" }, { subjectId: "iee-34", type: "regular" }, { subjectId: "iee-12", type: "aprobada" }, { subjectId: "iee-13", type: "aprobada" }, { subjectId: "iee-18", type: "aprobada" }, { subjectId: "iee-22", type: "aprobada" }, { subjectId: "iee-23", type: "aprobada" }, { subjectId: "iee-24", type: "aprobada" }] },
  // Sistemas de Potencia: regular 30-33 | aprobada 18x-22-23-26
  { id: "iee-38", name: "Sistemas de Potencia",                     year: 5,
    correlatives: [{ subjectId: "iee-30", type: "regular" }, { subjectId: "iee-33", type: "regular" }, { subjectId: "iee-18", type: "aprobada" }, { subjectId: "iee-22", type: "aprobada" }, { subjectId: "iee-23", type: "aprobada" }, { subjectId: "iee-26", type: "aprobada" }] },
  // Accionamientos y Controles Eléctricos: regular 29-30-33 | aprobada 11-18x-22-23-25-26
  { id: "iee-39", name: "Accionamientos y Controles Eléctricos",    year: 5,
    correlatives: [{ subjectId: "iee-29", type: "regular" }, { subjectId: "iee-30", type: "regular" }, { subjectId: "iee-33", type: "regular" }, { subjectId: "iee-11", type: "aprobada" }, { subjectId: "iee-18", type: "aprobada" }, { subjectId: "iee-22", type: "aprobada" }, { subjectId: "iee-23", type: "aprobada" }, { subjectId: "iee-25", type: "aprobada" }, { subjectId: "iee-26", type: "aprobada" }] },
  { id: "iee-40", name: "Organización y Administración de Empresas", year: 5,
    correlatives: [{ subjectId: "iee-12", type: "regular" }, { subjectId: "iee-13", type: "regular" }, { subjectId: "iee-24", type: "regular" }, { subjectId: "iee-9", type: "aprobada" }, { subjectId: "iee-16", type: "aprobada" }] },
  // Proyecto Final: para cursar regular 28-30-32-33 | aprobada 18x-19-22-23-25-26-27
  //                 para rendir: Todas
  { id: "iee-41", name: "Proyecto Final (INT)",                     year: 5,
    correlatives: [{ subjectId: "iee-28", type: "regular" }, { subjectId: "iee-30", type: "regular" }, { subjectId: "iee-32", type: "regular" }, { subjectId: "iee-33", type: "regular" }, { subjectId: "iee-18", type: "aprobada" }, { subjectId: "iee-19", type: "aprobada" }, { subjectId: "iee-22", type: "aprobada" }, { subjectId: "iee-23", type: "aprobada" }, { subjectId: "iee-25", type: "aprobada" }, { subjectId: "iee-26", type: "aprobada" }, { subjectId: "iee-27", type: "aprobada" }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTN FRRo — IM — Ingeniería Mecánica — Plan 2023
// ─────────────────────────────────────────────────────────────────────────────
const IM_UTN_SUBJECTS = [
  // 1ER NIVEL
  { id: "im-1",  name: "Análisis Matemático I",                     year: 1 },
  { id: "im-2",  name: "Química General",                           year: 1 },
  { id: "im-3",  name: "Álgebra y Geometría Analítica",             year: 1 },
  { id: "im-4",  name: "Física I",                                  year: 1 },
  { id: "im-5",  name: "Ingeniería y Sociedad",                     year: 1 },
  { id: "im-6",  name: "Ingeniería Mecánica I (INT)",               year: 1 },
  { id: "im-7",  name: "Sistemas de Representación",                year: 1 },
  { id: "im-8",  name: "Fundamentos de Informática",                year: 1 },

  // 2DO NIVEL
  { id: "im-9",  name: "Materiales No Metálicos",                   year: 2,
    correlatives: [{ subjectId: "im-2", type: "regular" }, { subjectId: "im-4", type: "regular" }] },
  { id: "im-10", name: "Estabilidad I",                             year: 2,
    correlatives: [{ subjectId: "im-1", type: "regular" }, { subjectId: "im-3", type: "regular" }, { subjectId: "im-4", type: "regular" }] },
  { id: "im-11", name: "Materiales Metálicos",                      year: 2,
    correlatives: [{ subjectId: "im-2", type: "regular" }, { subjectId: "im-4", type: "regular" }] },
  { id: "im-12", name: "Análisis Matemático II",                    year: 2,
    correlatives: [{ subjectId: "im-1", type: "regular" }, { subjectId: "im-3", type: "regular" }] },
  { id: "im-13", name: "Física II",                                 year: 2,
    correlatives: [{ subjectId: "im-1", type: "regular" }, { subjectId: "im-4", type: "regular" }] },
  { id: "im-14", name: "Ingeniería Ambiental y Seguridad Industrial", year: 2,
    correlatives: [{ subjectId: "im-2", type: "regular" }, { subjectId: "im-4", type: "regular" }] },
  { id: "im-15", name: "Ingeniería Mecánica II (INT)",              year: 2,
    correlatives: [{ subjectId: "im-4", type: "regular" }, { subjectId: "im-6", type: "regular" }] },
  { id: "im-16", name: "Inglés I",                                  year: 2 },

  // 3ER NIVEL
  { id: "im-17", name: "Termodinámica",                             year: 3,
    correlatives: [{ subjectId: "im-12", type: "regular" }, { subjectId: "im-13", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-18", name: "Mecánica Racional",                         year: 3,
    correlatives: [{ subjectId: "im-10", type: "regular" }, { subjectId: "im-12", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-19", name: "Estabilidad II",                            year: 3,
    correlatives: [{ subjectId: "im-10", type: "regular" }, { subjectId: "im-12", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-20", name: "Mediciones y Ensayos",                      year: 3,
    correlatives: [{ subjectId: "im-10", type: "regular" }, { subjectId: "im-11", type: "regular" }, { subjectId: "im-13", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-21", name: "Diseño Mecánico",                           year: 3,
    correlatives: [{ subjectId: "im-9", type: "regular" }, { subjectId: "im-10", type: "regular" }, { subjectId: "im-11", type: "regular" }, { subjectId: "im-4", type: "aprobada" }, { subjectId: "im-6", type: "aprobada" }, { subjectId: "im-7", type: "aprobada" }, { subjectId: "im-8", type: "aprobada" }] },
  { id: "im-22", name: "Cálculo Avanzado",                          year: 3,
    correlatives: [{ subjectId: "im-12", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-8", type: "aprobada" }] },
  { id: "im-23", name: "Ingeniería Mecánica III (INT)",             year: 3,
    correlatives: [{ subjectId: "im-9", type: "regular" }, { subjectId: "im-11", type: "regular" }, { subjectId: "im-15", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-2", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }, { subjectId: "im-6", type: "aprobada" }] },
  { id: "im-24", name: "Probabilidad y Estadística",                year: 3,
    correlatives: [{ subjectId: "im-1", type: "regular" }, { subjectId: "im-3", type: "regular" }] },
  { id: "im-25", name: "Inglés II",                                 year: 3,
    correlatives: [{ subjectId: "im-16", type: "aprobada" }] },

  // 4TO NIVEL
  { id: "im-26", name: "Economía",                                  year: 4,
    correlatives: [{ subjectId: "im-15", type: "regular" }, { subjectId: "im-5", type: "aprobada" }] },
  { id: "im-27", name: "Elementos de Máquinas (INT)",               year: 4,
    correlatives: [{ subjectId: "im-9", type: "regular" }, { subjectId: "im-11", type: "regular" }, { subjectId: "im-18", type: "regular" }, { subjectId: "im-19", type: "regular" }, { subjectId: "im-23", type: "regular" }, { subjectId: "im-2", type: "aprobada" }, { subjectId: "im-10", type: "aprobada" }, { subjectId: "im-12", type: "aprobada" }] },
  { id: "im-28", name: "Tecnología del Calor",                      year: 4,
    correlatives: [{ subjectId: "im-17", type: "regular" }, { subjectId: "im-12", type: "aprobada" }, { subjectId: "im-13", type: "aprobada" }] },
  { id: "im-29", name: "Metrología e Ingeniería de la Calidad",     year: 4,
    correlatives: [{ subjectId: "im-20", type: "regular" }, { subjectId: "im-24", type: "regular" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-11", type: "aprobada" }, { subjectId: "im-13", type: "aprobada" }] },
  { id: "im-30", name: "Mecánica de los Fluidos",                   year: 4,
    correlatives: [{ subjectId: "im-17", type: "regular" }, { subjectId: "im-12", type: "aprobada" }, { subjectId: "im-13", type: "aprobada" }] },
  { id: "im-31", name: "Electrotecnia y Máquinas Eléctricas",       year: 4,
    correlatives: [{ subjectId: "im-12", type: "regular" }, { subjectId: "im-13", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-32", name: "Electrónica y Sistemas de Control",         year: 4,
    correlatives: [{ subjectId: "im-12", type: "regular" }, { subjectId: "im-13", type: "regular" }, { subjectId: "im-22", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }] },
  { id: "im-33", name: "Estabilidad III",                           year: 4,
    correlatives: [{ subjectId: "im-19", type: "regular" }, { subjectId: "im-1", type: "aprobada" }, { subjectId: "im-3", type: "aprobada" }, { subjectId: "im-4", type: "aprobada" }, { subjectId: "im-10", type: "aprobada" }] },

  // 5TO NIVEL
  { id: "im-34", name: "Tecnología de Fabricación",                 year: 5,
    correlatives: [{ subjectId: "im-27", type: "regular" }, { subjectId: "im-29", type: "regular" }, { subjectId: "im-9", type: "aprobada" }, { subjectId: "im-10", type: "aprobada" }, { subjectId: "im-11", type: "aprobada" }, { subjectId: "im-21", type: "aprobada" }] },
  { id: "im-35", name: "Máquinas Alternativas y Turbomáquinas",     year: 5,
    correlatives: [{ subjectId: "im-28", type: "regular" }, { subjectId: "im-13", type: "aprobada" }, { subjectId: "im-17", type: "aprobada" }] },
  { id: "im-36", name: "Instalaciones Industriales",                year: 5,
    correlatives: [{ subjectId: "im-20", type: "regular" }, { subjectId: "im-28", type: "regular" }, { subjectId: "im-30", type: "regular" }, { subjectId: "im-31", type: "regular" }, { subjectId: "im-32", type: "regular" }, { subjectId: "im-10", type: "aprobada" }, { subjectId: "im-14", type: "aprobada" }, { subjectId: "im-17", type: "aprobada" }] },
  { id: "im-37", name: "Organización Industrial",                   year: 5,
    correlatives: [{ subjectId: "im-26", type: "regular" }, { subjectId: "im-15", type: "aprobada" }] },
  { id: "im-38", name: "Legislación",                               year: 5,
    correlatives: [{ subjectId: "im-15", type: "regular" }, { subjectId: "im-5", type: "aprobada" }] },
  { id: "im-39", name: "Mantenimiento",                             year: 5,
    correlatives: [{ subjectId: "im-20", type: "regular" }, { subjectId: "im-26", type: "regular" }, { subjectId: "im-27", type: "regular" }, { subjectId: "im-11", type: "aprobada" }, { subjectId: "im-13", type: "aprobada" }, { subjectId: "im-18", type: "aprobada" }, { subjectId: "im-19", type: "aprobada" }] },
  // Proyecto Final: para cursar regular 27-29-31-32 | aprobada 18-19-20-21
  //                 para rendir: Todas
  { id: "im-41", name: "Proyecto Final (INT)",                      year: 5,
    correlatives: [{ subjectId: "im-27", type: "regular" }, { subjectId: "im-29", type: "regular" }, { subjectId: "im-31", type: "regular" }, { subjectId: "im-32", type: "regular" }, { subjectId: "im-18", type: "aprobada" }, { subjectId: "im-19", type: "aprobada" }, { subjectId: "im-20", type: "aprobada" }, { subjectId: "im-21", type: "aprobada" }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTN FRRo — IC — Ingeniería Civil — Plan 2023
// 6 niveles. Materia 40 (Vías de Comunicación II) aparece dos veces en el PDF
// con el mismo número — la segunda es "1er Cuatrimestre", se usa id ic-40b.
// ─────────────────────────────────────────────────────────────────────────────
const IC_UTN_SUBJECTS = [
  // 1ER NIVEL
  { id: "ic-1",  name: "Análisis Matemático I",                     year: 1 },
  { id: "ic-2",  name: "Álgebra y Geometría Analítica",             year: 1 },
  { id: "ic-3",  name: "Ingeniería y Sociedad",                     year: 1 },
  { id: "ic-4",  name: "Ingeniería Civil I (INT)",                  year: 1 },
  { id: "ic-5",  name: "Sistemas de Representación",                year: 1 },
  { id: "ic-6",  name: "Química General",                           year: 1 },
  { id: "ic-7",  name: "Física I",                                  year: 1 },
  { id: "ic-8",  name: "Fundamentos de Informática",                year: 1 },

  // 2DO NIVEL
  { id: "ic-9",  name: "Análisis Matemático II",                    year: 2,
    correlatives: [{ subjectId: "ic-1", type: "regular" }, { subjectId: "ic-2", type: "regular" }] },
  { id: "ic-10", name: "Estabilidad",                               year: 2,
    correlatives: [{ subjectId: "ic-1", type: "regular" }, { subjectId: "ic-2", type: "regular" }, { subjectId: "ic-5", type: "regular" }, { subjectId: "ic-7", type: "regular" }, { subjectId: "ic-8", type: "regular" }] },
  { id: "ic-11", name: "Ingeniería Civil II (INT)",                 year: 2,
    correlatives: [{ subjectId: "ic-3", type: "regular" }, { subjectId: "ic-4", type: "regular" }, { subjectId: "ic-5", type: "regular" }, { subjectId: "ic-8", type: "regular" }] },
  { id: "ic-12", name: "Tecnología de los Materiales",              year: 2,
    correlatives: [{ subjectId: "ic-1", type: "regular" }, { subjectId: "ic-5", type: "regular" }, { subjectId: "ic-6", type: "regular" }, { subjectId: "ic-7", type: "regular" }] },
  { id: "ic-13", name: "Física II",                                 year: 2,
    correlatives: [{ subjectId: "ic-1", type: "regular" }, { subjectId: "ic-7", type: "regular" }] },
  { id: "ic-14", name: "Probabilidad y Estadística",                year: 2,
    correlatives: [{ subjectId: "ic-1", type: "regular" }, { subjectId: "ic-2", type: "regular" }] },
  { id: "ic-15", name: "Inglés I",                                  year: 2,
    correlatives: [{ subjectId: "ic-3", type: "regular" }] },

  // 3ER NIVEL
  { id: "ic-16", name: "Resistencia de Materiales",                 year: 3,
    correlatives: [{ subjectId: "ic-10", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },
  { id: "ic-17", name: "Tecnología del Hormigón",                   year: 3,
    correlatives: [{ subjectId: "ic-12", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-15", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-6", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }] },
  { id: "ic-18", name: "Tecnología de la Construcción (INT)",       year: 3,
    correlatives: [{ subjectId: "ic-10", type: "regular" }, { subjectId: "ic-11", type: "regular" }, { subjectId: "ic-12", type: "regular" }, { subjectId: "ic-15", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-6", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },
  { id: "ic-19", name: "Geotopografía",                             year: 3,
    correlatives: [{ subjectId: "ic-9", type: "regular" }, { subjectId: "ic-11", type: "regular" }, { subjectId: "ic-13", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }] },
  { id: "ic-20", name: "Hidráulica General y Aplicada",             year: 3,
    correlatives: [{ subjectId: "ic-9", type: "regular" }, { subjectId: "ic-10", type: "regular" }, { subjectId: "ic-11", type: "regular" }, { subjectId: "ic-13", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },
  { id: "ic-21", name: "Cálculo Avanzado",                          year: 3,
    correlatives: [{ subjectId: "ic-9", type: "regular" }, { subjectId: "ic-10", type: "regular" }, { subjectId: "ic-12", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },
  { id: "ic-22", name: "Instalaciones Eléctricas y Acústicas",      year: 3,
    correlatives: [{ subjectId: "ic-11", type: "regular" }, { subjectId: "ic-12", type: "regular" }, { subjectId: "ic-13", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-6", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }] },
  { id: "ic-23", name: "Instalaciones Termomecánicas",              year: 3,
    correlatives: [{ subjectId: "ic-11", type: "regular" }, { subjectId: "ic-12", type: "regular" }, { subjectId: "ic-13", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-6", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }] },
  { id: "ic-24", name: "Economía",                                  year: 3,
    correlatives: [{ subjectId: "ic-11", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-15", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-3", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },
  { id: "ic-25", name: "Inglés II",                                 year: 3,
    correlatives: [{ subjectId: "ic-15", type: "regular" }, { subjectId: "ic-3", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }] },

  // 4TO NIVEL
  { id: "ic-26", name: "Geotecnia",                                 year: 4,
    correlatives: [{ subjectId: "ic-16", type: "regular" }, { subjectId: "ic-17", type: "regular" }, { subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-20", type: "regular" }, { subjectId: "ic-9", type: "aprobada" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }, { subjectId: "ic-13", type: "aprobada" }, { subjectId: "ic-14", type: "aprobada" }] },
  { id: "ic-27", name: "Instalaciones Sanitarias y de Gas",         year: 4,
    correlatives: [{ subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-20", type: "regular" }, { subjectId: "ic-24", type: "regular" }, { subjectId: "ic-5", type: "aprobada" }, { subjectId: "ic-6", type: "aprobada" }, { subjectId: "ic-7", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }] },
  { id: "ic-28", name: "Diseño Arquitectónico, Planeamiento y Urbanismo", year: 4,
    correlatives: [{ subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-22", type: "regular" }, { subjectId: "ic-23", type: "regular" }, { subjectId: "ic-24", type: "regular" }, { subjectId: "ic-25", type: "regular" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }, { subjectId: "ic-15", type: "aprobada" }] },
  { id: "ic-29", name: "Análisis Estructural I",                    year: 4,
    correlatives: [{ subjectId: "ic-16", type: "regular" }, { subjectId: "ic-17", type: "regular" }, { subjectId: "ic-9", type: "aprobada" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-14", type: "aprobada" }] },
  { id: "ic-30", name: "Estructuras de Hormigón",                   year: 4,
    correlatives: [{ subjectId: "ic-16", type: "regular" }, { subjectId: "ic-17", type: "regular" }, { subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-25", type: "regular" }, { subjectId: "ic-9", type: "aprobada" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }, { subjectId: "ic-13", type: "aprobada" }, { subjectId: "ic-14", type: "aprobada" }] },
  { id: "ic-31", name: "Hidrología y Obras Hidráulicas",            year: 4,
    correlatives: [{ subjectId: "ic-16", type: "regular" }, { subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-20", type: "regular" }, { subjectId: "ic-24", type: "regular" }, { subjectId: "ic-25", type: "regular" }, { subjectId: "ic-9", type: "aprobada" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }, { subjectId: "ic-13", type: "aprobada" }, { subjectId: "ic-14", type: "aprobada" }] },
  { id: "ic-32", name: "Ingeniería Legal",                          year: 4,
    correlatives: [{ subjectId: "ic-9", type: "regular" }, { subjectId: "ic-11", type: "regular" }, { subjectId: "ic-14", type: "regular" }, { subjectId: "ic-15", type: "regular" }, { subjectId: "ic-1", type: "aprobada" }, { subjectId: "ic-2", type: "aprobada" }, { subjectId: "ic-3", type: "aprobada" }, { subjectId: "ic-4", type: "aprobada" }, { subjectId: "ic-8", type: "aprobada" }] },

  // 5TO NIVEL
  { id: "ic-33", name: "Construcciones Metálicas y de Maderas",     year: 5,
    correlatives: [{ subjectId: "ic-21", type: "regular" }, { subjectId: "ic-29", type: "regular" }, { subjectId: "ic-16", type: "aprobada" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }] },
  { id: "ic-34", name: "Cimentaciones",                             year: 5,
    correlatives: [{ subjectId: "ic-21", type: "regular" }, { subjectId: "ic-26", type: "regular" }, { subjectId: "ic-29", type: "regular" }, { subjectId: "ic-30", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-16", type: "aprobada" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-20", type: "aprobada" }] },
  { id: "ic-35", name: "Ingeniería Sanitaria",                      year: 5,
    correlatives: [{ subjectId: "ic-26", type: "regular" }, { subjectId: "ic-27", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-20", type: "aprobada" }, { subjectId: "ic-25", type: "aprobada" }] },
  { id: "ic-36", name: "Organización y Conducción de Obras (INT)",  year: 5,
    correlatives: [{ subjectId: "ic-26", type: "regular" }, { subjectId: "ic-27", type: "regular" }, { subjectId: "ic-28", type: "regular" }, { subjectId: "ic-30", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-20", type: "aprobada" }, { subjectId: "ic-22", type: "aprobada" }, { subjectId: "ic-23", type: "aprobada" }, { subjectId: "ic-24", type: "aprobada" }, { subjectId: "ic-25", type: "aprobada" }] },
  { id: "ic-37", name: "Gestión Ambiental y Desarrollo Sustentable", year: 5,
    correlatives: [{ subjectId: "ic-26", type: "regular" }, { subjectId: "ic-28", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-32", type: "regular" }, { subjectId: "ic-20", type: "aprobada" }, { subjectId: "ic-24", type: "aprobada" }, { subjectId: "ic-25", type: "aprobada" }] },
  { id: "ic-38", name: "Vías de Comunicación I",                    year: 5,
    correlatives: [{ subjectId: "ic-17", type: "regular" }, { subjectId: "ic-18", type: "regular" }, { subjectId: "ic-19", type: "regular" }, { subjectId: "ic-9", type: "aprobada" }, { subjectId: "ic-10", type: "aprobada" }, { subjectId: "ic-11", type: "aprobada" }, { subjectId: "ic-12", type: "aprobada" }, { subjectId: "ic-14", type: "aprobada" }, { subjectId: "ic-15", type: "aprobada" }] },
  { id: "ic-39", name: "Análisis Estructural II",                   year: 5,
    correlatives: [{ subjectId: "ic-21", type: "regular" }, { subjectId: "ic-26", type: "regular" }, { subjectId: "ic-29", type: "regular" }, { subjectId: "ic-30", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-16", type: "aprobada" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-25", type: "aprobada" }] },
  // Vías de Comunicación II (1er Cuatrimestre) — mismo Nº 40 que Gestión Ambiental
  // El PDF usa el número 40 dos veces; el segundo es el "1er Cuatrimestre".
  { id: "ic-40", name: "Vías de Comunicación II (1er Cuatrimestre)", year: 5,
    correlatives: [{ subjectId: "ic-26", type: "regular" }, { subjectId: "ic-30", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-32", type: "regular" }, { subjectId: "ic-37", type: "regular" }, { subjectId: "ic-16", type: "aprobada" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-20", type: "aprobada" }, { subjectId: "ic-24", type: "aprobada" }] },

  // 6TO NIVEL
  // Proyecto Final: para cursar regular 26-27-28-29-30-31-32 | aprobada 15-16-17-18-19-20-22-23-24-25
  //                 para rendir: Todas
  { id: "ic-41", name: "Proyecto Final (INT)",                      year: 6,
    correlatives: [{ subjectId: "ic-26", type: "regular" }, { subjectId: "ic-27", type: "regular" }, { subjectId: "ic-28", type: "regular" }, { subjectId: "ic-29", type: "regular" }, { subjectId: "ic-30", type: "regular" }, { subjectId: "ic-31", type: "regular" }, { subjectId: "ic-32", type: "regular" }, { subjectId: "ic-15", type: "aprobada" }, { subjectId: "ic-16", type: "aprobada" }, { subjectId: "ic-17", type: "aprobada" }, { subjectId: "ic-18", type: "aprobada" }, { subjectId: "ic-19", type: "aprobada" }, { subjectId: "ic-20", type: "aprobada" }, { subjectId: "ic-22", type: "aprobada" }, { subjectId: "ic-23", type: "aprobada" }, { subjectId: "ic-24", type: "aprobada" }, { subjectId: "ic-25", type: "aprobada" }] },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTN FRRo — IQ — Ingeniería Química — Plan 2023
// ─────────────────────────────────────────────────────────────────────────────
const IQ_UTN_SUBJECTS = [
  // 1ER NIVEL
  { id: "iq-1",  name: "Introducción a la Ingeniería Química (INT)", year: 1 },
  { id: "iq-2",  name: "Ingeniería y Sociedad",                      year: 1 },
  { id: "iq-3",  name: "Álgebra y Geometría Analítica",              year: 1 },
  { id: "iq-4",  name: "Análisis Matemático I",                      year: 1 },
  { id: "iq-5",  name: "Física I",                                   year: 1 },
  { id: "iq-6",  name: "Química",                                    year: 1 },
  { id: "iq-7",  name: "Sistemas de Representación",                 year: 1 },
  { id: "iq-8",  name: "Fundamentos de Informática (2do Cuatrimestre)", year: 1 },

  // 2DO NIVEL
  { id: "iq-9",  name: "Introducción a Equipos y Procesos (INT)",    year: 2,
    correlatives: [{ subjectId: "iq-1", type: "regular" }, { subjectId: "iq-6", type: "regular" }] },
  { id: "iq-10", name: "Probabilidad y Estadística",                 year: 2,
    correlatives: [{ subjectId: "iq-3", type: "regular" }, { subjectId: "iq-4", type: "regular" }] },
  { id: "iq-11", name: "Química Inorgánica (1er Cuatrimestre)",      year: 2,
    correlatives: [{ subjectId: "iq-6", type: "regular" }] },
  { id: "iq-12", name: "Análisis Matemático II",                     year: 2,
    correlatives: [{ subjectId: "iq-3", type: "regular" }, { subjectId: "iq-4", type: "regular" }] },
  { id: "iq-13", name: "Física II",                                  year: 2,
    correlatives: [{ subjectId: "iq-4", type: "regular" }, { subjectId: "iq-5", type: "regular" }] },
  { id: "iq-14", name: "Química Orgánica",                           year: 2,
    correlatives: [{ subjectId: "iq-6", type: "regular" }] },
  { id: "iq-15", name: "Legislación (2do Cuatri)",                   year: 2,
    correlatives: [{ subjectId: "iq-1", type: "regular" }, { subjectId: "iq-2", type: "regular" }] },
  { id: "iq-16", name: "Inglés I",                                   year: 2 },

  // 3ER NIVEL
  { id: "iq-17", name: "Balances de Masa y Energía (INT)",           year: 3,
    correlatives: [{ subjectId: "iq-6", type: "regular" }, { subjectId: "iq-7", type: "regular" }, { subjectId: "iq-8", type: "regular" }, { subjectId: "iq-9", type: "regular" }, { subjectId: "iq-13", type: "regular" }, { subjectId: "iq-1", type: "aprobada" }, { subjectId: "iq-3", type: "aprobada" }, { subjectId: "iq-4", type: "aprobada" }] },
  { id: "iq-18", name: "Termodinámica",                              year: 3,
    correlatives: [{ subjectId: "iq-11", type: "regular" }, { subjectId: "iq-12", type: "regular" }, { subjectId: "iq-13", type: "regular" }, { subjectId: "iq-4", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-19", name: "Matemática Superior Aplicada",               year: 3,
    correlatives: [{ subjectId: "iq-12", type: "regular" }, { subjectId: "iq-3", type: "aprobada" }, { subjectId: "iq-4", type: "aprobada" }] },
  { id: "iq-20", name: "Ciencia de los Materiales",                  year: 3,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-11", type: "regular" }, { subjectId: "iq-14", type: "regular" }, { subjectId: "iq-1", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-21", name: "Fisicoquímica",                              year: 3,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-12", type: "regular" }, { subjectId: "iq-13", type: "regular" }, { subjectId: "iq-3", type: "aprobada" }, { subjectId: "iq-4", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-22", name: "Fenómenos de Transporte",                    year: 3,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-12", type: "regular" }, { subjectId: "iq-13", type: "regular" }, { subjectId: "iq-3", type: "aprobada" }, { subjectId: "iq-4", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-23", name: "Química Analítica",                          year: 3,
    correlatives: [{ subjectId: "iq-10", type: "regular" }, { subjectId: "iq-11", type: "regular" }, { subjectId: "iq-14", type: "regular" }, { subjectId: "iq-2", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-24", name: "Microbiología y Química Biológica",          year: 3,
    correlatives: [{ subjectId: "iq-11", type: "regular" }, { subjectId: "iq-14", type: "regular" }, { subjectId: "iq-6", type: "aprobada" }] },
  { id: "iq-25", name: "Química Aplicada",                           year: 3,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-11", type: "regular" }, { subjectId: "iq-13", type: "regular" }, { subjectId: "iq-14", type: "regular" }, { subjectId: "iq-1", type: "aprobada" }, { subjectId: "iq-2", type: "aprobada" }, { subjectId: "iq-6", type: "aprobada" }, { subjectId: "iq-16", type: "aprobada" }] },
  { id: "iq-26", name: "Inglés II",                                  year: 3,
    correlatives: [{ subjectId: "iq-16", type: "aprobada" }] },

  // 4TO NIVEL
  { id: "iq-27", name: "Diseño, Simulación, Optimización y Seguridad de Procesos (INT)", year: 4,
    correlatives: [{ subjectId: "iq-17", type: "regular" }, { subjectId: "iq-19", type: "regular" }, { subjectId: "iq-7", type: "aprobada" }, { subjectId: "iq-8", type: "aprobada" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-12", type: "aprobada" }, { subjectId: "iq-26", type: "aprobada" }] },
  { id: "iq-28", name: "Operaciones Unitarias I",                    year: 4,
    correlatives: [{ subjectId: "iq-17", type: "regular" }, { subjectId: "iq-18", type: "regular" }, { subjectId: "iq-22", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-12", type: "aprobada" }, { subjectId: "iq-13", type: "aprobada" }] },
  { id: "iq-29", name: "Tecnología de la Energía Térmica",           year: 4,
    correlatives: [{ subjectId: "iq-17", type: "regular" }, { subjectId: "iq-18", type: "regular" }, { subjectId: "iq-21", type: "regular" }, { subjectId: "iq-22", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-12", type: "aprobada" }, { subjectId: "iq-13", type: "aprobada" }] },
  { id: "iq-30", name: "Economía",                                   year: 4,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-2", type: "aprobada" }, { subjectId: "iq-3", type: "aprobada" }] },
  { id: "iq-31", name: "Operaciones Unitarias II",                   year: 4,
    correlatives: [{ subjectId: "iq-18", type: "regular" }, { subjectId: "iq-21", type: "regular" }, { subjectId: "iq-22", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-12", type: "aprobada" }, { subjectId: "iq-13", type: "aprobada" }, { subjectId: "iq-14", type: "aprobada" }] },
  { id: "iq-32", name: "Ingeniería de las Reacciones Químicas",      year: 4,
    correlatives: [{ subjectId: "iq-17", type: "regular" }, { subjectId: "iq-18", type: "regular" }, { subjectId: "iq-21", type: "regular" }, { subjectId: "iq-22", type: "regular" }, { subjectId: "iq-11", type: "aprobada" }, { subjectId: "iq-12", type: "aprobada" }, { subjectId: "iq-14", type: "aprobada" }] },
  { id: "iq-33", name: "Organización Industrial",                    year: 4,
    correlatives: [{ subjectId: "iq-10", type: "regular" }, { subjectId: "iq-17", type: "regular" }, { subjectId: "iq-2", type: "aprobada" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-15", type: "aprobada" }] },
  { id: "iq-34", name: "Calidad y Control Estadístico de Procesos",  year: 4,
    correlatives: [{ subjectId: "iq-10", type: "regular" }, { subjectId: "iq-4", type: "aprobada" }, { subjectId: "iq-9", type: "aprobada" }] },

  // 5TO NIVEL
  { id: "iq-35", name: "Control Automático de Procesos",             year: 5,
    correlatives: [{ subjectId: "iq-27", type: "regular" }, { subjectId: "iq-31", type: "regular" }, { subjectId: "iq-17", type: "aprobada" }, { subjectId: "iq-19", type: "aprobada" }, { subjectId: "iq-23", type: "aprobada" }] },
  { id: "iq-36", name: "Mecánica Industrial",                        year: 5,
    correlatives: [{ subjectId: "iq-9", type: "regular" }, { subjectId: "iq-21", type: "regular" }, { subjectId: "iq-5", type: "aprobada" }, { subjectId: "iq-11", type: "aprobada" }, { subjectId: "iq-20", type: "aprobada" }] },
  { id: "iq-37", name: "Ingeniería Ambiental",                       year: 5,
    correlatives: [{ subjectId: "iq-25", type: "regular" }, { subjectId: "iq-28", type: "regular" }, { subjectId: "iq-31", type: "regular" }, { subjectId: "iq-32", type: "regular" }, { subjectId: "iq-15", type: "aprobada" }, { subjectId: "iq-17", type: "aprobada" }, { subjectId: "iq-23", type: "aprobada" }] },
  { id: "iq-38", name: "Procesos Biotecnológicos",                   year: 5,
    correlatives: [{ subjectId: "iq-17", type: "regular" }, { subjectId: "iq-21", type: "regular" }, { subjectId: "iq-22", type: "regular" }, { subjectId: "iq-24", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-11", type: "aprobada" }, { subjectId: "iq-14", type: "aprobada" }] },
  { id: "iq-39", name: "Higiene y Seguridad en el Trabajo (2do Cuatrimestre)", year: 5,
    correlatives: [{ subjectId: "iq-11", type: "regular" }, { subjectId: "iq-14", type: "regular" }, { subjectId: "iq-17", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }] },
  { id: "iq-40", name: "Máquinas e Instalaciones Eléctricas",        year: 5,
    correlatives: [{ subjectId: "iq-28", type: "regular" }, { subjectId: "iq-9", type: "aprobada" }, { subjectId: "iq-13", type: "aprobada" }] },
  // Proyecto Final: para cursar regular 27-28-29-31-32-33 | aprobada 17-21-22-25-30
  //                 para rendir: Todas
  { id: "iq-41", name: "Proyecto Final (INT)",                       year: 5,
    correlatives: [{ subjectId: "iq-27", type: "regular" }, { subjectId: "iq-28", type: "regular" }, { subjectId: "iq-29", type: "regular" }, { subjectId: "iq-31", type: "regular" }, { subjectId: "iq-32", type: "regular" }, { subjectId: "iq-33", type: "regular" }, { subjectId: "iq-17", type: "aprobada" }, { subjectId: "iq-21", type: "aprobada" }, { subjectId: "iq-22", type: "aprobada" }, { subjectId: "iq-25", type: "aprobada" }, { subjectId: "iq-30", type: "aprobada" }] },
];

function buildPlanData(subjects) {
  const maxYear = Math.max(...subjects.map(s => s.year));
  const years = [];
  for (let y = 1; y <= maxYear; y++) {
    const yearSubjects = subjects.filter(s => s.year === y).map(s => ({
      id: s.id,
      name: s.name,
      correlatives: s.correlatives || [],
      correlativesParaFinal: s.correlativesParaFinal || [],
    }));
    if (yearSubjects.length > 0) {
      years.push({ id: y, label: `${y}° Año`, subjects: yearSubjects });
    }
  }
  return { years };
}

// Detecta qué plan predefinido coincide exactamente con los datos actuales del usuario.
// Compara el conjunto de IDs de materias — si coinciden exactamente, es ese plan.
// Si el usuario modificó el plan (agregó/quitó materias), devuelve null.
export function detectPlanId(data) {
  if (!data?.years) return null;
  const userIds = new Set(data.years.flatMap(y => y.subjects.map(s => s.id)));
  if (userIds.size === 0) return null;
  for (const plan of PLANES) {
    const planIds = new Set(plan.data.years.flatMap(y => y.subjects.map(s => s.id)));
    if (planIds.size === userIds.size && [...planIds].every(id => userIds.has(id))) {
      return plan.id;
    }
  }
  return null;
}

export const PLANES = [
  {
    id: "utn-frro-isi-2023",
    universidad: "UTN",
    carrera: "Ingeniería en Sistemas de Información",
    plan: "Plan 2023",
    data: buildPlanData(ISI_UTN_SUBJECTS),
  },
  {
    id: "unr-fca-agr-2023",
    universidad: "UNR",
    carrera: "Ingeniería Agrónoma",
    plan: "Plan 2023",
    data: buildPlanData(AGR_UNR_SUBJECTS),
  },
  {
    id: "utn-frro-iee-2023",
    universidad: "UTN",
    carrera: "Ingeniería en Energía Eléctrica",
    plan: "Plan 2023",
    data: buildPlanData(IEE_UTN_SUBJECTS),
  },
  {
    id: "utn-frro-im-2023",
    universidad: "UTN",
    carrera: "Ingeniería Mecánica",
    plan: "Plan 2023",
    data: buildPlanData(IM_UTN_SUBJECTS),
  },
  {
    id: "utn-frro-ic-2023",
    universidad: "UTN",
    carrera: "Ingeniería Civil",
    plan: "Plan 2023",
    data: buildPlanData(IC_UTN_SUBJECTS),
  },
  {
    id: "utn-frro-iq-2023",
    universidad: "UTN",
    carrera: "Ingeniería Química",
    plan: "Plan 2023",
    data: buildPlanData(IQ_UTN_SUBJECTS),
  },
];

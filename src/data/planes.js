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
// UNR FCA — Ingeniería Agronómica — Plan 2023 (Res. C.S. Nº 416/2023)
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
      years.push({ id: `year-${y}`, label: `${y}° Año`, subjects: yearSubjects });
    }
  }
  return { years };
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
    carrera: "Ingeniería Agronómica",
    plan: "Plan 2023 · Res. C.S. Nº 416",
    data: buildPlanData(AGR_UNR_SUBJECTS),
  },
];

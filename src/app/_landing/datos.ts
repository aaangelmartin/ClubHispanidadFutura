// Dueño: perfil 1. Datos de ejemplo de la landing. Todo lo que sale de aquí va marcado «Ejemplo» en pantalla.
import type { DatosPasaporte, EstadoEntregaValor, Tarjeta } from "@/components/embarca";

export const PASAPORTE_EJEMPLO: DatosPasaporte = {
  nombre: "Andrés Rojas",
  universidad: "U. Nacional de Colombia",
  pais: "Colombia",
  retos: 2,
  numero: "EMB204871",
  sellos: [
    { nota: 8.6, empresa: "Ibérica Retail" },
    { nota: 7.9, empresa: "Andina Pagos" },
  ],
};

export const TARJETA_EJEMPLO: Tarjeta = {
  empresa: "Ibérica Retail",
  origen: "MAD",
  destino: "BOG",
  titulo: "¿Por qué abandonan el carrito los clientes colombianos?",
  datos: [
    { etiqueta: "Duración", valor: "5 días" },
    { etiqueta: "Perfil", valor: "Junior de datos" },
    { etiqueta: "Cierra", valor: "15 oct" },
    { etiqueta: "Premio", valor: "300 €" },
  ],
  puerta: "B12",
  estado: "abierto",
};

export const SALIDAS: { estudiante: string; reto: string; empresa: string; estado: EstadoEntregaValor; nota?: number }[] = [
  { estudiante: "Lucía Fernández · ES", reto: "Rediseño del flujo de devoluciones", empresa: "Ibérica Retail", estado: "valorada", nota: 9.4 },
  { estudiante: "Andrés Rojas · CO", reto: "Abandono del carrito", empresa: "Ibérica Retail", estado: "valorada", nota: 7.9 },
  { estudiante: "Sofía Martín · ES", reto: "Campaña para pymes en Colombia", empresa: "Andina Pagos", estado: "valorada", nota: 6.2 },
  { estudiante: "Valeria Ortiz · CO", reto: "Abandono del carrito", empresa: "Ibérica Retail", estado: "por_valorar" },
  { estudiante: "Diego Pardo · CO", reto: "Alertas de stock", empresa: "Rutas Caribe", estado: "entregada" },
  { estudiante: "Mateo Gil · ES", reto: "Abandono del carrito", empresa: "Ibérica Retail", estado: "no_entregada" },
];

export const LLEGADAS = [
  { hora: "15:42", nombre: "Andrés", uni: "U. Nacional de Colombia", pais: "COL" },
  { hora: "15:36", nombre: "Lucía", uni: "U. Complutense de Madrid", pais: "ESP" },
  { hora: "15:31", nombre: "Valeria", uni: "U. de Antioquia", pais: "COL" },
];

export const RESUMEN_IA = [
  "Analiza 5.000 sesiones y separa España y Colombia.",
  "El abandono se concentra en el paso de envío.",
  "Propone tres mejoras medibles.",
  "Pregunta para ti: ¿el coste de envío es negociable?",
];

export const CRITERIOS = [
  { nombre: "Rigor del análisis", peso: "40 %", nota: 9 },
  { nombre: "Propuestas medibles", peso: "35 %", nota: 8.5 },
  { nombre: "Claridad", peso: "25 %", nota: 8 },
];

// Modo demo: /demo, /dev/sesion y el botón "Demo" solo existen si DEMO_MODE=true.
// En producción real va a false: sin él, nadie puede entrar como otra persona.
export const DEMO_MODE = process.env.DEMO_MODE === "true";

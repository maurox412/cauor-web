import { randomInt } from "crypto";

const PARTICULAS = new Set(["de", "del", "la", "las", "los", "y"]);

// Usuario fijo del colegiado: iniciales (mayúsculas) de nombres y apellidos + registro CAUOR.
// Ejemplo: María Fernanda Apaza Quispe, registro 0123 -> MFAQ0123
export function generarUsername(nombres: string, apellidoPaterno: string, apellidoMaterno: string, registroCauor: string) {
  const iniciales = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .filter((w) => w && !PARTICULAS.has(w.toLowerCase()))
    .map((w) => w[0])
    .join("");
  return `${iniciales}${registroCauor.trim()}`.toUpperCase();
}

// Contraseña temporal aleatoria (sin caracteres confusos como 0/O o 1/l).
// Se muestra una sola vez al administrador y el colegiado debe cambiarla en su primer ingreso.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
export function generarClaveTemporal(largo = 10) {
  return Array.from({ length: largo }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");
}

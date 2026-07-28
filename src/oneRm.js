// Calcul de charge conseillée à partir d'un 1RM (répétition maximale).
// Fonctions pures, sans état — testables et réutilisables par n'importe quelle vue.

const PLATE_STEP = 2.5; // plus petit incrément réaliste (correspond au stepper de charge)

/** Arrondit un poids au pas de plaque le plus proche (2.5 kg par défaut). */
export function roundToStep(kg, step = PLATE_STEP) {
  return Math.round(kg / step) * step;
}

/**
 * Poids estimé permettant de réaliser `reps` répétitions à partir d'un 1RM,
 * via la formule d'Epley : 1RM = charge × (1 + reps / 30).
 * Renvoie null si les entrées sont invalides.
 */
export function weightForReps(oneRM, reps) {
  if (!oneRM || oneRM <= 0 || !reps || reps <= 0) return null;
  if (reps === 1) return roundToStep(oneRM);
  return roundToStep(oneRM / (1 + reps / 30));
}

/**
 * Extrait un nombre de répétitions cible d'un texte libre ("6-8/jambe" → 8,
 * "12-15" → 15, "5" → 5). On prend la borne haute (poids plus léger = conseil
 * plus prudent). Renvoie null si aucun nombre exploitable (ex. "AMRAP", "—").
 */
export function parseTargetReps(repsText) {
  if (!repsText) return null;
  const nums = (String(repsText).match(/\d+/g) || []).map(Number).filter((n) => n > 0);
  if (!nums.length) return null;
  return Math.max(...nums);
}

/** Charge conseillée (kg) pour la cible de reps d'un exercice, ou null. */
export function suggestedWeight(oneRM, repsText) {
  return weightForReps(oneRM, parseTargetReps(repsText));
}

/** Formate un poids sans décimale superflue : 80 → "80", 87.5 → "87.5". */
export function fmtKg(n) {
  if (n == null) return '';
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(1)));
}

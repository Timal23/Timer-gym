export const EQUIPMENT_MAISON = ['Haltères', 'Barre', 'Barre EZ', 'Barre de traction', 'Kettlebell', 'Chaise romaine'];
export const EQUIPMENT_PDC = ['Barre de traction', 'Barres parallèles'];

const META = {
  push: { label: 'Push', muscles: 'Pecs · Épaules · Triceps' },
  pull: { label: 'Pull', muscles: 'Dos · Biceps' },
  jambes: { label: 'Jambes', muscles: 'Quads · Ischios · Mollets' }
};

export const PROGRAM_IDS = ['push', 'pull', 'jambes'];

export function getProgramMeta(programId) {
  return META[programId];
}

// Salle : accès complet aux machines, poulies, barres guidées, etc. — jamais filtré par matériel.
const SALLE_EXERCISES = {
  push: [
    { name: 'Développé couché', muscle: 'Pecs', sets: 4, reps: 12, rest: 90 },
    { name: 'Développé incliné haltères', muscle: 'Pecs', sets: 4, reps: 10, rest: 90 },
    { name: 'Développé militaire', muscle: 'Épaules', sets: 4, reps: 10, rest: 90 },
    { name: 'Élévations latérales', muscle: 'Épaules', sets: 3, reps: 15, rest: 60 },
    { name: 'Dips', muscle: 'Triceps', sets: 3, reps: 12, rest: 75 },
    { name: 'Extension triceps poulie', muscle: 'Triceps', sets: 3, reps: 15, rest: 60 },
    { name: 'Écarté poulie vis-à-vis', muscle: 'Pecs', sets: 3, reps: 15, rest: 60 },
    { name: 'Gainage', muscle: 'Abdos', sets: 3, reps: '45s', rest: 45 }
  ],
  pull: [
    { name: 'Tractions', muscle: 'Dos', sets: 4, reps: 8, rest: 90 },
    { name: 'Rowing barre', muscle: 'Dos', sets: 4, reps: 10, rest: 90 },
    { name: 'Tirage horizontal poulie', muscle: 'Dos', sets: 3, reps: 12, rest: 75 },
    { name: 'Rowing haltère unilatéral', muscle: 'Dos', sets: 3, reps: 10, rest: 75 },
    { name: 'Curl barre', muscle: 'Biceps', sets: 3, reps: 12, rest: 60 },
    { name: 'Curl marteau', muscle: 'Biceps', sets: 3, reps: 12, rest: 60 },
    { name: 'Face pull poulie', muscle: 'Dos', sets: 3, reps: 15, rest: 45 }
  ],
  jambes: [
    { name: 'Squat', muscle: 'Quads', sets: 4, reps: 10, rest: 120 },
    { name: 'Presse à cuisses', muscle: 'Quads', sets: 4, reps: 12, rest: 90 },
    { name: 'Soulevé de terre roumain', muscle: 'Ischios', sets: 4, reps: 10, rest: 90 },
    { name: 'Fentes marchées', muscle: 'Quads', sets: 3, reps: 12, rest: 75 },
    { name: 'Leg curl machine', muscle: 'Ischios', sets: 3, reps: 12, rest: 60 },
    { name: 'Leg extension machine', muscle: 'Quads', sets: 3, reps: 15, rest: 60 },
    { name: 'Mollets debout machine', muscle: 'Mollets', sets: 4, reps: 15, rest: 45 },
    { name: 'Mollets assis machine', muscle: 'Mollets', sets: 3, reps: 15, rest: 45 },
    { name: 'Gainage latéral', muscle: 'Abdos', sets: 3, reps: '30s', rest: 45 }
  ]
};

// Maison : haltères / barre / barre EZ / barre de traction / kettlebell / chaise romaine.
// requires: [] => toujours dispo (poids du corps). Sinon, dispo si au moins un des tags est coché.
const MAISON_EXERCISES = {
  push: [
    { name: 'Pompes', muscle: 'Pecs', sets: 4, reps: 15, rest: 60, requires: [] },
    { name: 'Pompes diamant', muscle: 'Triceps', sets: 3, reps: 12, rest: 60, requires: [] },
    { name: 'Développé au sol haltères', muscle: 'Pecs', sets: 4, reps: 12, rest: 90, requires: ['Haltères'] },
    { name: 'Développé militaire haltères', muscle: 'Épaules', sets: 4, reps: 10, rest: 90, requires: ['Haltères'] },
    { name: 'Développé militaire barre', muscle: 'Épaules', sets: 4, reps: 10, rest: 90, requires: ['Barre'] },
    { name: 'Élévations latérales haltères', muscle: 'Épaules', sets: 3, reps: 15, rest: 60, requires: ['Haltères'] },
    { name: 'Dips sur chaise romaine', muscle: 'Triceps', sets: 3, reps: 12, rest: 75, requires: ['Chaise romaine'] },
    { name: 'Extension triceps haltère', muscle: 'Triceps', sets: 3, reps: 15, rest: 60, requires: ['Haltères'] },
    { name: 'Gainage', muscle: 'Abdos', sets: 3, reps: '45s', rest: 45, requires: [] }
  ],
  pull: [
    { name: 'Tractions', muscle: 'Dos', sets: 4, reps: 8, rest: 90, requires: ['Barre de traction'] },
    { name: 'Rowing haltère unilatéral', muscle: 'Dos', sets: 4, reps: 10, rest: 75, requires: ['Haltères'] },
    { name: 'Rowing barre', muscle: 'Dos', sets: 4, reps: 10, rest: 90, requires: ['Barre'] },
    { name: 'Superman', muscle: 'Dos', sets: 3, reps: 15, rest: 45, requires: [] },
    { name: 'Extension dos au sol', muscle: 'Dos', sets: 3, reps: 15, rest: 45, requires: [] },
    { name: 'Curl barre EZ', muscle: 'Biceps', sets: 3, reps: 12, rest: 60, requires: ['Barre EZ'] },
    { name: 'Curl haltères', muscle: 'Biceps', sets: 3, reps: 12, rest: 60, requires: ['Haltères'] },
    { name: 'Curl kettlebell', muscle: 'Biceps', sets: 3, reps: 12, rest: 60, requires: ['Kettlebell'] }
  ],
  jambes: [
    { name: 'Squats', muscle: 'Quads', sets: 4, reps: 15, rest: 75, requires: [] },
    { name: 'Fentes marchées', muscle: 'Quads', sets: 3, reps: 12, rest: 75, requires: [] },
    { name: 'Fentes bulgares', muscle: 'Quads', sets: 3, reps: 12, rest: 75, requires: [] },
    { name: 'Squat gobelet haltère', muscle: 'Quads', sets: 4, reps: 12, rest: 90, requires: ['Haltères'] },
    { name: 'Squat gobelet kettlebell', muscle: 'Quads', sets: 4, reps: 12, rest: 90, requires: ['Kettlebell'] },
    { name: 'Soulevé de terre roumain haltères', muscle: 'Ischios', sets: 4, reps: 10, rest: 90, requires: ['Haltères'] },
    { name: 'Soulevé de terre roumain barre', muscle: 'Ischios', sets: 4, reps: 10, rest: 90, requires: ['Barre'] },
    { name: 'Mollets debout', muscle: 'Mollets', sets: 4, reps: 20, rest: 45, requires: [] },
    { name: 'Leg raises chaise romaine', muscle: 'Abdos', sets: 3, reps: 15, rest: 45, requires: ['Chaise romaine'] },
    { name: 'Gainage', muscle: 'Abdos', sets: 3, reps: '30s', rest: 45, requires: [] }
  ]
};

// PDC : uniquement poids du corps, sauf si barre de traction / barres parallèles dispo en extérieur.
const PDC_EXERCISES = {
  push: [
    { name: 'Pompes classiques', muscle: 'Pecs', sets: 4, reps: 15, rest: 60, requires: [] },
    { name: 'Pompes surélevées (déclinées)', muscle: 'Pecs', sets: 3, reps: 12, rest: 60, requires: [] },
    { name: 'Pompes diamant', muscle: 'Triceps', sets: 3, reps: 12, rest: 60, requires: [] },
    { name: 'Pike push-ups', muscle: 'Épaules', sets: 3, reps: 12, rest: 60, requires: [] },
    { name: 'Dips entre deux chaises', muscle: 'Triceps', sets: 3, reps: 12, rest: 60, requires: [] },
    { name: 'Dips barres parallèles', muscle: 'Triceps', sets: 4, reps: 12, rest: 75, requires: ['Barres parallèles'] },
    { name: 'Gainage', muscle: 'Abdos', sets: 3, reps: '45s', rest: 45, requires: [] }
  ],
  pull: [
    { name: 'Tractions', muscle: 'Dos', sets: 4, reps: 8, rest: 90, requires: ['Barre de traction'] },
    { name: 'Rowing australien (sous table)', muscle: 'Dos', sets: 4, reps: 12, rest: 75, requires: [] },
    { name: 'Superman', muscle: 'Dos', sets: 3, reps: 15, rest: 45, requires: [] },
    { name: 'Extension dos au sol', muscle: 'Dos', sets: 3, reps: 15, rest: 45, requires: [] }
  ],
  jambes: [
    { name: 'Squats', muscle: 'Quads', sets: 4, reps: 20, rest: 60, requires: [] },
    { name: 'Squats sautés', muscle: 'Quads', sets: 3, reps: 15, rest: 75, requires: [] },
    { name: 'Fentes marchées', muscle: 'Quads', sets: 3, reps: 12, rest: 75, requires: [] },
    { name: 'Fentes bulgares (chaise)', muscle: 'Quads', sets: 3, reps: 12, rest: 75, requires: [] },
    { name: 'Mollets debout', muscle: 'Mollets', sets: 4, reps: 20, rest: 45, requires: [] },
    { name: 'Chaise murale', muscle: 'Quads', sets: 3, reps: '40s', rest: 45, requires: [] },
    { name: 'Gainage', muscle: 'Abdos', sets: 3, reps: '30s', rest: 45, requires: [] }
  ]
};

function filterByEquipment(exercises, equipment) {
  return exercises.filter((ex) => !ex.requires || ex.requires.length === 0 || ex.requires.some((tag) => equipment[tag]));
}

export function resolveExercises(mode, programId, equipment) {
  if (mode === 'Salle') return SALLE_EXERCISES[programId];
  if (mode === 'Maison') return filterByEquipment(MAISON_EXERCISES[programId], equipment || {});
  return filterByEquipment(PDC_EXERCISES[programId], equipment || {});
}

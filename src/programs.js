/**
 * Programme Push / Pull / Legs — données du programme d'entraînement.
 * Structure : PROGRAM[lieu][jour][niveau] -> Exercise[]
 */

export const LEVELS = [
  { id: 'deb', label: 'Débutant' },
  { id: 'int', label: 'Intermédiaire' },
  { id: 'exp', label: 'Expert' }
];

const TYPES = {
  F: { id: 'F', label: 'Force', hint: '3-6 reps, lourd, repos longs, 1-2 reps en réserve, note tes perfs.' },
  H: { id: 'H', label: 'Hypertrophie', hint: '8-15 reps, près de l\'échec (0-2 reps en réserve).' },
  M: { id: 'M', label: 'Mixte', hint: 'Entre force et hypertrophie.' },
  X: { id: 'X', label: 'Explosif', hint: 'Vitesse maximale, jamais à l\'échec (pliométrie).' }
};

const DAYS = [
  { id: 'push', label: 'Push', targets: ['Pecs', 'Épaules', 'Triceps'] },
  { id: 'pull', label: 'Pull', targets: ['Dos', 'Biceps', 'Arrière d\'épaule', 'Trapèzes'] },
  { id: 'legs', label: 'Jambes', targets: ['Quadriceps', 'Ischios', 'Fessiers', 'Mollets'] }
];

const rest = (sec, label) => ({ sec, label });

const R = {
  p120: rest(120, '2 min'),
  p150: rest(150, '2-3 min'),
  p180: rest(180, '3 min'),
  s90: rest(90, '90 s'),
  s75: rest(75, '75 s'),
  s60: rest(60, '60 s'),
  s45: rest(45, '45 s')
};

const ex = (name, sets, r, type, note = null) => ({ name, sets, rest: r, type, note });

export const WARMUPS = {
  push: [
    'Mobilité articulaire : cercles épaules, coudes, poignets ×10 chacun',
    "Rotations d'épaules + band pull-aparts (ou bras à vide) ×20",
    '10 pompes lentes',
    '2 séries d\'approche montantes sur le 1er développé (barre à vide → ~50% → ~70%)'
  ],
  pull: [
    'Mobilité articulaire : cercles épaules, coudes, poignets, cou ×10',
    'Dislocations d\'épaule au bâton/serviette ×10',
    'Face pulls légers ou band pull-aparts ×20',
    'Suspension passive à la barre 20 s',
    '2 séries d\'approche sur le 1er tirage/rowing'
  ],
  legs: [
    'Mobilité articulaire : cercles hanches, genoux, chevilles ×10 chacun',
    '15 squats au poids du corps + good-morning à vide ×10',
    'Fentes dynamiques ×10/jambe',
    '2-3 séries d\'approche montantes sur le 1er gros exo'
  ]
};

const ABS = {
  push: {
    title: 'Abdos — gainage & anté',
    exercises: [
      ex('Gainage planche', '3 × 30-60 s', R.s45, 'H'),
      ex('Relevés de jambes suspendus (barre)', '3 × 12', R.s45, 'H',
        'Maison : relevés de genoux à la chaise romaine, ou jambes tendues au sol.')
    ]
  },
  pull: {
    title: 'Abdos — flexion & obliques',
    exercises: [
      ex('Roue abdominale (ou crunch au sol)', '3 × 10-12', R.s45, 'H', 'Pas de roue : crunch lent tempo 2-1-2.'),
      ex('Russian twist / crunch oblique', '3 × 15/côté', R.s45, 'H')
    ]
  },
  legs: {
    title: 'Abdos — bas des abdos & latéral',
    exercises: [
      ex('Relevés de jambes suspendus lents', '3 × 10-15', R.s45, 'H', 'Adapte au sol / chaise romaine selon le lieu.'),
      ex('Gainage latéral', '3 × 30-45 s/côté', R.s45, 'H')
    ]
  }
};

const PROGRAM = {
  salle: {
    push: {
      deb: [
        ex('Développé couché haltères', '4 × 6', R.p120, 'F', 'Descente contrôlée, pas de rebond.'),
        ex('Développé militaire assis haltères', '3 × 8-10', R.s90, 'H'),
        ex('Écarté à la poulie (ou pec-deck)', '3 × 12', R.s75, 'H'),
        ex('Élévations latérales', '3 × 12-15', R.s60, 'H', "Monte à l'horizontale, pas plus haut."),
        ex('Extension triceps poulie corde', '3 × 12', R.s60, 'H')
      ],
      int: [
        ex('Développé couché barre', '5 × 5', R.p150, 'F'),
        ex('Développé incliné haltères', '4 × 8', R.s90, 'H'),
        ex('Développé militaire debout barre', '4 × 6-8', R.p120, 'F'),
        ex('Élévations latérales', '4 × 12-15', R.s60, 'H'),
        ex('Dips (lestés légers si possible)', '3 × 8-10', R.s90, 'H'),
        ex('Extension triceps poulie', '3 × 12', R.s60, 'H')
      ],
      exp: [
        ex('Développé couché barre', '5 × 3-5', R.p180, 'F', 'Top set lourd puis back-off à ~90%.'),
        ex('Développé militaire barre debout', '4 × 5', R.p150, 'F'),
        ex('Développé incliné haltères', '4 × 8-10', R.s90, 'H'),
        ex('Écarté poulie (dropset sur la dernière)', '3 × 12-15', R.s75, 'H'),
        ex('Élévations latérales (dropset finale)', '4 × 12-20', R.s60, 'H'),
        ex('Dips lestés', '4 × 8', R.p120, 'M'),
        ex('Extension triceps overhead corde', '4 × 10-12', R.s60, 'H')
      ]
    },
    pull: {
      deb: [
        ex('Tirage vertical (lat pulldown)', '4 × 8-10', R.s90, 'M'),
        ex('Rowing machine (ou haltère)', '3 × 10', R.s90, 'H'),
        ex('Tirage horizontal poulie', '3 × 12', R.s75, 'H'),
        ex('Face pull', '3 × 15', R.s60, 'H', "Santé d'épaule — ne le saute jamais."),
        ex('Curl haltères', '3 × 12', R.s60, 'H')
      ],
      int: [
        ex('Tractions (assistées si besoin)', '4 × 6-8', R.p120, 'F'),
        ex('Rowing barre penché', '4 × 6-8', R.p120, 'F'),
        ex('Tirage horizontal poulie', '3 × 10-12', R.s75, 'H'),
        ex('Face pull', '3 × 15', R.s60, 'H'),
        ex('Curl barre EZ', '3 × 10', R.s60, 'H'),
        ex('Curl incliné haltères', '3 × 12', R.s60, 'H')
      ],
      exp: [
        ex('Tractions lestées', '4 × 5-6', R.p150, 'F'),
        ex('Rowing barre lourd (Pendlay)', '4 × 6', R.p150, 'F'),
        ex('Tirage vertical prise serrée', '3 × 10', R.s90, 'H'),
        ex('Rowing poulie unilatéral', '3 × 12', R.s75, 'H'),
        ex('Face pull / oiseau poulie', '4 × 15-20', R.s60, 'H'),
        ex('Curl barre EZ', '4 × 8-10', R.s75, 'H'),
        ex('Curl marteau', '3 × 12', R.s60, 'H')
      ]
    },
    legs: {
      deb: [
        ex('Presse à cuisses', '4 × 8-10', R.p120, 'M'),
        ex('Leg curl allongé', '3 × 10-12', R.s90, 'H'),
        ex('Leg extension', '3 × 12', R.s75, 'H'),
        ex('Fentes marchées haltères', '3 × 10/jambe', R.s90, 'H'),
        ex('Mollets debout', '4 × 15', R.s45, 'H')
      ],
      int: [
        ex('Squat barre', '5 × 5', R.p180, 'F'),
        ex('Soulevé de terre roumain', '4 × 8', R.p120, 'M', 'Étire les ischios, dos gainé.'),
        ex('Presse à cuisses', '3 × 10-12', R.s90, 'H'),
        ex('Leg curl', '3 × 12', R.s75, 'H'),
        ex('Mollets debout', '4 × 12-15', R.s45, 'H')
      ],
      exp: [
        ex('Squat barre', '5 × 3-5', R.p180, 'F'),
        ex('Soulevé de terre roumain (ou classique)', '4 × 5-6', R.p180, 'F'),
        ex('Hack squat ou presse', '4 × 10-12', R.p120, 'H'),
        ex('Leg curl', '4 × 12', R.s75, 'H'),
        ex('Leg extension (dropset finale)', '3 × 15', R.s60, 'H'),
        ex('Mollets (debout + assis)', '5 × 12-20', R.s45, 'H')
      ]
    }
  },

  maison: {
    push: {
      deb: [
        ex('Développé couché haltères (banc)', '4 × 6', R.p120, 'F'),
        ex('Développé militaire haltères assis', '3 × 8-10', R.s90, 'H'),
        ex('Écarté haltères (banc)', '3 × 12', R.s75, 'H'),
        ex('Élévations latérales haltères', '3 × 12-15', R.s60, 'H'),
        ex('Barre au front EZ (skullcrusher)', '3 × 12', R.s60, 'H')
      ],
      int: [
        ex('Développé couché barre (banc)', '5 × 5', R.p150, 'F'),
        ex('Développé incliné haltères', '4 × 8', R.s90, 'H'),
        ex('Développé militaire barre debout', '4 × 6-8', R.p120, 'F'),
        ex('Élévations latérales haltères', '4 × 12-15', R.s60, 'H'),
        ex('Dips à la chaise romaine (ou entre 2 bancs)', '3 × 8-10', R.s90, 'H', "Leste avec un haltère entre les pieds si trop facile."),
        ex('Skullcrusher EZ', '3 × 12', R.s60, 'H')
      ],
      exp: [
        ex('Développé couché barre', '5 × 3-5', R.p180, 'F'),
        ex('Développé militaire barre debout', '4 × 5', R.p150, 'F'),
        ex('Développé incliné haltères', '4 × 8-10', R.s90, 'H'),
        ex('Écarté haltères (tempo lent, dropset)', '3 × 12-15', R.s75, 'H'),
        ex('Élévations latérales (dropset)', '4 × 12-20', R.s60, 'H'),
        ex('Dips lestés (chaise romaine)', '4 × 8', R.p120, 'M'),
        ex('Overhead haltère + skullcrusher EZ', '4 × 10-12', R.s60, 'H')
      ]
    },
    pull: {
      deb: [
        ex('Rowing haltère unilatéral (appui banc)', '4 × 10', R.s90, 'H'),
        ex('Rowing barre penché', '3 × 10', R.s90, 'M'),
        ex('Hyperextensions (chaise romaine)', '3 × 12', R.s75, 'H', 'Dos + ischios + fessiers.'),
        ex('Oiseau haltères (arrière d\'épaule)', '3 × 15', R.s60, 'H'),
        ex('Curl EZ', '3 × 12', R.s60, 'H')
      ],
      int: [
        ex('Rowing barre penché (Pendlay)', '4 × 6-8', R.p120, 'F'),
        ex('Tractions (si barre) ou rowing haltère lourd', '4 × 8', R.p120, 'M'),
        ex('Hyperextensions lestées (chaise romaine)', '3 × 12', R.s75, 'H'),
        ex('Shrugs haltères (trapèzes)', '3 × 12-15', R.s60, 'H'),
        ex('Oiseau haltères', '3 × 15', R.s60, 'H'),
        ex('Curl EZ + curl marteau', '3 × 10-12', R.s60, 'H')
      ],
      exp: [
        ex('Rowing barre lourd', '4 × 6', R.p150, 'F'),
        ex('Tractions lestées (si barre) ou rowing haltère lourd unilat.', '4 × 6-8', R.p120, 'M'),
        ex('Hyperextensions lestées', '4 × 12', R.s75, 'H'),
        ex('Rowing haltère unilatéral (tempo)', '3 × 12', R.s75, 'H'),
        ex('Shrugs barre', '4 × 12', R.s60, 'H'),
        ex('Oiseau haltères (dropset)', '4 × 15-20', R.s45, 'H'),
        ex('Curl EZ + curl marteau', '4 × 8-10', R.s60, 'H')
      ]
    },
    legs: {
      deb: [
        ex('Squat gobelet haltère (ou barre si rack)', '4 × 10', R.p120, 'M'),
        ex('Fentes bulgares haltères (banc)', '3 × 10/jambe', R.s90, 'H', 'Ton meilleur exo cuisses à la maison.'),
        ex('Soulevé de terre roumain haltères', '3 × 10', R.s90, 'H'),
        ex('Hip thrust haltère/barre (dos sur banc)', '3 × 12', R.s90, 'H'),
        ex('Mollets debout haltère (1 jambe sur une marche)', '4 × 15', R.s45, 'H')
      ],
      int: [
        ex('Squat barre (rack) — sinon fentes bulgares lourdes', '5 × 5', R.p180, 'F'),
        ex('Soulevé de terre roumain barre', '4 × 8', R.p120, 'M'),
        ex('Hip thrust barre', '4 × 10', R.s90, 'H'),
        ex('Fentes marchées haltères', '3 × 10/jambe', R.s90, 'H'),
        ex('Mollets debout', '4 × 12-15', R.s45, 'H')
      ],
      exp: [
        ex('Squat barre (rack) — sinon bulgares très lestées', '5 × 3-5', R.p180, 'F'),
        ex('Soulevé de terre roumain barre lourd', '4 × 5-6', R.p180, 'F'),
        ex('Hip thrust barre', '4 × 8-10', R.p120, 'M'),
        ex('Fentes bulgares haltères (tempo)', '3 × 10/jambe', R.s90, 'H'),
        ex('Nordic curl (aide chaise romaine/banc)', '3 × 6-8', R.s90, 'H', 'Ischios, brutal — régresse en négatives lentes.'),
        ex('Mollets (debout + 1 jambe)', '5 × 15-20', R.s45, 'H')
      ]
    }
  },

  pdc: {
    push: {
      deb: [
        ex('Dips barres parallèles', '4 × 6-8', R.p120, 'F', 'Trop dur : négatives lentes ou dips sur banc.'),
        ex('Pompes (inclinées → au sol)', '3 × 10-12', R.s90, 'H'),
        ex('Pompes piké (vers handstand)', '3 × 8-10', R.s90, 'H', 'Cible les épaules.'),
        ex('Pompes diamant', '3 × 10', R.s60, 'H', 'Cible les triceps.')
      ],
      int: [
        ex('Dips barres parallèles', '4 × 8-10', R.p120, 'F'),
        ex('Pompes déclinées (pieds surélevés)', '4 × 10-12', R.s90, 'H'),
        ex('Pompes piké surélevées', '4 × 8', R.s90, 'H'),
        ex('Pompes archer', '3 × 8/côté', R.s75, 'H'),
        ex('Pompes diamant', '3 × 12', R.s60, 'H')
      ],
      exp: [
        ex('Dips lestés (ceinture)', '4 × 6-8', R.p150, 'F'),
        ex('Handstand push-ups (mur, ou piké très surélevé)', '4 × 5-8', R.p120, 'F', 'Épaules — progresse en amplitude.'),
        ex('Pompes pseudo-planche', '4 × 8-10', R.s90, 'H'),
        ex('Pompes archer', '3 × 8/côté', R.s75, 'H'),
        ex('Pompes diamant (tempo lent)', '3 × 12-15', R.s60, 'H')
      ]
    },
    pull: {
      deb: [
        ex('Tractions (élastique/assistées)', '4 × 5-8', R.p120, 'F', 'Trop dur : remplace par rowing australien.'),
        ex('Rowing australien (barre basse / parallèles)', '3 × 10-12', R.s90, 'H'),
        ex('Chin-ups supination (assistés)', '3 × 6-8', R.s90, 'M', 'Cible les biceps.'),
        ex('Curl australien supination (corps horizontal)', '3 × 10', R.s60, 'H')
      ],
      int: [
        ex('Tractions pronation', '4 × 6-10', R.p120, 'F'),
        ex('Rowing australien pieds surélevés', '4 × 10-12', R.s90, 'H'),
        ex('Chin-ups (supination)', '3 × 8', R.s90, 'M'),
        ex('Rowing australien supination (biceps)', '3 × 10-12', R.s60, 'H'),
        ex('Tractions prise large (tempo, haut du dos)', '3 × 8-10', R.s60, 'H')
      ],
      exp: [
        ex('Tractions lestées', '4 × 5-6', R.p150, 'F'),
        ex('Tractions archer ou prise très large', '4 × 6-8', R.p120, 'H'),
        ex('Front lever rows (progression) / rowing australien lesté', '3 × 8-10', R.s90, 'H'),
        ex('Chin-ups lestés', '3 × 6-8', R.s90, 'M', 'Cible les biceps.'),
        ex('Curl australien supination (tempo lent)', '3 × 10-12', R.s60, 'H')
      ]
    },
    legs: {
      deb: [
        ex('Squats poids du corps (tempo 3 s descente)', '4 × 15-20', R.s90, 'H'),
        ex('Fentes marchées', '3 × 12/jambe', R.s90, 'H'),
        ex('Fentes bulgares (pied sur banc/muret)', '3 × 10/jambe', R.s90, 'H'),
        ex('Nordic curl négatif (aidé)', '3 × 5-8', R.s90, 'H', 'Ischios.'),
        ex('Mollets 1 jambe (sur une marche)', '4 × 15-20', R.s45, 'H')
      ],
      int: [
        ex('Fentes bulgares (tempo)', '4 × 10-12/jambe', R.s90, 'M', 'Moteur principal des cuisses.'),
        ex('Squats sautés (pliométrie)', '4 × 10', R.s90, 'X'),
        ex('Progression pistol squat (sur boîte/appui)', '3 × 6-8/jambe', R.s90, 'H'),
        ex('Nordic curl', '3 × 6-8', R.s90, 'H', 'Ischios.'),
        ex('Hip thrust 1 jambe au sol', '3 × 12/jambe', R.s60, 'H'),
        ex('Mollets 1 jambe', '4 × 20', R.s45, 'H')
      ],
      exp: [
        ex('Pistol squats', '4 × 6-8/jambe', R.p120, 'F'),
        ex('Fentes bulgares sautées (ou tempo 4 s)', '4 × 10/jambe', R.s90, 'H'),
        ex('Fentes / squats sautés (pliométrie)', '4 × 12', R.s90, 'X'),
        ex('Nordic curl complet', '4 × 6-8', R.s90, 'F', 'Ischios — le plafond du bodyweight, exploite-le.'),
        ex('Hip thrust 1 jambe (tempo)', '3 × 15/jambe', R.s60, 'H'),
        ex('Mollets 1 jambe (amplitude complète)', '5 × 20-25', R.s45, 'H')
      ]
    }
  }
};

/**
 * Ancienne base d'exercices (avant le passage au programme par niveaux),
 * récupérée pour élargir le pool de tirage aléatoire. Même format brut que
 * PROGRAM (ex()), clé LEGACY[lieu][jour]. Les entrées d'abdos rejoignent le
 * pool d'abdos ; les autres, le pool du groupe musculaire correspondant.
 */
const LEGACY = {
  salle: {
    push: [
      ex('Développé couché', '4 × 12', R.s90, 'M'),
      ex('Développé incliné haltères', '4 × 10', R.s90, 'M'),
      ex('Développé militaire', '4 × 10', R.s90, 'M'),
      ex('Élévations latérales', '3 × 15', R.s60, 'H'),
      ex('Dips', '3 × 12', R.s75, 'H'),
      ex('Extension triceps poulie', '3 × 15', R.s60, 'H'),
      ex('Écarté poulie vis-à-vis', '3 × 15', R.s60, 'H'),
      ex('Gainage', '3 × 45 s', R.s45, 'H')
    ],
    pull: [
      ex('Tractions', '4 × 8', R.s90, 'F'),
      ex('Rowing barre', '4 × 10', R.s90, 'M'),
      ex('Tirage horizontal poulie', '3 × 12', R.s75, 'H'),
      ex('Rowing haltère unilatéral', '3 × 10', R.s75, 'H'),
      ex('Curl barre', '3 × 12', R.s60, 'H'),
      ex('Curl marteau', '3 × 12', R.s60, 'H'),
      ex('Face pull poulie', '3 × 15', R.s45, 'H')
    ],
    legs: [
      ex('Squat', '4 × 10', R.p120, 'F'),
      ex('Presse à cuisses', '4 × 12', R.s90, 'M'),
      ex('Soulevé de terre roumain', '4 × 10', R.s90, 'M'),
      ex('Fentes marchées', '3 × 12', R.s75, 'H'),
      ex('Leg curl machine', '3 × 12', R.s60, 'H'),
      ex('Leg extension machine', '3 × 15', R.s60, 'H'),
      ex('Mollets debout machine', '4 × 15', R.s45, 'H'),
      ex('Mollets assis machine', '3 × 15', R.s45, 'H'),
      ex('Gainage latéral', '3 × 30 s', R.s45, 'H')
    ]
  },
  maison: {
    push: [
      ex('Pompes', '4 × 15', R.s60, 'H'),
      ex('Pompes diamant', '3 × 12', R.s60, 'H'),
      ex('Développé au sol haltères', '4 × 12', R.s90, 'M'),
      ex('Développé militaire haltères', '4 × 10', R.s90, 'M'),
      ex('Développé militaire barre', '4 × 10', R.s90, 'M'),
      ex('Élévations latérales haltères', '3 × 15', R.s60, 'H'),
      ex('Dips sur chaise romaine', '3 × 12', R.s75, 'H'),
      ex('Extension triceps haltère', '3 × 15', R.s60, 'H'),
      ex('Pompes piké', '3 × 10-12', R.s60, 'H'),
      ex('Pompes déclinées (pieds surélevés)', '4 × 12', R.s60, 'H'),
      ex('Pompes archer', '3 × 8/côté', R.s75, 'H'),
      ex('Gainage', '3 × 45 s', R.s45, 'H')
    ],
    pull: [
      ex('Tractions', '4 × 8', R.s90, 'F'),
      ex('Rowing haltère unilatéral', '4 × 10', R.s75, 'M'),
      ex('Rowing barre', '4 × 10', R.s90, 'M'),
      ex('Rowing australien (sous une table)', '4 × 12', R.s75, 'H'),
      ex('Superman', '3 × 15', R.s45, 'H'),
      ex('Extension dos au sol', '3 × 15', R.s45, 'H'),
      ex('Curl barre EZ', '3 × 12', R.s60, 'H'),
      ex('Curl haltères', '3 × 12', R.s60, 'H'),
      ex('Curl kettlebell', '3 × 12', R.s60, 'H'),
      ex('Curl australien supination (sous une table)', '3 × 10-12', R.s60, 'H')
    ],
    legs: [
      ex('Squats', '4 × 15', R.s75, 'H'),
      ex('Squats sautés', '3 × 15', R.s75, 'X'),
      ex('Fentes marchées', '3 × 12', R.s75, 'H'),
      ex('Fentes bulgares', '3 × 12', R.s75, 'H'),
      ex('Squat gobelet haltère', '4 × 12', R.s90, 'M'),
      ex('Squat gobelet kettlebell', '4 × 12', R.s90, 'M'),
      ex('Soulevé de terre roumain haltères', '4 × 10', R.s90, 'M'),
      ex('Soulevé de terre roumain barre', '4 × 10', R.s90, 'M'),
      ex('Pont fessier (poids du corps)', '3 × 15', R.s60, 'H'),
      ex('Nordic curl négatif', '3 × 6-8', R.s90, 'H'),
      ex('Mollets debout', '4 × 20', R.s45, 'H'),
      ex('Leg raises chaise romaine', '3 × 15', R.s45, 'H'),
      ex('Gainage', '3 × 30 s', R.s45, 'H')
    ]
  },
  pdc: {
    push: [
      ex('Pompes classiques', '4 × 15', R.s60, 'H'),
      ex('Pompes surélevées (déclinées)', '3 × 12', R.s60, 'H'),
      ex('Pompes diamant', '3 × 12', R.s60, 'H'),
      ex('Pike push-ups', '3 × 12', R.s60, 'H'),
      ex('Dips entre deux chaises', '3 × 12', R.s60, 'H'),
      ex('Dips barres parallèles', '4 × 12', R.s75, 'M'),
      ex('Gainage', '3 × 45 s', R.s45, 'H')
    ],
    pull: [
      ex('Tractions', '4 × 8', R.s90, 'F'),
      ex('Rowing australien (sous table)', '4 × 12', R.s75, 'H'),
      ex('Superman', '3 × 15', R.s45, 'H'),
      ex('Extension dos au sol', '3 × 15', R.s45, 'H')
    ],
    legs: [
      ex('Squats', '4 × 20', R.s60, 'H'),
      ex('Squats sautés', '3 × 15', R.s75, 'X'),
      ex('Fentes marchées', '3 × 12', R.s75, 'H'),
      ex('Fentes bulgares (chaise)', '3 × 12', R.s75, 'H'),
      ex('Mollets debout', '4 × 20', R.s45, 'H'),
      ex('Chaise murale', '3 × 40 s', R.s45, 'H'),
      ex('Gainage', '3 × 30 s', R.s45, 'H')
    ]
  }
};

/**
 * Groupe musculaire d'un exercice, déduit de son nom et du jour. Sert uniquement
 * à équilibrer le tirage aléatoire (on remplace un exercice par un autre du même
 * groupe). 'Abdos' est routé vers le pool d'abdos dédié.
 */
function classifyMuscle(name, programId) {
  const n = name.toLowerCase();
  if (/gainage|crunch|twist|roue|relev[eé]s?|leg raises|abdo|russian/.test(n)) return 'Abdos';
  if (programId === 'push') {
    if (/militaire|[eé]l[eé]vation|pik[eé]|pike|handstand|[eé]paule/.test(n)) return 'Épaules';
    if (/triceps|dips|skull|barre au front|diamant|overhead|extension/.test(n)) return 'Triceps';
    return 'Pecs';
  }
  if (programId === 'pull') {
    if (/curl|chin-?\s?up|marteau|biceps/.test(n)) return 'Biceps';
    return 'Dos';
  }
  // legs
  if (/mollet/.test(n)) return 'Mollets';
  if (/ischio|roumain|leg curl|nordic|good-?morning/.test(n)) return 'Ischios';
  if (/hip thrust|fessier/.test(n)) return 'Fessiers';
  return 'Quads';
}

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Matériel possible à la maison (déclaré dans le profil). Le mode Salle n'est
 * jamais filtré (accès complet), le mode PDC est du poids du corps.
 */
export const EQUIPMENT_MAISON = ['Haltères', 'Barre', 'Barre EZ', 'Barre de traction', 'Kettlebell', 'Chaise romaine'];

/**
 * Matériel requis par un exercice (une catégorie, ou null = poids du corps,
 * toujours dispo). Déduit du nom. Utilisé seulement pour filtrer le pool Maison
 * selon le matériel du profil.
 */
function equipmentFor(name) {
  const n = name.toLowerCase();
  if (/nordic/.test(n)) return null; // ancrage improvisé (canapé, aide) — pas de matériel
  if (/kettlebell/.test(n)) return 'Kettlebell';
  if (/traction|chin-?\s?up/.test(n)) return 'Barre de traction';
  if (/barre ez|\bez\b|skull|barre au front/.test(n)) return 'Barre EZ';
  if (/chaise romaine|hyperextension/.test(n)) return 'Chaise romaine';
  if (/halt[eè]re/.test(n)) return 'Haltères';
  if (/barre/.test(n)) return 'Barre';
  return null;
}

/** L'exercice est-il réalisable avec le matériel déclaré ? (equipment nul = tout dispo) */
function ownsEquipment(equipment, name) {
  const tag = equipmentFor(name);
  return tag == null || !equipment || equipment[tag];
}

/* --------------------------------- Adaptation ----------------------------- */

const MODE_TO_LOCATION = { Salle: 'salle', Maison: 'maison', PDC: 'pdc' };

const PROGRAM_LABELS = { push: 'Push', pull: 'Pull', legs: 'Jambes' };

export const PROGRAM_IDS = DAYS.map((d) => d.id);

export function getProgramMeta(programId) {
  const day = DAYS.find((d) => d.id === programId);
  return { label: PROGRAM_LABELS[programId] || day.label, muscles: day.targets.join(' · ') };
}

function toWarmupExercise(text) {
  return { name: text, muscle: 'Échauffement', sets: 1, reps: '—', rest: 20, restLabel: '20 s', note: null, hold: parseHold(text) };
}

/** Découpe une chaîne "4 × 6-8/jambe" en { sets: 4, reps: "6-8/jambe" }. */
function parseSets(raw) {
  const match = /^(\d+)\s*×\s*(.+)$/.exec(raw.trim());
  if (!match) return { sets: 3, reps: raw.trim() };
  return { sets: parseInt(match[1], 10), reps: match[2].trim() };
}

/**
 * Détecte un maintien chronométré ("30-60 s", "45 s/côté", "20 s") et renvoie
 * la durée cible en secondes (borne haute d'une fourchette), sinon null.
 */
function parseHold(text) {
  if (!text) return null;
  const m = /(\d+)(?:\s*[-–]\s*(\d+))?\s*s(?:ec)?\b/i.exec(text);
  if (!m) return null;
  return parseInt(m[2] || m[1], 10);
}

function toWorkoutExercise(raw, muscle) {
  const { sets, reps } = parseSets(raw.sets);
  return {
    name: raw.name,
    muscle,
    sets,
    reps,
    rest: raw.rest.sec,
    restLabel: raw.rest.label,
    note: raw.note,
    hold: parseHold(reps)
  };
}

/**
 * Pool d'exercices principaux (niveau choisi + anciens exercices), regroupé par
 * groupe musculaire, dédupliqué par nom. Les abdos sont exclus (pool séparé).
 */
function buildGroupedPool(location, programId, level, equipment) {
  const filterEquip = location === 'maison';
  const raws = [
    ...(PROGRAM[location]?.[programId]?.[level] || []),
    ...(LEGACY[location]?.[programId] || [])
  ];
  const groups = {};
  const seen = new Set();
  for (const raw of raws) {
    if (seen.has(raw.name)) continue;
    if (filterEquip && !ownsEquipment(equipment, raw.name)) continue;
    const group = classifyMuscle(raw.name, programId);
    if (group === 'Abdos') continue;
    seen.add(raw.name);
    (groups[group] ||= []).push(raw);
  }
  return groups;
}

/** Pool d'abdos : blocs ABS de tous les jours + abdos des anciens exercices du lieu. */
function buildAbsPool(location, equipment) {
  const filterEquip = location === 'maison';
  const raws = [
    ...Object.values(ABS).flatMap((block) => block.exercises),
    ...['push', 'pull', 'legs'].flatMap((day) =>
      (LEGACY[location]?.[day] || []).filter((raw) => classifyMuscle(raw.name, day) === 'Abdos')
    )
  ];
  const seen = new Set();
  return raws.filter((raw) => {
    if (seen.has(raw.name)) return false;
    if (filterEquip && !ownsEquipment(equipment, raw.name)) return false;
    seen.add(raw.name);
    return true;
  });
}

/**
 * Construit la liste d'une séance. L'échauffement est fixe. Les exercices
 * principaux et les abdos sont tirés AU HASARD à chaque appel : pour chaque
 * emplacement du programme (qui fixe le nombre d'exercices et la répartition
 * musculaire du niveau), on pioche un exercice du même groupe dans le pool
 * (niveau + anciens exercices), sans doublon. Relancer la même séance donne
 * donc une sélection différente.
 *
 * `equipment` (map { matériel: bool } du profil) filtre le pool en mode Maison :
 * les exercices dont le matériel n'est pas déclaré sont retirés. Si un groupe
 * musculaire n'a plus aucun exercice réalisable, on pioche dans le reste du pool
 * dispo (poids du corps) plutôt qu'imposer un exercice infaisable.
 */
export function resolveExercises(mode, programId, level, equipment = null) {
  const location = MODE_TO_LOCATION[mode];
  const template = PROGRAM[location]?.[programId]?.[level] || [];
  const groups = buildGroupedPool(location, programId, level, equipment);
  const allAvailable = Object.values(groups).flat();
  const used = new Set();

  const mainRaws = template.map((slot) => {
    const group = classifyMuscle(slot.name, programId);
    let candidates = (groups[group] || []).filter((raw) => !used.has(raw.name));
    if (!candidates.length) candidates = allAvailable.filter((raw) => !used.has(raw.name));
    // Dernier recours : autoriser un doublon réalisable plutôt qu'un exo infaisable.
    if (!candidates.length) candidates = allAvailable;
    const chosen = candidates.length ? pickRandom(candidates) : slot;
    used.add(chosen.name);
    return chosen;
  });

  const absCount = ABS[programId]?.exercises.length || 0;
  const absPool = buildAbsPool(location, equipment);
  const absRaws = [];
  for (let i = 0; i < absCount; i++) {
    const candidates = absPool.filter((raw) => !used.has(raw.name));
    const src = candidates.length ? candidates : ABS[programId].exercises;
    const chosen = pickRandom(src);
    used.add(chosen.name);
    absRaws.push(chosen);
  }

  const warmup = (WARMUPS[programId] || []).map(toWarmupExercise);
  const main = mainRaws.map((raw) => toWorkoutExercise(raw, TYPES[raw.type]?.label || ''));
  const abs = absRaws.map((raw) => toWorkoutExercise(raw, 'Abdos'));

  return [...warmup, ...main, ...abs];
}

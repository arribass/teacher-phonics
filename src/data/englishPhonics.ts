export interface PhonicDetail {
  letter: string;
  word: string;
  image: string;
  colorClass: string;
  ipa: string;
  soundHint: string;
}

export const ENGLISH_VOWELS = ['A', 'E', 'I', 'O', 'U'];
export const ENGLISH_CONSONANTS = [
  'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 
  'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

export const ENGLISH_PHONIC_MAP: Record<string, PhonicDetail> = {
  A: { letter: 'A', word: 'apple', image: '🍎', colorClass: 'gradient-sky', ipa: '/æ/', soundHint: 'ah' },
  B: { letter: 'B', word: 'bat', image: '🦇', colorClass: 'gradient-amber', ipa: '/b/', soundHint: 'buh' },
  C: { letter: 'C', word: 'cat', image: '🐱', colorClass: 'gradient-orange', ipa: '/k/', soundHint: 'kuh' },
  D: { letter: 'D', word: 'dog', image: '🐶', colorClass: 'gradient-peach', ipa: '/d/', soundHint: 'duh' },
  E: { letter: 'E', word: 'egg', image: '🥚', colorClass: 'gradient-yellow', ipa: '/e/', soundHint: 'eh' },
  F: { letter: 'F', word: 'fish', image: '🐟', colorClass: 'gradient-teal', ipa: '/f/', soundHint: 'fff' },
  G: { letter: 'G', word: 'goat', image: '🐐', colorClass: 'gradient-slate', ipa: '/ɡ/', soundHint: 'guh' },
  H: { letter: 'H', word: 'hat', image: '🎩', colorClass: 'gradient-purple', ipa: '/h/', soundHint: 'huh' },
  I: { letter: 'I', word: 'ink', image: '🖊️', colorClass: 'gradient-blue', ipa: '/ɪ/', soundHint: 'ih' },
  J: { letter: 'J', word: 'jam', image: '🍓', colorClass: 'gradient-rose', ipa: '/dʒ/', soundHint: 'juh' },
  K: { letter: 'K', word: 'kite', image: '🪁', colorClass: 'gradient-sky', ipa: '/k/', soundHint: 'kuh' },
  L: { letter: 'L', word: 'lion', image: '🦁', colorClass: 'gradient-orange', ipa: '/l/', soundHint: 'lll' },
  M: { letter: 'M', word: 'map', image: '🗺️', colorClass: 'gradient-peach', ipa: '/m/', soundHint: 'mmm' },
  N: { letter: 'N', word: 'nest', image: '🪹', colorClass: 'gradient-amber', ipa: '/n/', soundHint: 'nnn' },
  O: { letter: 'O', word: 'octopus', image: '🐙', colorClass: 'gradient-purple', ipa: '/ɒ/', soundHint: 'oh' },
  P: { letter: 'P', word: 'pig', image: '🐷', colorClass: 'gradient-rose', ipa: '/p/', soundHint: 'puh' },
  Q: { letter: 'Q', word: 'queen', image: '👑', colorClass: 'gradient-yellow', ipa: '/kw/', soundHint: 'kwuh' },
  R: { letter: 'R', word: 'rabbit', image: '🐇', colorClass: 'gradient-slate', ipa: '/r/', soundHint: 'rrr' },
  S: { letter: 'S', word: 'sun', image: '☀️', colorClass: 'gradient-amber', ipa: '/s/', soundHint: 'sss' },
  T: { letter: 'T', word: 'tree', image: '🌳', colorClass: 'gradient-teal', ipa: '/t/', soundHint: 'tuh' },
  U: { letter: 'U', word: 'umbrella', image: '☂️', colorClass: 'gradient-blue', ipa: '/ʌ/', soundHint: 'uh' },
  V: { letter: 'V', word: 'van', image: '🚐', colorClass: 'gradient-sky', ipa: '/v/', soundHint: 'vvv' },
  W: { letter: 'W', word: 'web', image: '🕸️', colorClass: 'gradient-slate', ipa: '/w/', soundHint: 'wuh' },
  X: { letter: 'X', word: 'fox', image: '🦊', colorClass: 'gradient-orange', ipa: '/ks/', soundHint: 'ks' },
  Y: { letter: 'Y', word: 'yak', image: '🐃', colorClass: 'gradient-peach', ipa: '/j/', soundHint: 'yuh' },
  Z: { letter: 'Z', word: 'zebra', image: '🦓', colorClass: 'gradient-slate', ipa: '/z/', soundHint: 'zzz' }
};

export const ENGLISH_WORD_DICTIONARY: Record<string, { image: string; translation: string }> = {
  MAP: { image: '🗺️', translation: 'Mapa' },
  ANT: { image: '🐜', translation: 'Hormiga' },
  CAT: { image: '🐱', translation: 'Gato' },
  DOG: { image: '🐶', translation: 'Perro' },
  SUN: { image: '☀️', translation: 'Sol' },
  BUS: { image: '🚌', translation: 'Autobús' },
  FOX: { image: '🦊', translation: 'Zorro' },
  PIG: { image: '🐷', translation: 'Cerdo' },
  PEN: { image: '🖊️', translation: 'Bolígrafo' },
  BED: { image: '🛌', translation: 'Cama' },
  BUG: { image: '🐛', translation: 'Bicho' },
  JAM: { image: '🍓', translation: 'Mermelada' },
  CUP: { image: '☕', translation: 'Taza' },
  BOX: { image: '📦', translation: 'Caja' },
  VAN: { image: '🚐', translation: 'Furgoneta' },
  HAT: { image: '🎩', translation: 'Sombrero' },
  NET: { image: '🕸️', translation: 'Red' },
  KEY: { image: '🔑', translation: 'Llave' },
  BAT: { image: '🦇', translation: 'Murciélago / Bate' },
  RAT: { image: '🐀', translation: 'Rata' },
  HEN: { image: '🐔', translation: 'Gallina' },
  LOG: { image: '🪵', translation: 'Tronco' },
  NUT: { image: '🥜', translation: 'Nuez' },
  WEB: { image: '🕸️', translation: 'Telaraña' },
  COW: { image: '🐮', translation: 'Vaca' },
  OWL: { image: '🦉', translation: 'Búho' },
  MAN: { image: '👨', translation: 'Hombre' },
  BOY: { image: '👦', translation: 'Niño' },
  GIRL: { image: '👧', translation: 'Niña' },
  TOY: { image: '🧸', translation: 'Juguete' },
  TOP: { image: '🪀', translation: 'Peonza' },
  BAG: { image: '🎒', translation: 'Mochila' },
  PIN: { image: '📍', translation: 'Chincheta' },
  MUG: { image: '🍺', translation: 'Jarra' },
  LIP: { image: '👄', translation: 'Labio' },
  RUN: { image: '🏃', translation: 'Correr' },
  HOP: { image: '🦘', translation: 'Saltar' },
  APPLE: { image: '🍎', translation: 'Manzana' },
  FROG: { image: '🐸', translation: 'Rana' },
  FISH: { image: '🐟', translation: 'Pez' },
  STAR: { image: '⭐', translation: 'Estrella' },
  MOON: { image: '🌙', translation: 'Luna' },
  BOOK: { image: '📖', translation: 'Libro' },
  BALL: { image: '⚽', translation: 'Pelota' },
  MILK: { image: '🥛', translation: 'Leche' },
  DUCK: { image: '🦆', translation: 'Pato' },
  BIRD: { image: '🐦', translation: 'Pájaro' },
  LION: { image: '🦁', translation: 'León' },
  TREE: { image: '🌳', translation: 'Árbol' }
};

export const SUGGESTED_ENGLISH_WORDS = [
  'MAP', 'ANT', 'CAT', 'DOG', 'SUN', 'BUS', 'FOX', 'PIG', 
  'PEN', 'BED', 'BUG', 'JAM', 'CUP', 'BOX', 'VAN', 'HAT'
];

export function findWordIllustration(word: string): string {
  const upper = word.trim().toUpperCase();
  if (ENGLISH_WORD_DICTIONARY[upper]) {
    return ENGLISH_WORD_DICTIONARY[upper].image;
  }
  // Fallback: check first letter's emoji
  if (upper.length > 0 && ENGLISH_PHONIC_MAP[upper[0]]) {
    return ENGLISH_PHONIC_MAP[upper[0]].image;
  }
  return '📝';
}

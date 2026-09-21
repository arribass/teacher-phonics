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

// Digraphs & 2-Letter Multi-Letter Phonemes (PH, OU, CH, SH, TH, WH, CK, EE, OO, AI, OA, AR, OR, QU)
export const ENGLISH_DIGRAPHS_MAP: Record<string, PhonicDetail> = {
  PH: { letter: 'PH', word: 'phone', image: '📞', colorClass: 'gradient-teal', ipa: '/f/', soundHint: 'fff (f-sound)' },
  OU: { letter: 'OU', word: 'touch', image: '👆', colorClass: 'gradient-purple', ipa: '/aʊ/ /ʌ/', soundHint: 'ow / uh' },
  CH: { letter: 'CH', word: 'chair', image: '🪑', colorClass: 'gradient-orange', ipa: '/tʃ/', soundHint: 'ch' },
  SH: { letter: 'SH', word: 'ship', image: '🚢', colorClass: 'gradient-sky', ipa: '/ʃ/', soundHint: 'shh' },
  TH: { letter: 'TH', word: 'tree', image: '🌳', colorClass: 'gradient-amber', ipa: '/θ/', soundHint: 'th' },
  WH: { letter: 'WH', word: 'whale', image: '🐳', colorClass: 'gradient-blue', ipa: '/w/', soundHint: 'wuh' },
  CK: { letter: 'CK', word: 'duck', image: '🦆', colorClass: 'gradient-peach', ipa: '/k/', soundHint: 'kuh' },
  EE: { letter: 'EE', word: 'tree', image: '🌳', colorClass: 'gradient-yellow', ipa: '/iː/', soundHint: 'eee' },
  OO: { letter: 'OO', word: 'moon', image: '🌙', colorClass: 'gradient-purple', ipa: '/uː/', soundHint: 'ooo' },
  AI: { letter: 'AI', word: 'rain', image: '🌧️', colorClass: 'gradient-sky', ipa: '/eɪ/', soundHint: 'ay' },
  OA: { letter: 'OA', word: 'boat', image: '⛵', colorClass: 'gradient-amber', ipa: '/oʊ/', soundHint: 'oh' },
  AR: { letter: 'AR', word: 'star', image: '⭐', colorClass: 'gradient-yellow', ipa: '/ɑːr/', soundHint: 'ahr' },
  OR: { letter: 'OR', word: 'fork', image: '🍴', colorClass: 'gradient-orange', ipa: '/ɔːr/', soundHint: 'or' },
  QU: { letter: 'QU', word: 'queen', image: '👑', colorClass: 'gradient-rose', ipa: '/kw/', soundHint: 'kw' }
};

export const ALL_PHONICS_MAP: Record<string, PhonicDetail> = {
  ...ENGLISH_PHONIC_MAP,
  ...ENGLISH_DIGRAPHS_MAP
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
  BAT: { image: '🦇', translation: 'Murciélago' },
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
  TREE: { image: '🌳', translation: 'Árbol' },

  // Words with Digraphs / 2-letter phonemes (PH, OU, CH, SH, TH, WH, CK)
  PHONE: { image: '📞', translation: 'Teléfono' },
  TOUCH: { image: '👆', translation: 'Tocar' },
  PHOTO: { image: '📷', translation: 'Fotografía' },
  GRAPH: { image: '📊', translation: 'Gráfico' },
  DOLPHIN: { image: '🐬', translation: 'Delfín' },
  CHIP: { image: '🍟', translation: 'Patata frita' },
  CHAIR: { image: '🪑', translation: 'Silla' },
  SHIP: { image: '🚢', translation: 'Barco' },
  SHARK: { image: '🦈', translation: 'Tiburón' },
  HOUSE: { image: '🏠', translation: 'Casa' },
  MOUSE: { image: '🐭', translation: 'Ratón' },
  CLOUD: { image: '☁️', translation: 'Nube' },
  SOUP: { image: '🥣', translation: 'Sopa' }
};

export const SUGGESTED_ENGLISH_WORDS = [
  'PHONE', 'TOUCH', 'MAP', 'CAT', 'DOG', 'SUN', 'SHIP', 
  'CHIP', 'DUCK', 'MOON', 'FISH', 'BUS', 'FOX', 'PIG', 'BED'
];

export function findWordIllustration(word: string): string {
  const upper = word.trim().toUpperCase();
  if (ENGLISH_WORD_DICTIONARY[upper]) {
    return ENGLISH_WORD_DICTIONARY[upper].image;
  }
  // Check for digraph start
  if (upper.length >= 2) {
    const start2 = upper.substring(0, 2);
    if (ENGLISH_DIGRAPHS_MAP[start2]) {
      return ENGLISH_DIGRAPHS_MAP[start2].image;
    }
  }
  // Fallback: check first letter's emoji
  if (upper.length > 0 && ENGLISH_PHONIC_MAP[upper[0]]) {
    return ENGLISH_PHONIC_MAP[upper[0]].image;
  }
  return '📝';
}

/**
 * Phonics Tokenizer Engine:
 * Converts an English word into an array of phoneme tokens, automatically detecting 2-letter digraphs (PH, OU, CH, SH, TH, WH, CK, EE, OO, AI, OA, AR, OR, QU).
 * Example: 'PHONE' -> ['PH', 'O', 'N', 'E']
 * Example: 'TOUCH' -> ['T', 'OU', 'CH']
 * Example: 'GRAPH' -> ['G', 'R', 'A', 'PH']
 */
export function tokenizePhonics(word: string): string[] {
  const upper = word.trim().toUpperCase();
  const result: string[] = [];
  let i = 0;

  while (i < upper.length) {
    if (i + 1 < upper.length) {
      const pair = upper.substring(i, i + 2);
      if (ENGLISH_DIGRAPHS_MAP[pair]) {
        result.push(pair);
        i += 2;
        continue;
      }
    }
    result.push(upper[i]);
    i += 1;
  }

  return result;
}

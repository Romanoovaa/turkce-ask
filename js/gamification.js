const LEVELS = [
  { id: 1, name: 'Turist', nameRu: 'Турист', emoji: '🧳', xp: 0, color: '#9E9E9E' },
  { id: 2, name: 'Misafir', nameRu: 'Гость', emoji: '🫖', xp: 100, color: '#8D6E63' },
  { id: 3, name: 'Arkadaş', nameRu: 'Друг', emoji: '🤝', xp: 300, color: '#42A5F5' },
  { id: 4, name: 'Sevgili', nameRu: 'Возлюбленная', emoji: '💕', xp: 600, color: '#EC407A' },
  { id: 5, name: 'Nişanlı', nameRu: 'Помолвленная', emoji: '💍', xp: 1000, color: '#AB47BC' },
  { id: 6, name: 'Gelin', nameRu: 'Невестка', emoji: '👰', xp: 1500, color: '#FF7043' },
  { id: 7, name: 'Aile', nameRu: 'Семья', emoji: '👨‍👩‍👧', xp: 2500, color: '#66BB6A' },
  { id: 8, name: 'Türk Kızı', nameRu: 'Турецкая девушка', emoji: '🇹🇷', xp: 4000, color: '#EF5350' },
  { id: 9, name: 'Ana', nameRu: 'Мать', emoji: '🌺', xp: 6000, color: '#FFA726' },
  { id: 10, name: 'Sultan', nameRu: 'Султанша', emoji: '👑', xp: 9000, color: '#FFD700' },
];

const ACHIEVEMENTS = [
  { id: 'first_word', emoji: '🌹', name: 'Первое слово', desc: 'Выучи первое слово', check: s => s.learned.length >= 1 },
  { id: 'ten_words', emoji: '📖', name: 'Десяточка', desc: 'Выучи 10 слов', check: s => s.learned.length >= 10 },
  { id: 'fifty_words', emoji: '📚', name: 'Полсотни', desc: 'Выучи 50 слов', check: s => s.learned.length >= 50 },
  { id: 'hundred_words', emoji: '💯', name: 'Сотня', desc: 'Выучи 100 слов', check: s => s.learned.length >= 100 },
  { id: 'polyglot', emoji: '🧠', name: 'Полиглот', desc: 'Выучи 500 слов', check: s => s.learned.length >= 500 },
  { id: 'streak_3', emoji: '🔥', name: 'Три дня', desc: 'Серия 3 дня подряд', check: s => s.streak >= 3 },
  { id: 'streak_7', emoji: '🔥', name: 'Неделя огня', desc: 'Серия 7 дней подряд', check: s => s.streak >= 7 },
  { id: 'streak_30', emoji: '🏆', name: 'Месяц силы', desc: 'Серия 30 дней подряд', check: s => s.streak >= 30 },
  { id: 'xp_500', emoji: '⭐', name: 'Звёздочка', desc: 'Набери 500 XP', check: s => s.xp >= 500 },
  { id: 'xp_2000', emoji: '🌟', name: 'Суперзвезда', desc: 'Набери 2000 XP', check: s => s.xp >= 2000 },
  { id: 'translator', emoji: '💌', name: 'Переводчица', desc: 'Переведи 10 сообщений', check: s => (s.translationCount || 0) >= 10 },
  { id: 'fav_10', emoji: '⭐', name: 'Коллекционер', desc: 'Сохрани 10 слов в избранное', check: s => s.favorites.length >= 10 },
  { id: 'night_owl', emoji: '🌙', name: 'Полуночница', desc: 'Занимайся после 23:00', check: s => s.nightOwl === true },
  { id: 'early_bird', emoji: '☀️', name: 'Ранняя пташка', desc: 'Занимайся до 7:00', check: s => s.earlyBird === true },
  { id: 'perfect_quiz', emoji: '🎯', name: 'Снайпер', desc: 'Пройди квиз без ошибок', check: s => s.perfectQuiz === true },
];

function getLevel(xp) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xp) current = lvl;
    else break;
  }
  return current;
}

function getNextLevel(xp) {
  for (const lvl of LEVELS) {
    if (xp < lvl.xp) return lvl;
  }
  return null;
}

function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.xp - current.xp;
  const progress = xp - current.xp;
  return Math.round((progress / range) * 100);
}

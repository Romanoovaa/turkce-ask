const APP = {
  state: {
    screen: 'onboarding1',
    goal: null,
    level: null,
    currentSection: null,
    currentCardIndex: 0,
    flipped: false,
    learned: JSON.parse(localStorage.getItem('ta_learned') || '[]'),
    favorites: JSON.parse(localStorage.getItem('ta_favorites') || '[]'),
    streak: parseInt(localStorage.getItem('ta_streak') || '0'),
    xp: parseInt(localStorage.getItem('ta_xp') || '0'),
    lastDate: localStorage.getItem('ta_lastDate') || '',
    onboarded: localStorage.getItem('ta_onboarded') === 'true',
    userName: localStorage.getItem('ta_userName') || '',
    dailyDate: localStorage.getItem('ta_dailyDate') || '',
    dailyWords: parseInt(localStorage.getItem('ta_dailyWords') || '0'),
    dailyQuizzes: parseInt(localStorage.getItem('ta_dailyQuizzes') || '0'),
    dailyTranslations: parseInt(localStorage.getItem('ta_dailyTranslations') || '0'),
    dailyBonusClaimed: localStorage.getItem('ta_dailyBonusClaimed') === 'true',
    translationCount: parseInt(localStorage.getItem('ta_translationCount') || '0'),
    quizWords: [],
    quizIndex: 0,
    quizLives: 3,
    quizCorrect: 0,
    quizAnswered: false,
  },

  init() {
    this.checkStreak();
    this.resetDailyIfNeeded();
    this.initSounds();
    if (this.state.onboarded) {
      this.showScreen('home');
      if (this.state.streak >= 2) {
        setTimeout(() => this.showStreakPopup(), 600);
      }
    } else {
      this.showScreen('onboarding1');
    }
  },

  initSounds() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.audioCtx = new AudioCtx();
  },

  playSound(type) {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'levelup') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
      osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.7);
    } else if (type === 'bonus') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  },

  showStreakPopup() {
    const s = this.state.streak;
    let message, emoji;
    if (s >= 30) { emoji = '🏆'; message = `${s} дней подряд! Ты легенда!`; }
    else if (s >= 14) { emoji = '💪'; message = `${s} дней! Невероятный результат!`; }
    else if (s >= 7) { emoji = '🔥'; message = `${s} дней подряд! Целая неделя!`; }
    else { emoji = '🔥'; message = `${s} дней подряд! Продолжай!`; }

    const popup = document.createElement('div');
    popup.className = 'streak-popup';
    popup.innerHTML = `
      <div class="streak-fire">${emoji}</div>
      <div class="streak-count">${s}</div>
      <div class="streak-text">${message}</div>
      <button class="streak-btn" onclick="this.parentElement.remove()">Продолжить 💪</button>
    `;
    document.body.appendChild(popup);
    this.haptic('MEDIUM');
    setTimeout(() => { if (popup.parentElement) popup.remove(); }, 5000);
  },

  save() {
    localStorage.setItem('ta_learned', JSON.stringify(this.state.learned));
    localStorage.setItem('ta_favorites', JSON.stringify(this.state.favorites));
    localStorage.setItem('ta_streak', this.state.streak);
    localStorage.setItem('ta_xp', this.state.xp);
    localStorage.setItem('ta_lastDate', this.state.lastDate);
    localStorage.setItem('ta_onboarded', this.state.onboarded);
    localStorage.setItem('ta_dailyDate', this.state.dailyDate);
    localStorage.setItem('ta_dailyWords', this.state.dailyWords);
    localStorage.setItem('ta_dailyQuizzes', this.state.dailyQuizzes);
    localStorage.setItem('ta_dailyTranslations', this.state.dailyTranslations);
    localStorage.setItem('ta_dailyBonusClaimed', this.state.dailyBonusClaimed);
    localStorage.setItem('ta_translationCount', this.state.translationCount);
  },

  resetDailyIfNeeded() {
    const today = new Date().toDateString();
    if (this.state.dailyDate !== today) {
      this.state.dailyDate = today;
      this.state.dailyWords = 0;
      this.state.dailyQuizzes = 0;
      this.state.dailyTranslations = 0;
      this.state.dailyBonusClaimed = false;
      this.save();
    }
  },

  trackDaily(type) {
    this.resetDailyIfNeeded();
    if (type === 'word') this.state.dailyWords++;
    if (type === 'quiz') this.state.dailyQuizzes++;
    if (type === 'translation') this.state.dailyTranslations++;
    this.save();
    if (!this.state.dailyBonusClaimed && this.isDailyComplete()) {
      this.state.dailyBonusClaimed = true;
      this.addXP(50);
      this.save();
      setTimeout(() => {
        this.playSound('bonus');
        this.showAchievementPopup({ emoji: '🎁', name: 'Бонус дня', desc: '+50 XP за все задания!' });
      }, 600);
    }
  },

  isDailyComplete() {
    return this.state.dailyWords >= 5 && this.state.dailyQuizzes >= 1 && this.state.dailyTranslations >= 1;
  },

  checkStreak() {
    const today = new Date().toDateString();
    const last = this.state.lastDate;
    if (!last) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last !== today && last !== yesterday) {
      this.state.streak = 0;
    }
  },

  recordActivity() {
    const today = new Date().toDateString();
    if (this.state.lastDate !== today) {
      if (this.state.lastDate === new Date(Date.now() - 86400000).toDateString()) {
        this.state.streak++;
      } else {
        this.state.streak = 1;
      }
      this.state.lastDate = today;
    }
    this.save();
  },

  addXP(amount) {
    const oldLevel = getLevel(this.state.xp);
    this.state.xp += amount;
    this.recordActivity();
    this.showXPPopup(amount);
    const newLevel = getLevel(this.state.xp);
    if (newLevel.id > oldLevel.id) {
      setTimeout(() => this.showLevelUpPopup(newLevel), 500);
    }
    this.checkAchievements();
  },

  showLevelUpPopup(lvl) {
    this.playSound('levelup');
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
      <div class="ach-popup-emoji">${lvl.emoji}</div>
      <div class="ach-popup-title">Новый уровень!</div>
      <div class="ach-popup-name">${lvl.name}</div>
      <div class="ach-popup-desc">${lvl.nameRu}</div>
    `;
    document.body.appendChild(popup);
    this.haptic('HEAVY');
    this.spawnConfetti(40);
    setTimeout(() => popup.remove(), 3500);
  },

  showXPPopup(amount) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = `+${amount} XP`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  },

  spawnConfetti(count = 30) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const colors = ['#E91E63', '#FF7043', '#9C27B0', '#4CAF50', '#F9A825', '#2196F3', '#FF5722'];
    const shapes = ['❤️', '💕', '⭐', '✨', '🎉'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      const useEmoji = Math.random() > 0.5;
      if (useEmoji) {
        piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        piece.style.fontSize = (12 + Math.random() * 14) + 'px';
        piece.style.background = 'none';
      } else {
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (6 + Math.random() * 8) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      }
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4000);
  },

  spawnHearts(count = 12) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'confetti-piece';
      heart.textContent = '❤️';
      heart.style.fontSize = (16 + Math.random() * 20) + 'px';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (2 + Math.random() * 2) + 's';
      heart.style.animationDelay = Math.random() * 0.8 + 's';
      container.appendChild(heart);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 5000);
  },

  showScreen(name) {
    this.state.screen = name;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const nav = document.querySelector('.bottom-nav');
    const showNav = ['home', 'favorites', 'translate', 'phrases', 'profile'].includes(name);
    nav.classList.toggle('hidden', !showNav);
    if (showNav) {
      document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.toggle('active', n.dataset.screen === name);
      });
    }

    const el = document.getElementById('screen-' + name);
    if (el) {
      el.classList.add('active');
      if (name === 'home') this.renderHome();
      if (name === 'favorites') this.renderFavorites();
      if (name === 'phrases') this.renderPhrases();
      if (name === 'profile') this.renderProfile();
    }
  },

  // ===== ONBOARDING =====
  selectGoal(goal, btn) {
    this.state.goal = goal;
    document.querySelectorAll('#screen-onboarding2 .ob-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    setTimeout(() => this.showScreen('onboarding3'), 300);
  },

  selectLevel(level, btn) {
    this.state.level = level;
    document.querySelectorAll('#screen-onboarding3 .ob-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    setTimeout(() => this.showScreen('onboarding4'), 300);
  },

  saveName(skip) {
    if (skip === 'skip') {
      this.state.userName = '';
    } else {
      const input = document.getElementById('ob-name-input');
      this.state.userName = input.value.trim();
    }
    localStorage.setItem('ta_userName', this.state.userName);
    this.state.onboarded = true;
    this.save();
    this.showScreen('home');
  },

  haptic(style) {
    try {
      if (window.Capacitor && Capacitor.Plugins.Haptics) {
        Capacitor.Plugins.Haptics.impact({ style: style || 'LIGHT' });
      } else if (navigator.vibrate) {
        navigator.vibrate(style === 'HEAVY' ? 20 : 10);
      }
    } catch(e) {}
  },

  // ===== HOME =====
  getGreeting() {
    const h = new Date().getHours();
    if (h < 6) return 'Не спится? 🌙';
    if (h < 12) return 'Доброе утро! 🌸';
    if (h < 17) return 'Добрый день! ☀️';
    if (h < 22) return 'Добрый вечер! 🌆';
    return 'Доброй ночи! 🌙';
  },

  getWordOfDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return WORDS[dayOfYear % WORDS.length];
  },

  renderHome() {
    const totalLearned = this.state.learned.length;
    document.getElementById('home-streak').textContent = this.state.streak;
    document.getElementById('home-words').textContent = totalLearned;
    document.getElementById('home-xp').textContent = this.state.xp;
    const lvl = getLevel(this.state.xp);
    document.getElementById('home-level-badge').textContent = lvl.emoji + ' ' + lvl.name;

    this.resetDailyIfNeeded();
    const dw = Math.min(this.state.dailyWords, 5);
    const dq = Math.min(this.state.dailyQuizzes, 1);
    const dt = Math.min(this.state.dailyTranslations, 1);
    const allDone = dw >= 5 && dq >= 1 && dt >= 1;
    document.getElementById('home-daily').innerHTML = `
      <div class="daily-title">${allDone ? '✅ Задания выполнены!' : '📋 Задания дня'}</div>
      <div class="daily-items">
        <div class="daily-item ${dw >= 5 ? 'done' : ''}">
          <div class="daily-check">${dw >= 5 ? '✅' : '⬜'}</div>
          <div class="daily-text">Выучи 5 слов</div>
          <div class="daily-progress">${dw}/5</div>
        </div>
        <div class="daily-item ${dq >= 1 ? 'done' : ''}">
          <div class="daily-check">${dq >= 1 ? '✅' : '⬜'}</div>
          <div class="daily-text">Пройди квиз</div>
          <div class="daily-progress">${dq}/1</div>
        </div>
        <div class="daily-item ${dt >= 1 ? 'done' : ''}">
          <div class="daily-check">${dt >= 1 ? '✅' : '⬜'}</div>
          <div class="daily-text">Переведи сообщение</div>
          <div class="daily-progress">${dt}/1</div>
        </div>
      </div>
      ${allDone ? '<div class="daily-bonus">🎁 +50 XP бонус получен!</div>' : '<div class="daily-reward">Выполни всё — получи 🎁 +50 XP</div>'}
    `;

    const name = this.state.userName;
    document.getElementById('home-greeting').textContent = name
      ? `${this.getGreeting().replace('!', '')}, ${name}!`
      : this.getGreeting();

    const wod = this.getWordOfDay();
    document.getElementById('home-word-of-day').innerHTML = `
      <div class="wod-left">
        <div class="wod-label">✨ Слово дня</div>
        <div class="wod-word">${wod.tr}</div>
        <div class="wod-translation">${wod.ru}</div>
      </div>
      <div class="wod-sound">🔊</div>
    `;
    document.getElementById('home-word-of-day').onclick = () => this.speak(wod.tr);

    const cont = document.getElementById('home-continue');
    if (this.state.currentSection && this.state.currentCardIndex > 0) {
      const sec = SECTIONS.find(s => s.id === this.state.currentSection);
      if (sec) {
        const words = WORDS.filter(w => w.s === this.state.currentSection);
        cont.style.display = 'flex';
        cont.innerHTML = `
          <div class="continue-icon">${sec.emoji}</div>
          <div class="continue-info">
            <div class="continue-title">Продолжить: ${sec.name}</div>
            <div class="continue-sub">${this.state.currentCardIndex} из ${words.length} слов</div>
          </div>
          <div class="continue-arrow">→</div>
        `;
        cont.onclick = () => {
          this.haptic('MEDIUM');
          this.showScreen('cards');
          this.renderCard();
        };
      }
    } else {
      cont.style.display = 'none';
    }

    const grid = document.getElementById('sections-grid');
    grid.innerHTML = SECTIONS.map(sec => {
      const sectionWords = WORDS.filter(w => w.s === sec.id);
      const learnedCount = sectionWords.filter(w => this.state.learned.includes(w.n)).length;
      const pct = sectionWords.length > 0 ? Math.round(learnedCount / sectionWords.length * 100) : 0;
      return `
        <div class="section-card" onclick="APP.openSection('${sec.id}')">
          <div class="section-emoji">${sec.emoji}</div>
          <div class="section-name">${sec.name}</div>
          <div class="section-count">${learnedCount} / ${sectionWords.length}</div>
          <div class="section-progress">
            <div class="section-progress-bar" style="width:${pct}%;background:${sec.color}"></div>
          </div>
        </div>
      `;
    }).join('');
  },

  // ===== CARDS =====
  openSection(sectionId) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    this.state.currentSection = sectionId;
    this.state.currentCardIndex = 0;
    this.state.flipped = false;

    document.getElementById('cards-title').textContent = sec.emoji + ' ' + sec.name;
    document.querySelector('.cards-progress-fill').style.background = sec.color;
    this.showScreen('cards');
    this.renderCard();
  },

  getSectionWords() {
    return WORDS.filter(w => w.s === this.state.currentSection);
  },

  renderCard() {
    const words = this.getSectionWords();
    const idx = this.state.currentCardIndex;
    if (idx >= words.length) {
      this.showSectionComplete();
      return;
    }
    const word = words[idx];
    const pct = Math.round((idx / words.length) * 100);
    document.querySelector('.cards-progress-fill').style.width = pct + '%';

    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('flipped');
    this.state.flipped = false;

    document.getElementById('card-turkish').textContent = word.tr;
    document.getElementById('card-russian').textContent = word.ru;
    const ctx = document.getElementById('card-context');
    ctx.textContent = word.note || '';
    ctx.style.display = word.note ? 'block' : 'none';

    const favBtn = document.getElementById('card-fav');
    favBtn.classList.toggle('active', this.state.favorites.includes(word.n));
    favBtn.textContent = this.state.favorites.includes(word.n) ? '⭐' : '☆';
  },

  flipCard() {
    const flashcard = document.getElementById('flashcard');
    this.state.flipped = !this.state.flipped;
    flashcard.classList.toggle('flipped', this.state.flipped);
  },

  cardKnow() {
    const words = this.getSectionWords();
    const word = words[this.state.currentCardIndex];
    if (!this.state.learned.includes(word.n)) {
      this.state.learned.push(word.n);
      this.trackDaily('word');
    }
    this.addXP(5);
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('card-exit-right');
    setTimeout(() => {
      this.state.currentCardIndex++;
      flashcard.classList.remove('card-exit-right');
      flashcard.classList.add('card-enter');
      this.renderCard();
      setTimeout(() => flashcard.classList.remove('card-enter'), 300);
    }, 250);
  },

  cardAgain() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.add('card-exit-left');
    setTimeout(() => {
      this.state.currentCardIndex++;
      flashcard.classList.remove('card-exit-left');
      flashcard.classList.add('card-enter');
      this.renderCard();
      setTimeout(() => flashcard.classList.remove('card-enter'), 300);
    }, 250);
  },

  toggleFavorite() {
    const words = this.getSectionWords();
    const word = words[this.state.currentCardIndex];
    const idx = this.state.favorites.indexOf(word.n);
    if (idx > -1) {
      this.state.favorites.splice(idx, 1);
    } else {
      this.state.favorites.push(word.n);
    }
    this.save();
    const favBtn = document.getElementById('card-fav');
    favBtn.classList.toggle('active', this.state.favorites.includes(word.n));
    favBtn.textContent = this.state.favorites.includes(word.n) ? '⭐' : '☆';
  },

  showSectionComplete() {
    document.querySelector('.cards-progress-fill').style.width = '100%';
    this.spawnConfetti(50);
    document.querySelector('.card-container').innerHTML = `
      <div class="quiz-result">
        <div class="result-emoji">🎉</div>
        <h2>Раздел пройден!</h2>
        <p style="color:#888;margin-bottom:1rem">Отличная работа! Теперь проверь себя</p>
        <button class="btn-primary" onclick="APP.startQuiz()">Пройти тест</button>
        <br>
        <button class="btn-secondary" onclick="APP.showScreen('home')">На главную</button>
      </div>
    `;
    document.querySelector('.card-actions').style.display = 'none';
  },

  // ===== SPEAK =====
  speak(text) {
    if (!text) {
      const words = this.getSectionWords();
      text = words[this.state.currentCardIndex]?.tr;
    }
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  },

  // ===== QUIZ =====
  startQuiz() {
    const sectionWords = this.getSectionWords();
    const shuffled = [...sectionWords].sort(() => Math.random() - 0.5);
    this.state.quizWords = shuffled.slice(0, Math.min(10, shuffled.length));
    this.state.quizIndex = 0;
    this.state.quizLives = 3;
    this.state.quizCorrect = 0;
    this.state.quizAnswered = false;
    this.showScreen('quiz');
    this.renderQuiz();
  },

  renderQuiz() {
    const { quizWords, quizIndex, quizLives } = this.state;
    if (quizIndex >= quizWords.length || quizLives <= 0) {
      this.showQuizResult();
      return;
    }

    const word = quizWords[quizIndex];
    const hearts = document.getElementById('quiz-hearts');
    hearts.innerHTML = '❤️'.repeat(quizLives) + '🖤'.repeat(3 - quizLives);

    const pct = Math.round((quizIndex / quizWords.length) * 100);
    document.getElementById('quiz-progress-fill').style.width = pct + '%';
    document.getElementById('quiz-counter').textContent = `${quizIndex + 1} / ${quizWords.length}`;

    const quizType = Math.random();
    const sectionWords = WORDS.filter(w => w.s === this.state.currentSection);
    const container = document.getElementById('quiz-options');
    const questionEl = document.querySelector('.quiz-question');
    this.state.quizAnswered = false;

    if (quizType < 0.4) {
      // Type 1: турецкое → выбери русский
      questionEl.innerHTML = `<div class="quiz-sub">Как переводится?</div><div class="quiz-word" id="quiz-word">${word.tr}</div>`;
      const wrongOptions = sectionWords.filter(w => w.n !== word.n).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.ru);
      const options = [...wrongOptions, word.ru].sort(() => Math.random() - 0.5);
      container.innerHTML = options.map(opt => `
        <button class="quiz-option" onclick="APP.answerQuiz(this, '${this.escapeHtml(opt)}', '${this.escapeHtml(word.ru)}', '${this.escapeHtml(word.tr)}', '${this.escapeHtml(word.note)}')">${opt}</button>
      `).join('');
    } else if (quizType < 0.7) {
      // Type 2: русское → выбери турецкий
      questionEl.innerHTML = `<div class="quiz-sub">Выбери турецкий вариант</div><div class="quiz-word" id="quiz-word">${word.ru}</div>`;
      const wrongOptions = sectionWords.filter(w => w.n !== word.n).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.tr);
      const options = [...wrongOptions, word.tr].sort(() => Math.random() - 0.5);
      container.innerHTML = options.map(opt => `
        <button class="quiz-option" onclick="APP.answerQuiz(this, '${this.escapeHtml(opt)}', '${this.escapeHtml(word.tr)}', '${this.escapeHtml(word.tr)}', '${this.escapeHtml(word.note)}')">${opt}</button>
      `).join('');
    } else {
      // Type 3: аудио → выбери перевод
      questionEl.innerHTML = `<div class="quiz-sub">Послушай и выбери перевод</div><div class="quiz-word" id="quiz-word">🔊</div>`;
      this.speak(word.tr);
      document.getElementById('quiz-word').onclick = () => this.speak(word.tr);
      document.getElementById('quiz-word').style.cursor = 'pointer';
      const wrongOptions = sectionWords.filter(w => w.n !== word.n).sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.ru);
      const options = [...wrongOptions, word.ru].sort(() => Math.random() - 0.5);
      container.innerHTML = options.map(opt => `
        <button class="quiz-option" onclick="APP.answerQuiz(this, '${this.escapeHtml(opt)}', '${this.escapeHtml(word.ru)}', '${this.escapeHtml(word.tr)}', '${this.escapeHtml(word.note)}')">${opt}</button>
      `).join('');
    }
  },

  escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  },

  answerQuiz(btn, selected, correct, wordTr, note) {
    if (this.state.quizAnswered) return;
    this.state.quizAnswered = true;

    document.querySelectorAll('.quiz-option').forEach(b => b.classList.add('disabled'));

    if (selected === correct) {
      btn.classList.add('correct');
      this.state.quizCorrect++;
      this.addXP(10);
      this.haptic('MEDIUM');
      this.playSound('correct');
      if (Math.random() > 0.5) this.spawnHearts(6);
      setTimeout(() => { this.state.quizIndex++; this.renderQuiz(); }, 1000);
    } else {
      btn.classList.add('wrong');
      this.state.quizLives--;
      this.haptic('HEAVY');
      this.playSound('wrong');
      document.querySelectorAll('.quiz-option').forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });

      const hint = document.createElement('div');
      hint.className = 'quiz-hint';
      hint.innerHTML = `<strong>${wordTr}</strong> — ${correct}${note ? `<br><span class="quiz-hint-note">${note}</span>` : ''}`;
      document.getElementById('quiz-options').after(hint);

      setTimeout(() => {
        hint.remove();
        this.state.quizIndex++;
        this.renderQuiz();
      }, 2500);
    }

    const hearts = document.getElementById('quiz-hearts');
    hearts.innerHTML = '❤️'.repeat(this.state.quizLives) + '🖤'.repeat(3 - this.state.quizLives);
  },

  showQuizResult() {
    const { quizCorrect, quizWords, quizLives } = this.state;
    const total = quizWords.length;
    const pct = Math.round(quizCorrect / total * 100);
    let emoji, message;
    this.trackDaily('quiz');
    if (pct === 100) { emoji = '🎉'; message = 'Идеально!'; this.spawnConfetti(50); this.state.perfectQuiz = true; this.checkAchievements(); }
    else if (pct >= 80) { emoji = '🎉'; message = 'Отлично!'; this.spawnConfetti(40); }
    else if (pct >= 50) { emoji = '👍'; message = 'Хорошо!'; this.spawnConfetti(20); }
    else { emoji = '💪'; message = 'Попробуй ещё раз!'; }

    const screen = document.getElementById('screen-quiz');
    screen.innerHTML = `
      <div class="quiz-result" style="padding-top:4rem">
        <div class="result-emoji">${emoji}</div>
        <h2>${message}</h2>
        <div class="result-stats">
          <div class="result-stat"><div class="num">${quizCorrect}/${total}</div><div class="label">Правильных</div></div>
          <div class="result-stat"><div class="num">+${quizCorrect * 10}</div><div class="label">XP</div></div>
        </div>
        <button class="btn-primary" onclick="APP.retryQuiz()">Ещё раз</button>
        <br>
        <button class="btn-secondary" onclick="APP.showScreen('home')">На главную</button>
      </div>
    `;
  },

  retryQuiz() {
    this.rebuildQuizScreen();
    this.startQuiz();
  },

  rebuildQuizScreen() {
    const screen = document.getElementById('screen-quiz');
    screen.innerHTML = `
      <div class="quiz-header">
        <button class="back-btn" onclick="APP.showScreen('home')">←</button>
        <h2 id="quiz-counter">1 / 10</h2>
        <div class="hearts" id="quiz-hearts">❤️❤️❤️</div>
      </div>
      <div class="cards-progress-bar"><div class="cards-progress-fill" id="quiz-progress-fill" style="background:var(--pink);width:0%"></div></div>
      <div class="quiz-question">
        <div class="quiz-sub">Как переводится?</div>
        <div class="quiz-word" id="quiz-word"></div>
      </div>
      <div class="quiz-options" id="quiz-options"></div>
    `;
  },

  // ===== FAVORITES =====
  renderFavorites() {
    const container = document.getElementById('fav-list');
    if (this.state.favorites.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <p>Пока нет избранных слов.<br>Нажмите ☆ на карточке, чтобы сохранить слово.</p>
        </div>
      `;
      return;
    }
    const favWords = WORDS.filter(w => this.state.favorites.includes(w.n));
    container.innerHTML = favWords.map(w => `
      <div class="fav-item">
        <div>
          <div class="fav-tr">${w.tr}</div>
          <div class="fav-ru">${w.ru}</div>
        </div>
        <button class="fav-remove" onclick="APP.removeFav(${w.n})">✕</button>
      </div>
    `).join('');
  },

  // ===== PROFILE =====
  renderProfile() {
    const xp = this.state.xp;
    const lvl = getLevel(xp);
    const next = getNextLevel(xp);
    const pct = getLevelProgress(xp);

    document.getElementById('profile-emoji').textContent = lvl.emoji;
    document.getElementById('profile-name').textContent = this.state.userName || 'Ученица';
    document.getElementById('profile-level-name').innerHTML = `Уровень ${lvl.id}: <strong>${lvl.name}</strong> — ${lvl.nameRu}`;
    document.getElementById('profile-xp-fill').style.width = pct + '%';
    document.getElementById('profile-xp-fill').style.background = lvl.color;
    document.getElementById('profile-xp-label').textContent = next
      ? `${xp} / ${next.xp} XP до «${next.nameRu}»`
      : `${xp} XP — Максимальный уровень!`;

    document.getElementById('profile-stats').innerHTML = `
      <div class="pstat"><div class="pstat-num">${this.state.streak}</div><div class="pstat-label">🔥 Дней подряд</div></div>
      <div class="pstat"><div class="pstat-num">${this.state.learned.length}</div><div class="pstat-label">📚 Слов выучено</div></div>
      <div class="pstat"><div class="pstat-num">${xp}</div><div class="pstat-label">⭐ XP</div></div>
      <div class="pstat"><div class="pstat-num">${lvl.id}</div><div class="pstat-label">${lvl.emoji} Уровень</div></div>
    `;

    this.checkTimeAchievements();
    const unlocked = JSON.parse(localStorage.getItem('ta_achievements') || '[]');
    document.getElementById('achievements-grid').innerHTML = ACHIEVEMENTS.map(a => {
      const done = unlocked.includes(a.id);
      return `
        <div class="achievement ${done ? 'unlocked' : 'locked'}">
          <div class="ach-emoji">${done ? a.emoji : '🔒'}</div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
        </div>
      `;
    }).join('');
  },

  checkTimeAchievements() {
    const h = new Date().getHours();
    if (h >= 23 || h < 5) this.state.nightOwl = true;
    if (h >= 5 && h < 7) this.state.earlyBird = true;
  },

  checkAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('ta_achievements') || '[]');
    let newUnlock = false;
    for (const a of ACHIEVEMENTS) {
      if (!unlocked.includes(a.id) && a.check(this.state)) {
        unlocked.push(a.id);
        newUnlock = a;
      }
    }
    if (newUnlock) {
      localStorage.setItem('ta_achievements', JSON.stringify(unlocked));
      this.showAchievementPopup(newUnlock);
    }
  },

  showAchievementPopup(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
      <div class="ach-popup-emoji">${achievement.emoji}</div>
      <div class="ach-popup-title">Новое достижение!</div>
      <div class="ach-popup-name">${achievement.name}</div>
      <div class="ach-popup-desc">${achievement.desc}</div>
    `;
    document.body.appendChild(popup);
    this.haptic('HEAVY');
    this.spawnConfetti(30);
    setTimeout(() => popup.remove(), 3000);
  },

  removeFav(n) {
    this.state.favorites = this.state.favorites.filter(f => f !== n);
    this.save();
    this.renderFavorites();
  },

  // ===== TRANSLATE =====
  setExample(text) {
    document.getElementById('translate-input').value = text;
    this.translateMessage();
  },

  translateMessage() {
    const input = document.getElementById('translate-input').value.trim();
    const result = document.getElementById('translate-result');
    if (!input) {
      result.innerHTML = '';
      return;
    }

    const btn = document.getElementById('translate-btn');
    btn.textContent = 'Анализирую...';
    btn.disabled = true;

    setTimeout(() => {
      const analysis = this.analyzeText(input);
      result.innerHTML = analysis;
      btn.textContent = 'Перевести 💌';
      btn.disabled = false;
      this.state.translationCount++;
      this.trackDaily('translation');
    }, 300);
  },

  analyzeText(text) {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);
    const foundWords = WORDS.filter(w => {
      const wLower = w.tr.toLowerCase();
      return words.some(word => wLower.includes(word) || word.includes(wLower));
    }).slice(0, 10);

    const responses = this.getSmartResponse(lower, foundWords);

    let html = `<div class="tr-card">`;
    html += `<div class="tr-section"><div class="tr-label">📝 Перевод</div><div class="tr-text">${responses.translation}</div></div>`;
    html += `<div class="tr-section"><div class="tr-label">💡 Что он имел в виду</div><div class="tr-text">${responses.meaning}</div></div>`;
    html += `<div class="tr-section"><div class="tr-label">🎯 Как ответить</div><div class="tr-suggestions">`;
    responses.replies.forEach(r => {
      html += `<div class="tr-reply"><div class="tr-reply-tr">${r.tr}</div><div class="tr-reply-ru">${r.ru}</div></div>`;
    });
    html += `</div></div>`;

    if (foundWords.length > 0) {
      html += `<div class="tr-section"><div class="tr-label">📚 Слова из словаря</div><div class="tr-words">`;
      foundWords.slice(0, 8).forEach(w => {
        html += `<div class="tr-word-chip"><strong>${w.tr}</strong> — ${w.ru}</div>`;
      });
      html += `</div></div>`;
    }

    html += `</div>`;
    return html;
  },

  // ===== PHRASES =====
  renderPhrases() {
    const cats = document.getElementById('phrase-categories');
    cats.innerHTML = PHRASE_CATEGORIES.map(c => {
      const count = PHRASES.filter(p => p.cat === c.id).length;
      return `
        <div class="phrase-cat-card" onclick="APP.openPhraseCategory('${c.id}')" style="border-left:4px solid ${c.color}">
          <span class="phrase-cat-emoji">${c.emoji}</span>
          <div class="phrase-cat-info">
            <div class="phrase-cat-name">${c.name}</div>
            <div class="phrase-cat-count">${count} фраз</div>
          </div>
          <span class="phrase-cat-arrow">→</span>
        </div>
      `;
    }).join('');

    const list = document.getElementById('phrase-list');
    list.innerHTML = `
      <div class="fill-promo" onclick="APP.startFillExercise()">
        <div class="fill-promo-icon">✏️</div>
        <div class="fill-promo-text">
          <div class="fill-promo-title">Вставь пропущенное слово</div>
          <div class="fill-promo-sub">20 заданий — проверь свои знания</div>
        </div>
        <span class="phrase-cat-arrow">→</span>
      </div>
    `;
  },

  openPhraseCategory(catId) {
    const cat = PHRASE_CATEGORIES.find(c => c.id === catId);
    this.state.currentPhraseCat = catId;
    this.state.currentPhraseIndex = 0;
    document.getElementById('phrase-cards-title').textContent = cat.emoji + ' ' + cat.name;
    document.getElementById('phrase-progress-fill').style.background = cat.color;
    this.showScreen('phrase-cards');
    this.renderPhraseCard();
  },

  getCatPhrases() {
    return PHRASES.filter(p => p.cat === this.state.currentPhraseCat);
  },

  renderPhraseCard() {
    const phrases = this.getCatPhrases();
    const idx = this.state.currentPhraseIndex;
    if (idx >= phrases.length) {
      this.state.currentPhraseIndex = 0;
      this.renderPhraseCard();
      return;
    }
    const phrase = phrases[idx];
    const pct = Math.round((idx / phrases.length) * 100);
    document.getElementById('phrase-progress-fill').style.width = pct + '%';

    const flashcard = document.getElementById('phrase-flashcard');
    flashcard.classList.remove('flipped');

    document.getElementById('phrase-turkish').textContent = phrase.tr;
    document.getElementById('phrase-russian').textContent = phrase.ru;
    document.getElementById('phrase-context').textContent = phrase.context;
    document.getElementById('phrase-situation').textContent = '📍 ' + phrase.situation;
  },

  flipPhraseCard() {
    document.getElementById('phrase-flashcard').classList.toggle('flipped');
  },

  nextPhrase() {
    this.state.currentPhraseIndex++;
    const phrases = this.getCatPhrases();
    if (this.state.currentPhraseIndex >= phrases.length) {
      this.state.currentPhraseIndex = 0;
    }
    this.renderPhraseCard();
  },

  // ===== FILL IN THE BLANK =====
  startFillExercise() {
    const shuffled = [...FILL_EXERCISES].sort(() => Math.random() - 0.5);
    this.state.fillExercises = shuffled.slice(0, 10);
    this.state.fillIndex = 0;
    this.state.fillLives = 3;
    this.state.fillCorrect = 0;
    this.state.fillAnswered = false;
    this.showScreen('fill');
    this.renderFillExercise();
  },

  renderFillExercise() {
    const { fillExercises, fillIndex, fillLives } = this.state;
    if (fillIndex >= fillExercises.length || fillLives <= 0) {
      this.showFillResult();
      return;
    }

    const ex = fillExercises[fillIndex];
    document.getElementById('fill-hearts').innerHTML = '❤️'.repeat(fillLives) + '🖤'.repeat(3 - fillLives);
    document.getElementById('fill-counter').textContent = `${fillIndex + 1} / ${fillExercises.length}`;
    document.getElementById('fill-progress-fill').style.width = Math.round((fillIndex / fillExercises.length) * 100) + '%';

    const sentenceHtml = ex.sentence.replace('___', '<span class="fill-blank">______</span>');
    document.getElementById('fill-sentence').innerHTML = sentenceHtml;
    document.getElementById('fill-translation').textContent = ex.ru;

    const options = [...ex.options].sort(() => Math.random() - 0.5);
    this.state.fillAnswered = false;
    document.getElementById('fill-options').innerHTML = options.map(opt => `
      <button class="quiz-option" onclick="APP.answerFill(this, '${this.escapeHtml(opt)}', '${this.escapeHtml(ex.answer)}')">${opt}</button>
    `).join('');
  },

  answerFill(btn, selected, correct) {
    if (this.state.fillAnswered) return;
    this.state.fillAnswered = true;

    document.querySelectorAll('#fill-options .quiz-option').forEach(b => b.classList.add('disabled'));

    if (selected === correct) {
      btn.classList.add('correct');
      this.state.fillCorrect++;
      this.addXP(10);
      this.haptic('MEDIUM');
      this.playSound('correct');
      if (Math.random() > 0.5) this.spawnHearts(6);
      const blank = document.querySelector('.fill-blank');
      if (blank) { blank.textContent = correct; blank.classList.add('fill-filled'); }
    } else {
      btn.classList.add('wrong');
      this.state.fillLives--;
      this.haptic('HEAVY');
      this.playSound('wrong');
      document.querySelectorAll('#fill-options .quiz-option').forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });
    }

    document.getElementById('fill-hearts').innerHTML = '❤️'.repeat(this.state.fillLives) + '🖤'.repeat(3 - this.state.fillLives);

    setTimeout(() => {
      this.state.fillIndex++;
      this.renderFillExercise();
    }, 1200);
  },

  showFillResult() {
    const { fillCorrect, fillExercises } = this.state;
    const total = fillExercises.length;
    const pct = Math.round(fillCorrect / total * 100);
    let emoji, message;
    if (pct >= 80) { emoji = '🎉'; message = 'Отлично!'; this.spawnConfetti(40); }
    else if (pct >= 50) { emoji = '👍'; message = 'Хороший результат!'; this.spawnConfetti(20); }
    else { emoji = '💪'; message = 'Попробуй ещё раз!'; }

    const screen = document.getElementById('screen-fill');
    screen.innerHTML = `
      <div class="quiz-result" style="padding-top:4rem">
        <div class="result-emoji">${emoji}</div>
        <h2>${message}</h2>
        <div class="result-stats">
          <div class="result-stat"><div class="num">${fillCorrect}/${total}</div><div class="label">Правильных</div></div>
          <div class="result-stat"><div class="num">+${fillCorrect * 10}</div><div class="label">XP</div></div>
        </div>
        <button class="btn-primary" onclick="APP.retryFill()">Ещё раз</button>
        <br>
        <button class="btn-secondary" onclick="APP.showScreen('home')">На главную</button>
      </div>
    `;
  },

  retryFill() {
    const screen = document.getElementById('screen-fill');
    screen.innerHTML = `
      <div class="quiz-header">
        <button class="back-btn" onclick="APP.showScreen('home')">←</button>
        <h2 id="fill-counter">1 / 10</h2>
        <div class="hearts" id="fill-hearts">❤️❤️❤️</div>
      </div>
      <div class="cards-progress-bar">
        <div class="cards-progress-fill" id="fill-progress-fill" style="background:var(--orange);width:0%"></div>
      </div>
      <div class="fill-question">
        <div class="fill-label">Вставь пропущенное слово</div>
        <div class="fill-sentence" id="fill-sentence"></div>
        <div class="fill-translation" id="fill-translation"></div>
      </div>
      <div class="quiz-options" id="fill-options"></div>
    `;
    this.startFillExercise();
  },

  getSmartResponse(text, foundWords) {
    const patterns = [
      {
        keywords: ['özledim', 'özlüyorum', 'özlem'],
        translation: 'Он говорит, что скучает по тебе.',
        meaning: 'Это искреннее выражение чувств. Турки часто пишут это без повода — просто чтобы ты знала, что он думает о тебе. Хороший знак!',
        replies: [
          { tr: 'Ben de seni çok özledim!', ru: 'Я тоже очень скучала!' },
          { tr: 'Ne zaman görüşeceğiz?', ru: 'Когда увидимся?' },
          { tr: 'Kalbimdesin ❤️', ru: 'Ты в моём сердце ❤️' },
        ]
      },
      {
        keywords: ['kıskan', 'kimlerle', 'kim o', 'telefonunu göster'],
        translation: 'Он ревнует или выражает беспокойство.',
        meaning: 'Ревность в турецкой культуре часто воспринимается как знак любви, но важно отличать здоровую заботу от контроля. Если это разовое — скорее всего он просто волнуется. Если постоянно — стоит обсудить границы.',
        replies: [
          { tr: 'Sadece sen varsın, merak etme', ru: 'Есть только ты, не переживай' },
          { tr: 'Sana güveniyorum, sen de bana güven', ru: 'Я тебе доверяю, и ты мне доверяй' },
          { tr: 'Konuşalım mı?', ru: 'Давай поговорим?' },
        ]
      },
      {
        keywords: ['annem', 'aile', 'yemeğ', 'tanış'],
        translation: 'Он говорит о семье — скорее всего приглашает на семейное мероприятие или передаёт слова мамы.',
        meaning: 'Это очень серьёзный знак! В Турции знакомство с семьёй означает, что отношения для него важны. Если мама о тебе спрашивает — ты уже «одобрена». Обязательно скажи «Elinize sağlık» после еды!',
        replies: [
          { tr: 'Çok sevinirim! Ne zaman gelelim?', ru: 'Буду очень рада! Когда прийти?' },
          { tr: 'Annenize selamlar 🌸', ru: 'Передай привет маме 🌸' },
          { tr: 'Ne getireyim?', ru: 'Что мне принести?' },
        ]
      },
      {
        keywords: ['evlen', 'nikah', 'nişan', 'söz', 'yüzük'],
        translation: 'Он говорит о свадьбе, помолвке или браке.',
        meaning: 'Это серьёзные намерения. В турецкой культуре разговор о свадьбе — это не просто слова. Если он упоминает никях, нишан или юзюк — он думает о совместном будущем. Обсудите детали открыто.',
        replies: [
          { tr: 'Seninle her şeyi konuşabiliriz', ru: 'С тобой могу обсудить всё' },
          { tr: 'Çok mutlu oldum!', ru: 'Я так счастлива!' },
          { tr: 'Ailelerimiz tanışmalı', ru: 'Наши семьи должны познакомиться' },
        ]
      },
      {
        keywords: ['boş ver', 'önemli değil', 'sorun yok', 'geçti', 'unuttum'],
        translation: 'Он говорит, что всё нормально, не важно, или пытается закрыть тему.',
        meaning: '⚠️ Осторожно! Эти фразы в турецком часто скрывают обиду. «Önemli değil» может означать «мне очень важно, но я не хочу показывать». Если чувствуешь напряжение — лучше мягко спросить ещё раз.',
        replies: [
          { tr: 'Emin misin? Bana her şeyi söyleyebilirsin', ru: 'Ты уверен? Можешь мне всё рассказать' },
          { tr: 'Senin için önemli olan benim için de önemli', ru: 'Что важно для тебя — важно и для меня' },
          { tr: 'Konuşalım mı, canım?', ru: 'Поговорим, дорогой?' },
        ]
      },
    ];

    for (const p of patterns) {
      if (p.keywords.some(k => text.includes(k))) {
        return p;
      }
    }

    if (foundWords.length > 0) {
      const translations = foundWords.slice(0, 5).map(w => `${w.tr} — ${w.ru}`).join('; ');
      return {
        translation: `Найдены слова: ${translations}.`,
        meaning: 'Попробуй составить общий смысл из найденных слов. Для точного анализа с контекстом подключи полную версию с ИИ.',
        replies: [
          { tr: 'Anladım!', ru: 'Поняла!' },
          { tr: 'Tekrar söyler misin?', ru: 'Можешь повторить?' },
        ]
      };
    }

    return {
      translation: 'Не удалось распознать текст в текущем словаре.',
      meaning: 'Это сообщение содержит слова, которых пока нет в нашей базе. В полной версии с ИИ мы сможем перевести любой текст и объяснить контекст.',
      replies: [
        { tr: 'Anlamadım, tekrar yazar mısın?', ru: 'Не поняла, напишешь ещё раз?' },
        { tr: 'Türkçe öğreniyorum 😊', ru: 'Учу турецкий 😊' },
      ]
    };
  },
};

document.addEventListener('DOMContentLoaded', () => {
  APP.init();
  APP.initSwipe();
});

// Swipe gestures for flashcards
APP.initSwipe = function() {
  let startX = 0, startY = 0, swiping = false;
  document.addEventListener('touchstart', e => {
    const card = e.target.closest('.flashcard');
    if (!card) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    swiping = true;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!swiping) return;
    swiping = false;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;

    const screen = APP.state.screen;
    if (screen === 'cards') {
      if (dx > 0) { APP.haptic('MEDIUM'); APP.cardKnow(); }
      else { APP.haptic('LIGHT'); APP.cardAgain(); }
    } else if (screen === 'phrase-cards') {
      APP.haptic('LIGHT');
      APP.nextPhrase();
    }
  }, { passive: true });
};

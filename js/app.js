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
    srs: JSON.parse(localStorage.getItem('ta_srs') || '{}'),
    completedMissions: JSON.parse(localStorage.getItem('ta_completedMissions') || '[]'),
    missionStars: JSON.parse(localStorage.getItem('ta_missionStars') || '{}'),
    readiness: parseInt(localStorage.getItem('ta_readiness') || '0'),
    examPassed: JSON.parse(localStorage.getItem('ta_examPassed') || '[]'),
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
    localStorage.setItem('ta_srs', JSON.stringify(this.state.srs));
    localStorage.setItem('ta_completedMissions', JSON.stringify(this.state.completedMissions));
    localStorage.setItem('ta_missionStars', JSON.stringify(this.state.missionStars));
    localStorage.setItem('ta_readiness', this.state.readiness);
    localStorage.setItem('ta_examPassed', JSON.stringify(this.state.examPassed));
  },

  // ===== SPACED REPETITION =====
  // Box 1: review now, Box 2: 1 day, Box 3: 3 days, Box 4: 7 days, Box 5: mastered
  srsIntervals: [0, 0, 1, 3, 7, 30],

  srsPromote(wordId) {
    const entry = this.state.srs[wordId] || { box: 0, next: 0 };
    entry.box = Math.min(entry.box + 1, 5);
    entry.next = Date.now() + (this.srsIntervals[entry.box] * 86400000);
    this.state.srs[wordId] = entry;
    this.save();
  },

  srsDemote(wordId) {
    this.state.srs[wordId] = { box: 1, next: 0 };
    this.save();
  },

  startReview(words) {
    this.state.reviewMode = true;
    this.state.reviewWords = words;
    this.state.currentCardIndex = 0;
    document.getElementById('cards-title').textContent = '🧠 Повторение';
    document.querySelector('.cards-progress-fill').style.background = '#9C27B0';
    this.showScreen('cards');
    this.renderCard();
  },

  getWordsForReview() {
    const now = Date.now();
    return WORDS.filter(w => {
      const entry = this.state.srs[w.n];
      if (!entry) return false;
      return entry.box >= 1 && entry.box < 5 && entry.next <= now;
    });
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
    const showNav = ['home', 'favorites', 'translate', 'learn', 'profile', 'phrases', 'journey'].includes(name);
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
      if (name === 'journey') this.renderJourney();
      if (name === 'words') this.renderWords();
      if (name === 'verbs') this.renderVerbs();
      if (name === 'grammar') this.renderGrammar();
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

    const reviewWords = this.getWordsForReview();
    const reviewEl = document.getElementById('home-review');
    if (reviewWords.length > 0) {
      reviewEl.style.display = 'flex';
      reviewEl.innerHTML = `
        <div class="review-icon">🧠</div>
        <div class="review-info">
          <div class="review-title">Пора повторить!</div>
          <div class="review-sub">${reviewWords.length} слов ждут повторения</div>
        </div>
        <div class="continue-arrow">→</div>
      `;
      reviewEl.onclick = () => {
        this.haptic('MEDIUM');
        this.startReview(reviewWords);
      };
    } else {
      reviewEl.style.display = 'none';
    }

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

    document.getElementById('sections-grid').innerHTML = this.buildSectionsHTML();
  },

  buildSectionsHTML() {
    return SECTIONS.map(sec => {
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

  renderWords() {
    document.getElementById('words-grid').innerHTML = this.buildSectionsHTML();
  },

  // ===== JOURNEY / MISSIONS =====
  isMissionDone(id) { return this.state.completedMissions.includes(id); },

  LEVELS: [
    { id: 'A1', name: 'İlk Adımlar' },
    { id: 'A2', name: 'Daha Yakın' },
  ],

  isMissionUnlocked(id) {
    const idx = MISSIONS.findIndex(m => m.id === id);
    if (idx <= 0) return true;
    const prev = MISSIONS[idx - 1];
    const cur = MISSIONS[idx];
    if (prev.level !== cur.level) {
      // первая миссия нового уровня — нужен сданный экзамен предыдущего
      return this.state.examPassed.includes(prev.level);
    }
    return this.isMissionDone(prev.id);
  },

  renderJourney() {
    const total = MISSIONS.length;
    const doneCount = this.state.completedMissions.length;
    document.getElementById('journey-readiness-fill').style.width = this.state.readiness + '%';
    document.getElementById('journey-readiness-pct').textContent = this.state.readiness + '%';
    document.getElementById('journey-level').textContent = `${this.getCefrLabel()}`;
    const sub = document.getElementById('journey-cta-sub');
    if (sub) sub.textContent = `${doneCount}/${total} миссий · ${this.getCefrLabel()}`;

    let html = '';
    let side = 0;
    this.LEVELS.forEach(lvl => {
      const ms = MISSIONS.filter(m => m.level === lvl.id);
      html += `<div class="journey-level-divider">${lvl.id} · ${lvl.name}</div>`;
      ms.forEach(m => {
        const done = this.isMissionDone(m.id);
        const unlocked = this.isMissionUnlocked(m.id);
        const stars = this.state.missionStars[m.id] || 0;
        const cls = done ? 'done' : unlocked ? 'active' : 'locked';
        const sideCls = side % 2 === 0 ? 'left' : 'right';
        side++;
        const starsHtml = done ? `<div class="node-stars">${'⭐'.repeat(stars)}${'·'.repeat(3 - stars)}</div>` : '';
        html += `
          <div class="journey-node ${sideCls} ${cls}" ${unlocked ? `onclick="APP.openMission(${m.id})"` : ''}>
            <div class="node-circle">${done ? '✓' : unlocked ? m.emoji : '🔒'}</div>
            <div class="node-info">
              <div class="node-num">Миссия ${m.id}</div>
              <div class="node-title">${m.title}</div>
              ${starsHtml}
            </div>
          </div>`;
      });
      const allDone = ms.every(m => this.isMissionDone(m.id));
      const examDone = this.state.examPassed.includes(lvl.id);
      html += `
        <div class="journey-node exam ${examDone ? 'done' : allDone ? 'active' : 'locked'}" ${allDone && !examDone ? `onclick="APP.startExam('${lvl.id}')"` : ''}>
          <div class="node-circle">${examDone ? '🏆' : allDone ? '⭐' : '🔒'}</div>
          <div class="node-info">
            <div class="node-num">Экзамен</div>
            <div class="node-title">Уровень ${lvl.id}</div>
          </div>
        </div>`;
      side = 0;
    });
    document.getElementById('journey-path').innerHTML = html;
  },

  getCefrLabel() {
    if (this.state.examPassed.includes('B2')) return 'B2';
    if (this.state.examPassed.includes('B1')) return 'B1';
    if (this.state.examPassed.includes('A2')) return 'A2';
    if (this.state.examPassed.includes('A1')) return 'A2 (в процессе)';
    return 'A1 (в процессе)';
  },

  openMission(id) {
    const m = MISSIONS.find(x => x.id === id);
    if (!m) return;
    this.haptic('MEDIUM');
    this.mission = {
      data: m,
      steps: this.buildMissionSteps(m),
      stepIndex: 0,
    };
    this.showScreen('mission');
    this.renderMissionStep();
  },

  buildMissionSteps(m) {
    const steps = ['intro'];
    if (m.wordIds && m.wordIds.length) steps.push('words');
    if (m.verbIds && m.verbIds.length) steps.push('verbs');
    if (m.grammarId) steps.push('grammar');
    if (m.phraseIds && m.phraseIds.length) steps.push('phrases');
    if (m.dialog && m.dialog.length) steps.push('dialog');
    if (m.exercises && m.exercises.length) steps.push('trainer');
    else if (m.game) steps.push('game');
    if (m.test && m.test.length) steps.push('test');
    steps.push('reward');
    return steps;
  },

  renderMissionStep() {
    const { steps, stepIndex, data } = this.mission;
    const step = steps[stepIndex];
    document.getElementById('mission-progress-fill').style.width =
      Math.round((stepIndex / steps.length) * 100) + '%';
    const el = document.getElementById('mission-step');
    el.scrollTop = 0;
    const fn = {
      intro: 'stepIntro', words: 'stepWords', verbs: 'stepVerbs', grammar: 'stepGrammar',
      phrases: 'stepPhrases', dialog: 'stepDialog', game: 'stepGame', trainer: 'stepTrainer',
      test: 'stepTest', reward: 'stepReward',
    }[step];
    el.innerHTML = this[fn](data);
    if (step === 'dialog') this.initDialogStep();
    if (step === 'game') this.initGameStep();
    if (step === 'trainer') this.initTrainerStep();
    if (step === 'test') this.initTestStep();
  },

  missionNext() {
    this.haptic('LIGHT');
    this.mission.stepIndex++;
    if (this.mission.stepIndex >= this.mission.steps.length) {
      this.exitMission();
      return;
    }
    this.renderMissionStep();
  },

  exitMission() {
    this.mission = null;
    this.showScreen('journey');
  },

  stepHeader(emoji, label) {
    return `<div class="step-badge">${emoji} ${label}</div>`;
  },
  nextBtn(text) {
    return `<button class="btn-primary mission-next-btn" onclick="APP.missionNext()">${text || 'Далее'}</button>`;
  },

  stepIntro(m) {
    return `
      <div class="step-intro">
        <div class="step-intro-emoji">${m.emoji}</div>
        <div class="step-intro-mission">Миссия ${m.id} · ${m.level}${m.grammar_topic ? ' · ' + m.grammar_topic : ''}</div>
        <h2>${m.title}</h2>
        <div class="step-goal">🎯 ${m.goal}</div>
        ${m.hook ? `
          <div class="step-hook" onclick="APP.speak('${m.hook.phrase_tr.replace(/'/g, "\\'")}')">
            <div class="hook-phrase">${m.hook.phrase_tr} 🔊</div>
            <div class="hook-ru">${m.hook.phrase_ru}</div>
            <div class="hook-prompt">${m.hook.prompt}</div>
          </div>` : ''}
        ${this.nextBtn('Начать миссию')}
      </div>`;
  },

  stepWords(m) {
    const words = m.wordIds.map(n => WORDS.find(w => w.n === n)).filter(Boolean);
    return `
      ${this.stepHeader('📚', 'Новые слова')}
      <div class="step-words">
        ${words.map(w => `
          <div class="step-word" onclick="APP.speak('${w.tr.replace(/'/g, "\\'")}')">
            <div class="sw-left"><div class="sw-tr">${w.tr}</div><div class="sw-ru">${w.ru}</div></div>
            <div class="sw-sound">🔊</div>
          </div>`).join('')}
      </div>
      ${this.nextBtn()}`;
  },

  stepVerbs(m) {
    const verbs = m.verbIds.map(id => VERBS.find(v => v.id === id)).filter(Boolean);
    return `
      ${this.stepHeader('⚡', 'Ключевые глаголы')}
      <div class="step-verbs">
        ${verbs.map(v => `
          <div class="step-verb">
            <div class="sv-head" onclick="APP.speak('${v.tr}')"><span class="sv-tr">${v.tr}</span><span class="sv-ru">${v.ru}</span> 🔊</div>
            <div class="sv-conj">
              <span>ben ${v.present.ben}</span><span>sen ${v.present.sen}</span><span>o ${v.present.o}</span>
            </div>
            <div class="sv-ex">${v.examples[0]}</div>
          </div>`).join('')}
      </div>
      ${this.nextBtn()}`;
  },

  stepGrammar(m) {
    if (m.explanation) {
      const e = m.explanation;
      return `
        ${this.stepHeader('🧩', m.grammar_topic || 'Грамматика')}
        <div class="grammar-box" style="margin-top:0">${e.rule}</div>
        <div class="grammar-table">
          ${e.examples.map(ex => `
            <div class="grammar-row">
              <span class="g-letter">${ex.tr}</span>
              <span class="g-example">${ex.ru}</span>
            </div>`).join('')}
        </div>
        ${this.nextBtn()}`;
    }
    const g = GRAMMAR_LESSONS.find(x => x.id === m.grammarId);
    return `
      ${this.stepHeader('🧩', 'Грамматика')}
      <div class="grammar-lesson-content" style="padding:0 0 1rem">${g ? g.content : ''}</div>
      ${this.nextBtn()}`;
  },

  stepPhrases(m) {
    const phrases = m.phraseIds.map(id => PHRASES.find(p => p.id === id)).filter(Boolean);
    return `
      ${this.stepHeader('💬', 'Реальные фразы')}
      <div class="step-phrases">
        ${phrases.map(p => `
          <div class="step-phrase" onclick="APP.speak('${p.tr.replace(/'/g, "\\'")}')">
            <div class="sp-tr">${p.tr}</div>
            <div class="sp-ru">${p.ru}</div>
          </div>`).join('')}
      </div>
      ${this.nextBtn()}`;
  },

  stepDialog(m) {
    return `
      ${this.stepHeader('🎭', 'Диалог')}
      <div class="step-dialog" id="step-dialog-chat"></div>
      <div id="step-dialog-choice"></div>`;
  },

  initDialogStep() {
    const m = this.mission.data;
    const chat = document.getElementById('step-dialog-chat');
    const choiceEl = document.getElementById('step-dialog-choice');
    let i = 0;
    const showNext = () => {
      if (i >= m.dialog.length) {
        choiceEl.innerHTML = this.nextBtn();
        return;
      }
      const turn = m.dialog[i];
      if (turn.s === 'choose') {
        choiceEl.innerHTML = `
          <div class="dialog-q">${turn.q}</div>
          ${turn.options.map((o, idx) => `
            <button class="dialog-option" onclick="APP.dialogAnswer(this, ${o.correct})">
              <div class="do-tr">${o.tr}</div><div class="do-ru">${o.ru}</div>
            </button>`).join('')}`;
        return;
      }
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble ' + (turn.s === 'he' ? 'he' : 'you');
      bubble.innerHTML = `<div class="cb-tr">${turn.tr}</div><div class="cb-ru">${turn.ru}</div>`;
      bubble.onclick = () => this.speak(turn.tr);
      chat.appendChild(bubble);
      i++;
      setTimeout(showNext, turn.s === 'he' ? 700 : 500);
    };
    showNext();
  },

  dialogAnswer(btn, correct) {
    if (correct) {
      btn.classList.add('correct');
      this.haptic('MEDIUM'); this.playSound('correct');
      document.querySelectorAll('.dialog-option').forEach(b => b.style.pointerEvents = 'none');
      setTimeout(() => { document.getElementById('step-dialog-choice').innerHTML = this.nextBtn(); }, 700);
    } else {
      btn.classList.add('wrong');
      this.haptic('HEAVY'); this.playSound('wrong');
      setTimeout(() => btn.classList.remove('wrong'), 500);
    }
  },

  stepGame(m) {
    return `
      ${this.stepHeader('🎮', 'Собери фразу')}
      <div class="game-prompt">${m.game.ru}</div>
      <div class="game-answer" id="game-answer"></div>
      <div class="game-bank" id="game-bank"></div>
      <div id="game-next"></div>`;
  },

  initGameStep() {
    const m = this.mission.data;
    this.gameWords = m.game.tr.split(' ');
    this.gamePicked = [];
    const bank = document.getElementById('game-bank');
    const shuffled = [...this.gameWords].map((w, i) => ({ w, i })).sort(() => Math.random() - 0.5);
    bank.innerHTML = shuffled.map(o => `<button class="game-chip" data-i="${o.i}" onclick="APP.gamePick(this)">${o.w}</button>`).join('');
  },

  gamePick(btn) {
    this.haptic('LIGHT');
    btn.style.visibility = 'hidden';
    this.gamePicked.push(btn.textContent);
    const ans = document.getElementById('game-answer');
    ans.innerHTML = this.gamePicked.map(w => `<span class="game-token">${w}</span>`).join(' ');
    if (this.gamePicked.length === this.gameWords.length) {
      const correct = this.gamePicked.join(' ') === this.gameWords.join(' ');
      if (correct) {
        ans.classList.add('game-correct');
        this.playSound('correct'); this.haptic('MEDIUM');
        document.getElementById('game-next').innerHTML = this.nextBtn('Отлично! Далее');
      } else {
        ans.classList.add('game-wrong');
        this.playSound('wrong'); this.haptic('HEAVY');
        document.getElementById('game-next').innerHTML =
          `<button class="btn-secondary" onclick="APP.initGameStep();document.getElementById('game-answer').className='game-answer';document.getElementById('game-answer').innerHTML='';document.getElementById('game-next').innerHTML=''">Попробовать снова</button>`;
      }
    }
  },

  // ===== TRAINER (grammar exercises) =====
  stepTrainer(m) {
    return `
      ${this.stepHeader('🏋️', 'Тренажёр грамматики')}
      <div class="trainer-counter" id="trainer-counter"></div>
      <div id="trainer-body"></div>`;
  },

  initTrainerStep() {
    this.trainer = { i: 0, answered: false };
    this.renderTrainerExercise();
  },

  renderTrainerExercise() {
    const ex = this.mission.data.exercises;
    if (this.trainer.i >= ex.length) {
      this.missionNext();
      return;
    }
    const e = ex[this.trainer.i];
    this.trainer.answered = false;
    document.getElementById('trainer-counter').textContent = `${this.trainer.i + 1} / ${ex.length}`;
    const body = document.getElementById('trainer-body');
    if (e.type === 'recognize') {
      const opts = [...e.options].sort(() => Math.random() - 0.5);
      body.innerHTML = `
        <div class="trainer-q">
          <div class="trainer-sentence" style="font-size:1.1rem">${e.question_ru}</div>
        </div>
        <div class="quiz-options">
          ${opts.map(o => `<button class="quiz-option" onclick="APP.answerTrainerFill(this, '${this.escapeHtml(o)}', '${this.escapeHtml(e.correct)}')">${o}</button>`).join('')}
        </div>`;
    } else if (e.type === 'fill_blank') {
      const opts = [...e.options].sort(() => Math.random() - 0.5);
      const sentence = (e.sentence_tr || '').replace(/_+/g, '<span class="trainer-blank">?</span>');
      body.innerHTML = `
        <div class="trainer-q">
          ${e.question_ru ? `<div class="trainer-hint" style="margin-bottom:8px">${e.question_ru}</div>` : ''}
          <div class="trainer-sentence">${sentence}</div>
          ${e.sentence_ru ? `<div class="trainer-ru">${e.sentence_ru}</div>` : ''}
        </div>
        <div class="quiz-options">
          ${opts.map(o => `<button class="quiz-option" onclick="APP.answerTrainerFill(this, '${this.escapeHtml(o)}', '${this.escapeHtml(e.correct)}')">${o}</button>`).join('')}
        </div>`;
    } else if (e.type === 'word_order') {
      this.trainerWords = e.correct.split(' ');
      this.trainerPicked = [];
      const shuffled = [...this.trainerWords].sort(() => Math.random() - 0.5);
      body.innerHTML = `
        <div class="trainer-q">
          <div class="trainer-ru">${e.translation}</div>
          <div class="trainer-hint">Собери предложение</div>
        </div>
        <div class="game-answer" id="trainer-answer"></div>
        <div class="game-bank" id="trainer-bank">
          ${shuffled.map((w, idx) => `<button class="game-chip" data-w="${this.escapeHtml(w)}" onclick="APP.trainerPick(this)">${w}</button>`).join('')}
        </div>
        <div id="trainer-next"></div>`;
    }
  },

  answerTrainerFill(btn, selected, correct) {
    if (this.trainer.answered) return;
    this.trainer.answered = true;
    document.querySelectorAll('#trainer-body .quiz-option').forEach(b => b.classList.add('disabled'));
    if (selected === correct) {
      btn.classList.add('correct'); this.haptic('MEDIUM'); this.playSound('correct');
    } else {
      btn.classList.add('wrong'); this.haptic('HEAVY'); this.playSound('wrong');
      document.querySelectorAll('#trainer-body .quiz-option').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
    setTimeout(() => { this.trainer.i++; this.renderTrainerExercise(); }, 1100);
  },

  trainerPick(btn) {
    this.haptic('LIGHT');
    btn.style.visibility = 'hidden';
    this.trainerPicked.push(btn.dataset.w);
    const ans = document.getElementById('trainer-answer');
    ans.innerHTML = this.trainerPicked.map(w => `<span class="game-token">${w}</span>`).join(' ');
    if (this.trainerPicked.length === this.trainerWords.length) {
      const ok = this.trainerPicked.join(' ') === this.trainerWords.join(' ');
      if (ok) {
        ans.classList.add('game-correct'); this.playSound('correct'); this.haptic('MEDIUM');
        document.getElementById('trainer-next').innerHTML =
          `<button class="btn-primary mission-next-btn" onclick="APP.trainer.i++;APP.renderTrainerExercise()">Дальше</button>`;
      } else {
        ans.classList.add('game-wrong'); this.playSound('wrong'); this.haptic('HEAVY');
        document.getElementById('trainer-next').innerHTML =
          `<button class="btn-secondary" onclick="APP.renderTrainerExercise()">Попробовать снова</button>`;
      }
    }
  },

  stepTest(m) {
    return `
      ${this.stepHeader('📝', 'Мини-тест')}
      <div class="mission-test-counter" id="mtest-counter"></div>
      <div class="quiz-question" id="mtest-q"></div>
      <div class="quiz-options" id="mtest-opts"></div>`;
  },

  initTestStep() {
    this.mtest = { i: 0, correct: 0, answered: false };
    this.renderMissionTestQ();
  },

  renderMissionTestQ() {
    const test = this.mission.data.test;
    if (this.mtest.i >= test.length) {
      this.mission.testScore = this.mtest.correct / test.length;
      this.missionNext();
      return;
    }
    const q = test[this.mtest.i];
    this.mtest.answered = false;
    document.getElementById('mtest-counter').textContent = `${this.mtest.i + 1} / ${test.length}`;
    document.getElementById('mtest-q').innerHTML = `<div class="quiz-word">${q.q}</div>`;
    const opts = [...q.opts].sort(() => Math.random() - 0.5);
    document.getElementById('mtest-opts').innerHTML = opts.map(o =>
      `<button class="quiz-option" onclick="APP.answerMissionTest(this, '${this.escapeHtml(o)}', '${this.escapeHtml(q.a)}')">${o}</button>`
    ).join('');
  },

  answerMissionTest(btn, selected, correct) {
    if (this.mtest.answered) return;
    this.mtest.answered = true;
    document.querySelectorAll('#mtest-opts .quiz-option').forEach(b => b.classList.add('disabled'));
    if (selected === correct) {
      btn.classList.add('correct'); this.mtest.correct++;
      this.haptic('MEDIUM'); this.playSound('correct');
    } else {
      btn.classList.add('wrong'); this.haptic('HEAVY'); this.playSound('wrong');
      document.querySelectorAll('#mtest-opts .quiz-option').forEach(b => {
        if (b.textContent === correct) b.classList.add('correct');
      });
    }
    setTimeout(() => { this.mtest.i++; this.renderMissionTestQ(); }, 1000);
  },

  stepReward(m) {
    // compute stars from test score
    const score = this.mission.testScore != null ? this.mission.testScore : 1;
    let stars = 1;
    if (score >= 0.6) stars = 2;
    if (score >= 0.9) stars = 3;
    this.completeMission(m, stars);
    return `
      <div class="step-reward">
        <div class="reward-emoji">${m.emoji}</div>
        <h2>Миссия пройдена!</h2>
        <div class="reward-stars">${'⭐'.repeat(stars)}${'<span style="opacity:.25">⭐</span>'.repeat(3 - stars)}</div>
        <div class="reward-row">
          <div class="reward-item"><div class="ri-num">+${m.reward.xp}</div><div class="ri-label">XP</div></div>
          <div class="reward-item"><div class="ri-num">+${m.reward.readiness}%</div><div class="ri-label">готовность</div></div>
        </div>
        <div class="reward-badge">Новый значок: ${m.reward.badge}</div>
        ${m.finale ? `
          <div class="step-finale" onclick="APP.speak('${m.finale.phrase_tr.replace(/'/g, "\\'")}')">
            <div class="finale-phrase">${m.finale.phrase_tr} 🔊</div>
            <div class="finale-ru">${m.finale.phrase_ru}</div>
            <div class="finale-prompt">${m.finale.prompt}</div>
          </div>` : ''}
        <button class="btn-primary" onclick="APP.exitMission()">Продолжить путь</button>
      </div>`;
  },

  completeMission(m, stars) {
    if (this.isMissionDone(m.id)) {
      // already done — only update stars if better
      if ((this.state.missionStars[m.id] || 0) < stars) this.state.missionStars[m.id] = stars;
      this.save();
      return;
    }
    this.state.completedMissions.push(m.id);
    this.state.missionStars[m.id] = stars;
    this.state.readiness = Math.min(100, this.state.readiness + m.reward.readiness);
    // promote referenced words into SRS / learned
    (m.wordIds || []).forEach(n => {
      if (!this.state.learned.includes(n)) this.state.learned.push(n);
      this.srsPromote(n);
    });
    this.addXP(m.reward.xp);
    this.save();
    this.spawnConfetti(40);
    this.playSound('levelup');
  },

  // ===== EXAM =====
  startExam(level) {
    level = level || 'A1';
    this.haptic('MEDIUM');
    this.exam = { i: 0, correct: 0, answered: false, data: EXAMS[level], level };
    this.showScreen('mission');
    document.getElementById('mission-progress-fill').style.width = '0%';
    this.renderExamQ();
  },

  renderExamQ() {
    const ex = this.exam.data;
    const el = document.getElementById('mission-step');
    if (this.exam.i >= ex.questions.length) {
      this.finishExam();
      return;
    }
    document.getElementById('mission-progress-fill').style.width =
      Math.round((this.exam.i / ex.questions.length) * 100) + '%';
    const q = ex.questions[this.exam.i];
    this.exam.answered = false;
    const opts = [...q.opts].sort(() => Math.random() - 0.5);
    el.scrollTop = 0;
    el.innerHTML = `
      ${this.stepHeader('⭐', 'Экзамен ' + this.exam.level + ' · ' + q.sec)}
      <div class="mission-test-counter">${this.exam.i + 1} / ${ex.questions.length}</div>
      <div class="quiz-question"><div class="quiz-word">${q.q}</div></div>
      <div class="quiz-options">
        ${opts.map(o => `<button class="quiz-option" onclick="APP.answerExam(this, '${this.escapeHtml(o)}', '${this.escapeHtml(q.a)}')">${o}</button>`).join('')}
      </div>`;
  },

  answerExam(btn, selected, correct) {
    if (this.exam.answered) return;
    this.exam.answered = true;
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.add('disabled'));
    if (selected === correct) {
      btn.classList.add('correct'); this.exam.correct++;
      this.haptic('MEDIUM'); this.playSound('correct');
    } else {
      btn.classList.add('wrong'); this.haptic('HEAVY'); this.playSound('wrong');
      document.querySelectorAll('.quiz-option').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
    setTimeout(() => { this.exam.i++; this.renderExamQ(); }, 1000);
  },

  finishExam() {
    const ex = this.exam.data;
    const lvl = this.exam.level;
    const next = { A1: 'A2', A2: 'B1' }[lvl] || '';
    const pct = Math.round(this.exam.correct / ex.questions.length * 100);
    const passed = pct >= ex.pass;
    const el = document.getElementById('mission-step');
    document.getElementById('mission-progress-fill').style.width = '100%';
    if (passed && !this.state.examPassed.includes(lvl)) {
      this.state.examPassed.push(lvl);
      this.addXP(200);
      this.save();
      this.spawnConfetti(60);
      this.playSound('levelup');
    }
    el.innerHTML = `
      <div class="step-reward">
        <div class="reward-emoji">${passed ? '🏆' : '💪'}</div>
        <h2>${passed ? `Уровень ${lvl} сдан!` : 'Почти получилось'}</h2>
        <div class="exam-score">${this.exam.correct} / ${ex.questions.length} · ${pct}%</div>
        <div class="exam-msg">${passed
          ? `Поздравляю! Ты официально на уровне ${lvl}${next ? ` и готова к ${next}` : ''} 🇹🇷`
          : `Нужно ${ex.pass}%. Повтори миссии и попробуй снова — ты близко!`}</div>
        <button class="btn-primary" onclick="APP.exam=null;APP.showScreen('journey')">${passed ? 'Продолжить' : 'Вернуться к миссиям'}</button>
      </div>`;
  },

  // ===== CARDS =====
  openSection(sectionId) {
    const sec = SECTIONS.find(s => s.id === sectionId);
    this.state.currentSection = sectionId;
    this.state.currentCardIndex = 0;
    this.state.flipped = false;
    this.state.reviewMode = false;
    this.state.reviewWords = null;

    document.getElementById('cards-title').textContent = sec.emoji + ' ' + sec.name;
    document.querySelector('.cards-progress-fill').style.background = sec.color;
    this.showScreen('cards');
    this.renderCard();
  },

  getSectionWords() {
    if (this.state.reviewMode && this.state.reviewWords) {
      return this.state.reviewWords;
    }
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
    this.srsPromote(word.n);
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
    const words = this.getSectionWords();
    const word = words[this.state.currentCardIndex];
    this.srsDemote(word.n);
    const flashcard = document.getElementById('flashcard')
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

  // ===== VERBS =====
  renderVerbs() {
    document.getElementById('verbs-list').innerHTML = VERBS.map(v => `
      <div class="verb-card" onclick="APP.openVerb(${v.id})">
        <div class="verb-word">${v.tr}</div>
        <div class="verb-meaning">${v.ru}</div>
        <div class="verb-example">${v.examples[0].split('—')[0].trim()}</div>
      </div>
    `).join('');
  },

  openVerb(id) {
    const v = VERBS.find(x => x.id === id);
    if (!v) return;
    document.getElementById('verb-detail-title').textContent = v.tr;
    const tenses = [
      { name: 'Настоящее', data: v.present },
      { name: 'Прошедшее', data: v.past },
      { name: 'Будущее', data: v.future },
    ];
    document.getElementById('verb-detail-content').innerHTML = `
      <div class="vd-header">
        <div class="vd-word">${v.tr}</div>
        <div class="vd-meaning">${v.ru}</div>
        <button class="sound-btn" style="width:44px;height:44px;font-size:1.2rem;margin:8px 0" onclick="APP.speak('${v.tr}')">🔊</button>
      </div>
      ${tenses.map(t => `
        <div class="vd-tense">
          <div class="vd-tense-title">${t.name} время</div>
          <div class="vd-conj">
            ${Object.entries(t.data).map(([p, f]) => `<div class="vd-conj-row"><span class="vd-pronoun">${p}</span><span class="vd-form">${f}</span></div>`).join('')}
          </div>
        </div>
      `).join('')}
      <div class="vd-section">
        <div class="vd-section-title">Примеры</div>
        ${v.examples.map(e => `<div class="vd-example">${e}</div>`).join('')}
      </div>
      <div class="vd-section">
        <div class="vd-section-title">Словосочетания</div>
        ${v.combos.map(c => `<div class="vd-combo">${c}</div>`).join('')}
      </div>
    `;
    this.showScreen('verb-detail');
  },

  // ===== GRAMMAR =====
  renderGrammar() {
    document.getElementById('grammar-list').innerHTML = GRAMMAR_LESSONS.map(l => `
      <div class="grammar-card" onclick="APP.openGrammarLesson(${l.id})">
        <div class="grammar-card-emoji">${l.emoji}</div>
        <div class="grammar-card-info">
          <div class="grammar-card-title">${l.title}</div>
          <div class="grammar-card-desc">${l.desc}</div>
        </div>
        <div class="grammar-card-level">${l.level}</div>
      </div>
    `).join('');
  },

  openGrammarLesson(id) {
    const l = GRAMMAR_LESSONS.find(x => x.id === id);
    if (!l) return;
    document.getElementById('grammar-lesson-title').textContent = l.emoji + ' ' + l.title;
    document.getElementById('grammar-lesson-content').innerHTML = l.content;
    this.showScreen('grammar-lesson');
  },

  // ===== SEARCH =====
  handleSearch(query) {
    const q = query.trim().toLowerCase();
    const resultsEl = document.getElementById('search-results');
    const menuEl = document.getElementById('learn-menu');
    if (q.length < 2) {
      resultsEl.style.display = 'none';
      menuEl.style.display = 'block';
      return;
    }
    resultsEl.style.display = 'block';
    menuEl.style.display = 'none';

    const wordResults = WORDS.filter(w =>
      w.tr.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q)
    ).slice(0, 10);

    const phraseResults = PHRASES.filter(p =>
      p.tr.toLowerCase().includes(q) || p.ru.toLowerCase().includes(q)
    ).slice(0, 5);

    const verbResults = VERBS.filter(v =>
      v.tr.toLowerCase().includes(q) || v.ru.toLowerCase().includes(q)
    ).slice(0, 5);

    if (wordResults.length === 0 && phraseResults.length === 0 && verbResults.length === 0) {
      resultsEl.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>Ничего не найдено</p></div>';
      return;
    }

    let html = '';
    if (wordResults.length > 0) {
      html += '<div class="search-group-title">Слова</div>';
      html += wordResults.map(w => `
        <div class="search-item" onclick="APP.speak('${w.tr}')">
          <div class="search-item-tr">${w.tr}</div>
          <div class="search-item-ru">${w.ru}</div>
        </div>
      `).join('');
    }
    if (verbResults.length > 0) {
      html += '<div class="search-group-title">Глаголы</div>';
      html += verbResults.map(v => `
        <div class="search-item" onclick="APP.openVerb(${v.id})">
          <div class="search-item-tr">${v.tr}</div>
          <div class="search-item-ru">${v.ru}</div>
        </div>
      `).join('');
    }
    if (phraseResults.length > 0) {
      html += '<div class="search-group-title">Фразы</div>';
      html += phraseResults.map(p => `
        <div class="search-item" onclick="APP.speak('${p.tr.replace(/'/g, "\\'")}')">
          <div class="search-item-tr">${p.tr}</div>
          <div class="search-item-ru">${p.ru}</div>
        </div>
      `).join('');
    }
    resultsEl.innerHTML = html;
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
      <div class="pstat"><div class="pstat-num">${this.getCefrLabel().split(' ')[0]}</div><div class="pstat-label">🎓 Уровень CEFR</div></div>
      <div class="pstat"><div class="pstat-num">${this.state.readiness}%</div><div class="pstat-label">🇹🇷 Готовность</div></div>
      <div class="pstat"><div class="pstat-num">${this.state.completedMissions.length}/${MISSIONS.length}</div><div class="pstat-label">🗺️ Миссий</div></div>
      <div class="pstat"><div class="pstat-num">${this.state.streak}</div><div class="pstat-label">🔥 Дней подряд</div></div>
      <div class="pstat"><div class="pstat-num">${this.state.learned.length}</div><div class="pstat-label">📚 Слов</div></div>
      <div class="pstat"><div class="pstat-num">${xp}</div><div class="pstat-label">⭐ XP</div></div>
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

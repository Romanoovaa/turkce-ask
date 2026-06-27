const VERBS = [
  {
    id: 1, tr: 'olmak', ru: 'быть, становиться',
    present: { ben: 'olurum', sen: 'olursun', o: 'olur', biz: 'oluruz', siz: 'olursunuz', onlar: 'olurlar' },
    past: { ben: 'oldum', sen: 'oldun', o: 'oldu', biz: 'olduk', siz: 'oldunuz', onlar: 'oldular' },
    future: { ben: 'olacağım', sen: 'olacaksın', o: 'olacak', biz: 'olacağız', siz: 'olacaksınız', onlar: 'olacaklar' },
    examples: ['Mutlu olmak istiyorum — Хочу быть счастливой', 'Ne oldu? — Что случилось?'],
    combos: ['hazır olmak — быть готовым', 'hasta olmak — заболеть', 'mutlu olmak — быть счастливым']
  },
  {
    id: 2, tr: 'gelmek', ru: 'приходить, приезжать',
    present: { ben: 'gelirim', sen: 'gelirsin', o: 'gelir', biz: 'geliriz', siz: 'gelirsiniz', onlar: 'gelirler' },
    past: { ben: 'geldim', sen: 'geldin', o: 'geldi', biz: 'geldik', siz: 'geldiniz', onlar: 'geldiler' },
    future: { ben: 'geleceğim', sen: 'geleceksin', o: 'gelecek', biz: 'geleceğiz', siz: 'geleceksiniz', onlar: 'gelecekler' },
    examples: ['Seni almaya geliyorum — Еду за тобой', 'Gel buraya — Иди сюда'],
    combos: ['hoşuna gelmek — нравиться', 'aklına gelmek — прийти в голову']
  },
  {
    id: 3, tr: 'gitmek', ru: 'уходить, уезжать',
    present: { ben: 'giderim', sen: 'gidersin', o: 'gider', biz: 'gideriz', siz: 'gidersiniz', onlar: 'giderler' },
    past: { ben: 'gittim', sen: 'gittin', o: 'gitti', biz: 'gittik', siz: 'gittiniz', onlar: 'gittiler' },
    future: { ben: 'gideceğim', sen: 'gideceksin', o: 'gidecek', biz: 'gideceğiz', siz: 'gideceksiniz', onlar: 'gidecekler' },
    examples: ['Eve gidiyorum — Иду домой', 'Nereye gidiyorsun? — Куда идёшь?'],
    combos: ['işe gitmek — идти на работу', 'okula gitmek — идти в школу']
  },
  {
    id: 4, tr: 'yapmak', ru: 'делать',
    present: { ben: 'yaparım', sen: 'yaparsın', o: 'yapar', biz: 'yaparız', siz: 'yaparsınız', onlar: 'yaparlar' },
    past: { ben: 'yaptım', sen: 'yaptın', o: 'yaptı', biz: 'yaptık', siz: 'yaptınız', onlar: 'yaptılar' },
    future: { ben: 'yapacağım', sen: 'yapacaksın', o: 'yapacak', biz: 'yapacağız', siz: 'yapacaksınız', onlar: 'yapacaklar' },
    examples: ['Ne yapıyorsun? — Что делаешь?', 'Kahvaltı yapıyorum — Завтракаю'],
    combos: ['yemek yapmak — готовить еду', 'spor yapmak — заниматься спортом']
  },
  {
    id: 5, tr: 'istemek', ru: 'хотеть',
    present: { ben: 'isterim', sen: 'istersin', o: 'ister', biz: 'isteriz', siz: 'istersiniz', onlar: 'isterler' },
    past: { ben: 'istedim', sen: 'istedin', o: 'istedi', biz: 'istedik', siz: 'istediniz', onlar: 'istediler' },
    future: { ben: 'isteyeceğim', sen: 'isteyeceksin', o: 'isteyecek', biz: 'isteyeceğiz', siz: 'isteyeceksiniz', onlar: 'isteyecekler' },
    examples: ['Seni görmek istiyorum — Хочу тебя видеть', 'Ne istiyorsun? — Что ты хочешь?'],
    combos: ['evlenmek istemek — хотеть жениться', 'konuşmak istemek — хотеть поговорить']
  },
  {
    id: 6, tr: 'sevmek', ru: 'любить',
    present: { ben: 'severim', sen: 'seversin', o: 'sever', biz: 'severiz', siz: 'seversiniz', onlar: 'severler' },
    past: { ben: 'sevdim', sen: 'sevdin', o: 'sevdi', biz: 'sevdik', siz: 'sevdiniz', onlar: 'sevdiler' },
    future: { ben: 'seveceğim', sen: 'seveceksin', o: 'sevecek', biz: 'seveceğiz', siz: 'seveceksiniz', onlar: 'sevecekler' },
    examples: ['Seni seviyorum — Я тебя люблю', 'Çayı çok severim — Очень люблю чай'],
    combos: ['birini sevmek — любить кого-то', 'çok sevmek — очень любить']
  },
  {
    id: 7, tr: 'bilmek', ru: 'знать',
    present: { ben: 'bilirim', sen: 'bilirsin', o: 'bilir', biz: 'biliriz', siz: 'bilirsiniz', onlar: 'bilirler' },
    past: { ben: 'bildim', sen: 'bildin', o: 'bildi', biz: 'bildik', siz: 'bildiniz', onlar: 'bildiler' },
    future: { ben: 'bileceğim', sen: 'bileceksin', o: 'bilecek', biz: 'bileceğiz', siz: 'bileceksiniz', onlar: 'bilecekler' },
    examples: ['Bilmiyorum — Не знаю', 'Türkçe biliyor musun? — Ты знаешь турецкий?'],
    combos: ['bir şey bilmek — знать что-то', 'ne bileyim — откуда мне знать']
  },
  {
    id: 8, tr: 'söylemek', ru: 'говорить, сказать',
    present: { ben: 'söylerim', sen: 'söylersin', o: 'söyler', biz: 'söyleriz', siz: 'söylersiniz', onlar: 'söylerler' },
    past: { ben: 'söyledim', sen: 'söyledin', o: 'söyledi', biz: 'söyledik', siz: 'söylediniz', onlar: 'söylediler' },
    future: { ben: 'söyleyeceğim', sen: 'söyleyeceksin', o: 'söyleyecek', biz: 'söyleyeceğiz', siz: 'söyleyeceksiniz', onlar: 'söyleyecekler' },
    examples: ['Ne söyledi? — Что он сказал?', 'Tekrar söyle — Скажи ещё раз'],
    combos: ['doğruyu söylemek — говорить правду', 'yalan söylemek — лгать']
  },
  {
    id: 9, tr: 'almak', ru: 'брать, покупать',
    present: { ben: 'alırım', sen: 'alırsın', o: 'alır', biz: 'alırız', siz: 'alırsınız', onlar: 'alırlar' },
    past: { ben: 'aldım', sen: 'aldın', o: 'aldı', biz: 'aldık', siz: 'aldınız', onlar: 'aldılar' },
    future: { ben: 'alacağım', sen: 'alacaksın', o: 'alacak', biz: 'alacağız', siz: 'alacaksınız', onlar: 'alacaklar' },
    examples: ['Bir kahve alayım — Возьму кофе', 'Hediye aldım — Купил подарок'],
    combos: ['haber almak — получить известие', 'izin almak — получить разрешение']
  },
  {
    id: 10, tr: 'vermek', ru: 'давать',
    present: { ben: 'veririm', sen: 'verirsin', o: 'verir', biz: 'veririz', siz: 'verirsiniz', onlar: 'verirler' },
    past: { ben: 'verdim', sen: 'verdin', o: 'verdi', biz: 'verdik', siz: 'verdiniz', onlar: 'verdiler' },
    future: { ben: 'vereceğim', sen: 'vereceksin', o: 'verecek', biz: 'vereceğiz', siz: 'vereceksiniz', onlar: 'verecekler' },
    examples: ['Bana ver — Дай мне', 'Söz veriyorum — Обещаю'],
    combos: ['cevap vermek — отвечать', 'karar vermek — принять решение']
  },
  {
    id: 11, tr: 'yemek', ru: 'есть, кушать',
    present: { ben: 'yerim', sen: 'yersin', o: 'yer', biz: 'yeriz', siz: 'yersiniz', onlar: 'yerler' },
    past: { ben: 'yedim', sen: 'yedin', o: 'yedi', biz: 'yedik', siz: 'yediniz', onlar: 'yediler' },
    future: { ben: 'yiyeceğim', sen: 'yiyeceksin', o: 'yiyecek', biz: 'yiyeceğiz', siz: 'yiyeceksiniz', onlar: 'yiyecekler' },
    examples: ['Ne yemek istersin? — Что хочешь поесть?', 'Çok yedim — Я много съел'],
    combos: ['yemek yemek — кушать', 'kahvaltı yemek — завтракать']
  },
  {
    id: 12, tr: 'içmek', ru: 'пить',
    present: { ben: 'içerim', sen: 'içersin', o: 'içer', biz: 'içeriz', siz: 'içersiniz', onlar: 'içerler' },
    past: { ben: 'içtim', sen: 'içtin', o: 'içti', biz: 'içtik', siz: 'içtiniz', onlar: 'içtiler' },
    future: { ben: 'içeceğim', sen: 'içeceksin', o: 'içecek', biz: 'içeceğiz', siz: 'içeceksiniz', onlar: 'içecekler' },
    examples: ['Çay içelim mi? — Выпьем чай?', 'Su içmek istiyorum — Хочу пить воду'],
    combos: ['çay içmek — пить чай', 'kahve içmek — пить кофе']
  },
  {
    id: 13, tr: 'konuşmak', ru: 'разговаривать',
    present: { ben: 'konuşurum', sen: 'konuşursun', o: 'konuşur', biz: 'konuşuruz', siz: 'konuşursunuz', onlar: 'konuşurlar' },
    past: { ben: 'konuştum', sen: 'konuştun', o: 'konuştu', biz: 'konuştuk', siz: 'konuştunuz', onlar: 'konuştular' },
    future: { ben: 'konuşacağım', sen: 'konuşacaksın', o: 'konuşacak', biz: 'konuşacağız', siz: 'konuşacaksınız', onlar: 'konuşacaklar' },
    examples: ['Konuşalım — Давай поговорим', 'Türkçe konuşuyorum — Я говорю по-турецки'],
    combos: ['telefonda konuşmak — говорить по телефону', 'yavaş konuşmak — говорить медленно']
  },
  {
    id: 14, tr: 'görmek', ru: 'видеть',
    present: { ben: 'görürüm', sen: 'görürsün', o: 'görür', biz: 'görürüz', siz: 'görürsünüz', onlar: 'görürler' },
    past: { ben: 'gördüm', sen: 'gördün', o: 'gördü', biz: 'gördük', siz: 'gördünüz', onlar: 'gördüler' },
    future: { ben: 'göreceğim', sen: 'göreceksin', o: 'görecek', biz: 'göreceğiz', siz: 'göreceksiniz', onlar: 'görecekler' },
    examples: ['Seni görmek güzel — Приятно тебя видеть', 'Görüşürüz — До встречи'],
    combos: ['rüya görmek — видеть сон', 'doktoru görmek — увидеть врача']
  },
  {
    id: 15, tr: 'beklemek', ru: 'ждать',
    present: { ben: 'beklerim', sen: 'beklersin', o: 'bekler', biz: 'bekleriz', siz: 'beklersiniz', onlar: 'beklerler' },
    past: { ben: 'bekledim', sen: 'bekledin', o: 'bekledi', biz: 'bekledik', siz: 'beklediniz', onlar: 'beklediler' },
    future: { ben: 'bekleyeceğim', sen: 'bekleyeceksin', o: 'bekleyecek', biz: 'bekleyeceğiz', siz: 'bekleyeceksiniz', onlar: 'bekleyecekler' },
    examples: ['Seni bekliyorum — Жду тебя', 'Bekle biraz — Подожди немного'],
    combos: ['sabırla beklemek — терпеливо ждать']
  },
  {
    id: 16, tr: 'düşünmek', ru: 'думать',
    present: { ben: 'düşünürüm', sen: 'düşünürsün', o: 'düşünür', biz: 'düşünürüz', siz: 'düşünürsünüz', onlar: 'düşünürler' },
    past: { ben: 'düşündüm', sen: 'düşündün', o: 'düşündü', biz: 'düşündük', siz: 'düşündünüz', onlar: 'düşündüler' },
    future: { ben: 'düşüneceğim', sen: 'düşüneceksin', o: 'düşünecek', biz: 'düşüneceğiz', siz: 'düşüneceksiniz', onlar: 'düşünecekler' },
    examples: ['Seni düşünüyorum — Думаю о тебе', 'Ne düşünüyorsun? — Что думаешь?'],
    combos: ['iyi düşünmek — хорошо подумать']
  },
  {
    id: 17, tr: 'anlamak', ru: 'понимать',
    present: { ben: 'anlarım', sen: 'anlarsın', o: 'anlar', biz: 'anlarız', siz: 'anlarsınız', onlar: 'anlarlar' },
    past: { ben: 'anladım', sen: 'anladın', o: 'anladı', biz: 'anladık', siz: 'anladınız', onlar: 'anladılar' },
    future: { ben: 'anlayacağım', sen: 'anlayacaksın', o: 'anlayacak', biz: 'anlayacağız', siz: 'anlayacaksınız', onlar: 'anlayacaklar' },
    examples: ['Anladım — Понял(а)', 'Anlamıyorum — Не понимаю'],
    combos: ['yanlış anlamak — неправильно понять']
  },
  {
    id: 18, tr: 'çalışmak', ru: 'работать, стараться',
    present: { ben: 'çalışırım', sen: 'çalışırsın', o: 'çalışır', biz: 'çalışırız', siz: 'çalışırsınız', onlar: 'çalışırlar' },
    past: { ben: 'çalıştım', sen: 'çalıştın', o: 'çalıştı', biz: 'çalıştık', siz: 'çalıştınız', onlar: 'çalıştılar' },
    future: { ben: 'çalışacağım', sen: 'çalışacaksın', o: 'çalışacak', biz: 'çalışacağız', siz: 'çalışacaksınız', onlar: 'çalışacaklar' },
    examples: ['Çalışıyorum — Я работаю', 'Çok çalışıyor — Он много работает'],
    combos: ['uzaktan çalışmak — работать удалённо']
  },
  {
    id: 19, tr: 'öğrenmek', ru: 'учить, изучать',
    present: { ben: 'öğrenirim', sen: 'öğrenirsin', o: 'öğrenir', biz: 'öğreniriz', siz: 'öğrenirsiniz', onlar: 'öğrenirler' },
    past: { ben: 'öğrendim', sen: 'öğrendin', o: 'öğrendi', biz: 'öğrendik', siz: 'öğrendiniz', onlar: 'öğrendiler' },
    future: { ben: 'öğreneceğim', sen: 'öğreneceksin', o: 'öğrenecek', biz: 'öğreneceğiz', siz: 'öğreneceksiniz', onlar: 'öğrenecekler' },
    examples: ['Türkçe öğreniyorum — Учу турецкий', 'Yeni kelimeler öğrendim — Выучила новые слова'],
    combos: ['dil öğrenmek — учить язык']
  },
  {
    id: 20, tr: 'bakmak', ru: 'смотреть, ухаживать',
    present: { ben: 'bakarım', sen: 'bakarsın', o: 'bakar', biz: 'bakarız', siz: 'bakarsınız', onlar: 'bakarlar' },
    past: { ben: 'baktım', sen: 'baktın', o: 'baktı', biz: 'baktık', siz: 'baktınız', onlar: 'baktılar' },
    future: { ben: 'bakacağım', sen: 'bakacaksın', o: 'bakacak', biz: 'bakacağız', siz: 'bakacaksınız', onlar: 'bakacaklar' },
    examples: ['Bana bak — Посмотри на меня', 'Kendine iyi bak — Береги себя'],
    combos: ['çocuğa bakmak — ухаживать за ребёнком', 'pencereden bakmak — смотреть из окна']
  },
];

const GRAMMAR_LESSONS = [
  {
    id: 1, title: 'Алфавит и произношение', emoji: '🔤', level: 'A1',
    desc: 'Турецкий алфавит, особые буквы, правила чтения',
    content: `<h3>Турецкий алфавит — 29 букв</h3>
<p>Турецкий использует латиницу с дополнительными буквами. Читается почти как пишется!</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ç ç</span><span class="g-sound">ч</span><span class="g-example">çay — чай</span></div>
<div class="grammar-row"><span class="g-letter">Ş ş</span><span class="g-sound">ш</span><span class="g-example">aşk — любовь</span></div>
<div class="grammar-row"><span class="g-letter">Ğ ğ</span><span class="g-sound">удлиняет гласную</span><span class="g-example">dağ — гора</span></div>
<div class="grammar-row"><span class="g-letter">I ı</span><span class="g-sound">ы</span><span class="g-example">kız — девушка</span></div>
<div class="grammar-row"><span class="g-letter">İ i</span><span class="g-sound">и</span><span class="g-example">bir — один</span></div>
<div class="grammar-row"><span class="g-letter">Ö ö</span><span class="g-sound">ё (как в нём.)</span><span class="g-example">göz — глаз</span></div>
<div class="grammar-row"><span class="g-letter">Ü ü</span><span class="g-sound">ю (как в нём.)</span><span class="g-example">gül — роза</span></div>
</div>
<p class="grammar-tip">💡 Главное правило: в турецком каждая буква = один звук. Нет немых букв!</p>`,
  },
  {
    id: 2, title: 'Гармония гласных', emoji: '🎵', level: 'A1',
    desc: 'Главное правило турецкой грамматики',
    content: `<h3>Гармония гласных</h3>
<p>Это <strong>самое важное</strong> правило в турецком! Суффиксы меняются в зависимости от последней гласной в слове.</p>
<div class="grammar-box">
<p><strong>Твёрдые гласные:</strong> a, ı, o, u</p>
<p><strong>Мягкие гласные:</strong> e, i, ö, ü</p>
</div>
<p>Если последняя гласная твёрдая → суффикс тоже твёрдый.<br>Если мягкая → суффикс мягкий.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">ev + de</span><span class="g-sound">=</span><span class="g-example">evde (дома) ✅</span></div>
<div class="grammar-row"><span class="g-letter">okul + da</span><span class="g-sound">=</span><span class="g-example">okulda (в школе) ✅</span></div>
</div>
<p class="grammar-tip">💡 Не заучивай правила наизусть — со временем ухо само подскажет!</p>`,
  },
  {
    id: 3, title: 'Местоимения', emoji: '👤', level: 'A1',
    desc: 'Я, ты, он/она, мы, вы, они',
    content: `<h3>Личные местоимения</h3>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ben</span><span class="g-sound">Я</span><span class="g-example">Ben Ksenia'yım — Я Ксения</span></div>
<div class="grammar-row"><span class="g-letter">Sen</span><span class="g-sound">Ты</span><span class="g-example">Sen güzelsin — Ты красивая</span></div>
<div class="grammar-row"><span class="g-letter">O</span><span class="g-sound">Он/Она/Оно</span><span class="g-example">O Türk — Он турок</span></div>
<div class="grammar-row"><span class="g-letter">Biz</span><span class="g-sound">Мы</span><span class="g-example">Biz mutluyuz — Мы счастливы</span></div>
<div class="grammar-row"><span class="g-letter">Siz</span><span class="g-sound">Вы (вежл.)</span><span class="g-example">Siz nasılsınız? — Как вы?</span></div>
<div class="grammar-row"><span class="g-letter">Onlar</span><span class="g-sound">Они</span><span class="g-example">Onlar geldiler — Они пришли</span></div>
</div>
<p class="grammar-tip">💡 В турецком нет «он» и «она» — «o» для всех. Пол понятен из контекста!</p>
<p class="grammar-tip">💡 К старшим и незнакомым обращайся на «siz» — это важно!</p>`,
  },
  {
    id: 4, title: 'Настоящее время', emoji: '⏰', level: 'A1',
    desc: 'Что я делаю прямо сейчас',
    content: `<h3>Настоящее продолженное время (-yor)</h3>
<p>Используется для действий, которые происходят <strong>прямо сейчас</strong>.</p>
<div class="grammar-box">
<p><strong>Формула:</strong> глагол + -(ı/i/u/ü)yor + личное окончание</p>
</div>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ben</span><span class="g-sound">geliyorum</span><span class="g-example">Я прихожу</span></div>
<div class="grammar-row"><span class="g-letter">Sen</span><span class="g-sound">geliyorsun</span><span class="g-example">Ты приходишь</span></div>
<div class="grammar-row"><span class="g-letter">O</span><span class="g-sound">geliyor</span><span class="g-example">Он/она приходит</span></div>
<div class="grammar-row"><span class="g-letter">Biz</span><span class="g-sound">geliyoruz</span><span class="g-example">Мы приходим</span></div>
<div class="grammar-row"><span class="g-letter">Siz</span><span class="g-sound">geliyorsunuz</span><span class="g-example">Вы приходите</span></div>
<div class="grammar-row"><span class="g-letter">Onlar</span><span class="g-sound">geliyorlar</span><span class="g-example">Они приходят</span></div>
</div>
<p class="grammar-tip">💡 Это время ты будешь слышать чаще всего! «Ne yapıyorsun?» — Что делаешь?</p>`,
  },
  {
    id: 5, title: 'Отрицание', emoji: '❌', level: 'A1',
    desc: 'Как сказать «нет» и «не»',
    content: `<h3>Отрицание в турецком</h3>
<p>Чтобы сказать «не делаю», добавь <strong>-m(ı/i/u/ü)yor</strong> вместо -(ı/i/u/ü)yor.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Anlıyorum</span><span class="g-sound">→</span><span class="g-example">Anlamıyorum (Не понимаю)</span></div>
<div class="grammar-row"><span class="g-letter">Biliyorum</span><span class="g-sound">→</span><span class="g-example">Bilmiyorum (Не знаю)</span></div>
<div class="grammar-row"><span class="g-letter">İstiyorum</span><span class="g-sound">→</span><span class="g-example">İstemiyorum (Не хочу)</span></div>
<div class="grammar-row"><span class="g-letter">Seviyorum</span><span class="g-sound">→</span><span class="g-example">Sevmiyorum (Не люблю)</span></div>
</div>
<div class="grammar-box">
<p><strong>Полезные слова:</strong></p>
<p>Hayır — Нет</p>
<p>Değil — Не (для существительных): Türk değilim — Я не турчанка</p>
<p>Yok — Нет (не существует): Para yok — Денег нет</p>
</div>
<p class="grammar-tip">💡 «Anlamıyorum» — запомни это первым! Самая нужная фраза для начинающих.</p>`,
  },
  {
    id: 6, title: 'Прошедшее время', emoji: '⏪', level: 'A2',
    desc: 'Рассказать о том, что было',
    content: `<h3>Прошедшее время (-dı/-di/-du/-dü)</h3>
<p>Чтобы рассказать о вчерашнем дне, добавь к глаголу <strong>-dı</strong> и личное окончание.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ben</span><span class="g-sound">geldim</span><span class="g-example">Я пришёл/пришла</span></div>
<div class="grammar-row"><span class="g-letter">Sen</span><span class="g-sound">geldin</span><span class="g-example">Ты пришёл</span></div>
<div class="grammar-row"><span class="g-letter">O</span><span class="g-sound">geldi</span><span class="g-example">Он/она пришёл</span></div>
<div class="grammar-row"><span class="g-letter">Biz</span><span class="g-sound">geldik</span><span class="g-example">Мы пришли</span></div>
</div>
<p class="grammar-box">После глухих согласных (p,ç,t,k,s,ş,h,f) → -tı: «gittim» (я пошёл), «içtim» (я выпил).</p>
<p class="grammar-tip">💡 «Çok güzel olmuş» — «получилось очень вкусно». Скажи это его маме после еды!</p>`,
  },
  {
    id: 7, title: 'Падеж направления (-e/-a)', emoji: '➡️', level: 'A2',
    desc: 'Куда? К кому?',
    content: `<h3>Куда идём? (-e / -a)</h3>
<p>Чтобы сказать «куда», добавь к слову <strong>-e</strong> (после мягких) или <strong>-a</strong> (после твёрдых).</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">ev → eve</span><span class="g-sound">домой</span><span class="g-example">Eve gidiyorum</span></div>
<div class="grammar-row"><span class="g-letter">okul → okula</span><span class="g-sound">в школу</span><span class="g-example">Okula gidiyorum</span></div>
<div class="grammar-row"><span class="g-letter">İstanbul → İstanbul'a</span><span class="g-sound">в Стамбул</span><span class="g-example">İstanbul'a gidelim</span></div>
</div>
<p class="grammar-tip">💡 «Annene gidelim» — поедем к твоей маме. Падеж направления нужен постоянно!</p>`,
  },
  {
    id: 8, title: 'Падеж места (-de/-da)', emoji: '📍', level: 'A2',
    desc: 'Где? У кого?',
    content: `<h3>Где находимся? (-de / -da)</h3>
<p>Чтобы сказать «где», добавь <strong>-de</strong> или <strong>-da</strong>.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">ev → evde</span><span class="g-sound">дома</span><span class="g-example">Evdeyim — Я дома</span></div>
<div class="grammar-row"><span class="g-letter">iş → işte</span><span class="g-sound">на работе</span><span class="g-example">İşteyim — Я на работе</span></div>
<div class="grammar-row"><span class="g-letter">kafe → kafede</span><span class="g-sound">в кафе</span><span class="g-example">Kafedeyim</span></div>
</div>
<p class="grammar-box">После глухих согласных → -te/-ta: «işte» (на работе).</p>
<p class="grammar-tip">💡 «Neredesin?» — «Где ты?». Ответ: «Evdeyim» — «Я дома».</p>`,
  },
  {
    id: 9, title: 'Принадлежность', emoji: '🫶', level: 'A2',
    desc: 'Мой, твой, его',
    content: `<h3>Чьё это? (-im / -in / -i)</h3>
<p>Принадлежность выражается окончанием на самом предмете.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">anne → annem</span><span class="g-sound">моя мама</span><span class="g-example">Annem geldi</span></div>
<div class="grammar-row"><span class="g-letter">eş → eşim</span><span class="g-sound">мой супруг</span><span class="g-example">Eşim çalışıyor</span></div>
<div class="grammar-row"><span class="g-letter">ev → evin</span><span class="g-sound">твой дом</span><span class="g-example">Evin güzel</span></div>
</div>
<p class="grammar-tip">💡 «Aşkım», «canım», «hayatım» — это всё «-im»: любовь МОЯ, душа МОЯ. Ты уже знаешь принадлежность!</p>`,
  },
  {
    id: 10, title: 'Глагол «быть» (olmak)', emoji: '🪞', level: 'A1',
    desc: 'Я есть, ты есть — окончания сказуемости',
    content: `<h3>«Быть» в настоящем времени</h3>
<p>В турецком нет отдельного слова «я есть». Вместо него к слову добавляется <strong>личное окончание</strong>.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ben</span><span class="g-sound">-im / -ım</span><span class="g-example">Mutluyum — Я счастлива</span></div>
<div class="grammar-row"><span class="g-letter">Sen</span><span class="g-sound">-sin / -sın</span><span class="g-example">Güzelsin — Ты красивая</span></div>
<div class="grammar-row"><span class="g-letter">O</span><span class="g-sound">(нет)</span><span class="g-example">O Türk — Он турок</span></div>
<div class="grammar-row"><span class="g-letter">Biz</span><span class="g-sound">-iz / -ız</span><span class="g-example">Hazırız — Мы готовы</span></div>
</div>
<p class="grammar-box">«Я учитель» → Öğretmenim. «Ты дома?» → Evde misin?</p>
<p class="grammar-tip">💡 «Nasılsın?» = «как ты есть?» — буквально nasıl + sın. Ты уже это говоришь!</p>`,
  },
  {
    id: 11, title: 'Вопросительные слова', emoji: '❓', level: 'A1',
    desc: 'Ne, kim, nerede, nasıl, kaç',
    content: `<h3>Главные вопросительные слова</h3>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">Ne?</span><span class="g-sound">Что?</span><span class="g-example">Ne yapıyorsun? — Что делаешь?</span></div>
<div class="grammar-row"><span class="g-letter">Kim?</span><span class="g-sound">Кто?</span><span class="g-example">Bu kim? — Кто это?</span></div>
<div class="grammar-row"><span class="g-letter">Nerede?</span><span class="g-sound">Где?</span><span class="g-example">Neredesin? — Где ты?</span></div>
<div class="grammar-row"><span class="g-letter">Nasıl?</span><span class="g-sound">Как?</span><span class="g-example">Nasılsın? — Как ты?</span></div>
<div class="grammar-row"><span class="g-letter">Kaç?</span><span class="g-sound">Сколько?</span><span class="g-example">Kaç yaşındasın? — Сколько тебе лет?</span></div>
<div class="grammar-row"><span class="g-letter">Ne zaman?</span><span class="g-sound">Когда?</span><span class="g-example">Ne zaman geliyorsun? — Когда придёшь?</span></div>
</div>
<p class="grammar-tip">💡 «Nereli​sin?» — «откуда ты?». Эти слова откроют любой разговор.</p>`,
  },
  {
    id: 12, title: 'Geniş Zaman (-ir/-er/-ar)', emoji: '🔁', level: 'A1',
    desc: 'Настоящее обычное — то, что делаешь всегда',
    content: `<h3>Geniş Zaman — настоящее обычное время</h3>
<p>Описывает привычки и регулярные действия («обычно», «каждый день»). Основа глагола + <strong>-ir / -er / -ar / -ur</strong>.</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">içmek → içerim</span><span class="g-sound">пью (обычно)</span><span class="g-example">Her gün çay içerim</span></div>
<div class="grammar-row"><span class="g-letter">yaşamak → yaşar</span><span class="g-sound">живёт</span><span class="g-example">O İstanbul'da yaşar</span></div>
<div class="grammar-row"><span class="g-letter">sevmek → severim</span><span class="g-sound">люблю</span><span class="g-example">Seni çok severim</span></div>
</div>
<p class="grammar-box">Сравни: «içiyorum» = пью прямо сейчас. «içerim» = пью обычно, каждый день.</p>
<p class="grammar-tip">💡 «Ne yaparsın?» — «чем занимаешься (по жизни)?». Частый вопрос при знакомстве.</p>`,
  },
  {
    id: 13, title: 'Исходный падеж (-den/-dan)', emoji: '⬅️', level: 'A1',
    desc: 'Откуда? От кого?',
    content: `<h3>Откуда? (-den / -dan)</h3>
<p>Чтобы сказать «откуда» или «от», добавь <strong>-den</strong> (после мягких) или <strong>-dan</strong> (после твёрдых).</p>
<div class="grammar-table">
<div class="grammar-row"><span class="g-letter">ev → evden</span><span class="g-sound">из дома</span><span class="g-example">Evden çıkıyorum — Выхожу из дома</span></div>
<div class="grammar-row"><span class="g-letter">Rusya → Rusya'dan</span><span class="g-sound">из России</span><span class="g-example">Rusya'danım — Я из России</span></div>
<div class="grammar-row"><span class="g-letter">iş → işten</span><span class="g-sound">с работы</span><span class="g-example">İşten geldim — Пришёл с работы</span></div>
</div>
<p class="grammar-box">После глухих согласных → -ten/-tan: «işten» (с работы).</p>
<p class="grammar-tip">💡 Тройка падежей: -e (куда) · -de (где) · -den (откуда). Запомни их вместе!</p>`,
  },
];

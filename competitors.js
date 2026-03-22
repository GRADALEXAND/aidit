(function(){
  var SKIP = ['yandex','avito','2gis','wikipedia','vk.com','dzen','tutu','rzd',
    'google','ok.ru','blablacar','youtube','instagram','tripadvisor','zoon',
    'flamp','otzovik','irecommend','gosuslugi','nalog','consultant'];
  var KEY = 'seo_comp_bm';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {domains:{},meta:{}}; }
    catch(e) { return {domains:{},meta:{}}; }
  }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  var store = load();
  if (!store.domains) store.domains = {};
  if (!store.meta)    store.meta    = {};

  // Запрос из URL Яндекса
  var q = decodeURIComponent(
    (location.search.match(/text=([^&]*)/) || ['','неизвестный запрос'])[1]
  );

  // Номер страницы → смещение позиций
  var pageParam  = parseInt((location.search.match(/[?&]p=(\d+)/) || ['','0'])[1]);
  var pageOffset = Math.floor(pageParam / 10) * 10;

  // Собираем результаты выдачи
  var items = Array.from(document.querySelectorAll(
    '.serp-item,.organic,.Organic,.search-result'
  ));
  var found = 0;

  items.forEach(function(item, idx) {
    var links = Array.from(item.querySelectorAll('a[href^="http"]'));
    var link  = links.find(function(a) { return !a.href.includes('yandex'); });
    if (!link) return;

    try {
      var domain = new URL(link.href).hostname.replace(/^www\./, '');
      if (SKIP.some(function(s) { return domain.includes(s); })) return;

      var position = pageOffset + (idx + 1);

      if (!store.domains[domain]) {
        store.domains[domain] = {
          totalScore:  0,
          appearances: 0,
          positions:   {},
          firstSeen:   new Date().toISOString().slice(0, 10)
        };
      }

      var d = store.domains[domain];
      if (!d.positions[q]) d.positions[q] = [];

      if (!d.positions[q].includes(position)) {
        d.positions[q].push(position);
        d.appearances++;
        d.totalScore += Math.max(0.1, 10 - (position - 1) * 0.9);
      }
      found++;
    } catch(e) {}
  });

  store.meta.lastUpdated   = new Date().toISOString().slice(0, 10);
  store.meta.totalQueries  = (store.meta.totalQueries || 0) + (found > 0 ? 1 : 0);
  save(store);

  var total = Object.keys(store.domains).length;
  alert(
    '✅ Запрос: "' + q + '"\n' +
    'Страница: ' + (Math.floor(pageOffset/10)+1) +
    ' (позиции ' + (pageOffset+1) + '-' + (pageOffset+10) + ')\n' +
    'Найдено: ' + found + '\n' +
    'Всего доменов накоплено: ' + total
  );
})();

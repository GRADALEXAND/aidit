(function(){
  var KEY = 'seo_comp_bm';
  var data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch(e) { data = {}; }

  var domains = data.domains || {};
  if (!Object.keys(domains).length) {
    alert('Данных нет. Сначала собери конкурентов.');
    return;
  }

  // Сортируем по взвешенному score
  var sorted = Object.entries(domains).sort(function(a,b) {
    return b[1].totalScore - a[1].totalScore;
  });

  // Считаем метрики
  var enriched = sorted.map(function(entry) {
    var domain = entry[0];
    var d      = entry[1];
    var allPos = [];
    Object.values(d.positions).forEach(function(arr) {
      arr.forEach(function(p) { allPos.push(p); });
    });
    var avgPos  = allPos.length ? (allPos.reduce(function(a,b){return a+b;},0)/allPos.length).toFixed(1) : '-';
    var bestPos = allPos.length ? Math.min.apply(null, allPos) : '-';
    return {
      domain:      domain,
      score:       Math.round(d.totalScore * 10) / 10,
      appearances: d.appearances,
      queryCount:  Object.keys(d.positions).length,
      avgPos:      avgPos,
      bestPos:     bestPos,
      positions:   d.positions,
      firstSeen:   d.firstSeen || ''
    };
  });

  // Вывод в консоль
  console.log('%c══════ КОНКУРЕНТЫ ══════', 'font-weight:bold;font-size:14px;color:#7c3aed');
  console.table(enriched.map(function(r) {
    return {
      домен:              r.domain,
      score:              r.score,
      запросов_в_топе:    r.queryCount,
      попаданий:          r.appearances,
      средняя_позиция:    r.avgPos,
      лучшая_позиция:     r.bestPos
    };
  }));

  // Текст для бота
  var lines = [
    '=== КОНКУРЕНТЫ ПО ЗАПРОСАМ — ПОЛНЫЙ СПИСОК ===',
    'Дата: ' + new Date().toLocaleDateString('ru'),
    'Всего доменов: ' + enriched.length,
    'Метрика score: позиция 1 = 10 очков, позиция 10 = 1 очко',
    '',
    '------'
  ];

  enriched.forEach(function(r, i) {
    lines.push((i+1) + '. ' + r.domain);
    lines.push('   Score: ' + r.score + ' | Запросов: ' + r.queryCount +
      ' | Попаданий: ' + r.appearances +
      ' | Ср.поз: ' + r.avgPos +
      ' | Лучш.поз: ' + r.bestPos);
    Object.entries(r.positions).forEach(function(e) {
      lines.push('   "' + e[0] + '" → позиции: ' + e[1].join(', '));
    });
  });

  lines.push('');
  lines.push('=== ЗАДАЧА ДЛЯ ИИ ===');
  lines.push('Раздели на категории:');
  lines.push('- Прямые конкуренты');
  lines.push('- Агрегаторы');
  lines.push('- Медиа/блоги');
  lines.push('- Нерелевантные');
  lines.push('Из прямых конкурентов выдели топ-10 по силе.');

  var claudeText = lines.join('\n');

  // Панель с кнопками
  var old = document.getElementById('comp-report-panel');
  if (old) old.remove();

  var panel = document.createElement('div');
  panel.id = 'comp-report-panel';
  panel.style.cssText = [
    'position:fixed','bottom:20px','right:20px','z-index:999999',
    'background:#fff','border-radius:12px',
    'box-shadow:0 4px 28px rgba(0,0,0,.2)',
    'font-family:system-ui,sans-serif','width:320px','overflow:hidden'
  ].join(';');

  panel.innerHTML = [
    '<div style="background:#1e1b4b;color:#e0e7ff;padding:11px 15px;display:flex;justify-content:space-between;align-items:center;">',
      '<div>',
        '<div style="font-weight:700;font-size:13px;">📊 Конкуренты</div>',
        '<div style="font-size:10px;opacity:.6;">' + enriched.length + ' доменов собрано</div>',
      '</div>',
      '<span id="crp-close" style="cursor:pointer;font-size:16px;opacity:.7;">✕</span>',
    '</div>',

    '<div style="padding:10px 14px;border-bottom:1px solid #f3f4f6;">',
      '<div style="font-size:10px;font-weight:600;color:#9ca3af;margin-bottom:6px;">ТОП-5 ПО SCORE</div>',
      enriched.slice(0,5).map(function(r,i) {
        return '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;">' +
          '<span>' + (i+1) + '. <b>' + r.domain + '</b></span>' +
          '<span style="color:#534AB7;">score <b>' + r.score + '</b> · поз <b>' + r.bestPos + '</b></span>' +
          '</div>';
      }).join(''),
    '</div>',

    '<div style="padding:10px 14px;display:flex;flex-direction:column;gap:6px;">',
      '<button id="crp-copy" style="padding:9px;background:#1e1b4b;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">',
        '🤖 Скопировать всё для бота (' + enriched.length + ' доменов)',
      '</button>',
      '<button id="crp-csv" style="padding:8px;background:#f5f3ff;color:#534AB7;border:1px solid #CECBF6;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;">',
        '📥 Скачать CSV',
      '</button>',
      '<button id="crp-clear" style="padding:6px;background:#fff;color:#9ca3af;border:1px solid #e5e7eb;border-radius:8px;font-size:11px;cursor:pointer;">',
        '🗑 Очистить данные',
      '</button>',
    '</div>'
  ].join('');

  document.body.appendChild(panel);

  document.getElementById('crp-close').onclick = function() { panel.remove(); };

  document.getElementById('crp-copy').onclick = function() {
    var btn = this;
    navigator.clipboard.writeText(claudeText).then(function() {
      btn.textContent = '✅ Скопировано! Скинь боту в Telegram.';
      setTimeout(function() {
        btn.textContent = '🤖 Скопировать всё для бота (' + enriched.length + ' доменов)';
      }, 3000);
    }).catch(function() {
      console.log(claudeText);
      btn.textContent = '⚠️ Смотри консоль F12';
    });
  };

  document.getElementById('crp-csv').onclick = function() {
    var rows = [['домен','score','запросов','попаданий','ср.поз','лучш.поз','запросы']];
    enriched.forEach(function(r) {
      var posStr = Object.entries(r.positions).map(function(e) {
        return '"' + e[0] + '":' + e[1].join(',');
      }).join(' | ');
      rows.push([r.domain, r.score, r.queryCount, r.appearances, r.avgPos, r.bestPos, '"'+posStr+'"']);
    });
    var csv = '\uFEFF' + rows.map(function(r){return r.join(';');}).join('\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    a.download = 'competitors_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
  };

  document.getElementById('crp-clear').onclick = function() {
    if (confirm('Очистить все данные? (' + enriched.length + ' доменов)')) {
      localStorage.removeItem(KEY);
      panel.remove();
      alert('✅ Данные очищены.');
    }
  };
})();

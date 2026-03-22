/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              MEGA AUDIT v2 — ПОЛНЫЙ АУДИТ СТРАНИЦЫ              ║
 * ║   UX Design Audit v8 + GEO Content Audit + SEO On-Page Checker  ║
 * ║                   + Deep Content Audit                          ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  ЗАПУСК: вставить в консоль браузера → Enter                    ║
 * ║  ФЛАГИ (до запуска): window.UX_PANEL = true                     ║
 * ║                                                                  ║
 * ║  ПОСЛЕ ЗАПУСКА — кнопка в углу страницы «📋 Скопировать аудит» ║
 * ║                                                                  ║
 * ║  КОМАНДЫ (опционально, всё уже встроено):                        ║
 * ║    uxAudit.copy()   — скопировать полный аудит в буфер          ║
 * ║    uxAudit.forAI()  — скопировать UX-данные для ИИ              ║
 * ║    uxAudit.panel()  — боковая панель UX на странице              ║
 * ║    uxAudit.json()   — сырые данные в консоль                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ВОРДСТАТ: отредактируй блок WORDSTAT_KEYWORDS ниже перед запуском
 */

// ════════════════════════════════════════════════════════════════════
// ⬇️  ВСТАВЬ СВОИ ЗАПРОСЫ ИЗ ВОРДСТАТА (слово TAB частота, по одному на строку)
// ════════════════════════════════════════════════════════════════════
const WORDSTAT_KEYWORDS = `
автоматизация пассажирских перевозок	74
автоматизация управления пассажирскими перевозками	46
билетные системы для продажи билетов	11
виджет билет	216
виджет продажи билетов	37
система автоматизированной продажи билетов	44
система продажи билетов	732
система продажи билетов беларусь	15
система продажи билетов на автобусы	187
система продажи билетов на автобусы беларусь	11
система продажи билетов на мероприятия	20
система продажи электронных билетов	10
`;
// ════════════════════════════════════════════════════════════════════

(function MEGA_AUDIT_V1() {
'use strict';

// Хранилище для всех данных аудитов
const AUDIT_STORE = {
  ux: null,
  geo: null,
  seo: null,
  content: null,
  meta: {
    url: location.href,
    hostname: location.hostname,
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString('ru-RU'),
  }
};

// ════════════════════════════════════════════════════════════════════
// ЧАСТЬ 1: UX DESIGN AUDIT v8
// ════════════════════════════════════════════════════════════════════
(function UX_AUDIT_V8() {

  ['ux8-panel','ux8-tip'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.remove();
  });
  document.querySelectorAll('[data-ux8]').forEach(function(el){
    el.removeAttribute('data-ux8');
    el.style.outline = '';
    el.style.outlineOffset = '';
  });

  var VW = window.innerWidth, VH = window.innerHeight;
  var isMob = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
  var MODE = (VW <= 768 || (isMob && VW <= 1024)) ? 'mobile' : VW <= 1024 ? 'tablet' : 'desktop';
  var MRU = {mobile:'Мобильный', tablet:'Планшет', desktop:'Десктоп'}[MODE];
  var NORM = {
    mobile:  {fontMin:16, lhMin:1.4, lhMax:1.8, ctaH:44, touch:44},
    tablet:  {fontMin:15, lhMin:1.4, lhMax:1.8, ctaH:44, touch:44},
    desktop: {fontMin:14, lhMin:1.3, lhMax:1.9, ctaH:36, touch:32}
  }[MODE];

  var SEV_COLOR = {crit:'#ef4444', warn:'#f59e0b', info:'#3b82f6', signal:'#8b5cf6'};

  function isReallyVisible(el) {
    if (!el || el === document.documentElement) return false;
    if (el.closest && (el.closest('#ux8-panel') || el.closest('#ux8-tip') || el.closest('#mega-audit-panel'))) return false;
    var rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    var s = window.getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) < 0.1) return false;
    var p = el.parentElement;
    while (p && p !== document.documentElement) {
      var ps = window.getComputedStyle(p);
      if (ps.display === 'none' || ps.visibility === 'hidden') return false;
      if (parseFloat(ps.opacity) < 0.1) return false;
      if (parseFloat(ps.height) < 2 && ps.overflow === 'hidden') return false;
      p = p.parentElement;
    }
    var slide = el.closest && el.closest('[class*="slide"],[class*="swiper-slide"],[class*="slick-slide"]');
    if (slide && (window.getComputedStyle(slide).display === 'none' || slide.getAttribute('aria-hidden') === 'true')) return false;
    return true;
  }

  function isAboveFold(el) {
    var r = el.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return (r.top + scrollTop) < VH && (r.bottom + scrollTop) > 0;
  }

  function elText(el) {
    return (el ? (el.textContent || '').trim().replace(/\s+/g,' ') : '');
  }

  function elLabel(el) {
    if (!el || el === document.body) return 'body';
    var tag = (el.tagName||'').toLowerCase();
    if (tag === 'img') {
      var alt = el.getAttribute('alt');
      return alt ? 'img[alt="'+alt.slice(0,35)+'"]' : 'img["'+( el.src||'').split('/').pop().slice(0,25)+'"]';
    }
    if (el.id && el.id.length < 25 && !/^\d/.test(el.id)) return tag+'#'+el.id;
    var aria = el.getAttribute('aria-label');
    if (aria) return tag+'[aria-label="'+aria.slice(0,30)+'"]';
    var t = elText(el).slice(0,40);
    if (t) return tag+'("'+t+'")';
    var cls = (el.className||'').toString().split(' ').filter(function(c){ return c && c.length<20 && !/^\d/.test(c); }).slice(0,2).join('.');
    return cls ? tag+'.'+cls : tag;
  }

  function colorToHex(c) {
    try {
      var cv = document.createElement('canvas'); cv.width = cv.height = 1;
      var ctx = cv.getContext('2d'); ctx.fillStyle = c; ctx.fillRect(0,0,1,1);
      var d = ctx.getImageData(0,0,1,1).data;
      return '#'+[d[0],d[1],d[2]].map(function(v){ return v.toString(16).padStart(2,'0'); }).join('');
    } catch(e) { return '#808080'; }
  }

  function colorSaturation(c) {
    try {
      var cv = document.createElement('canvas'); cv.width = cv.height = 1;
      var ctx = cv.getContext('2d'); ctx.fillStyle = c; ctx.fillRect(0,0,1,1);
      var d = ctx.getImageData(0,0,1,1).data;
      return Math.max(d[0],d[1],d[2]) - Math.min(d[0],d[1],d[2]);
    } catch(e) { return 0; }
  }

  function getDomBg(el) {
    var cur = el.parentElement || el;
    var depth = 0;
    while (cur && cur !== document.documentElement && depth < 10) {
      var bg = window.getComputedStyle(cur).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      cur = cur.parentElement;
      depth++;
    }
    return 'rgb(255,255,255)';
  }

  var FINDINGS = [];
  var FID = 0;
  var MARKED = new Set();
  var FMAP = {};

  function addFinding(el, sev, cat, title, why, fix, metric) {
    if (el && el !== document.body) {
      var cur = el.parentElement;
      while (cur && cur !== document.documentElement) {
        if (MARKED.has(cur)) return null;
        cur = cur.parentElement;
      }
    }
    FID++;
    var num = String(FID).padStart(3,'0');
    var f = {id:'ux8_'+FID, num:num, sev:sev, cat:cat, title:title,
             why:why, fix:fix, metric:metric||null, el:el, label:elLabel(el)};
    FINDINGS.push(f);
    FMAP[f.id] = f;
    if (el && el !== document.body && el !== document.documentElement && el.style) {
      MARKED.add(el);
      el.dataset.ux8 = f.id;
      el.style.outline = sev==='crit' ? '3px solid '+SEV_COLOR.crit
                       : sev==='warn' ? '2px dashed '+SEV_COLOR.warn
                       : sev==='signal' ? '2px dashed '+SEV_COLOR.signal
                       : '1px dashed '+SEV_COLOR.info;
      el.style.outlineOffset = '2px';
    }
    return f;
  }

  function addGroup(els, sev, cat, title, why, fix, metric) {
    if (!els || !els.length) return;
    var valid = els.filter(function(el){ return el && !MARKED.has(el); });
    if (!valid.length) return;
    FID++;
    var num = String(FID).padStart(3,'0');
    var examples = valid.slice(0,3).map(elLabel);
    var exStr = examples.join(', ') + (valid.length > 3 ? ' +ещё '+(valid.length-3) : '');
    var f = {id:'ux8_'+FID, num:num, sev:sev, cat:cat,
             title:title+' ('+valid.length+' эл.)',
             why:why, fix:fix,
             metric:Object.assign({}, metric||{}, {примеры:exStr}),
             el:valid[0], label:exStr, isGroup:true, count:valid.length};
    FINDINGS.push(f);
    FMAP[f.id] = f;
    valid.forEach(function(el){
      MARKED.add(el);
      if (el.style) {
        el.dataset.ux8 = f.id;
        el.style.outline = sev==='crit'?'3px solid '+SEV_COLOR.crit:sev==='warn'?'2px dashed '+SEV_COLOR.warn:'2px dashed '+SEV_COLOR.signal;
        el.style.outlineOffset = '2px';
      }
    });
    return f;
  }

  var TIP = document.createElement('div');
  TIP.id = 'ux8-tip';
  Object.assign(TIP.style, {
    position:'fixed', zIndex:'2147483647',
    background:'#fff', borderRadius:'10px',
    padding:'12px 14px', maxWidth:'320px', minWidth:'220px',
    boxShadow:'0 6px 32px rgba(0,0,0,.2)',
    fontFamily:'system-ui,-apple-system,sans-serif',
    fontSize:'12px', lineHeight:'1.55',
    pointerEvents:'none', display:'none'
  });
  document.body.appendChild(TIP);

  document.addEventListener('mousemove', function(e){
    if (TIP.contains(e.target)) return;
    var el = e.target, found = null;
    for (var i=0; i<8; i++){
      if (!el || el===document.body) break;
      if (el.dataset && el.dataset.ux8){ found=el; break; }
      el = el.parentElement;
    }
    if (found && FMAP[found.dataset.ux8]){
      showTip(FMAP[found.dataset.ux8], e.clientX, e.clientY);
    } else {
      TIP.style.display='none';
    }
  }, true);

  function showTip(f, x, y){
    var SC = SEV_COLOR[f.sev]||SEV_COLOR.info;
    var BC = f.sev==='crit'?'#fef2f2':f.sev==='warn'?'#fffbeb':f.sev==='signal'?'#f5f3ff':'#eff6ff';
    var EM = f.sev==='crit'?'❌':f.sev==='warn'?'⚠️':f.sev==='signal'?'🔍':'ℹ️';
    var LV = f.sev==='crit'?'Критично':f.sev==='warn'?'Предупреждение':f.sev==='signal'?'Сигнал':'Инфо';
    TIP.style.border='1px solid '+SC;
    TIP.innerHTML=
      '<div style="background:'+BC+';margin:-12px -14px 10px;padding:8px 14px;border-radius:9px 9px 0 0;border-bottom:1px solid '+SC+'30;">'+
        '<span style="font-size:10px;font-weight:700;color:'+SC+';">'+EM+' '+LV+' · #'+f.num+'</span>'+
        '<div style="font-weight:700;font-size:12px;color:#111;margin-top:2px;">'+f.cat+'</div>'+
      '</div>'+
      '<div style="font-weight:600;font-size:12px;color:#111;margin-bottom:6px;">'+f.title+'</div>'+
      '<div style="color:#555;font-size:11px;margin-bottom:8px;"><b style="color:#374151;">Почему:</b> '+f.why+'</div>'+
      '<div style="background:#f0fdf4;border-radius:6px;padding:6px 9px;font-size:11px;color:#166534;"><b>✓ Исправить:</b> '+f.fix+'</div>'+
      (f.metric?'<div style="margin-top:6px;font-size:10px;color:#9ca3af;">'+Object.entries(f.metric).map(function(kv){return kv[0]+': '+kv[1];}).join(' · ')+'</div>':'')+
      '<div style="margin-top:5px;font-size:10px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:4px;">📍 '+f.label+'</div>';
    TIP.style.display='block';
    var w=TIP.offsetWidth||300, h=TIP.offsetHeight||200;
    var lx=x+16, ly=y+16;
    if(lx+w>VW-8) lx=x-w-10;
    if(ly+h>VH-8) ly=y-h-10;
    TIP.style.left=Math.max(4,lx)+'px';
    TIP.style.top=Math.max(4,ly)+'px';
  }

  var L1 = {};

  // 1.1 ПЕРВЫЙ ЭКРАН
  (function(){
    var foldEls = Array.from(document.querySelectorAll('*')).filter(function(el){
      return isReallyVisible(el) && isAboveFold(el);
    });
    var ctaRx = /заказ|купи|записа|получи|заявк|позвони|рассчита|начать|попробо|скачать|старт|start|get|buy|sign/i;

    var h1 = foldEls.find(function(el){ return el.tagName==='H1'; });
    L1.h1OnFold = !!h1;
    L1.h1Text = h1 ? elText(h1).slice(0,80) : '';

    if (!h1){
      addFinding(document.querySelector('h1')||document.body,'crit','Первый экран',
        'H1 не виден без скролла',
        'Решение "остаться или уйти" принимается за 0–3 сек. F-паттерн: взгляд идёт в верхний левый — там ожидается главный заголовок.',
        'Переместить H1 выше линии fold. Виден без скролла на всех устройствах.',null);
    } else if (elText(h1).length < 12){
      addFinding(h1,'warn','Первый экран',
        'H1 слишком короткий — не раскрывает ценность',
        '"'+L1.h1Text.slice(0,40)+'" — не объясняет ЧТО предлагается и КОМУ.',
        'H1 должен отвечать: что + кому + ключевая выгода. Минимум 20 символов.',
        {длина: elText(h1).length+' симв.'});
    }

    var desc = foldEls.find(function(el){
      return (el.tagName==='P'||el.tagName==='H2') && elText(el).length>25;
    });
    L1.hasDesc = !!desc;
    L1.descText = desc ? elText(desc).slice(0,100) : '';
    if (h1 && !desc){
      addFinding(h1,'warn','Первый экран',
        'H1 без подзаголовка — нет ценностного предложения',
        '"'+L1.h1Text.slice(0,40)+'" — без пояснения пользователь не понимает выгоду.',
        'Добавить подзаголовок под H1 (1–2 предложения): что + кому + выгода.',null);
    }

    var ctas = foldEls.filter(function(el){
      return (el.tagName==='BUTTON'||el.getAttribute('role')==='button'||(el.tagName==='A'&&el.href))
        && ctaRx.test(elText(el));
    });
    L1.ctaOnFoldCount = ctas.length;
    L1.ctaOnFoldTexts = ctas.map(function(el){ return elText(el).slice(0,30); });

    if (!ctas.length){
      addFinding(document.body,'crit','Первый экран',
        'Нет CTA на первом экране',
        'Мотивация к действию максимальна в первые секунды. Без кнопки конверсия падает на 30–50%.',
        'Добавить одну главную кнопку с глаголом. Один экран = одно действие.',null);
    } else if (ctas.length>2){
      addFinding(ctas[0],'warn','Первый экран',
        ctas.length+' CTA на первом экране — паралич выбора',
        'Закон Хика: время решения растёт логарифмически с числом вариантов.',
        'Оставить 1 первичный CTA. Остальные — outline или текстовые ссылки.',
        {CTA_на_экране: ctas.length});
    }

    var trustQ = '[class*="review"],[class*="rating"],[class*="trust"],[class*="logo"],[class*="partner"],[class*="client"],[class*="award"]';
    L1.hasTrust = foldEls.some(function(el){ return el.matches&&el.matches(trustQ); });
    if (!L1.hasTrust){
      addFinding(document.body,'info','Первый экран',
        'Нет сигналов доверия на первом экране',
        '90% оценивают доверие в первые 3 сек. Рейтинги, лого, счётчики снижают барьер.',
        'Разместить рядом с CTA: звёзды/рейтинг, лого клиентов или "X000+ клиентов".',null);
    }
  })();

  // 1.2 ТИПОГРАФИКА
  (function(){
    var bcs = window.getComputedStyle(document.body);
    var bfs = parseFloat(bcs.fontSize);
    var blhRaw = bcs.lineHeight;
    var blh = blhRaw==='normal'?1.5:parseFloat(blhRaw)/bfs;
    L1.bodyFont = bfs;
    L1.bodyLH = +blh.toFixed(2);

    if (bfs < NORM.fontMin){
      addFinding(document.body,'crit','Типографика',
        'Шрифт body: '+bfs+'px — ниже нормы '+NORM.fontMin+'px',
        MODE==='mobile'?'iOS зумирует страницу при focus на input если font-size < 16px. Пользователь теряет контекст → уходит.':'Шрифт <14px увеличивает когнитивную нагрузку.',
        'font-size: '+NORM.fontMin+'px на body.',{текущий:bfs+'px',норма:NORM.fontMin+'px'});
    }
    if (blh < NORM.lhMin){
      addFinding(document.body,'crit','Типографика',
        'line-height: '+blh.toFixed(2)+' — строки сливаются',
        'Глаз перепрыгивает на соседнюю строку. Скорость чтения падает на 20–30%.',
        'line-height: 1.5–1.6 на body.',{текущий:blh.toFixed(2),норма:NORM.lhMin});
    } else if (blh > NORM.lhMax){
      addFinding(document.body,'warn','Типографика',
        'line-height: '+blh.toFixed(2)+' — слишком разреженно',
        'Избыточный интервал разрывает связность текста.',
        'line-height: 1.5–1.7.',{текущий:blh.toFixed(2)});
    }

    var families = {};
    var familyEls = Array.from(document.querySelectorAll('h1,h2,h3,p,button,a,li'))
      .filter(function(el){ return isReallyVisible(el); }).slice(0,80);
    familyEls.forEach(function(el){
      var ff = window.getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/['"]/g,'');
      var tag = el.tagName.toLowerCase();
      var role = /h[1-4]/i.test(tag)?'заголовок':/button|a/.test(tag)?'кнопка/ссылка':'текст';
      if (!families[ff]) families[ff] = new Set();
      families[ff].add(role);
    });
    L1.fontFamilies = Object.keys(families).map(function(ff){
      return {name:ff, uses:Array.from(families[ff]).join(', ')};
    });
    if (L1.fontFamilies.length>3){
      addFinding(document.body,'warn','Типографика',
        'Слишком много гарнитур: '+L1.fontFamilies.length+' шт.',
        'Более 2–3 шрифтов = визуальный шум. Nielsen Norman: максимум 2 гарнитуры.',
        'Оставить 2: для заголовков + для текста. Вариативность — весом и размером.',
        {гарнитуры: L1.fontFamilies.map(function(f){ return f.name+'('+f.uses+')'; }).join(', ')});
    }

    var paras = Array.from(document.querySelectorAll('p')).filter(function(p){
      return elText(p).length>80 && isReallyVisible(p);
    });
    var lineMax = {mobile:60,tablet:72,desktop:85}[MODE];
    if (paras.length){
      var avgW = paras.reduce(function(s,p){ return s+p.offsetWidth; },0)/paras.length;
      L1.avgLineChars = Math.round(avgW/(bfs*0.52));
      if (L1.avgLineChars > lineMax){
        addFinding(paras[0],'warn','Типографика',
          'Длина строки ~'+L1.avgLineChars+' символов (норма до '+lineMax+')',
          'При >80 символах трудно найти начало следующей строки.',
          'max-width текстового блока: ~'+Math.round(65*bfs*0.52)+'px.',
          {символов:L1.avgLineChars,норма:lineMax});
      }
    }

    var capsEls = Array.from(document.querySelectorAll('p,li,h1,h2,h3')).filter(function(el){
      return window.getComputedStyle(el).textTransform==='uppercase'
        && elText(el).length>40 && isReallyVisible(el);
    }).slice(0,2);
    L1.uppercaseBlocks = capsEls.length;
    capsEls.forEach(function(el){
      addFinding(el,'warn','Типографика',
        el.tagName+'("'+elText(el).slice(0,30)+'…"): uppercase на длинном тексте',
        'UPPERCASE читается на 13–20% медленнее. Мозг распознаёт слова по форме букв.',
        'Убрать text-transform: uppercase. Акцент — через font-weight или цвет.',
        {длина:elText(el).length+' симв.'});
    });

    var pSizes = Array.from(document.querySelectorAll('p'))
      .filter(function(e){ return isReallyVisible(e)&&elText(e).length>20; })
      .map(function(p){ return Math.round(parseFloat(window.getComputedStyle(p).fontSize)); });
    L1.uniqueParaSizes = Array.from(new Set(pSizes));
    if (L1.uniqueParaSizes.length>3){
      addFinding(document.body,'warn','Типографика',
        L1.uniqueParaSizes.length+' разных размеров шрифта в параграфах',
        'Принцип консистентности: одинаковые элементы должны выглядеть одинаково.',
        'Определить 2–3 текстовых стиля (body, small, caption) и применять системно.',
        {размеры:L1.uniqueParaSizes.join(', ')+'px'});
    }
  })();

  // 1.3 ВИЗУАЛЬНАЯ ИЕРАРХИЯ
  (function(){
    var heads = {};
    ['H1','H2','H3','H4'].forEach(function(tag){
      var el = Array.from(document.querySelectorAll(tag)).find(isReallyVisible);
      if (el) heads[tag]={el:el, fs:parseFloat(window.getComputedStyle(el).fontSize), fw:parseInt(window.getComputedStyle(el).fontWeight)||400};
    });
    L1.headings = {};
    Object.keys(heads).forEach(function(k){ L1.headings[k]={fs:heads[k].fs,fw:heads[k].fw}; });

    [['H1','H2'],['H2','H3'],['H3','H4']].forEach(function(pair){
      var big=heads[pair[0]], sm=heads[pair[1]];
      if (!big||!sm) return;
      var r=+(big.fs/sm.fs).toFixed(2);
      if (r<1.15){
        addFinding(big.el,'crit','Визуальная иерархия',
          pair[0]+'('+big.fs+'px) ≈ '+pair[1]+'('+sm.fs+'px) — нет иерархии (ratio '+r+')',
          'F-паттерн: взгляд ищет заголовки как якоря. Разница должна считываться без усилий за <1 сек.',
          pair[0]+' минимум '+Math.round(sm.fs*1.28)+'px при '+pair[1]+'='+sm.fs+'px.',
          {ratio:r,норма:'>1.25'});
      } else if (r<1.25){
        addFinding(big.el,'warn','Визуальная иерархия',
          pair[0]+'/'+pair[1]+' ratio='+r+' — слабая иерархия',
          'Разница есть, но недостаточна — пользователь замедляется при сканировании.',
          'Увеличить ratio до ≥1.3.',{ratio:r});
      }
    });

    var allH1 = Array.from(document.querySelectorAll('h1')).filter(isReallyVisible);
    L1.h1Count = allH1.length;
    if (allH1.length>1){
      addFinding(allH1[1],'warn','Визуальная иерархия',
        allH1.length+' элементов H1 — нет единственной доминанты',
        'Один H1 = одна главная точка притяжения взгляда. Несколько → дезориентация.',
        'Оставить один H1. Остальные понизить до H2.',{найдено:allH1.length});
    }
    if (heads.H1&&heads.H1.fw<600){
      addFinding(heads.H1.el,'warn','Визуальная иерархия',
        'H1 не жирный (font-weight:'+heads.H1.fw+')',
        '"'+elText(heads.H1.el).slice(0,40)+'" — лёгкий шрифт делает страницу визуально плоской.',
        'font-weight: 700 или 800 для H1.',{font_weight:heads.H1.fw});
    }
  })();

  // 1.4 CTA
  (function(){
    var ctaRx = /заказ|купи|записа|получи|заявк|позвони|рассчита|начать|попробо|скачать/i;
    var weakRx = /^(подробнее|далее|ещё|узнать|читать|смотреть|more|learn more|click here)$/i;
    var allCTAs = Array.from(document.querySelectorAll('button,[role="button"],a')).filter(function(el){
      return ctaRx.test(elText(el))&&isReallyVisible(el)&&el.offsetHeight>10;
    });
    L1.allCTATexts = allCTAs.map(function(el){ return elText(el).slice(0,40); });

    allCTAs.slice(0,8).forEach(function(btn){
      var h=btn.offsetHeight;
      if (h<NORM.ctaH){
        addFinding(btn,'crit','CTA',
          'CTA "'+elText(btn).slice(0,30)+'": высота '+h+'px < '+NORM.ctaH+'px',
          MODE==='mobile'?'Средний палец 44–57px. При '+h+'px промахи в 30–40% — прямая потеря конверсий.'
            :'Закон Фиттса: маленькая цель = промахи = раздражение.',
          'padding: '+(MODE==='mobile'?'14px 28px':'10px 24px')+'. Минимум '+NORM.ctaH+'px.',
          {высота:h+'px',норма:NORM.ctaH+'px'});
      }
      if (weakRx.test(elText(btn).toLowerCase().trim())){
        addFinding(btn,'warn','CTA',
          'CTA "'+elText(btn).slice(0,30)+'": расплывчатый текст',
          '"Подробнее" не объясняет результат клика. Конкретный глагол повышает конверсию на 20–30%.',
          'Заменить: "Получить консультацию", "Рассчитать цену", "Скачать PDF".',null);
      }
      var tr = window.getComputedStyle(btn).transition;
      var hasHover = tr && tr!=='none' && tr!=='all 0s ease 0s'
        && parseFloat((tr.match(/[\d.]+s/)||['0'])[0])>0.05;
      if (!hasHover && !MARKED.has(btn)){
        addFinding(btn,'info','Интерактивность',
          'CTA "'+elText(btn).slice(0,30)+'": нет hover-анимации',
          'Nielsen #1 (обратная связь): кнопка без hover не подтверждает интерактивность.',
          'transition: background 0.2s ease + изменение цвета на :hover.',null);
      }
    });

    var allBtns = Array.from(document.querySelectorAll('button,[role="button"]')).filter(function(el){
      return isReallyVisible(el)&&el.offsetHeight>20;
    });
    L1.totalButtons = allBtns.length;
    var btnColors = new Set();
    allBtns.forEach(function(btn){
      var bg = window.getComputedStyle(btn).backgroundColor;
      if (bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'){
        try{ var hex=colorToHex(bg); if(hex!=='#ffffff'&&hex!=='#000000') btnColors.add(hex); }catch(e){}
      }
    });
    L1.btnColorCount = btnColors.size;
    L1.btnColors = Array.from(btnColors);
    if (btnColors.size>3&&allBtns.length>4){
      addFinding(allBtns[0],'warn','Консистентность',
        btnColors.size+' разных цветов кнопок — нарушен паттерн',
        'Nielsen #4: одинаковые действия должны выглядеть одинаково. Разные стили кнопок ломают паттерн поведения.',
        'Определить 2 стиля: primary (яркий фон) и secondary (outline). Применять системно.',
        {уникальных_цветов:btnColors.size});
    }

    if (allBtns.length>8){
      addFinding(document.body,'warn','Когнитивная нагрузка',
        allBtns.length+' кнопок на странице — паралич выбора (закон Хика)',
        'С ростом вариантов растёт время решения. '+allBtns.length+' кнопок = пользователь откладывает действие.',
        '1 первичное действие на экран. Остальные — outline или текстовые ссылки.',
        {кнопок:allBtns.length});
    }
  })();

  // 1.5 АФФОРДАНС
  (function(){
    var fakeBtns = Array.from(document.querySelectorAll('div,span')).filter(function(el){
      if (!isReallyVisible(el)) return false;
      var cs = window.getComputedStyle(el);
      return cs.cursor==='pointer'&&!el.getAttribute('role')
        &&!el.closest('a')&&!el.closest('button')
        &&el.offsetHeight>20&&el.offsetWidth>30&&elText(el).length>0;
    }).slice(0,5);
    L1.fakeBtnsCount = fakeBtns.length;
    fakeBtns.forEach(function(el){
      addFinding(el,'warn','Аффорданс',
        '"'+elText(el).slice(0,35)+'": кликабельный элемент без роли кнопки',
        'Когнитивный разрыв: выглядит как кнопка — работает хуже. Скринридер игнорирует.',
        'Добавить role="button" + tabindex="0" или заменить на <button>.',null);
    });

    var flatLinks = Array.from(document.querySelectorAll('p a[href], li a[href]')).filter(function(el){
      if (!isReallyVisible(el)||elText(el).length<3) return false;
      var cs=window.getComputedStyle(el);
      var pcs=window.getComputedStyle(el.parentElement||document.body);
      return cs.textDecoration.indexOf('underline')===-1&&cs.color===pcs.color;
    }).slice(0,3);
    L1.flatLinksCount = flatLinks.length;
    flatLinks.forEach(function(el){
      addFinding(el,'warn','Аффорданс',
        'Ссылка "'+elText(el).slice(0,35)+'" в тексте не отличается визуально',
        'Аффорданс: ссылка должна выглядеть как ссылка. Одинаковый цвет без underline — пользователь не видит.',
        'Добавить underline или другой цвет для ссылок внутри текста.',null);
    });

    Array.from(document.querySelectorAll('label')).filter(function(el){ return isReallyVisible(el); })
      .forEach(function(label){
        var forId=label.getAttribute('for');
        if (!forId) return;
        var inp=document.getElementById(forId);
        if (!inp||!isReallyVisible(inp)) return;
        var lr=label.getBoundingClientRect(), ir=inp.getBoundingClientRect();
        var gap=Math.abs(lr.bottom-ir.top);
        if (gap>24){
          addFinding(label,'warn','Гештальт: Близость',
            'Label "'+elText(label).slice(0,30)+'" и input разделены '+Math.round(gap)+'px',
            'Принцип близости: элементы рядом = связаны. Разрыв >20px между label и полем заставляет искать связь.',
            'Уменьшить gap до 4–8px. Label и поле — единица.',{разрыв:Math.round(gap)+'px'});
        }
      });
  })();

  // 1.6 КОГНИТИВНАЯ НАГРУЗКА
  (function(){
    L1.hScroll = document.documentElement.scrollWidth > VW+5;
    if (L1.hScroll){
      addFinding(document.body,'crit','Когнитивная нагрузка',
        'Горизонтальный скролл: +'+(document.documentElement.scrollWidth-VW)+'px',
        'Сломанная вёрстка = непрофессиональный сайт. На мобильных — триггер немедленного ухода.',
        'Найти элемент с фиксированной шириной > viewport. Заменить на max-width:100%.',
        {переполнение:(document.documentElement.scrollWidth-VW)+'px'});
    }

    var animEls = Array.from(document.querySelectorAll('*')).filter(function(el){
      if (!isReallyVisible(el)) return false;
      var cs=window.getComputedStyle(el);
      return cs.animationName&&cs.animationName!=='none'&&parseFloat(cs.animationDuration||'0')>0.2;
    });
    L1.animationsCount = animEls.length;
    if (animEls.length>8){
      addFinding(animEls[0],'warn','Когнитивная нагрузка',
        'Много CSS-анимаций ('+animEls.length+') — рассеивание внимания',
        'Движение — сильнейший аттрактор. При '+animEls.length+' анимациях мозг не удерживает фокус.',
        'Анимировать только: hover кнопок, появление секций. Убрать декоративные бесконечные.',
        {анимаций:animEls.length});
    }

    var realPopups = Array.from(document.querySelectorAll('[class*="modal"],[class*="popup"],[id*="modal"],[id*="popup"]'))
      .filter(function(el){
        if (!isReallyVisible(el)||el.offsetHeight<60) return false;
        var cs=window.getComputedStyle(el);
        return (cs.position==='fixed'||cs.position==='absolute')&&(parseInt(cs.zIndex)||0)>100;
      });
    L1.popupsCount = realPopups.length;
    if (realPopups.length>0){
      addFinding(realPopups[0],'warn','Когнитивная нагрузка',
        'Поп-ап виден при загрузке ('+realPopups.length+' шт.)',
        '69% сразу закрывают поп-ап. Прерывание до понимания ценности сайта → отказ.',
        'Задержать показ на 30–60 сек или до 40–50% скролла.',{найдено:realPopups.length});
    }

    L1.pageScreens = Math.round(document.body.scrollHeight/VH);
    if (L1.pageScreens>15){
      addFinding(document.body,'warn','Когнитивная нагрузка',
        'Страница '+L1.pageScreens+' экранов — риск потери пользователя',
        'Nielsen: редко смотрят более 3–4 экранов без якоря интереса.',
        'Добавить sticky-навигацию по секциям или anchor-ссылки.',{экранов:L1.pageScreens});
    }
  })();

  // 1.7 СТРУКТУРА БЛОКОВ
  (function(){
    var ctaRx = /заказ|купи|записа|получи|рассчита|начать|попробо|скачать/i;
    var blocks = Array.from(document.querySelectorAll('section,article,[class*="section"],[class*="hero"],[class*="block"]'))
      .filter(function(el){ return isReallyVisible(el)&&el.offsetHeight>100; }).slice(0,20);
    L1.blocks = [];

    blocks.forEach(function(block){
      var bH=block.querySelector('h1,h2,h3');
      var bTexts=Array.from(block.querySelectorAll('p,li')).filter(isReallyVisible);
      var bLinks=Array.from(block.querySelectorAll('a[href]')).filter(isReallyVisible);
      var bCTAs=Array.from(block.querySelectorAll('button,[role="button"]')).filter(function(e){ return ctaRx.test(elText(e))&&isReallyVisible(e); });
      var totalTxt=bTexts.reduce(function(s,p){ return s+elText(p).length; },0);
      var bName=bH?'"'+elText(bH).slice(0,35)+'"':(block.id?'#'+block.id:'.'+((block.className||'').toString().split(' ')[0].slice(0,20)));

      L1.blocks.push({
        name:bName,
        hasHead:!!bH,
        headText:bH?elText(bH).slice(0,50):'',
        textLen:totalTxt,
        hasCTA:bCTAs.length>0,
        hasLinks:bLinks.length>0,
        ctaTexts:bCTAs.map(function(e){ return elText(e).slice(0,25); })
      });

      if (!bH&&bTexts.length>1){
        addFinding(block,'warn','Структура блока',
          'Блок '+bName+': нет заголовка — нет точки входа',
          'F-паттерн: взгляд ищет H2/H3 как якорь при скролле. Блок без заголовка пролистывается мимо.',
          'Добавить H2 или H3 в начало блока. 3–5 слов достаточно.',null);
      }
      if (totalTxt>500&&block.querySelectorAll('ul li,ol li').length===0&&block.querySelectorAll('h3,h4').length===0){
        addFinding(block,'warn','Структура блока',
          'Блок '+bName+': стена текста '+totalTxt+' симв.',
          'Nielsen: 79% сканируют, 16% читают. Монолитный текст = невидимый текст.',
          'Разбить на H3 + маркированные списки. Один абзац = одна идея.',{символов:totalTxt});
      }
      if (!bCTAs.length&&!bLinks.length&&bTexts.length>2&&totalTxt>100){
        addFinding(block,'warn','Структура блока',
          'Блок '+bName+': информационный тупик — нет следующего шага',
          'Связь "Сложность→Мотивация": после контента должен быть логичный шаг. Без него воронка рвётся.',
          'Добавить кнопку, ссылку или хотя бы "Подробнее →".',null);
      }
    });
    L1.deadEnds = L1.blocks.filter(function(b){ return !b.hasCTA&&!b.hasLinks&&b.textLen>100; }).length;
    L1.walls = L1.blocks.filter(function(b){ return b.textLen>500; }).length;
  })();

  // 1.8 ИЗОБРАЖЕНИЯ
  (function(){
    var imgs = Array.from(document.querySelectorAll('img')).filter(isReallyVisible);
    L1.imgsTotal = imgs.length;
    L1.imgsAboveFold = imgs.filter(function(img){ return isAboveFold(img)&&img.offsetWidth>100; }).length;

    var noAlt = imgs.filter(function(el){ return !el.hasAttribute('alt'); }).slice(0,3);
    L1.noAltCount = noAlt.length;
    noAlt.forEach(function(img){
      addFinding(img,'warn','Изображения',elLabel(img)+' — нет alt',
        'SEO: поисковик не видит содержимое. Медленный интернет: пустой прямоугольник.',
        'alt="" для декоративных. alt="описание" для смысловых.',null);
    });

    var heavy = imgs.filter(function(img){ return img.naturalWidth>1200&&img.loading!=='lazy'&&!isAboveFold(img); });
    L1.lazyMissing = heavy.length;
    if (heavy.length>0){
      addGroup(heavy.slice(0,5),'warn','Изображения',
        'Крупные изображения без lazy loading',
        '53% мобильных уходят при загрузке >3 сек. Изображения ниже fold без lazy замедляют рендер.',
        'Добавить loading="lazy" всем <img> ниже первого экрана.',{изображений:heavy.length});
    }
    if (L1.imgsAboveFold===0&&imgs.length<2){
      addFinding(document.body,'info','Изображения','Мало визуала на первом экране',
        'Мозг обрабатывает изображения в 60 000 раз быстрее текста. Страница без визуала теряет контакт.',
        'Добавить смысловой визуал на первый экран: продукт, результат, человек.',null);
    }
  })();

  // 1.9 МОБИЛЬНЫЙ ДИЗАЙН
  (function(){
    if (MODE!=='mobile'&&MODE!=='tablet') return;

    var smallTouch = Array.from(document.querySelectorAll('a,button,[role="button"],input,select'))
      .filter(function(el){ return isReallyVisible(el)&&el.offsetHeight>0&&el.offsetHeight<NORM.touch; });
    L1.smallTouchCount = smallTouch.length;
    if (smallTouch.length>3){
      addGroup(smallTouch.slice(0,8),'warn','Мобильный дизайн',
        'Touch-цели меньше '+NORM.touch+'px',
        'Средний палец 44–57px. Меньше '+NORM.touch+'px — промахи в 30–40%. Apple HIG и Material Design.',
        'Добавить padding до минимума '+NORM.touch+'px для всех интерактивных элементов.',
        {элементов:smallTouch.length});
    } else {
      smallTouch.forEach(function(el){
        addFinding(el,'warn','Мобильный дизайн',
          elLabel(el)+': touch-цель '+el.offsetHeight+'px < '+NORM.touch+'px',
          'Промахи в 30–40% нажатий.',
          'padding: '+Math.ceil((NORM.touch-el.offsetHeight)/2)+'px сверху и снизу.',
          {высота:el.offsetHeight+'px'});
      });
    }

    var smallInputs = Array.from(document.querySelectorAll('input,textarea,select')).filter(function(el){
      return isReallyVisible(el)&&parseFloat(window.getComputedStyle(el).fontSize)<16;
    });
    L1.smallInputsCount = smallInputs.length;
    if (smallInputs.length>1){
      addGroup(smallInputs,'crit','Мобильный дизайн',
        'font-size < 16px на полях ввода — iOS зумирует страницу',
        'iOS Safari автозум при focus если font-size < 16px. Пользователь теряет контекст → уходит.',
        'font-size: 16px на всех input, textarea, select.',{элементов:smallInputs.length});
    } else if (smallInputs.length===1){
      addFinding(smallInputs[0],'crit','Мобильный дизайн',
        elLabel(smallInputs[0])+': font-size<16px — iOS зумирует',
        'iOS Safari автозум при focus.',
        'font-size: 16px.',{размер:parseFloat(window.getComputedStyle(smallInputs[0]).fontSize)+'px'});
    }

    var vmeta = document.querySelector('meta[name="viewport"]');
    L1.viewportMeta = vmeta ? vmeta.content : null;
    if (!vmeta){
      addFinding(document.body,'crit','Мобильный дизайн','Нет meta viewport',
        'Без viewport meta браузер рендерит как десктоп и уменьшает всё.',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',null);
    } else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1[^0-9]/i.test(vmeta.content)){
      addFinding(vmeta,'warn','Мобильный дизайн','Viewport запрещает масштабирование',
        'user-scalable=no нарушает WCAG 1.4.4. Слабовидящие не могут увеличить текст.',
        'Убрать user-scalable=no.',{content:vmeta.content.slice(0,60)});
    }
  })();

  // 1.10 ДОВЕРИЕ
  (function(){
    var footer = document.querySelector('footer,[class*="footer"]');
    L1.footerText = footer ? footer.textContent.trim().slice(0,400) : '';
    if (footer){
      if (!/tel:|mailto:|телефон|email|е-mail|адрес|контакт/i.test(footer.innerHTML)){
        addFinding(footer,'info','Доверие','Footer: нет контактной информации',
          'Пользователь дошёл до конца без контактов → сомневается в реальности компании.',
          'Добавить телефон, email или адрес.',null);
      }
      if (!/20\d\d/.test(footer.textContent)){
        addFinding(footer,'info','Доверие','Footer: нет года — сайт выглядит заброшенным',
          'Без даты вопрос "актуален ли сайт?" = недоверие.',
          'Добавить © '+new Date().getFullYear()+' [Название].',null);
      }
    }
    var reviews = Array.from(document.querySelectorAll('[class*="testimonial"],[class*="review"]')).filter(isReallyVisible);
    L1.reviewsCount = reviews.length;
    L1.reviewsWithPhoto = reviews.filter(function(r){ return r.querySelector('img'); }).length;
    if (reviews.length>=2&&!L1.reviewsWithPhoto){
      addFinding(reviews[0],'info','Доверие','Отзывы без фото авторов',
        'Nielsen: отзывы с фото воспринимаются на 35% достовернее.',
        'Добавить аватар + имя + должность к каждому отзыву.',null);
    }
  })();

  // УРОВЕНЬ 2: СИГНАЛЫ
  var L2 = {};

  (function(){
    var ctaRx = /заказ|купи|записа|получи|рассчита|начать|попробо/i;
    var mainCTAs = Array.from(document.querySelectorAll('button,[role="button"],a')).filter(function(el){
      return ctaRx.test(elText(el))&&isReallyVisible(el)&&isAboveFold(el);
    });

    var candidates = Array.from(document.querySelectorAll('*')).filter(function(el){
      return isReallyVisible(el)&&isAboveFold(el)
        &&el.offsetWidth>40&&el.offsetHeight>20&&el.offsetHeight<VH*0.7
        &&!['BODY','HTML','MAIN','SECTION','HEADER','NAV','FOOTER'].includes(el.tagName)
        &&!(el.closest&&el.closest('#ux8-panel'))
        &&!(el.closest&&el.closest('#mega-audit-panel'));
    });

    var weights = [];
    candidates.forEach(function(el){
      var bg = window.getComputedStyle(el).backgroundColor;
      if (!bg||bg==='rgba(0, 0, 0, 0)') return;
      var sat = colorSaturation(bg);
      if (sat<30) return;
      var area = el.offsetWidth*el.offsetHeight;
      var weight = sat * Math.log(area+1);
      weights.push({el:el, weight:weight, sat:sat, area:area, bg:bg, isCTA:ctaRx.test(elText(el))});
    });
    weights.sort(function(a,b){ return b.weight-a.weight; });

    L2.heaviestEl = null;
    L2.heaviestIsCTA = false;
    L2.heaviestWeight = 0;
    L2.ctaWeight = 0;

    if (weights.length>0){
      L2.heaviestEl = weights[0];
      L2.heaviestIsCTA = weights[0].isCTA;
      L2.heaviestWeight = Math.round(weights[0].weight);

      var ctaW = weights.find(function(w){ return w.isCTA; });
      L2.ctaWeight = ctaW ? Math.round(ctaW.weight) : 0;

      if (!weights[0].isCTA && weights[0].weight > 500 && mainCTAs.length>0){
        addFinding(weights[0].el,'signal','Сигнал: Визуальный вес',
          '"'+elText(weights[0].el).slice(0,35)+'" визуально доминирует, но не является CTA',
          'Связь "Визуальный вес → Приоритет бизнеса": самый заметный элемент должен быть CTA.',
          'Проверить вручную: снизить вес этого элемента или усилить выделение CTA.',
          {вес_элемента:Math.round(weights[0].weight), вес_CTA:L2.ctaWeight});
      }
    }

    var heavyOnFold = weights.filter(function(w){ return w.weight>300&&!w.isCTA; }).slice(0,5);
    L2.competingFocusPoints = heavyOnFold.length;
    if (heavyOnFold.length>=3){
      addFinding(heavyOnFold[0].el,'signal','Сигнал: Точки фокуса',
        heavyOnFold.length+' конкурирующих ярких элемента на первом экране',
        'Несколько ярких элементов конкурируют за внимание. Взгляд рассеивается.',
        'Проверить вручную: оставить один визуально доминирующий элемент на экране.',
        {ярких_элементов:heavyOnFold.length});
    }
  })();

  (function(){
    var ctaRx = /заказ|купи|записа|получи|рассчита|начать|попробо/i;
    var mainCTA = Array.from(document.querySelectorAll('button,[role="button"],a')).find(function(el){
      return ctaRx.test(elText(el))&&isReallyVisible(el)&&isAboveFold(el);
    });
    L2.ctaPosition = null;
    if (mainCTA){
      var r = mainCTA.getBoundingClientRect();
      var cx = r.left+r.width/2, cy = r.top+r.height/2;
      var qH = cx>VW*0.5?'правый':'левый';
      var qV = cy>VH*0.4?'нижний':'верхний';
      L2.ctaPosition = {x:Math.round(cx), y:Math.round(cy), quadrant:qV+' '+qH};
      var inTerminal = cx>VW*0.5&&cy>VH*0.35;
      if (!inTerminal){
        addFinding(mainCTA,'signal','Сигнал: Z-паттерн',
          'CTA "'+elText(mainCTA).slice(0,30)+'" не в терминальной зоне ('+qV+' '+qH+')',
          'Диаграмма Гутенберга: терминальная зона — правый нижний квадрант.',
          'Проверить вручную: попробовать сдвинуть CTA в правый нижний квадрант первого экрана.',
          {позиция:Math.round(cx)+'x'+Math.round(cy)+' из '+VW+'x'+VH});
      }
    }
  })();

  (function(){
    var colors = new Map();
    Array.from(document.querySelectorAll('*')).filter(isReallyVisible).slice(0,200).forEach(function(el){
      var cs = window.getComputedStyle(el);
      [cs.color, cs.backgroundColor].forEach(function(c){
        if (!c||c==='rgba(0, 0, 0, 0)'||c==='transparent') return;
        try{
          var hex = colorToHex(c);
          if (hex==='#ffffff'||hex==='#000000') return;
          colors.set(hex, (colors.get(hex)||0)+1);
        }catch(e){}
      });
    });
    L2.uniqueColors = colors.size;
    L2.topColors = Array.from(colors.entries())
      .sort(function(a,b){ return b[1]-a[1]; })
      .slice(0,8)
      .map(function(e){ return {hex:e[0], count:e[1]}; });

    if (colors.size>8){
      addFinding(document.body,'signal','Сигнал: Цветовая система',
        'Широкая палитра: '+colors.size+' уникальных цветов (без белого/чёрного)',
        'Правило 60-30-10: 60% основной, 30% вторичный, 10% акцент.',
        'Проверить: каждый цвет несёт смысловую нагрузку?',
        {цветов:colors.size,норма:'≤6'});
    }
  })();

  // УРОВЕНЬ 3: ДАННЫЕ ДЛЯ ИИ
  var L3 = {};
  L3.domain = location.hostname;
  L3.title = document.title;
  L3.metaDesc = (document.querySelector('meta[name="description"]')||{content:''}).content;
  L3.h1 = L1.h1Text;
  L3.h1desc = L1.descText;
  L3.ctaTexts = L1.ctaOnFoldTexts;
  L3.allCTATexts = L1.allCTATexts;
  L3.h2Sequence = Array.from(document.querySelectorAll('h2')).filter(isReallyVisible)
    .map(function(el){ return elText(el).slice(0,60); });
  L3.h3Sample = Array.from(document.querySelectorAll('h3')).filter(isReallyVisible)
    .slice(0,6).map(function(el){ return elText(el).slice(0,50); });
  L3.blockSequence = L1.blocks.map(function(b){
    return b.name + (b.hasCTA?' [есть CTA: '+b.ctaTexts.join(',')+']':' [нет CTA]')
      + (b.hasLinks?' [есть ссылки]':' [нет ссылок]')
      + ' ('+b.textLen+' симв.)';
  });
  L3.forms = Array.from(document.querySelectorAll('form')).filter(isReallyVisible).map(function(form){
    var inputs = Array.from(form.querySelectorAll('input:not([type="hidden"]),textarea,select')).filter(isReallyVisible);
    var labels = Array.from(form.querySelectorAll('label')).map(function(l){ return elText(l).slice(0,30); });
    var submit = form.querySelector('[type="submit"],button[type="submit"]');
    return {
      поля: inputs.length,
      лейблы: labels,
      кнопка_отправки: submit ? elText(submit).slice(0,30) : 'нет'
    };
  });
  L3.navItems = Array.from(document.querySelectorAll('nav a,[class*="menu"] a,[class*="nav"] a'))
    .filter(isReallyVisible).slice(0,12)
    .map(function(el){ return elText(el).slice(0,30); });
  L3.footerText = L1.footerText;
  L3.foldImgAlts = Array.from(document.querySelectorAll('img'))
    .filter(function(img){ return isReallyVisible(img)&&isAboveFold(img)&&img.offsetWidth>100; })
    .map(function(img){ return img.getAttribute('alt')||'[нет alt, src: '+img.src.split('/').pop().slice(0,30)+']'; });
  L3.palette = (L2.topColors||[]).map(function(c){ return c.hex+'(×'+c.count+')'; });
  L3.fonts = (L1.fontFamilies||[]).map(function(f){ return f.name+' — используется в: '+f.uses; });

  // ИТОГ
  var CRITS = FINDINGS.filter(function(f){ return f.sev==='crit'; });
  var WARNS = FINDINGS.filter(function(f){ return f.sev==='warn'; });
  var SIGS  = FINDINGS.filter(function(f){ return f.sev==='signal'; });
  var INFOS = FINDINGS.filter(function(f){ return f.sev==='info'; });

  var critCats = new Set(CRITS.map(function(f){ return f.cat+'_'+f.title.slice(0,15); }));
  var warnCats = new Set(WARNS.map(function(f){ return f.cat+'_'+f.title.slice(0,15); }));
  var SCORE = Math.max(0,Math.min(100,Math.round(100-critCats.size*12-warnCats.size*4)));

  var OKS = [];
  if (L1.h1OnFold&&L1.h1Text.length>=12) OKS.push({t:'H1 виден на первом экране', i:'Пользователь понимает куда попал → снижает отказы'});
  if (L1.ctaOnFoldCount===1) OKS.push({t:'Ровно 1 CTA на первом экране', i:'Нет паралича выбора → фокус на одном действии'});
  if (L1.hasTrust) OKS.push({t:'Сигналы доверия на первом экране', i:'Снижают барьер принятия решения'});
  if (!L1.hScroll) OKS.push({t:'Нет горизонтального скролла', i:'Вёрстка не сломана → базовое доверие'});
  if ((L1.fontFamilies||[]).length<=2) OKS.push({t:'Чистая типографика: '+(L1.fontFamilies||[]).length+' гарнитуры', i:'Нет визуального шума от смешения шрифтов'});
  if (L1.btnColorCount<=2) OKS.push({t:'Консистентные кнопки: '+L1.btnColorCount+' цвета', i:'Паттерн действий считывается быстро'});

  var CHAINS = [];
  if (!L1.h1OnFold&&!L1.ctaOnFoldCount) CHAINS.push('🔴🔴 ДВОЙНОЙ УДАР: нет H1 + нет CTA → пользователь не понимает куда попал И не знает что делать → отказ >70%');
  if (CRITS.some(function(c){return c.cat==='Контраст'||c.cat==='CTA';})&&L1.ctaOnFoldCount>0) CHAINS.push('🔴 ЦЕПОЧКА: нечитаемый контент + слабые CTA → не прочитал → не нажал → потеря конверсии');
  if (L1.walls>=2&&L1.deadEnds>=2) CHAINS.push('🟡 СИСТЕМНО: '+L1.walls+' стен текста + '+L1.deadEnds+' тупиков → контент написан без учёта F-паттерна сканирования');
  if (L2.uniqueColors>8&&(L1.fontFamilies||[]).length>3) CHAINS.push('🟡 НЕТ ДИЗАЙН-СИСТЕМЫ: '+L2.uniqueColors+' цветов + '+(L1.fontFamilies||[]).length+' гарнитуры → сайт выглядит "собранным кусками"');
  if (L2.heaviestEl&&!L2.heaviestIsCTA) CHAINS.push('🟡 СИГНАЛ: самый заметный элемент не является CTA → дизайн может работать против конверсии.');

  function buildForAI(){
    var lines = [];
    lines.push('=== UX ДАННЫЕ ДЛЯ АНАЛИЗА ДИЗАЙНА ===');
    lines.push('Сайт: '+L3.domain);
    lines.push('Title: '+L3.title);
    lines.push('Meta description: '+(L3.metaDesc||'отсутствует'));
    lines.push('');
    lines.push('--- КОНТЕКСТ СТРАНИЦЫ (определи нишу и аудиторию) ---');
    lines.push('H1: "'+L3.h1+'"');
    lines.push('Подзаголовок/описание: "'+(L3.h1desc||'отсутствует')+'"');
    lines.push('Тексты CTA на первом экране: '+(L3.ctaTexts.length?L3.ctaTexts.map(function(t){return '"'+t+'"';}).join(', '):'нет'));
    lines.push('Все CTA на странице: '+(L3.allCTATexts.length?L3.allCTATexts.map(function(t){return '"'+t+'"';}).join(', '):'нет'));
    lines.push('Навигация: '+(L3.navItems.length?L3.navItems.join(' → '):'не найдена'));
    lines.push('');
    lines.push('--- НАРРАТИВ И СТРУКТУРА ---');
    lines.push('Последовательность H2:');
    L3.h2Sequence.forEach(function(h,i){ lines.push('  '+(i+1)+'. "'+h+'"'); });
    if (L3.h3Sample.length){
      lines.push('Примеры H3: '+L3.h3Sample.map(function(h){return '"'+h+'"';}).join(', '));
    }
    lines.push('');
    lines.push('Структура блоков:');
    L3.blockSequence.forEach(function(b,i){ lines.push('  '+(i+1)+'. '+b); });
    lines.push('');
    if (L3.forms.length){
      lines.push('--- ФОРМЫ ---');
      L3.forms.forEach(function(form,i){
        lines.push('  Форма '+(i+1)+': '+form.поля+' полей | кнопка: "'+form.кнопка_отправки+'"');
      });
      lines.push('');
    }
    lines.push('--- ДИЗАЙН-СИСТЕМА ---');
    lines.push('Гарнитуры: '+(L3.fonts.length?L3.fonts.join(' | '):'не определены'));
    lines.push('font-size body: '+L1.bodyFont+'px | line-height: '+L1.bodyLH);
    lines.push('Иерархия заголовков: '+Object.keys(L1.headings||{}).map(function(k){return k+'='+L1.headings[k].fs+'px(fw:'+L1.headings[k].fw+')';}).join(' / '));
    lines.push('Уникальных цветов на странице: '+L2.uniqueColors);
    lines.push('Топ цветов палитры: '+(L3.palette.length?L3.palette.join(', '):'нет данных'));
    lines.push('');
    lines.push('--- ТОЧНЫЕ НАРУШЕНИЯ ---');
    if (CRITS.length){ lines.push('КРИТИЧНЫЕ:'); CRITS.forEach(function(f){ lines.push('  ❌ #'+f.num+' ['+f.cat+'] '+f.title); }); }
    if (WARNS.length){ lines.push('ПРЕДУПРЕЖДЕНИЯ:'); WARNS.forEach(function(f){ lines.push('  ⚠️ #'+f.num+' ['+f.cat+'] '+f.title); }); }
    lines.push('');
    lines.push('--- FOOTER ---');
    lines.push(L3.footerText||'не найден');
    lines.push('');
    lines.push('=== ЗАДАЧА ДЛЯ ИИ ===');
    lines.push('1. Какой это сайт, ниша, целевая аудитория');
    lines.push('2. Соответствует ли дизайн нише?');
    lines.push('3. Логична ли последовательность блоков?');
    lines.push('4. Достаточна ли мотивация пользователя на каждом шаге?');
    lines.push('5. Есть ли когнитивный разрыв между ожиданием и реальностью?');
    lines.push('6. Как технические нарушения влияют на конверсию именно для этой ниши?');
    lines.push('7. Главные 3–5 приоритетов для этого конкретного сайта');
    return lines.join('\n');
  }

  // Сохраняем данные UX аудита
  AUDIT_STORE.ux = {
    score: SCORE,
    mode: MRU,
    viewport: VW+'×'+VH,
    findings: FINDINGS.map(function(f){
      return {num:f.num,sev:f.sev,cat:f.cat,title:f.title,element:f.label,why:f.why,fix:f.fix,metric:f.metric};
    }),
    counts: {crit:CRITS.length,warn:WARNS.length,signal:SIGS.length,info:INFOS.length},
    oks: OKS,
    chains: CHAINS,
    l1: L1,
    l2: L2,
    l3: L3,
    forAI: buildForAI,
    _FINDINGS: FINDINGS,
    _FMAP: FMAP,
    _SEV_COLOR: SEV_COLOR,
    _MODE: MODE,
    _MRU: MRU,
    _SCORE: SCORE,
    _CRITS: CRITS,
    _WARNS: WARNS,
    _SIGS: SIGS,
    _INFOS: INFOS,
    _OKS: OKS,
    _CHAINS: CHAINS,
    buildPanel: null // будет назначено ниже
  };

  function buildPanel(){
    var existing=document.getElementById('ux8-panel');
    if(existing){existing.remove();return;}
    var sc2=SCORE>=70?'#16a34a':SCORE>=45?'#d97706':'#dc2626';
    var cats={};
    FINDINGS.forEach(function(f){if(!cats[f.cat])cats[f.cat]=[];cats[f.cat].push(f);});

    var p=document.createElement('div');
    p.id='ux8-panel';
    Object.assign(p.style,{
      position:'fixed',right:'0',top:'60px',width:'330px',height:'580px',
      background:'#fff',zIndex:'2147483646',boxShadow:'-4px 0 28px rgba(0,0,0,.18)',
      borderRadius:'8px 0 0 8px',fontFamily:'system-ui,sans-serif',
      display:'flex',flexDirection:'column',overflow:'hidden'
    });

    var catHTML=Object.keys(cats).map(function(cat){
      return '<div style="margin-bottom:10px;">'+
        '<div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;">'+cat+'</div>'+
        cats[cat].map(function(f){
          var bc=f.sev==='crit'?'#fef2f2':f.sev==='warn'?'#fffbeb':f.sev==='signal'?'#f5f3ff':'#eff6ff';
          var lc=SEV_COLOR[f.sev]||SEV_COLOR.info;
          var em=f.sev==='crit'?'❌':f.sev==='warn'?'⚠️':f.sev==='signal'?'🔍':'ℹ️';
          return '<div style="padding:5px 8px;margin-bottom:2px;border-radius:4px;background:'+bc+';border-left:3px solid '+lc+';">'+
            '<div style="font-size:10px;color:'+lc+';font-weight:700;">'+em+' #'+f.num+(f.isGroup?' · '+f.count+' эл.':'')+'</div>'+
            '<div style="font-size:11px;color:#111;font-weight:500;">'+f.title.slice(0,60)+(f.title.length>60?'…':'')+'</div>'+
            '<div style="font-size:10px;color:#9ca3af;margin-top:1px;">'+f.label.slice(0,50)+'</div>'+
            '</div>';
        }).join('')+'</div>';
    }).join('');

    p.innerHTML=
      '<div style="background:#1e1b4b;color:#e0e7ff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">'+
        '<div><span style="font-weight:700;font-size:13px;">UX Audit v8 · '+MRU+'</span>'+
        '<span style="margin-left:10px;font-size:20px;font-weight:900;color:'+sc2+';">'+SCORE+'</span></div>'+
        '<span id="ux8-pclose" style="cursor:pointer;font-size:16px;opacity:.7;">✕</span>'+
      '</div>'+
      '<div style="padding:5px 10px;background:#312e81;font-size:11px;color:#c7d2fe;">'+
        '❌ '+CRITS.length+'  ⚠️ '+WARNS.length+'  🔍 '+SIGS.length+'  ℹ️ '+INFOS.length+' · Наводи мышь на рамки'+
      '</div>'+
      '<div style="flex:1;overflow-y:auto;padding:10px 12px;">'+catHTML+'</div>';

    document.body.appendChild(p);
    document.getElementById('ux8-pclose').addEventListener('click',function(){p.remove();});
  }

  AUDIT_STORE.ux.buildPanel = buildPanel;

  if (window.UX_PANEL) buildPanel();

  // Вывод UX в консоль
  var SC = SCORE>=70?'color:#16a34a;font-weight:900;font-size:20px':SCORE>=45?'color:#d97706;font-weight:900;font-size:20px':'color:#dc2626;font-weight:900;font-size:20px';
  console.log('\n%c╔══════════════════════════════════════════════════════════╗','color:#1e1b4b;font-weight:bold');
  console.log('%c  UX DESIGN AUDIT v8  ·  '+MRU+'  ·  '+location.hostname,'color:#1e1b4b;font-weight:bold;font-size:13px');
  console.log('%c╚══════════════════════════════════════════════════════════╝','color:#1e1b4b;font-weight:bold');
  console.log('%c  ДИЗАЙН-СКОР: '+SCORE+'/100',SC);
  console.log('%c  ❌ '+CRITS.length+' критичных  ⚠️ '+WARNS.length+' предупреждений  🔍 '+SIGS.length+' сигналов  ℹ️ '+INFOS.length+' инфо  ✅ '+OKS.length+' хорошо','font-size:12px;color:#374151');

  if (OKS.length>0){
    console.group('%c✅  ЧТО РАБОТАЕТ ('+OKS.length+')','color:#16a34a;font-weight:700;font-size:13px');
    OKS.forEach(function(ok,i){ console.log('  '+(i+1)+'. '+ok.t+' → '+ok.i); });
    console.groupEnd();
  }
  if (CHAINS.length>0){
    console.group('%c🔗  СВЯЗАННЫЕ ПРОБЛЕМЫ','color:#7c3aed;font-weight:700;font-size:13px');
    CHAINS.forEach(function(c){ console.log('  '+c); });
    console.groupEnd();
  }
  if (CRITS.length>0){
    console.group('%c❌  КРИТИЧНЫЕ ('+CRITS.length+')','color:#dc2626;font-weight:700;font-size:13px');
    CRITS.forEach(function(f){
      console.group('%c#'+f.num+' ['+f.cat+'] '+f.title,'color:#dc2626;font-weight:600');
      console.log('  📍 '+f.label); console.log('  ❓ '+f.why); console.log('  🔧 '+f.fix);
      if(f.metric) console.log('  📊',f.metric);
      console.groupEnd();
    });
    console.groupEnd();
  }
  if (WARNS.length>0){
    console.group('%c⚠️  ПРЕДУПРЕЖДЕНИЯ ('+WARNS.length+')','color:#d97706;font-weight:700;font-size:13px');
    WARNS.forEach(function(f){
      console.group('%c#'+f.num+' ['+f.cat+'] '+f.title,'color:#d97706;font-weight:600');
      console.log('  📍 '+f.label); console.log('  ❓ '+f.why); console.log('  🔧 '+f.fix);
      console.groupEnd();
    });
    console.groupEnd();
  }
  if (SIGS.length>0){
    console.group('%c🔍  СИГНАЛЫ ('+SIGS.length+')','color:#8b5cf6;font-weight:700;font-size:13px');
    SIGS.forEach(function(f){
      console.group('%c🔍 #'+f.num+' '+f.title,'color:#8b5cf6;font-weight:600');
      console.log('  📍 '+f.label); console.log('  ❓ '+f.why); console.log('  👁 '+f.fix);
      console.groupEnd();
    });
    console.groupEnd();
  }
  if (INFOS.length>0){
    console.group('%cℹ️  РЕКОМЕНДАЦИИ ('+INFOS.length+')','color:#3b82f6;font-weight:700;font-size:13px');
    INFOS.forEach(function(f){ console.log('  #'+f.num+' ['+f.cat+'] '+f.title); });
    console.groupEnd();
  }

})();


// ════════════════════════════════════════════════════════════════════
// ЧАСТЬ 2: GEO CONTENT AUDIT
// ════════════════════════════════════════════════════════════════════
(function GEO_CONTENT_AUDIT() {

  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script,style,nav,header,footer,aside,[class*="menu"],[class*="cookie"]')
    .forEach(el=>el.remove());
  const txt = (clone.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();
  const html = document.body.innerHTML.toLowerCase();
  const wc = txt.split(/\s+/).filter(Boolean).length;

  const geoIssues = [];
  const scores = { ok:0, fail:0 };

  function chk(label, val, tip) {
    val ? scores.ok++ : (scores.fail++, geoIssues.push({сигнал:label, что_добавить:tip}));
    return val;
  }

  const h2list = [...document.querySelectorAll('h2')].map(e=>e.innerText.trim());
  const h3list = [...document.querySelectorAll('h3')].map(e=>e.innerText.trim());

  // Структура для LLM
  chk('Есть H2 структура', h2list.length>=2, 'Добавь H2 для каждой подтемы — LLM воспринимает H2 как отдельный "чанк"');
  chk('Каждый раздел самодостаточен', h2list.length > 0 && wc/Math.max(h2list.length,1) >= 100, 'На каждый H2 должно быть минимум 80-150 слов с полным ответом');
  chk('Есть списки (ul/ol)', document.querySelectorAll('ul li,ol li').length > 4, 'Маркированные списки — один из лучших форматов для цитирования LLM');
  chk('Есть таблицы', document.querySelectorAll('table').length > 0, 'Сравнительные таблицы — LLM цитирует их при запросах "лучший/сравнение"');
  chk('Прямой ответ в начале', wc > 50 && !/добро.пожалов|рады.представ|наш.сайт.предлагает/i.test(txt.split(' ').slice(0,50).join(' ')), 'Первые 50-80 слов должны содержать суть');

  // FAQ и HowTo
  const faqEl   = document.querySelectorAll('[class*="faq"],[class*="question"],[class*="accor"]');
  const faqText  = /faq|часто.задавае|вопросы.и.ответ|вопрос.*ответ/i.test(txt);
  const howToText = /шаг\s*\d+|step\s*\d+|пошагов|инструкци|как\s(сделать|заказать|выбрать|настроить|получить)/i.test(txt);
  const hasWQuestions = /\b(кто|что|где|когда|как|почему|зачем|сколько)\b.*\?/i.test(txt);
  const questionCount = (txt.match(/\?/g)||[]).length;

  chk('FAQ-блок (элемент или текст)', faqEl.length>0||faqText, 'Добавь блок FAQ с 5-7 вопросами — Schema FAQPage даст сниппет в Яндексе');
  chk('HowTo / пошаговые инструкции', howToText, 'Добавь "Шаг 1... Шаг 2..." — LLM используют пошаговый формат в ответах');
  chk('Вопросы в тексте (W-формат)', hasWQuestions, 'Пиши как диалог: "Как выбрать X? [ответ]" — именно так спрашивают у нейросетей');

  // E-E-A-T
  const hasAuthorName  = /автор[:\s]|написал[:\s]|эксперт[:\s]|составил[:\s]/i.test(txt);
  const hasExperience  = /\d+.лет.опыта|\d+.лет.работ|опыт.с.\d{4}|основан.в.\d{4}/i.test(txt);
  const hasNumbers     = /\d+\s?(%|млн|тыс|руб|клиент|проект|заказ|поездк)/i.test(txt);
  const hasExpertQuote = /(говорит|отмечает|по.словам|считает|объясняет)[^.]{3,50}/i.test(txt);
  const hasCases       = /кейс|пример.работ|результат|достигли|увеличил|снизил|вырос/i.test(txt);
  const hasSource      = /по.данным|согласно|исследовани|источник|по.версии/i.test(txt);
  const hasDate        = !!document.querySelector('time,[class*="date"],[class*="publish"]');
  const hasUpdateDate  = /обновлен|актуализирован|обновлено|updated/i.test(txt);
  const hasSocProof    = /отзыв|рейтинг|\d+.клиент|\d+.заказ|\d+.поездк|\d+.пользовател/i.test(txt);

  chk('Автор с именем/должностью', hasAuthorName, 'Добавь "Автор: [Имя], [должность]"');
  chk('Опыт в цифрах (N лет)', hasExperience, 'Укажи конкретно: "работаем с 2014 года"');
  chk('Конкретные числа и метрики', hasNumbers, 'Замени "много клиентов" на "1200 поездок"');
  chk('Цитата эксперта/сотрудника', hasExpertQuote, 'Добавь прямую речь: "По словам [должность]: ..."');
  chk('Кейсы с результатами', hasCases, 'Добавь 1-2 кейса с цифрами');
  chk('Ссылки на источники/данные', hasSource, '"По данным Яндекс.Метрики..." = сигнал достоверности');
  chk('Дата публикации', hasDate, 'LLM проверяют актуальность — без даты контент теряет доверие');
  chk('Дата обновления', hasUpdateDate, 'Добавь "Обновлено: [дата]"');
  chk('Социальные доказательства', hasSocProof, 'Цифры клиентов/заказов + отзывы = коммерческий E-E-A-T');

  // Интенты
  const intents = {
    'Информационный': /что такое|как (работает|устроен|выбрать)|определение|объяснение/i.test(txt),
    'Коммерческий':   /цен|стоимост|заказат|купит|тариф|прайс|₽|руб/i.test(txt),
    'Сравнительный':  /лучший|сравни|vs|отличие|преимущест|в отличие|или/i.test(txt),
    'Навигационный':  /контакт|адрес|телефон|написат|позвонит/i.test(txt),
    'Транзакционный': /заказат|оформит|записатьс|подат заявку|оставит заявку/i.test(txt),
    'Ситуативный':    /если|когда|срочно|экстренно|нужно (сейчас|быстро|срочно)/i.test(txt),
  };
  Object.entries(intents).forEach(([name,has]) => chk(name+' интент', has, `Добавь контент под этот тип запросов`));

  // Языковая логика
  const adWords    = /лучший.в.мире|уникальный.подход|непревзойденный|лидер.рынка|номер.один/i.test(txt);
  const hasSpecific = /\d+\s?(мин|час|км|руб|дней|недел|месяц|лет|процент|%)/i.test(txt);
  const hasBenefits = /экономи|сэкономи|сохрани|получи|вместо|без|не нужно/i.test(txt);
  const hasComparison = /дешевле|быстрее|удобнее|лучше.чем|в отличие.от|по сравнению/i.test(txt);
  const hasNegativeAnti = /не стоит|нельзя|ошибка|проблема|риск|избегай/i.test(txt);

  chk('Нет рекламных клише', !adWords, 'LLM игнорирует "лучший в мире" — замени на факты');
  chk('Конкретные единицы (число+ед.изм)', hasSpecific, 'Пиши "28 руб/км" вместо "выгодная цена"');
  chk('Выгоды через конкретику', hasBenefits, 'Покажи что экономит/даёт пользователь');
  chk('Сравнение с альтернативами', hasComparison, 'LLM любит "дешевле поезда на X руб"');
  chk('Упоминание рисков/ошибок', hasNegativeAnti, 'Контент с "чего избегать" часто попадает в ответы');

  // Schema.org
  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')];
  const sTypes = new Set();
  schemas.forEach(s=>{ try{ const d=JSON.parse(s.textContent); const ex=(o)=>{ if(!o)return;if(o['@type'])sTypes.add(o['@type']);if(o['@graph'])o['@graph'].forEach(ex);};ex(d); }catch(e){} });

  const schemaNeeded = ['FAQPage','HowTo','Article','Review','LocalBusiness','BreadcrumbList'];
  schemaNeeded.forEach(type =>
    chk(`Schema: ${type}`, [...sTypes].some(t=>t.toLowerCase().includes(type.toLowerCase())), `Добавь Schema ${type}`)
  );

  const geoTotal = scores.ok + scores.fail;
  const geoPct = Math.round(scores.ok/geoTotal*100);

  AUDIT_STORE.geo = {
    score: geoPct,
    total: geoTotal,
    passed: scores.ok,
    failed: scores.fail,
    issues: geoIssues,
    foundQuestions: txt.match(/[^.!?]*\?/g)?.filter(q=>q.trim().length>15).slice(0,8)||[],
    schemaTypes: [...sTypes],
    wordCount: wc,
    questionCount: questionCount,
    h2list: h2list,
    h3list: h3list.slice(0,8),
  };

  // Вывод GEO в консоль
  console.log('%c\n🤖 GEO CONTENT AUDIT — '+geoPct+'% готовности','font-weight:bold;font-size:14px;color:#7c3aed');
  console.log('%c  ✅ '+scores.ok+' / '+geoTotal+' сигналов пройдено','color:#6b7280');
  if (geoIssues.length){
    console.group('%c📋 ЧТО ДОБАВИТЬ В КОНТЕНТ','font-weight:bold;color:#7c3aed');
    console.table(geoIssues);
    console.groupEnd();
  }

})();


// ════════════════════════════════════════════════════════════════════
// ЧАСТЬ 3: SEO ON-PAGE CHECKER
// ════════════════════════════════════════════════════════════════════
(function SEO_ONPAGE_CHECKER() {

  const keywords = WORDSTAT_KEYWORDS
    .trim().split('\n')
    .map(line => {
      const parts = line.trim().split(/\t+/);
      return { kw: parts[0].trim().toLowerCase(), freq: parseInt(parts[1]) || 0 };
    })
    .filter(x => x.kw)
    .sort((a, b) => b.freq - a.freq);

  if (!keywords.length) {
    AUDIT_STORE.seo = { skipped: true, reason: 'Нет ключевых слов в WORDSTAT_KEYWORDS' };
    return;
  }

  const maxFreq = Math.max(...keywords.map(x => x.freq));
  const url         = location.href.toLowerCase();
  const title       = (document.querySelector('title')?.textContent || '').toLowerCase();
  const desc        = (document.querySelector('meta[name="description"]')?.content || '').toLowerCase();
  const h1s         = [...document.querySelectorAll('h1')].map(e => e.innerText.toLowerCase());
  const h2s         = [...document.querySelectorAll('h2')].map(e => e.innerText.toLowerCase());
  const bodyText    = document.body.innerText.toLowerCase().replace(/\s+/g, ' ');
  const wordCount   = bodyText.split(/\s+/).filter(Boolean).length;
  const firstPara   = bodyText.split(' ').slice(0, 150).join(' ');
  const altsText    = [...document.querySelectorAll('img[alt]')].map(i => i.alt.toLowerCase()).join(' ');

  function hasPhrase(text, phrase) { return text.includes(phrase); }
  function hasWords(text, phrase) { return phrase.split(' ').every(word => word.length > 2 && text.includes(word)); }
  function countPhrase(text, phrase) { return (text.split(phrase).length - 1); }
  function icon(bool) { return bool ? '✅' : '—'; }

  const results = keywords.map(({ kw, freq }) => {
    const inUrl       = hasWords(url, kw);
    const inTitle     = hasPhrase(title, kw);
    const inTitleW    = !inTitle && hasWords(title, kw);
    const inDesc      = hasPhrase(desc, kw);
    const inH1        = h1s.some(h => hasPhrase(h, kw));
    const inH1W       = !inH1 && h1s.some(h => hasWords(h, kw));
    const inH2        = h2s.some(h => hasPhrase(h, kw));
    const inFirstPara = hasWords(firstPara, kw);
    const inAlts      = hasWords(altsText, kw);
    const mentions    = countPhrase(bodyText, kw);
    const density     = wordCount ? (mentions / wordCount * 100) : 0;

    const scoreTitle  = inTitle ? 40 : inTitleW ? 20 : 0;
    const scoreH1     = inH1   ? 25 : inH1W   ? 12 : 0;
    const scoreDesc   = inDesc  ? 20 : 0;
    const scoreH2     = inH2   ? 8  : 0;
    const scoreUrl    = inUrl   ? 4  : 0;
    const scorePara   = inFirstPara ? 3 : 0;
    const onPage      = Math.min(100, scoreTitle + scoreH1 + scoreDesc + scoreH2 + scoreUrl + scorePara);

    const freqW    = freq / maxFreq;
    const priority = Math.round((100 - onPage) * freqW);

    const status =
      onPage >= 75 ? '✅ хорошо'  :
      onPage >= 40 ? '⚠️ слабо'   :
                     '❌ не опт.';

    return {
      'запрос'      : kw,
      'частота'     : freq,
      'URL'         : icon(inUrl),
      'title'       : inTitle ? '✅' : inTitleW ? '⚡' : '—',
      'H1'          : inH1    ? '✅' : inH1W    ? '⚡' : '—',
      'desc'        : icon(inDesc),
      'H2'          : icon(inH2),
      '1й абзац'   : icon(inFirstPara),
      'alt img'    : icon(inAlts),
      'упом.'      : mentions,
      'плотность'  : density.toFixed(2) + '%',
      'score'       : onPage,
      'статус'      : status,
      '🔥 приоритет': priority,
    };
  });

  const urgent = [...results].sort((a, b) => b['🔥 приоритет'] - a['🔥 приоритет']).slice(0, 5);
  const needTitle = results.filter(r => r.title === '—' && r['🔥 приоритет'] > 10).slice(0,3).map(r => r['запрос']);
  const needH1    = results.filter(r => r.H1 === '—' && r['🔥 приоритет'] > 10).slice(0,3).map(r => r['запрос']);
  const needPara  = results.filter(r => r['1й абзац'] === '—' && r['🔥 приоритет'] > 8).slice(0,3).map(r => r['запрос']);

  AUDIT_STORE.seo = {
    keywords: keywords,
    results: results,
    urgent: urgent,
    recommendations: { title: needTitle, h1: needH1, firstPara: needPara },
    wordCount: wordCount,
  };

  // Вывод SEO в консоль
  console.group('%c\n🔍 SEO ON-PAGE CHECKER','font-weight:bold;font-size:14px;color:#1d4ed8');
  console.log('%c📊 '+keywords.length+' запросов · '+wordCount+' слов','color:#6b7280');
  console.table(results);
  console.log('%c\n🚨 ТОП-5 ПРИОРИТЕТОВ:','font-weight:bold;color:#c0392b');
  urgent.forEach((r, i) => {
    const missing = [
      !r.URL.includes('✅') && 'URL',
      r.title === '—' && 'title',
      r.H1 === '—' && 'H1',
      r.desc === '—' && 'description',
      r['1й абзац'] === '—' && 'первый абзац',
    ].filter(Boolean).join(', ');
    console.log(`  ${i+1}. "${r['запрос']}" (${r['частота']}/мес) — score ${r['score']}/100 | нет в: ${missing || 'везде есть'}`);
  });
  if (needTitle.length||needH1.length||needPara.length){
    console.log('%c\n📋 ТЗ КОПИРАЙТЕРУ:','font-weight:bold;color:#1a6b3c');
    if (needTitle.length) console.log(`  Title: → ${needTitle.join(' | ')}`);
    if (needH1.length)    console.log(`  H1: → ${needH1.join(' | ')}`);
    if (needPara.length)  console.log(`  Первый абзац: → ${needPara.join(' | ')}`);
  }
  console.groupEnd();

})();


// ════════════════════════════════════════════════════════════════════
// ЧАСТЬ 4: DEEP CONTENT AUDIT
// ════════════════════════════════════════════════════════════════════
(function CONTENT_AUDIT() {

  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script,style,nav,header,footer,aside,[class*="menu"],[class*="cookie"],[class*="popup"]')
    .forEach(el => el.remove());
  const rawText = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [];
  const allWordsRaw = rawText.match(/[а-яёa-zА-ЯЁA-Z]+/g) || [];
  const allWordsLow = allWordsRaw.map(w => w.toLowerCase());
  const totalWords = allWordsLow.length;
  const uniqueWords = new Set(allWordsLow).size;

  const STOP = new Set([
    'и','в','на','с','по','из','за','от','до','не','но','же','бы','ли',
    'что','это','как','для','при','или','все','уже','его','она',
    'они','был','там','где','нет','вас','наш','вам','вот','так',
    'если','очень','чтобы','которые','также','только','может',
    'быть','этот','этой','этом','после','через','когда','между',
    'более','будет','можно','нужно','самый','такой','свой','наши',
    'your','that','this','with','from','have','will','about','which',
    'также','именно','просто','данный','каждый','любой','сейчас'
  ]);

  const contentWords = allWordsLow.filter(w => !STOP.has(w) && w.length >= 3);
  const stopWordCount = allWordsLow.filter(w => STOP.has(w)).length;

  const freq = {};
  contentWords.forEach(w => { freq[w] = (freq[w]||0) + 1; });
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]);

  const topFreq = sorted[0]?.[1] || 0;
  const acadToshnota = (topFreq / Math.sqrt(totalWords) * 100).toFixed(1);
  const classicToshnota = ((topFreq/totalWords)*100).toFixed(2);

  const topWords = sorted.slice(0,30).map(([w,c]) => {
    const pct = (c/totalWords*100).toFixed(2);
    return { слово:w, кол_во:c, 'плотность%':pct, статус: parseFloat(pct) > 3 ? '🔴 ПЕРЕСПАМ' : parseFloat(pct) > 2 ? '🟡 высокая' : '🟢 норма' };
  });

  const bigrams = {};
  contentWords.forEach((w,i) => {
    if(i < contentWords.length-1) {
      const bg = w+' '+contentWords[i+1];
      bigrams[bg] = (bigrams[bg]||0)+1;
    }
  });
  const topBig = Object.entries(bigrams).filter(([,c])=>c>=2).sort((a,b)=>b[1]-a[1]).slice(0,25)
    .map(([p,c])=>({ фраза:p, упомин:c, плотность:(c/totalWords*100).toFixed(2)+'%' }));

  const trigrams = {};
  contentWords.forEach((w,i) => {
    if(i < contentWords.length-2) {
      const tg = w+' '+contentWords[i+1]+' '+contentWords[i+2];
      trigrams[tg] = (trigrams[tg]||0)+1;
    }
  });
  const topTri = Object.entries(trigrams).filter(([,c])=>c>=2).sort((a,b)=>b[1]-a[1]).slice(0,15)
    .map(([p,c])=>({ фраза:p, упомин:c }));

  const waterPct = (stopWordCount/totalWords*100).toFixed(1);
  const WATER = [
    'является','осуществляет','представляет','обеспечивает','позволяет',
    'данный','различный','следующий','соответствующий','необходимый',
    'важно','стоит','нужно','можно','следует','требуется',
    'высококачественный','профессиональный','уникальный','эффективный',
    'современный','инновационный','качественный','надёжный','надежный',
    'комплексный','индивидуальный','оптимальный','актуальный'
  ];
  const rawLow = rawText.toLowerCase();
  const waterFound = WATER.filter(w => rawLow.includes(w));
  const waterCount = WATER.reduce((s,w) => s + (rawLow.split(w).length-1), 0);

  const sentLengths = sentences.map(s => s.trim().split(/\s+/).filter(Boolean).length);
  const avgSentLen  = sentLengths.length ? (sentLengths.reduce((a,b)=>a+b,0)/sentLengths.length).toFixed(1) : 0;
  const longSents   = sentLengths.filter(l=>l>25).length;
  const shortSents  = sentLengths.filter(l=>l<5).length;
  const avgWordLen  = totalWords ? (allWordsLow.reduce((s,w)=>s+w.length,0)/totalWords).toFixed(1) : 0;

  const top5keys = sorted.slice(0,5).map(([w])=>w);
  const titleTxt = (document.querySelector('title')?.textContent||'').toLowerCase();
  const descTxt  = (document.querySelector('meta[name="description"]')?.content||'').toLowerCase();
  const h1Txt    = [...document.querySelectorAll('h1')].map(e=>e.innerText.toLowerCase()).join(' ');
  const h2Txt    = [...document.querySelectorAll('h2')].map(e=>e.innerText.toLowerCase()).join(' ');
  const altTxt   = [...document.querySelectorAll('img[alt]')].map(i=>i.alt.toLowerCase()).join(' ');
  const firstPar = rawText.toLowerCase().split(' ').slice(0,100).join(' ');

  const zoneMap = top5keys.map(kw=>({
    ключ: kw,
    title: titleTxt.includes(kw)?'✅':'—',
    h1: h1Txt.includes(kw)?'✅':'—',
    h2: h2Txt.includes(kw)?'✅':'—',
    description: descTxt.includes(kw)?'✅':'—',
    alt_img: altTxt.includes(kw)?'✅':'—',
    '1й абзац': firstPar.includes(kw)?'✅':'—',
  }));

  AUDIT_STORE.content = {
    totalWords,
    uniqueWords,
    acadToshnota,
    classicToshnota,
    topWords,
    topBigrams: topBig,
    topTrigrams: topTri,
    waterFound,
    waterCount,
    waterPct,
    readability: { avgSentLen, longSents, shortSents, avgWordLen, sentCount: sentences.length },
    zoneMap,
    sorted,
  };

  // Вывод Content Audit в консоль
  console.group('%c\n📝 DEEP CONTENT AUDIT','font-weight:bold;font-size:14px;color:#0891b2');
  console.log(`Слов: ${totalWords} | Уникальных: ${uniqueWords} | Тошнота акад.: ${acadToshnota}% (норма 2-3)`);
  console.log(`Предложений: ${sentences.length} | Средняя длина: ${avgSentLen} слов | Длинных: ${longSents}`);
  console.log(`Воды: ${waterPct}% | Слов-паразитов: ${waterCount}`);
  if (topWords.length) { console.log('%cТОП СЛОВ:','font-weight:bold'); console.table(topWords.slice(0,15)); }
  if (topBig.length)   { console.log('%cБИГРАММЫ:','font-weight:bold'); console.table(topBig.slice(0,10)); }
  if (zoneMap.length)  { console.log('%cКЛЮЧИ В ЗОНАХ:','font-weight:bold'); console.table(zoneMap); }
  console.groupEnd();

})();


// ════════════════════════════════════════════════════════════════════
// ФИНАЛЬНЫЙ ВЫВОД И ПУБЛИЧНЫЙ API
// ════════════════════════════════════════════════════════════════════

console.log('\n%c╔══════════════════════════════════════════════════════════════╗','color:#0f172a;font-weight:bold');
console.log('%c   MEGA AUDIT COMPLETE  ·  '+AUDIT_STORE.meta.hostname,'color:#0f172a;font-weight:bold;font-size:14px');
console.log('%c╠══════════════════════════════════════════════════════════════╣','color:#0f172a;font-weight:bold');
if(AUDIT_STORE.ux) console.log('%c   UX Score:    '+AUDIT_STORE.ux.score+'/100','color:#1e1b4b;font-weight:600');
if(AUDIT_STORE.geo) console.log('%c   GEO Score:   '+AUDIT_STORE.geo.score+'%','color:#7c3aed;font-weight:600');
if(AUDIT_STORE.seo && !AUDIT_STORE.seo.skipped) console.log('%c   SEO: '+AUDIT_STORE.seo.keywords.length+' ключей проверено','color:#1d4ed8;font-weight:600');
if(AUDIT_STORE.content) console.log('%c   Content: '+AUDIT_STORE.content.totalWords+' слов, тошнота '+AUDIT_STORE.content.acadToshnota+'%','color:#0891b2;font-weight:600');
console.log('%c╠══════════════════════════════════════════════════════════════╣','color:#0f172a;font-weight:bold');
console.log('%c   📋 Кнопка «Скопировать аудит» — в правом нижнем углу страницы','color:#16a34a;font-weight:700');
console.log('%c╠══════════════════════════════════════════════════════════════╣','color:#0f172a;font-weight:bold');
console.log('%c   Команды (опционально):','color:#6b7280;font-weight:600');
console.log('%c     uxAudit.copy()   — скопировать полный аудит в буфер','color:#6b7280');
console.log('%c     uxAudit.forAI()  — скопировать UX-данные для ИИ (компактнее)','color:#6b7280');
console.log('%c     uxAudit.panel()  — боковая UX-панель на странице','color:#6b7280');
console.log('%c     uxAudit.json()   — сырые данные всех аудитов','color:#6b7280');
console.log('%c╚══════════════════════════════════════════════════════════════╝','color:#0f172a;font-weight:bold');


// ─── ФУНКЦИЯ СБОРКИ ПОЛНОГО ОТЧЁТА (для копирования) ────────────
function buildDownload() {
  const lines = [];
  const d = AUDIT_STORE;
  const sep = '═'.repeat(60);

  lines.push(sep);
  lines.push('MEGA AUDIT — ПОЛНЫЙ ОТЧЁТ');
  lines.push('Сайт: '+d.meta.url);
  lines.push('Дата: '+d.meta.date+' '+d.meta.time);
  lines.push(sep);

  // UX
  if (d.ux) {
    lines.push('\n【UX DESIGN AUDIT v8】');
    lines.push('Дизайн-скор: '+d.ux.score+'/100 | Режим: '+d.ux.mode+' ('+d.ux.viewport+')');
    lines.push('Критичных: '+d.ux.counts.crit+' | Предупреждений: '+d.ux.counts.warn+' | Сигналов: '+d.ux.counts.signal+' | Инфо: '+d.ux.counts.info);
    if (d.ux._CHAINS.length) {
      lines.push('\nСвязанные проблемы:');
      d.ux._CHAINS.forEach(c => lines.push('  '+c));
    }
    if (d.ux._CRITS.length) {
      lines.push('\nКРИТИЧНЫЕ НАРУШЕНИЯ:');
      d.ux._CRITS.forEach(f => lines.push('  #'+f.num+' ['+f.cat+'] '+f.title+'\n    Почему: '+f.why+'\n    Исправить: '+f.fix));
    }
    if (d.ux._WARNS.length) {
      lines.push('\nПРЕДУПРЕЖДЕНИЯ:');
      d.ux._WARNS.forEach(f => lines.push('  #'+f.num+' ['+f.cat+'] '+f.title+'\n    Исправить: '+f.fix));
    }
    if (d.ux._SIGS.length) {
      lines.push('\nСИГНАЛЫ (требуют проверки):');
      d.ux._SIGS.forEach(f => lines.push('  #'+f.num+' '+f.title));
    }
    if (d.ux._OKS.length) {
      lines.push('\nЧТО РАБОТАЕТ:');
      d.ux._OKS.forEach(ok => lines.push('  ✅ '+ok.t));
    }
    lines.push('\n'+d.ux.forAI());
  }

  // GEO
  if (d.geo) {
    lines.push('\n'+sep);
    lines.push('【GEO CONTENT AUDIT】');
    lines.push('GEO-готовность: '+d.geo.score+'% ('+d.geo.passed+'/'+d.geo.total+')');
    lines.push('Слов: '+d.geo.wordCount+' | Вопросов: '+d.geo.questionCount);
    lines.push('Schema типы: '+(d.geo.schemaTypes.join(', ')||'нет'));
    if (d.geo.issues.length) {
      lines.push('\nЧТО ДОБАВИТЬ В КОНТЕНТ:');
      d.geo.issues.forEach(i => lines.push('  — '+i.сигнал+'\n    '+i.что_добавить));
    }
    if (d.geo.foundQuestions.length) {
      lines.push('\nНАЙДЕННЫЕ ВОПРОСЫ (потенциал для FAQ):');
      d.geo.foundQuestions.forEach((q,i) => lines.push('  '+(i+1)+'. '+q.trim().slice(0,100)));
    }
  }

  // SEO
  if (d.seo && !d.seo.skipped) {
    lines.push('\n'+sep);
    lines.push('【SEO ON-PAGE CHECKER】');
    lines.push('Ключевых слов: '+d.seo.keywords.length+' | Слов на странице: '+d.seo.wordCount);
    lines.push('\nТОП-5 ПРИОРИТЕТОВ (🔥 самые срочные):');
    d.seo.urgent.forEach((r, i) => {
      lines.push('  '+(i+1)+'. "'+r['запрос']+'" ('+r['частота']+'/мес) — score '+r['score']+'/100 | статус: '+r['статус']);
    });
    if (d.seo.recommendations.title.length||d.seo.recommendations.h1.length||d.seo.recommendations.firstPara.length) {
      lines.push('\nТЗ КОПИРАЙТЕРУ:');
      if (d.seo.recommendations.title.length) lines.push('  Title: добавить → '+d.seo.recommendations.title.join(' | '));
      if (d.seo.recommendations.h1.length)    lines.push('  H1: добавить → '+d.seo.recommendations.h1.join(' | '));
      if (d.seo.recommendations.firstPara.length) lines.push('  Первый абзац: → '+d.seo.recommendations.firstPara.join(' | '));
    }
    lines.push('\nПОЛНАЯ ТАБЛИЦА КЛЮЧЕЙ:');
    lines.push('запрос;частота;URL;title;H1;desc;H2;1й абзац;alt;упом;плотность;score;статус;приоритет');
    d.seo.results.forEach(r => {
      lines.push([r['запрос'],r['частота'],r.URL,r.title,r.H1,r.desc,r.H2,r['1й абзац'],r['alt img'],r['упом.'],r['плотность'],r['score'],r['статус'],r['🔥 приоритет']].join(';'));
    });
  }

  // Content
  if (d.content) {
    lines.push('\n'+sep);
    lines.push('【DEEP CONTENT AUDIT】');
    lines.push('Слов: '+d.content.totalWords+' | Уникальных: '+d.content.uniqueWords);
    lines.push('Тошнота академическая: '+d.content.acadToshnota+'% (норма 2-3)');
    lines.push('Тошнота классическая: '+d.content.classicToshnota+'% (норма <3%)');
    lines.push('Вода: '+d.content.waterPct+'% | Паразитов: '+d.content.waterCount);
    lines.push('Предложений: '+d.content.readability.sentCount+' | Средняя длина: '+d.content.readability.avgSentLen+' слов');
    if (d.content.waterFound.length) {
      lines.push('\nСЛОВА-ПАРАЗИТЫ ('+d.content.waterFound.length+'):');
      lines.push('  '+d.content.waterFound.join(', '));
    }
    lines.push('\nТОП-20 СЛОВ:');
    lines.push('слово;кол-во;плотность%;статус');
    d.content.topWords.slice(0,20).forEach(r => lines.push(r.слово+';'+r.кол_во+';'+r['плотность%']+';'+r.статус));
    if (d.content.topBigrams.length) {
      lines.push('\nБИГРАММЫ:');
      d.content.topBigrams.slice(0,15).forEach(r => lines.push('  "'+r.фраза+'" — '+r.упомин+'x ('+r.плотность+')'));
    }
    if (d.content.topTrigrams.length) {
      lines.push('\nТРИГРАММЫ:');
      d.content.topTrigrams.slice(0,10).forEach(r => lines.push('  "'+r.фраза+'" — '+r.упомин+'x'));
    }
    if (d.content.zoneMap.length) {
      lines.push('\nКЛЮЧИ В ЗОНАХ СТРАНИЦЫ:');
      lines.push('ключ;title;h1;h2;description;alt_img;1й абзац');
      d.content.zoneMap.forEach(r => lines.push(r.ключ+';'+r.title+';'+r.h1+';'+r.h2+';'+r.description+';'+r.alt_img+';'+r['1й абзац']));
    }
  }

  lines.push('\n'+sep);
  lines.push('Отчёт сгенерирован: '+new Date().toLocaleString('ru-RU'));
  lines.push(sep);

  return lines.join('\n');
}

// ─── КОПИРОВАНИЕ В БУФЕР ОБМЕНА ──────────────────────────────────
function copyToClipboard(text, onSuccess, onFail) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess, function() {
      // Fallback если clipboard API отказал
      legacyCopy(text, onSuccess, onFail);
    });
  } else {
    legacyCopy(text, onSuccess, onFail);
  }
}

function legacyCopy(text, onSuccess, onFail) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    ok ? onSuccess() : onFail('execCommand вернул false');
  } catch(e) {
    onFail(e);
  }
}

// ─── ПУБЛИЧНЫЙ API ───────────────────────────────────────────────
window.uxAudit = {

  // Скопировать полный аудит (UX + GEO + SEO + Content) в буфер
  copy: function() {
    const text = buildDownload();
    copyToClipboard(
      text,
      function() {
        console.log('%c✅ Полный аудит скопирован в буфер обмена! Вставляй в Claude/ChatGPT.','color:#16a34a;font-weight:700;font-size:13px');
        console.log('%c   Символов: '+text.length,'color:#6b7280');
      },
      function(err) {
        console.warn('⚠️ Не удалось скопировать автоматически. Текст выведен ниже — скопируй вручную (Ctrl+A, Ctrl+C):');
        console.log(text);
      }
    );
    return text;
  },

  // Скопировать только UX-блок данных для ИИ (компактнее, только UX)
  forAI: function() {
    if (!AUDIT_STORE.ux) { console.log('UX аудит не выполнен'); return; }
    const text = AUDIT_STORE.ux.forAI();
    copyToClipboard(
      text,
      function() {
        console.log('%c✅ UX-данные для ИИ скопированы! Вставляй в Claude/ChatGPT.','color:#0891b2;font-weight:700;font-size:13px');
      },
      function() {
        console.log('%c=== UX ДАННЫЕ ДЛЯ ИИ (скопируй вручную) ===','color:#0891b2;font-weight:700;font-size:13px');
        console.log(text);
        console.log('%c=== КОНЕЦ ===','color:#0891b2;font-weight:700');
      }
    );
    return text;
  },

  // Показать/скрыть боковую UX-панель на странице
  panel: function() {
    if (AUDIT_STORE.ux && AUDIT_STORE.ux.buildPanel) AUDIT_STORE.ux.buildPanel();
  },

  // Сырые данные всех аудитов в консоль
  json: function() {
    console.log(AUDIT_STORE);
    return AUDIT_STORE;
  }
};

// ─── КНОПКА «СКОПИРОВАТЬ АУДИТ» НА СТРАНИЦЕ ─────────────────────
(function buildCopyButton(){
  const existing = document.getElementById('mega-audit-copy-btn');
  if (existing) existing.remove();

  const btn = document.createElement('div');
  btn.id = 'mega-audit-copy-btn';

  const setContent = (icon, title, sub) => {
    btn.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">${icon}</div>
        <div>
          <div style="font-weight:700;font-size:13px;color:#fff;line-height:1.3;">${title}</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.65);margin-top:1px;">${sub}</div>
        </div>
      </div>
    `;
  };

  setContent('📋', 'Скопировать аудит', 'UX + GEO + SEO + Content');

  Object.assign(btn.style, {
    position:   'fixed',
    bottom:     '24px',
    right:      '24px',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    borderRadius: '14px',
    padding:    '11px 18px',
    cursor:     'pointer',
    zIndex:     '2147483645',
    boxShadow:  '0 4px 20px rgba(49,46,129,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
    fontFamily: 'system-ui,-apple-system,sans-serif',
    userSelect: 'none',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    minWidth:   '210px',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform  = 'translateY(-2px) scale(1.02)';
    btn.style.boxShadow  = '0 8px 30px rgba(49,46,129,0.7), 0 0 0 1px rgba(255,255,255,0.13)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '0 4px 20px rgba(49,46,129,0.55), 0 0 0 1px rgba(255,255,255,0.08)';
  });

  btn.addEventListener('click', () => {
    setContent('⏳', 'Копирую...', 'собираю все данные');
    btn.style.pointerEvents = 'none';

    const text = buildDownload();
    copyToClipboard(
      text,
      function() {
        setContent('✅', 'Скопировано!', text.length.toLocaleString('ru-RU')+' символов · вставляй в ИИ');
        btn.style.background = 'linear-gradient(135deg, #15803d 0%, #166534 100%)';
        btn.style.boxShadow  = '0 4px 20px rgba(22,163,74,0.5), 0 0 0 1px rgba(255,255,255,0.1)';
        setTimeout(() => {
          setContent('📋', 'Скопировать ещё раз', 'UX + GEO + SEO + Content');
          btn.style.background = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)';
          btn.style.boxShadow  = '0 4px 20px rgba(49,46,129,0.55), 0 0 0 1px rgba(255,255,255,0.08)';
          btn.style.pointerEvents = '';
        }, 3500);
      },
      function() {
        setContent('⚠️', 'Не скопировалось', 'открой консоль → uxAudit.copy()');
        btn.style.background = 'linear-gradient(135deg, #92400e 0%, #b45309 100%)';
        setTimeout(() => {
          setContent('📋', 'Скопировать аудит', 'UX + GEO + SEO + Content');
          btn.style.background = 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)';
          btn.style.boxShadow  = '0 4px 20px rgba(49,46,129,0.55), 0 0 0 1px rgba(255,255,255,0.08)';
          btn.style.pointerEvents = '';
          // В fallback — выводим в консоль
          console.log('%c📋 ПОЛНЫЙ АУДИТ (скопируй вручную из консоли):','color:#7c3aed;font-weight:700;font-size:13px');
          console.log(text);
        }, 3000);
      }
    );
  });

  document.body.appendChild(btn);
})();

})();

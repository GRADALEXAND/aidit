/**
 * MEGA AUDIT v2 — ПОЛНЫЙ АУДИТ СТРАНИЦЫ
 * UX Design Audit v8 + GEO Content Audit + SEO On-Page Checker + Deep Content Audit
 *
 * ЗАПУСК: вставить в консоль браузера → Enter
 * ПОСЛЕ ЗАПУСКА — кнопка «📋 Скопировать аудит» в правом нижнем углу
 *
 * ВОРДСТАТ: замени блок WORDSTAT_KEYWORDS своими запросами перед запуском
 */

const WORDSTAT_KEYWORDS = `
такси межгород	25065
трансфер из москвы	2949
заказать трансфер	6865
`;

(function MEGA_AUDIT_V1() {
'use strict';

const AUDIT_STORE = {
  ux: null, geo: null, seo: null, content: null,
  meta: {
    url: location.href,
    hostname: location.hostname,
    date: new Date().toISOString().slice(0,10),
    time: new Date().toLocaleTimeString('ru-RU'),
  }
};

// ════════════════════════════════════════════════════════════
// ЧАСТЬ 1: UX DESIGN AUDIT v8
// ════════════════════════════════════════════════════════════
(function UX_AUDIT_V8() {
  ['ux8-panel','ux8-tip'].forEach(function(id){var el=document.getElementById(id);if(el)el.remove();});
  document.querySelectorAll('[data-ux8]').forEach(function(el){el.removeAttribute('data-ux8');el.style.outline='';el.style.outlineOffset='';});

  var VW=window.innerWidth,VH=window.innerHeight;
  var isMob=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||navigator.maxTouchPoints>1;
  var MODE=(VW<=768||(isMob&&VW<=1024))?'mobile':VW<=1024?'tablet':'desktop';
  var MRU={mobile:'Мобильный',tablet:'Планшет',desktop:'Десктоп'}[MODE];
  var NORM={mobile:{fontMin:16,lhMin:1.4,lhMax:1.8,ctaH:44,touch:44},tablet:{fontMin:15,lhMin:1.4,lhMax:1.8,ctaH:44,touch:44},desktop:{fontMin:14,lhMin:1.3,lhMax:1.9,ctaH:36,touch:32}}[MODE];
  var SEV_COLOR={crit:'#ef4444',warn:'#f59e0b',info:'#3b82f6',signal:'#8b5cf6'};

  function isReallyVisible(el){
    if(!el||el===document.documentElement)return false;
    if(el.closest&&(el.closest('#ux8-panel')||el.closest('#ux8-tip')||el.closest('#mega-audit-panel')))return false;
    var rect=el.getBoundingClientRect();
    if(rect.width<=0||rect.height<=0)return false;
    var s=window.getComputedStyle(el);
    if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)<0.1)return false;
    var p=el.parentElement;
    while(p&&p!==document.documentElement){
      var ps=window.getComputedStyle(p);
      if(ps.display==='none'||ps.visibility==='hidden')return false;
      if(parseFloat(ps.opacity)<0.1)return false;
      if(parseFloat(ps.height)<2&&ps.overflow==='hidden')return false;
      p=p.parentElement;
    }
    var slide=el.closest&&el.closest('[class*="slide"],[class*="swiper-slide"],[class*="slick-slide"]');
    if(slide&&(window.getComputedStyle(slide).display==='none'||slide.getAttribute('aria-hidden')==='true'))return false;
    return true;
  }

  function isAboveFold(el){var r=el.getBoundingClientRect();var st=window.pageYOffset||document.documentElement.scrollTop;return(r.top+st)<VH&&(r.bottom+st)>0;}
  function elText(el){return(el?(el.textContent||'').trim().replace(/\s+/g,' '):'');}
  function elLabel(el){
    if(!el||el===document.body)return'body';
    var tag=(el.tagName||'').toLowerCase();
    if(tag==='img'){var alt=el.getAttribute('alt');return alt?'img[alt="'+alt.slice(0,35)+'"]':'img["'+(el.src||'').split('/').pop().slice(0,25)+'"]';}
    if(el.id&&el.id.length<25&&!/^\d/.test(el.id))return tag+'#'+el.id;
    var aria=el.getAttribute('aria-label');if(aria)return tag+'[aria-label="'+aria.slice(0,30)+'"]';
    var t=elText(el).slice(0,40);if(t)return tag+'("'+t+'")';
    var cls=(el.className||'').toString().split(' ').filter(function(c){return c&&c.length<20&&!/^\d/.test(c);}).slice(0,2).join('.');
    return cls?tag+'.'+cls:tag;
  }
  function colorToHex(c){try{var cv=document.createElement('canvas');cv.width=cv.height=1;var ctx=cv.getContext('2d');ctx.fillStyle=c;ctx.fillRect(0,0,1,1);var d=ctx.getImageData(0,0,1,1).data;return'#'+[d[0],d[1],d[2]].map(function(v){return v.toString(16).padStart(2,'0');}).join('');}catch(e){return'#808080';}}
  function colorSaturation(c){try{var cv=document.createElement('canvas');cv.width=cv.height=1;var ctx=cv.getContext('2d');ctx.fillStyle=c;ctx.fillRect(0,0,1,1);var d=ctx.getImageData(0,0,1,1).data;return Math.max(d[0],d[1],d[2])-Math.min(d[0],d[1],d[2]);}catch(e){return 0;}}

  var FINDINGS=[],FID=0,MARKED=new Set(),FMAP={};

  function addFinding(el,sev,cat,title,why,fix,metric){
    if(el&&el!==document.body){var cur=el.parentElement;while(cur&&cur!==document.documentElement){if(MARKED.has(cur))return null;cur=cur.parentElement;}}
    FID++;var num=String(FID).padStart(3,'0');
    var f={id:'ux8_'+FID,num:num,sev:sev,cat:cat,title:title,why:why,fix:fix,metric:metric||null,el:el,label:elLabel(el)};
    FINDINGS.push(f);FMAP[f.id]=f;
    if(el&&el!==document.body&&el!==document.documentElement&&el.style){
      MARKED.add(el);el.dataset.ux8=f.id;
      el.style.outline=sev==='crit'?'3px solid '+SEV_COLOR.crit:sev==='warn'?'2px dashed '+SEV_COLOR.warn:sev==='signal'?'2px dashed '+SEV_COLOR.signal:'1px dashed '+SEV_COLOR.info;
      el.style.outlineOffset='2px';
    }
    return f;
  }

  function addGroup(els,sev,cat,title,why,fix,metric){
    if(!els||!els.length)return;
    var valid=els.filter(function(el){return el&&!MARKED.has(el);});if(!valid.length)return;
    FID++;var num=String(FID).padStart(3,'0');
    var examples=valid.slice(0,3).map(elLabel);
    var exStr=examples.join(', ')+(valid.length>3?' +ещё '+(valid.length-3):'');
    var f={id:'ux8_'+FID,num:num,sev:sev,cat:cat,title:title+' ('+valid.length+' эл.)',why:why,fix:fix,metric:Object.assign({},metric||{},{примеры:exStr}),el:valid[0],label:exStr,isGroup:true,count:valid.length};
    FINDINGS.push(f);FMAP[f.id]=f;
    valid.forEach(function(el){MARKED.add(el);if(el.style){el.dataset.ux8=f.id;el.style.outline=sev==='crit'?'3px solid '+SEV_COLOR.crit:sev==='warn'?'2px dashed '+SEV_COLOR.warn:'2px dashed '+SEV_COLOR.signal;el.style.outlineOffset='2px';}});
    return f;
  }

  var TIP=document.createElement('div');TIP.id='ux8-tip';
  Object.assign(TIP.style,{position:'fixed',zIndex:'2147483647',background:'#fff',borderRadius:'10px',padding:'12px 14px',maxWidth:'320px',minWidth:'220px',boxShadow:'0 6px 32px rgba(0,0,0,.2)',fontFamily:'system-ui,-apple-system,sans-serif',fontSize:'12px',lineHeight:'1.55',pointerEvents:'none',display:'none'});
  document.body.appendChild(TIP);

  document.addEventListener('mousemove',function(e){
    if(TIP.contains(e.target))return;
    var el=e.target,found=null;
    for(var i=0;i<8;i++){if(!el||el===document.body)break;if(el.dataset&&el.dataset.ux8){found=el;break;}el=el.parentElement;}
    if(found&&FMAP[found.dataset.ux8]){showTip(FMAP[found.dataset.ux8],e.clientX,e.clientY);}else{TIP.style.display='none';}
  },true);

  function showTip(f,x,y){
    var SC=SEV_COLOR[f.sev]||SEV_COLOR.info;
    var BC=f.sev==='crit'?'#fef2f2':f.sev==='warn'?'#fffbeb':f.sev==='signal'?'#f5f3ff':'#eff6ff';
    var EM=f.sev==='crit'?'❌':f.sev==='warn'?'⚠️':f.sev==='signal'?'🔍':'ℹ️';
    var LV=f.sev==='crit'?'Критично':f.sev==='warn'?'Предупреждение':f.sev==='signal'?'Сигнал':'Инфо';
    TIP.style.border='1px solid '+SC;
    TIP.innerHTML='<div style="background:'+BC+';margin:-12px -14px 10px;padding:8px 14px;border-radius:9px 9px 0 0;border-bottom:1px solid '+SC+'30;"><span style="font-size:10px;font-weight:700;color:'+SC+';">'+EM+' '+LV+' · #'+f.num+'</span><div style="font-weight:700;font-size:12px;color:#111;margin-top:2px;">'+f.cat+'</div></div><div style="font-weight:600;font-size:12px;color:#111;margin-bottom:6px;">'+f.title+'</div><div style="color:#555;font-size:11px;margin-bottom:8px;"><b style="color:#374151;">Почему:</b> '+f.why+'</div><div style="background:#f0fdf4;border-radius:6px;padding:6px 9px;font-size:11px;color:#166534;"><b>✓ Исправить:</b> '+f.fix+'</div>'+(f.metric?'<div style="margin-top:6px;font-size:10px;color:#9ca3af;">'+Object.entries(f.metric).map(function(kv){return kv[0]+': '+kv[1];}).join(' · ')+'</div>':'')+'<div style="margin-top:5px;font-size:10px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:4px;">📍 '+f.label+'</div>';
    TIP.style.display='block';
    var w=TIP.offsetWidth||300,h=TIP.offsetHeight||200;
    var lx=x+16,ly=y+16;
    if(lx+w>VW-8)lx=x-w-10;if(ly+h>VH-8)ly=y-h-10;
    TIP.style.left=Math.max(4,lx)+'px';TIP.style.top=Math.max(4,ly)+'px';
  }

  var L1={};

  // 1.1 ПЕРВЫЙ ЭКРАН
  (function(){
    var foldEls=Array.from(document.querySelectorAll('*')).filter(function(el){return isReallyVisible(el)&&isAboveFold(el);});
    var ctaRx=/заказ|купи|записа|получи|заявк|позвони|рассчита|начать|попробо|скачать|старт|start|get|buy|sign/i;
    var h1=foldEls.find(function(el){return el.tagName==='H1';});
    L1.h1OnFold=!!h1;L1.h1Text=h1?elText(h1).slice(0,80):'';
    if(!h1){addFinding(document.querySelector('h1')||document.body,'crit','Первый экран','H1 не виден без скролла','Решение "остаться или уйти" принимается за 0–3 сек.','Переместить H1 выше линии fold.',null);}
    else if(elText(h1).length<12){addFinding(h1,'warn','Первый экран','H1 слишком короткий','Не объясняет ЧТО предлагается и КОМУ.','H1: что + кому + выгода. Минимум 20 символов.',{длина:elText(h1).length+' симв.'});}
    var desc=foldEls.find(function(el){return(el.tagName==='P'||el.tagName==='H2')&&elText(el).length>25;});
    L1.hasDesc=!!desc;L1.descText=desc?elText(desc).slice(0,100):'';
    if(h1&&!desc){addFinding(h1,'warn','Первый экран','H1 без подзаголовка','Пользователь не понимает выгоду.','Добавить подзаголовок: что + кому + выгода.',null);}
    var ctas=foldEls.filter(function(el){return(el.tagName==='BUTTON'||el.getAttribute('role')==='button'||(el.tagName==='A'&&el.href))&&ctaRx.test(elText(el));});
    L1.ctaOnFoldCount=ctas.length;L1.ctaOnFoldTexts=ctas.map(function(el){return elText(el).slice(0,30);});
    if(!ctas.length){addFinding(document.body,'crit','Первый экран','Нет CTA на первом экране','Без кнопки конверсия падает на 30–50%.','Добавить одну главную кнопку.',null);}
    else if(ctas.length>2){addFinding(ctas[0],'warn','Первый экран',ctas.length+' CTA — паралич выбора','Закон Хика.','Оставить 1 CTA.',{CTA:ctas.length});}
    var trustQ='[class*="review"],[class*="rating"],[class*="trust"],[class*="logo"],[class*="partner"],[class*="client"],[class*="award"]';
    L1.hasTrust=foldEls.some(function(el){return el.matches&&el.matches(trustQ);});
    if(!L1.hasTrust){addFinding(document.body,'info','Первый экран','Нет сигналов доверия','90% оценивают доверие за 3 сек.','Добавить рейтинг или лого клиентов.',null);}
  })();

  // 1.2 ТИПОГРАФИКА
  (function(){
    var bcs=window.getComputedStyle(document.body);
    var bfs=parseFloat(bcs.fontSize);
    var blhRaw=bcs.lineHeight;
    var blh=blhRaw==='normal'?1.5:parseFloat(blhRaw)/bfs;
    L1.bodyFont=bfs;L1.bodyLH=+blh.toFixed(2);
    if(bfs<NORM.fontMin){addFinding(document.body,'crit','Типографика','Шрифт body: '+bfs+'px < '+NORM.fontMin+'px',MODE==='mobile'?'iOS зумирует при focus если < 16px.':'Увеличивает когнитивную нагрузку.','font-size: '+NORM.fontMin+'px на body.',{текущий:bfs+'px',норма:NORM.fontMin+'px'});}
    if(blh<NORM.lhMin){addFinding(document.body,'crit','Типографика','line-height: '+blh.toFixed(2)+' — строки сливаются','Скорость чтения падает на 20–30%.','line-height: 1.5–1.6.',{текущий:blh.toFixed(2),норма:NORM.lhMin});}
    var families={};
    Array.from(document.querySelectorAll('h1,h2,h3,p,button,a,li')).filter(function(el){return isReallyVisible(el);}).slice(0,80).forEach(function(el){
      var ff=window.getComputedStyle(el).fontFamily.split(',')[0].trim().replace(/['"]/g,'');
      var tag=el.tagName.toLowerCase();
      var role=/h[1-4]/i.test(tag)?'заголовок':/button|a/.test(tag)?'кнопка':'текст';
      if(!families[ff])families[ff]=new Set();families[ff].add(role);
    });
    L1.fontFamilies=Object.keys(families).map(function(ff){return{name:ff,uses:Array.from(families[ff]).join(', ')};});
    if(L1.fontFamilies.length>3){addFinding(document.body,'warn','Типографика','Много гарнитур: '+L1.fontFamilies.length,'Nielsen: максимум 2.','Оставить 2 шрифта.',{гарнитуры:L1.fontFamilies.map(function(f){return f.name;}).join(', ')});}
  })();

  // 1.3 ВИЗУАЛЬНАЯ ИЕРАРХИЯ
  (function(){
    var heads={};
    ['H1','H2','H3','H4'].forEach(function(tag){var el=Array.from(document.querySelectorAll(tag)).find(isReallyVisible);if(el)heads[tag]={el:el,fs:parseFloat(window.getComputedStyle(el).fontSize),fw:parseInt(window.getComputedStyle(el).fontWeight)||400};});
    L1.headings={};Object.keys(heads).forEach(function(k){L1.headings[k]={fs:heads[k].fs,fw:heads[k].fw};});
    [['H1','H2'],['H2','H3'],['H3','H4']].forEach(function(pair){
      var big=heads[pair[0]],sm=heads[pair[1]];if(!big||!sm)return;
      var r=+(big.fs/sm.fs).toFixed(2);
      if(r<1.15){addFinding(big.el,'crit','Иерархия',pair[0]+'('+big.fs+'px) ≈ '+pair[1]+'('+sm.fs+'px) ratio '+r,'Разница не считывается за 1 сек.',pair[0]+' минимум '+Math.round(sm.fs*1.28)+'px.',{ratio:r,норма:'>1.25'});}
      else if(r<1.25){addFinding(big.el,'warn','Иерархия',pair[0]+'/'+pair[1]+' ratio='+r+' — слабая','Пользователь замедляется.','Ratio ≥1.3.',{ratio:r});}
    });
    var allH1=Array.from(document.querySelectorAll('h1')).filter(isReallyVisible);
    L1.h1Count=allH1.length;
    if(allH1.length>1){addFinding(allH1[1],'warn','Иерархия',allH1.length+' H1 — нет доминанты','Один H1 = одна точка притяжения.','Оставить один H1.',{найдено:allH1.length});}
  })();

  // 1.4 CTA
  (function(){
    var ctaRx=/заказ|купи|записа|получи|заявк|позвони|рассчита|начать|попробо|скачать/i;
    var allCTAs=Array.from(document.querySelectorAll('button,[role="button"],a')).filter(function(el){return ctaRx.test(elText(el))&&isReallyVisible(el)&&el.offsetHeight>10;});
    L1.allCTATexts=allCTAs.map(function(el){return elText(el).slice(0,40);});
    allCTAs.slice(0,8).forEach(function(btn){
      var h=btn.offsetHeight;
      if(h<NORM.ctaH){addFinding(btn,'crit','CTA','CTA "'+elText(btn).slice(0,30)+'": '+h+'px < '+NORM.ctaH+'px','Промахи при нажатии.','padding: '+(MODE==='mobile'?'14px 28px':'10px 24px')+'.',{высота:h+'px',норма:NORM.ctaH+'px'});}
    });
    var allBtns=Array.from(document.querySelectorAll('button,[role="button"]')).filter(function(el){return isReallyVisible(el)&&el.offsetHeight>20;});
    L1.totalButtons=allBtns.length;
    if(allBtns.length>8){addFinding(document.body,'warn','Когнитивная нагрузка',allBtns.length+' кнопок — паралич выбора','Закон Хика.','1 CTA на экран.',{кнопок:allBtns.length});}
  })();

  // 1.5 ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ И АНИМАЦИИ
  (function(){
    L1.hScroll=document.documentElement.scrollWidth>VW+5;
    if(L1.hScroll){addFinding(document.body,'crit','Вёрстка','Горизонтальный скролл: +'+(document.documentElement.scrollWidth-VW)+'px','Сломанная вёрстка.','max-width:100% на виновнике.',{переполнение:(document.documentElement.scrollWidth-VW)+'px'});}
    L1.pageScreens=Math.round(document.body.scrollHeight/VH);
  })();

  // 1.6 ИЗОБРАЖЕНИЯ
  (function(){
    var imgs=Array.from(document.querySelectorAll('img')).filter(isReallyVisible);
    L1.imgsTotal=imgs.length;
    var noAlt=imgs.filter(function(el){return!el.hasAttribute('alt');}).slice(0,3);
    L1.noAltCount=noAlt.length;
    noAlt.forEach(function(img){addFinding(img,'warn','Изображения',elLabel(img)+' — нет alt','SEO не видит содержимое.','alt="" для декоративных.',null);});
  })();

  // ИТОГ UX
  var CRITS=FINDINGS.filter(function(f){return f.sev==='crit';});
  var WARNS=FINDINGS.filter(function(f){return f.sev==='warn';});
  var SIGS=FINDINGS.filter(function(f){return f.sev==='signal';});
  var INFOS=FINDINGS.filter(function(f){return f.sev==='info';});
  var critCats=new Set(CRITS.map(function(f){return f.cat+'_'+f.title.slice(0,15);}));
  var warnCats=new Set(WARNS.map(function(f){return f.cat+'_'+f.title.slice(0,15);}));
  var SCORE=Math.max(0,Math.min(100,Math.round(100-critCats.size*12-warnCats.size*4)));
  var L2={uniqueColors:0,topColors:[]};
  var OKS=[];
  if(L1.h1OnFold&&L1.h1Text.length>=12)OKS.push({t:'H1 виден на первом экране',i:'Снижает отказы'});
  if(!L1.hScroll)OKS.push({t:'Нет горизонтального скролла',i:'Вёрстка не сломана'});
  var CHAINS=[];
  if(!L1.h1OnFold&&!L1.ctaOnFoldCount)CHAINS.push('🔴🔴 ДВОЙНОЙ УДАР: нет H1 + нет CTA → отказ >70%');

  function buildForAI(){
    var lines=[];
    lines.push('=== UX ДАННЫЕ ДЛЯ АНАЛИЗА ===');
    lines.push('Сайт: '+location.hostname);
    lines.push('Title: '+document.title);
    lines.push('H1: "'+(L1.h1Text||'отсутствует')+'"');
    lines.push('CTA на первом экране: '+(L1.ctaOnFoldTexts.length?L1.ctaOnFoldTexts.join(', '):'нет'));
    lines.push('H2: '+Array.from(document.querySelectorAll('h2')).filter(isReallyVisible).map(function(el){return elText(el).slice(0,60);}).join(' | '));
    lines.push('font-size body: '+L1.bodyFont+'px | line-height: '+L1.bodyLH);
    lines.push('Горизонтальный скролл: '+(L1.hScroll?'ДА':'нет'));
    lines.push('');
    lines.push('КРИТИЧНЫЕ:');
    CRITS.forEach(function(f){lines.push('  ❌ #'+f.num+' ['+f.cat+'] '+f.title+' | '+f.fix);});
    lines.push('ПРЕДУПРЕЖДЕНИЯ:');
    WARNS.forEach(function(f){lines.push('  ⚠️ #'+f.num+' ['+f.cat+'] '+f.title+' | '+f.fix);});
    if(CHAINS.length){lines.push('СВЯЗАННЫЕ ПРОБЛЕМЫ:');CHAINS.forEach(function(c){lines.push('  '+c);});}
    if(OKS.length){lines.push('ЧТО РАБОТАЕТ:');OKS.forEach(function(o){lines.push('  ✅ '+o.t);});}
    return lines.join('\n');
  }

  AUDIT_STORE.ux={score:SCORE,mode:MRU,viewport:VW+'×'+VH,findings:FINDINGS.map(function(f){return{num:f.num,sev:f.sev,cat:f.cat,title:f.title,element:f.label,why:f.why,fix:f.fix,metric:f.metric};}),counts:{crit:CRITS.length,warn:WARNS.length,signal:SIGS.length,info:INFOS.length},oks:OKS,chains:CHAINS,l1:L1,l2:L2,forAI:buildForAI,_CRITS:CRITS,_WARNS:WARNS,_SIGS:SIGS,_INFOS:INFOS,_OKS:OKS,_CHAINS:CHAINS,buildPanel:null};

  var SC=SCORE>=70?'color:#16a34a;font-weight:900;font-size:20px':SCORE>=45?'color:#d97706;font-weight:900;font-size:20px':'color:#dc2626;font-weight:900;font-size:20px';
  console.log('\n%c UX DESIGN AUDIT v8 · '+MRU+' · '+location.hostname,'color:#1e1b4b;font-weight:bold;font-size:13px');
  console.log('%c  ДИЗАЙН-СКОР: '+SCORE+'/100',SC);
  console.log('%c  ❌ '+CRITS.length+' критичных  ⚠️ '+WARNS.length+' предупреждений  ✅ '+OKS.length+' хорошо','font-size:12px;color:#374151');
  if(CRITS.length>0){console.group('%c❌ КРИТИЧНЫЕ','color:#dc2626;font-weight:700');CRITS.forEach(function(f){console.log('  #'+f.num+' ['+f.cat+'] '+f.title+' → '+f.fix);});console.groupEnd();}
  if(WARNS.length>0){console.group('%c⚠️ ПРЕДУПРЕЖДЕНИЯ','color:#d97706;font-weight:700');WARNS.forEach(function(f){console.log('  #'+f.num+' ['+f.cat+'] '+f.title);});console.groupEnd();}

  AUDIT_STORE.ux.buildPanel=function(){};
})();


// ════════════════════════════════════════════════════════════
// ЧАСТЬ 2: GEO CONTENT AUDIT
// ════════════════════════════════════════════════════════════
(function GEO_CONTENT_AUDIT() {
  var clone=document.body.cloneNode(true);
  clone.querySelectorAll('script,style,nav,header,footer,aside,[class*="menu"],[class*="cookie"]').forEach(function(el){el.remove();});
  var txt=(clone.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();
  var wc=txt.split(/\s+/).filter(Boolean).length;
  var geoIssues=[],scores={ok:0,fail:0};
  function chk(label,val,tip){val?scores.ok++:(scores.fail++,geoIssues.push({сигнал:label,что_добавить:tip}));return val;}
  var h2list=Array.from(document.querySelectorAll('h2')).map(function(e){return e.innerText.trim();});
  chk('Есть H2 структура',h2list.length>=2,'Добавь H2 для каждой подтемы');
  chk('Есть списки ul/ol',document.querySelectorAll('ul li,ol li').length>4,'Маркированные списки');
  chk('Есть таблицы',document.querySelectorAll('table').length>0,'Таблицы сравнения');
  chk('FAQ блок',/faq|часто задавае|вопросы и ответ/i.test(txt),'Добавь FAQ с 5-7 вопросами');
  chk('HowTo пошагово',/шаг\s*\d+|step\s*\d+|пошагов/i.test(txt),'Шаг 1... Шаг 2...');
  chk('Вопросы W-формат',/\b(кто|что|где|когда|как|почему|зачем|сколько)\b.+\?/i.test(txt),'Как выбрать X? [ответ]');
  chk('Опыт в цифрах',/\d+.лет.опыта|\d+.лет.работ|основан.в.\d{4}/i.test(txt),'работаем с 2014 года');
  chk('Конкретные числа',/\d+\s?(%|млн|тыс|руб|₽|клиент|проект|заказ)/i.test(txt),'замени "много" на цифры');
  chk('Дата публикации',!!document.querySelector('time,[class*="date"],[class*="publish"]'),'LLM проверяют актуальность');
  chk('Соц. доказательства',/отзыв|рейтинг|\d+.клиент|\d+.заказ/i.test(txt),'цифры клиентов + отзывы');
  chk('Нет клише',!/лучший.в.мире|уникальный.подход|непревзойденный/i.test(txt),'LLM игнорирует клише');
  chk('Конкретные единицы',/\d+\s?(мин|час|км|руб|₽|дней|лет|%)/i.test(txt),'28 руб/км вместо "выгодно"');
  var schemas=Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  var sTypes=new Set();
  schemas.forEach(function(s){try{var d=JSON.parse(s.textContent);if(d['@type'])sTypes.add(d['@type']);if(d['@graph'])d['@graph'].forEach(function(o){if(o['@type'])sTypes.add(o['@type']);});}catch(e){}});
  chk('Schema FAQPage',Array.from(sTypes).some(function(t){return t.toLowerCase().includes('faqpage');}),'Добавь Schema FAQPage');
  chk('Schema Organization',Array.from(sTypes).some(function(t){return t.toLowerCase().includes('organization')||t.toLowerCase().includes('localbusiness');}),'Добавь Schema Organization');
  var geoTotal=scores.ok+scores.fail;
  var geoPct=Math.round(scores.ok/geoTotal*100);
  AUDIT_STORE.geo={score:geoPct,total:geoTotal,passed:scores.ok,failed:scores.fail,issues:geoIssues,schemaTypes:Array.from(sTypes),wordCount:wc};
  console.log('%c\n🤖 GEO AUDIT — '+geoPct+'% готовности','font-weight:bold;font-size:14px;color:#7c3aed');
  if(geoIssues.length){console.group('%c📋 ЧТО ДОБАВИТЬ','font-weight:bold;color:#7c3aed');console.table(geoIssues);console.groupEnd();}
})();


// ════════════════════════════════════════════════════════════
// ЧАСТЬ 3: SEO ON-PAGE CHECKER
// ════════════════════════════════════════════════════════════
(function SEO_ONPAGE_CHECKER() {
  var keywords=WORDSTAT_KEYWORDS.trim().split('\n').map(function(line){var parts=line.trim().split(/\t+/);return{kw:parts[0].trim().toLowerCase(),freq:parseInt(parts[1])||0};}).filter(function(x){return x.kw;}).sort(function(a,b){return b.freq-a.freq;});
  if(!keywords.length){AUDIT_STORE.seo={skipped:true};return;}
  var maxFreq=Math.max.apply(null,keywords.map(function(x){return x.freq;}));
  var url=location.href.toLowerCase();
  var title=(document.querySelector('title')?document.querySelector('title').textContent:'').toLowerCase();
  var desc=(document.querySelector('meta[name="description"]')?document.querySelector('meta[name="description"]').content:'').toLowerCase();
  var h1s=Array.from(document.querySelectorAll('h1')).map(function(e){return e.innerText.toLowerCase();});
  var h2s=Array.from(document.querySelectorAll('h2')).map(function(e){return e.innerText.toLowerCase();});
  var bodyText=document.body.innerText.toLowerCase().replace(/\s+/g,' ');
  var wordCount=bodyText.split(/\s+/).filter(Boolean).length;
  var firstPara=bodyText.split(' ').slice(0,150).join(' ');
  function hasPhrase(text,phrase){return text.includes(phrase);}
  function hasWords(text,phrase){return phrase.split(' ').every(function(word){return word.length>2&&text.includes(word);});}
  function icon(b){return b?'✅':'—';}
  var results=keywords.map(function(d){
    var kw=d.kw,freq=d.freq;
    var inTitle=hasPhrase(title,kw),inTitleW=!inTitle&&hasWords(title,kw);
    var inDesc=hasPhrase(desc,kw);
    var inH1=h1s.some(function(h){return hasPhrase(h,kw);}),inH1W=!inH1&&h1s.some(function(h){return hasWords(h,kw);});
    var inH2=h2s.some(function(h){return hasPhrase(h,kw);});
    var inPara=hasWords(firstPara,kw);
    var mentions=bodyText.split(kw).length-1;
    var density=wordCount?(mentions/wordCount*100).toFixed(2)+'%':'0%';
    var score=Math.min(100,(inTitle?40:inTitleW?20:0)+(inH1?25:inH1W?12:0)+(inDesc?20:0)+(inH2?8:0)+(inPara?3:0));
    var priority=Math.round((100-score)*(freq/maxFreq));
    return{'запрос':kw,'частота':freq,'title':inTitle?'✅':inTitleW?'⚡':'—','H1':inH1?'✅':inH1W?'⚡':'—','desc':icon(inDesc),'H2':icon(inH2),'1й абзац':icon(inPara),'упом.':mentions,'плотность':density,'score':score,'статус':score>=75?'✅ хорошо':score>=40?'⚠️ слабо':'❌ не опт.','🔥 приоритет':priority};
  });
  var urgent=results.slice().sort(function(a,b){return b['🔥 приоритет']-a['🔥 приоритет'];}).slice(0,5);
  AUDIT_STORE.seo={keywords:keywords,results:results,urgent:urgent,wordCount:wordCount};
  console.group('%c\n🔍 SEO ON-PAGE','font-weight:bold;font-size:14px;color:#1d4ed8');
  console.table(results);
  console.log('%c🚨 ТОП-5 ПРИОРИТЕТОВ:','font-weight:bold;color:#c0392b');
  urgent.forEach(function(r,i){console.log('  '+(i+1)+'. "'+r['запрос']+'" ('+r['частота']+'/мес) — score '+r['score']+'/100');});
  console.groupEnd();
})();


// ════════════════════════════════════════════════════════════
// ЧАСТЬ 4: DEEP CONTENT AUDIT
// ════════════════════════════════════════════════════════════
(function CONTENT_AUDIT() {
  var clone=document.body.cloneNode(true);
  clone.querySelectorAll('script,style,nav,header,footer,aside,[class*="menu"],[class*="cookie"],[class*="popup"]').forEach(function(el){el.remove();});
  var rawText=(clone.innerText||clone.textContent||'').replace(/\s+/g,' ').trim();
  var allWordsRaw=rawText.match(/[а-яёa-zA-ZА-ЯЁ]+/g)||[];
  var allWordsLow=allWordsRaw.map(function(w){return w.toLowerCase();});
  var totalWords=allWordsLow.length;
  var STOP=new Set(['и','в','на','с','по','из','за','от','до','не','но','же','бы','ли','что','это','как','для','при','или','все','уже','его','она','они','был','там','где','нет','вас','наш','вам','вот','так','если','очень','чтобы','которые','также','только','может','быть','этот','этой','этом','после','через','когда','более','будет','можно','нужно','самый','такой','свой','наши']);
  var contentWords=allWordsLow.filter(function(w){return!STOP.has(w)&&w.length>=3;});
  var freq={};contentWords.forEach(function(w){freq[w]=(freq[w]||0)+1;});
  var sorted=Object.entries(freq).sort(function(a,b){return b[1]-a[1];});
  var topFreq=sorted[0]?sorted[0][1]:0;
  var acadToshnota=totalWords?(topFreq/Math.sqrt(totalWords)*100).toFixed(1):0;
  var classicToshnota=totalWords?((topFreq/totalWords)*100).toFixed(2):0;
  var WATER=['является','осуществляет','представляет','обеспечивает','позволяет','данный','различный','высококачественный','профессиональный','уникальный','эффективный','современный','инновационный','качественный','надёжный','надежный','комплексный','индивидуальный','оптимальный','актуальный'];
  var rawLow=rawText.toLowerCase();
  var waterFound=WATER.filter(function(w){return rawLow.includes(w);});
  var waterCount=WATER.reduce(function(s,w){return s+rawLow.split(w).length-1;},0);
  var stopCount=allWordsLow.filter(function(w){return STOP.has(w);}).length;
  var waterPct=totalWords?(stopCount/totalWords*100).toFixed(1):0;
  var bigrams={};
  contentWords.forEach(function(w,i){if(i<contentWords.length-1){var bg=w+' '+contentWords[i+1];bigrams[bg]=(bigrams[bg]||0)+1;}});
  var topBig=Object.entries(bigrams).filter(function(e){return e[1]>=2;}).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return{фраза:e[0],упомин:e[1]};});
  var topWords=sorted.slice(0,15).map(function(e){var pct=(e[1]/totalWords*100).toFixed(2);return{слово:e[0],кол_во:e[1],'плотность%':pct,статус:parseFloat(pct)>3?'🔴 ПЕРЕСПАМ':parseFloat(pct)>2?'🟡 высокая':'🟢 норма'};});
  AUDIT_STORE.content={totalWords:totalWords,acadToshnota:acadToshnota,classicToshnota:classicToshnota,waterFound:waterFound,waterCount:waterCount,waterPct:waterPct,topWords:topWords,topBigrams:topBig};
  console.group('%c\n📝 DEEP CONTENT AUDIT','font-weight:bold;font-size:14px;color:#0891b2');
  console.log('Слов: '+totalWords+' | Тошнота акад.: '+acadToshnota+'% (норма 2-3)');
  console.log('Вода: '+waterPct+'% | Паразитов: '+waterCount);
  if(waterFound.length)console.log('Паразиты: '+waterFound.join(', '));
  if(topWords.length){console.log('%cТОП СЛОВ:','font-weight:bold');console.table(topWords.slice(0,10));}
  if(topBig.length){console.log('%cБИГРАММЫ:','font-weight:bold');console.table(topBig.slice(0,8));}
  console.groupEnd();
})();


// ════════════════════════════════════════════════════════════
// ФИНАЛЬНЫЙ ВЫВОД И КНОПКА КОПИРОВАНИЯ
// ════════════════════════════════════════════════════════════

console.log('\n%c MEGA AUDIT COMPLETE · '+AUDIT_STORE.meta.hostname,'color:#0f172a;font-weight:bold;font-size:14px');
if(AUDIT_STORE.ux)console.log('%c   UX Score: '+AUDIT_STORE.ux.score+'/100','color:#1e1b4b;font-weight:600');
if(AUDIT_STORE.geo)console.log('%c   GEO: '+AUDIT_STORE.geo.score+'%','color:#7c3aed;font-weight:600');
if(AUDIT_STORE.seo&&!AUDIT_STORE.seo.skipped)console.log('%c   SEO: '+AUDIT_STORE.seo.keywords.length+' ключей','color:#1d4ed8;font-weight:600');
if(AUDIT_STORE.content)console.log('%c   Контент: '+AUDIT_STORE.content.totalWords+' слов, тошнота '+AUDIT_STORE.content.acadToshnota+'%','color:#0891b2;font-weight:600');
console.log('%c   📋 Кнопка «Скопировать аудит» — в правом нижнем углу','color:#16a34a;font-weight:700');

function buildDownload(){
  var lines=[],d=AUDIT_STORE,sep='═'.repeat(60);
  lines.push(sep);lines.push('MEGA AUDIT — ПОЛНЫЙ ОТЧЁТ');
  lines.push('Сайт: '+d.meta.url);lines.push('Дата: '+d.meta.date+' '+d.meta.time);lines.push(sep);
  if(d.ux){
    lines.push('\n【UX DESIGN AUDIT】');
    lines.push('Дизайн-скор: '+d.ux.score+'/100 | Режим: '+d.ux.mode+' ('+d.ux.viewport+')');
    lines.push('Критичных: '+d.ux.counts.crit+' | Предупреждений: '+d.ux.counts.warn+' | Сигналов: '+d.ux.counts.signal);
    if(d.ux._CHAINS.length){lines.push('\nСвязанные проблемы:');d.ux._CHAINS.forEach(function(c){lines.push('  '+c);});}
    if(d.ux._CRITS.length){lines.push('\nКРИТИЧНЫЕ:');d.ux._CRITS.forEach(function(f){lines.push('  #'+f.num+' ['+f.cat+'] '+f.title+'\n    Исправить: '+f.fix);});}
    if(d.ux._WARNS.length){lines.push('\nПРЕДУПРЕЖДЕНИЯ:');d.ux._WARNS.forEach(function(f){lines.push('  #'+f.num+' ['+f.cat+'] '+f.title+'\n    Исправить: '+f.fix);});}
    if(d.ux._OKS.length){lines.push('\nЧТО РАБОТАЕТ:');d.ux._OKS.forEach(function(ok){lines.push('  ✅ '+ok.t);});}
    lines.push('\n'+d.ux.forAI());
  }
  if(d.geo){
    lines.push('\n'+sep);lines.push('【GEO CONTENT AUDIT】');
    lines.push('GEO-готовность: '+d.geo.score+'% ('+d.geo.passed+'/'+d.geo.total+')');
    lines.push('Слов: '+d.geo.wordCount+' | Schema: '+(d.geo.schemaTypes.join(', ')||'нет'));
    if(d.geo.issues.length){lines.push('\nЧТО ДОБАВИТЬ:');d.geo.issues.forEach(function(i){lines.push('  — '+i.сигнал+'\n    '+i.что_добавить);});}
  }
  if(d.seo&&!d.seo.skipped){
    lines.push('\n'+sep);lines.push('【SEO ON-PAGE CHECKER】');
    lines.push('Ключей: '+d.seo.keywords.length+' | Слов: '+d.seo.wordCount);
    lines.push('\nТОП-5 ПРИОРИТЕТОВ:');
    d.seo.urgent.forEach(function(r,i){lines.push('  '+(i+1)+'. "'+r['запрос']+'" ('+r['частота']+'/мес) — score '+r['score']+'/100 | '+r['статус']);});
    lines.push('\nПОЛНАЯ ТАБЛИЦА:');
    lines.push('запрос;частота;title;H1;desc;H2;1й абзац;упом;плотность;score;статус;приоритет');
    d.seo.results.forEach(function(r){lines.push([r['запрос'],r['частота'],r.title,r.H1,r.desc,r.H2,r['1й абзац'],r['упом.'],r['плотность'],r['score'],r['статус'],r['🔥 приоритет']].join(';'));});
  }
  if(d.content){
    lines.push('\n'+sep);lines.push('【DEEP CONTENT AUDIT】');
    lines.push('Слов: '+d.content.totalWords+' | Тошнота акад.: '+d.content.acadToshnota+'% (норма 2-3)');
    lines.push('Тошнота класс.: '+d.content.classicToshnota+'% | Вода: '+d.content.waterPct+'% | Паразитов: '+d.content.waterCount);
    if(d.content.waterFound.length)lines.push('Паразиты: '+d.content.waterFound.join(', '));
    lines.push('\nТОП СЛОВ:');lines.push('слово;кол-во;плотность%;статус');
    d.content.topWords.slice(0,20).forEach(function(r){lines.push(r.слово+';'+r.кол_во+';'+r['плотность%']+';'+r.статус);});
    if(d.content.topBigrams.length){lines.push('\nБИГРАММЫ:');d.content.topBigrams.forEach(function(r){lines.push('  "'+r.фраза+'" — '+r.упомин+'x');});}
  }
  lines.push('\n'+sep);lines.push('Отчёт: '+new Date().toLocaleString('ru-RU'));lines.push(sep);
  return lines.join('\n');
}

function copyToClipboard(text,onOk,onFail){
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(onOk,function(){legacyCopy(text,onOk,onFail);});}
  else{legacyCopy(text,onOk,onFail);}
}
function legacyCopy(text,onOk,onFail){
  try{var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;top:-9999px;left:-9999px;opacity:0;';document.body.appendChild(ta);ta.focus();ta.select();var ok=document.execCommand('copy');document.body.removeChild(ta);ok?onOk():onFail('execCommand=false');}
  catch(e){onFail(e);}
}

window.uxAudit={
  copy:function(){var text=buildDownload();copyToClipboard(text,function(){console.log('%c✅ Аудит скопирован!','color:#16a34a;font-weight:700;font-size:13px');},function(){console.log(buildDownload());});return text;},
  json:function(){console.log(AUDIT_STORE);return AUDIT_STORE;}
};

(function buildCopyButton(){
  var old=document.getElementById('mega-audit-copy-btn');if(old)old.remove();
  var btn=document.createElement('div');btn.id='mega-audit-copy-btn';
  function setContent(icon,title,sub){btn.innerHTML='<div style="display:flex;align-items:center;gap:10px;"><div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">'+icon+'</div><div><div style="font-weight:700;font-size:13px;color:#fff;line-height:1.3;">'+title+'</div><div style="font-size:10px;color:rgba(255,255,255,0.65);margin-top:1px;">'+sub+'</div></div></div>';}
  setContent('📋','Скопировать аудит','UX + GEO + SEO + Content');
  Object.assign(btn.style,{position:'fixed',bottom:'24px',right:'24px',background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)',borderRadius:'14px',padding:'11px 18px',cursor:'pointer',zIndex:'2147483645',boxShadow:'0 4px 20px rgba(49,46,129,0.55)',fontFamily:'system-ui,-apple-system,sans-serif',userSelect:'none',minWidth:'210px'});
  btn.addEventListener('click',function(){
    setContent('⏳','Копирую...','собираю данные');btn.style.pointerEvents='none';
    var text=buildDownload();
    copyToClipboard(text,function(){
      setContent('✅','Скопировано!',text.length.toLocaleString('ru-RU')+' симв. · вставляй в бот');
      btn.style.background='linear-gradient(135deg,#15803d 0%,#166534 100%)';
      setTimeout(function(){setContent('📋','Скопировать ещё раз','UX + GEO + SEO + Content');btn.style.background='linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)';btn.style.pointerEvents='';},3500);
    },function(){
      setContent('⚠️','Не скопировалось','F12 → uxAudit.copy()');
      btn.style.background='linear-gradient(135deg,#92400e 0%,#b45309 100%)';
      setTimeout(function(){setContent('📋','Скопировать аудит','UX + GEO + SEO + Content');btn.style.background='linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)';btn.style.pointerEvents='';console.log(text);},3000);
    });
  });
  document.body.appendChild(btn);
})();

})();

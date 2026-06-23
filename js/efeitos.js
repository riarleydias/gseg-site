/* Efeitos de sofisticação — Onda 2B (GSEG)
 * Sutis, a serviço da credibilidade. As classes são aplicadas por JS:
 * sem JS, nada fica oculto (progressive enhancement). Respeita prefers-reduced-motion.
 *  1) Fade-in ao rolar (IntersectionObserver) — blocos/títulos principais, sem aninhar
 *  2) Contadores animados nos números de impacto (preserva prefixo "+" e sufixo "%")
 *  3) Linhas decorativas (kicker/eyebrow) que se desenham da esquerda p/ a direita
 */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slice = function (n) { return Array.prototype.slice.call(n); };

  // Não aninhar fade-in: pula o elemento se algum ancestral já tiver a classe
  function semAncestralFade(el) {
    var p = el.parentElement;
    while (p) {
      if (p.classList && (p.classList.contains('fade-in') || p.classList.contains('section-reveal'))) return false;
      p = p.parentElement;
    }
    return true;
  }

  // 0) REVEAL POR SEÇÃO — só onde a página opta (main[data-reveal-sections]); classe via JS (sem JS = visível)
  var mainRev = document.querySelector('main[data-reveal-sections]');
  if (mainRev) {
    slice(mainRev.children).forEach(function (sec) {
      if (sec.tagName === 'SECTION' && sec.className.indexOf('hero') === -1) sec.classList.add('section-reveal');
    });
  }
  var reveals = slice(document.querySelectorAll('.section-reveal'));

  // 1) FADE-IN — blocos e títulos principais do conteúdo (nunca header/CTA)
  var fadeSel = 'main h2, main h3, main .benef, main .bcard, main .bseg, main .benef-comp__col, ' +
                'main .seg-bloco, main .seg-stat, main .card-servico, main .cert-card, ' +
                'main .faq__item, main .diag-card, main .lead';
  var faders = slice(document.querySelectorAll(fadeSel)).filter(semAncestralFade);
  faders.forEach(function (el) { el.classList.add('fade-in'); });

  // 2) LINHAS — kickers (com traço) e eyebrows
  var linhas = slice(document.querySelectorAll('.kicker:not(.kicker--sem-traco), .eyebrow'));
  linhas.forEach(function (el) { el.classList.add('line-draw'); });

  // 3) CONTADORES — números de impacto (não o CREA, não placeholders)
  var contadores = slice(document.querySelectorAll('.seg-stat__num:not(.seg-stat__num--ph)'));

  function parseNum(txt) {
    var m = txt.trim().match(/^(\D*?)(\d+)(\D*)$/);
    return m ? { pre: m[1], val: parseInt(m[2], 10), suf: m[3] } : null;
  }

  // Sem animação (reduced-motion ou IO ausente): tudo no estado final imediatamente
  if (reduce || !('IntersectionObserver' in window)) {
    faders.forEach(function (el) { el.classList.add('visible'); });
    linhas.forEach(function (el) { el.classList.add('visible'); });
    reveals.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  // Prepara contadores: guarda o alvo em data-* e zera o valor exibido (preservando "+" e "%")
  contadores.forEach(function (el) {
    var info = parseNum(el.textContent);
    if (!info) return;
    el.dataset.pre = info.pre;
    el.dataset.suf = info.suf;
    el.dataset.val = String(info.val);
    el.dataset.alvo = '1';
    el.textContent = info.pre + '0' + info.suf;
  });

  function finalizar(el) {
    el.textContent = (el.dataset.pre || '') + el.dataset.val + (el.dataset.suf || '');
  }

  function animar(el) {
    var val = parseInt(el.dataset.val, 10), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    var dur = 1500, ini = null;
    function passo(ts) {
      if (ini === null) ini = ts;
      var p = Math.min((ts - ini) / dur, 1);
      el.textContent = pre + Math.floor(p * val) + suf;
      if (p < 1) requestAnimationFrame(passo); else el.textContent = pre + val + suf;
    }
    requestAnimationFrame(passo);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('visible');
      if (el.dataset.alvo === '1' && !el.dataset.contado) { el.dataset.contado = '1'; animar(el); }
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  faders.forEach(function (el) { io.observe(el); });
  linhas.forEach(function (el) { io.observe(el); });
  contadores.forEach(function (el) { io.observe(el); });
  reveals.forEach(function (el) { io.observe(el); });

  // Rede de segurança SÓ para contadores: se o IO não disparar (nunca em navegador real),
  // garante o valor final correto — nunca deixa um número travado em "0".
  setTimeout(function () {
    contadores.forEach(function (el) {
      if (el.dataset.alvo === '1' && !el.dataset.contado) { el.dataset.contado = '1'; finalizar(el); }
    });
  }, 4000);
})();

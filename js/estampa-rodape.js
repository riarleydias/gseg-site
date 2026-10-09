/* Estampa do rodapé — zonas de proteção atrás dos textos (rodada 19.5).
   Mede as caixas de texto do rodapé e gera uma máscara SVG (alfa 1 fora, "zona" dentro, bordas esmaecidas) para as camadas
   da estampa (--est-zona-g / --est-zona-w). Recalcula no resize e depois que as fontes carregam. Sem JS o CSS usa o nível seguro. */
(function () {
  'use strict';
  var rodape = document.querySelector('.rodape');
  if (!rodape) return;

  function numero(v, padrao) { var n = parseFloat(v); return isNaN(n) ? padrao : n; }

  // máscara SVG: retângulos (px relativos ao container) com luminância = fator da zona, desfocados (feather) dentro de <mask>
  function mascara(w, h, retangulos, fator, folga, sigma) {
    var cinza = Math.round(Math.max(0, Math.min(1, fator)) * 255), g = '';
    retangulos.forEach(function (r) {
      g += '<rect x="' + (r.x - folga).toFixed(1) + '" y="' + (r.y - folga).toFixed(1) + '" width="' + (r.w + folga * 2).toFixed(1) + '" height="' + (r.h + folga * 2).toFixed(1) + '" rx="' + folga + '"/>';
    });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><defs>' +
      '<filter id="b" filterUnits="userSpaceOnUse" x="-200" y="-200" width="' + (w + 400) + '" height="' + (h + 400) + '"><feGaussianBlur stdDeviation="' + sigma + '"/></filter>' +
      '<mask id="m" maskUnits="userSpaceOnUse" x="-20" y="-20" width="' + (w + 40) + '" height="' + (h + 40) + '"><rect x="-20" y="-20" width="' + (w + 40) + '" height="' + (h + 40) + '" fill="#fff"/><g filter="url(#b)" fill="rgb(' + cinza + ',' + cinza + ',' + cinza + ')">' + g + '</g></mask></defs>' +
      '<rect width="' + w + '" height="' + h + '" mask="url(#m)"/></svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  // caixas de texto de um conjunto de folhas, unidas por coluna, relativas ao elemento-base
  function caixas(base, grupos) {
    var o = base.getBoundingClientRect(), saida = [];
    var ox = o.left + (base.clientLeft || 0), oy = o.top + (base.clientTop || 0);   // a camada da estampa ocupa a caixa de padding (descontada a borda de 2px do topo)
    grupos.forEach(function (sel) {
      var u = null;
      base.querySelectorAll(sel).forEach(function (e) {
        var q = e.getBoundingClientRect();
        if (q.width < 2 || q.height < 2 || getComputedStyle(e).visibility === 'hidden') return;
        u = u ? { l: Math.min(u.l, q.left), t: Math.min(u.t, q.top), r: Math.max(u.r, q.right), b: Math.max(u.b, q.bottom) } : { l: q.left, t: q.top, r: q.right, b: q.bottom };
      });
      if (u) saida.push({ x: u.l - ox, y: u.t - oy, w: u.r - u.l, h: u.b - u.t });
    });
    return saida;
  }

  var pendente = false;
  function atualizar() {
    pendente = false;
    var q = rodape.getBoundingClientRect(); if (!q.width) return;
    var cs = getComputedStyle(rodape);
    var gF = numero(cs.getPropertyValue('--est-g-op-forte'), .3), gZ = numero(cs.getPropertyValue('--est-g-op-zona'), .1);
    var wF = numero(cs.getPropertyValue('--est-w-op-forte'), .1), wZ = numero(cs.getPropertyValue('--est-w-op-zona'), .05);
    var col = '.rodape__grid > .rodape__col:nth-child(';
    var r = caixas(rodape, [
      '.rodape__marca .logo, .rodape__marca .rodape__crea',
      col + '2) h3, ' + col + '2) a',
      col + '3) h3, ' + col + '3) a',
      col + '4) h3, ' + col + '4) p',
      '.rodape__base p:first-child',
      '.rodape__base p:last-child'
    ]);
    var w = rodape.clientWidth, h = rodape.clientHeight;
    rodape.style.setProperty('--est-zona-g', mascara(w, h, r, gZ / gF, 10, 14));
    rodape.style.setProperty('--est-zona-w', mascara(w, h, r, wZ / wF, 10, 14));
    rodape.classList.add('est-zonas');
    window.dispatchEvent(new Event('gseg:estampa'));
  }
  function agendar() { if (!pendente) { pendente = true; window.requestAnimationFrame(atualizar); } }

  window.gsegEstampa = { atualizar: agendar, mascara: mascara, caixas: caixas, numero: numero };
  agendar();
  window.addEventListener('load', agendar);
  window.addEventListener('resize', agendar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(agendar);
  if (window.ResizeObserver) new ResizeObserver(agendar).observe(rodape);
})();

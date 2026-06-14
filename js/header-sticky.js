/* =============================================================================
   GSEG · header-sticky.js — encolhe o cabeçalho na rolagem (Parte 3.1)
   -----------------------------------------------------------------------------
   Em repouso (topo): header alto (80px), descritor em 2 linhas.
   Ao rolar > limiar: adiciona .cabecalho--encolhido (logo reduzida, descritor
   some, sombra sutil) — o CTA WhatsApp segue sempre visível.
   A animação é por CSS (transition); o JS só alterna a classe. A transição de
   tamanho é automaticamente neutralizada por prefers-reduced-motion (reset.css),
   então o comportamento permanece funcional e instantâneo p/ quem prefere.
   rAF p/ não rodar a cada evento de scroll (sem jank).
   ============================================================================= */
(function () {
  'use strict';

  var header = document.getElementById('cabecalho');
  if (!header) return;

  var LIMIAR = 24;           // px de rolagem p/ encolher
  var encolhido = false;
  var pendente = false;

  function avaliar() {
    pendente = false;
    var deveEncolher = window.scrollY > LIMIAR;
    if (deveEncolher === encolhido) return;
    encolhido = deveEncolher;
    header.classList.toggle('cabecalho--encolhido', encolhido);
  }

  function aoRolar() {
    if (pendente) return;
    pendente = true;
    window.requestAnimationFrame(avaliar);
  }

  window.addEventListener('scroll', aoRolar, { passive: true });
  avaliar(); // estado correto se a página já abrir rolada (ex.: âncora)
})();

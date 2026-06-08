/* =============================================================================
   GSEG · menu.js — menu off-canvas (mobile)
   -----------------------------------------------------------------------------
   Abre/fecha o painel lateral. Fecha por: ✕, overlay, Esc, clique em link.
   Acessibilidade: aria-expanded, foco move ao 1º link, focus-trap cíclico,
   trava o scroll do body, devolve o foco ao botão ao fechar.
   Sem JS: o cabeçalho permanece utilizável (links do rodapé/âncoras).
   ============================================================================= */
(function () {
  'use strict';

  var botao   = document.getElementById('btn-menu');
  var menu    = document.getElementById('menu-mobile');
  if (!botao || !menu) return;

  var painel  = menu.querySelector('.menu-mobile__painel');
  var overlay = menu.querySelector('.menu-mobile__overlay');
  var fechar  = menu.querySelectorAll('[data-fechar-menu]');
  var ultimoFoco = null;

  function focaveis() {
    return Array.prototype.filter.call(
      painel.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0; }
    );
  }

  function abrir() {
    ultimoFoco = document.activeElement;
    menu.setAttribute('data-aberto', 'true');
    botao.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sem-scroll');
    document.addEventListener('keydown', aoTeclar);
    var alvos = focaveis();
    if (alvos.length) alvos[0].focus();
  }

  function fechar_() {
    menu.removeAttribute('data-aberto');
    botao.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sem-scroll');
    document.removeEventListener('keydown', aoTeclar);
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
  }

  function aoTeclar(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { fechar_(); return; }
    if (e.key !== 'Tab') return;
    var alvos = focaveis();
    if (!alvos.length) return;
    var primeiro = alvos[0];
    var ultimo   = alvos[alvos.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  }

  botao.addEventListener('click', abrir);
  if (overlay) overlay.addEventListener('click', fechar_);
  Array.prototype.forEach.call(fechar, function (el) {
    el.addEventListener('click', fechar_);
  });
  Array.prototype.forEach.call(
    menu.querySelectorAll('.menu-mobile__link'),
    function (a) { a.addEventListener('click', fechar_); }
  );
})();

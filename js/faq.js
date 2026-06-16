/* =============================================================================
   GSEG · faq.js — acordeão de perguntas frequentes (teaser da home + página FAQ)
   -----------------------------------------------------------------------------
   Animação de HEIGHT (220ms via CSS), NUNCA display — abre/fecha medindo a
   altura real do conteúdo e voltando a 'auto' ao fim da transição (responsivo).
   Acessível: <button> com aria-expanded; Enter/Espaço nativos; foco visível.
   1 aberta por vez. Q1 aberta por padrão (espelha o mockup-mestre).
   Progressive enhancement: sem JS, todos os painéis ficam visíveis (CSS:
   .faq__lista:not([data-js]) .faq__corpo{height:auto}). Respeita
   prefers-reduced-motion (transições zeradas no reset.css).
   ============================================================================= */
(function () {
  'use strict';

  var lista = document.querySelector('.faq__lista');
  if (!lista) return;

  var itens = Array.prototype.slice.call(lista.querySelectorAll('.faq__item'));
  if (!itens.length) return;

  // Liga o modo JS (habilita o colapso definido no CSS)
  lista.setAttribute('data-js', 'true');

  itens.forEach(function (item, indice) {
    var botao  = item.querySelector('.faq__pergunta');
    var corpo  = item.querySelector('.faq__corpo');
    if (!botao || !corpo) return;

    // estado inicial: 1ª aberta, demais fechadas
    definir(item, botao, corpo, indice === 0, true);

    botao.addEventListener('click', function () {
      var vaiAbrir = botao.getAttribute('aria-expanded') !== 'true';
      if (vaiAbrir) {
        // fecha as outras (1 aberta por vez)
        itens.forEach(function (outro) {
          if (outro === item) return;
          var b = outro.querySelector('.faq__pergunta');
          var c = outro.querySelector('.faq__corpo');
          if (b && c && b.getAttribute('aria-expanded') === 'true') definir(outro, b, c, false, false);
        });
      }
      definir(item, botao, corpo, vaiAbrir, false);
    });

    // ao terminar de abrir, solta a altura p/ 'auto' (acompanha reflow/responsivo)
    corpo.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'height') return;
      if (botao.getAttribute('aria-expanded') === 'true') corpo.style.height = 'auto';
    });
  });

  function definir(item, botao, corpo, aberto, inicial) {
    botao.setAttribute('aria-expanded', String(aberto));
    item.classList.toggle('faq__item--aberta', aberto);

    if (aberto) {
      if (inicial) {
        corpo.style.height = 'auto';
      } else {
        // de 0 → altura real (permite a transição de height)
        corpo.style.height = corpo.scrollHeight + 'px';
      }
    } else {
      if (inicial) {
        corpo.style.height = '0px';
      } else {
        // de auto → px atual → 0 (dois frames p/ a transição pegar)
        corpo.style.height = corpo.scrollHeight + 'px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { corpo.style.height = '0px'; });
        });
      }
    }
  }
})();

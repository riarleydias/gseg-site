/* =============================================================================
   GSEG · faq.js — accordion de perguntas frequentes
   -----------------------------------------------------------------------------
   Progressive enhancement: sem JS, todos os painéis ficam visíveis (conteúdo
   sempre acessível). Com JS, colapsa todos menos o primeiro e permite abrir/
   fechar. Vários painéis podem ficar abertos. Animação por grid-template-rows
   (respeita prefers-reduced-motion via reset.css).
   ============================================================================= */
(function () {
  'use strict';

  var faq = document.querySelector('.faq');
  if (!faq) return;

  var perguntas = faq.querySelectorAll('.faq__pergunta');
  if (!perguntas.length) return;

  // Liga o modo JS (habilita o colapso definido no CSS)
  faq.setAttribute('data-js', 'true');

  Array.prototype.forEach.call(perguntas, function (botao, indice) {
    var item   = botao.closest('.faq__item');
    var painel = document.getElementById(botao.getAttribute('aria-controls'));
    var aberto = indice === 0; // 1º já aberto (espelha o mockup)

    aplicar(botao, item, aberto);

    botao.addEventListener('click', function () {
      var estaAberto = botao.getAttribute('aria-expanded') === 'true';
      aplicar(botao, item, !estaAberto);
    });
  });

  function aplicar(botao, item, aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
    if (item) item.classList.toggle('faq__item--aberto', aberto);
  }
})();

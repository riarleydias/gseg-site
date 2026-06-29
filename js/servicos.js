/* =============================================================================
   GSEG · servicos.js — acordeão da página de Serviços
   -----------------------------------------------------------------------------
   • "Ver mais" expande o painel da PRÓPRIA seção (nunca redireciona ao WhatsApp;
     o WhatsApp é CTA secundário dentro do painel).
   • Abertura por âncora: ao chegar com #documentacao, #treinamentos, #consultoria,
     #esocial, #inspecoes ou #atendimento (vindos da home), abre o acordeão
     correspondente e faz scroll suave até ele.
   • Animação de HEIGHT (220ms via CSS), nunca display — mede a altura real e volta
     a 'auto' ao fim da transição. Acessível: <button> + aria-expanded (Enter/Espaço
     nativos). Progressive enhancement: sem JS, os painéis ficam visíveis.
   ============================================================================= */
(function () {
  'use strict';

  var lista = document.querySelector('.servicos__lista');
  if (!lista) return;

  var itens = Array.prototype.slice.call(lista.querySelectorAll('.serv-item'));
  if (!itens.length) return;
  var reduzirMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Liga o modo JS (habilita o colapso definido no CSS)
  lista.setAttribute('data-js', 'true');

  itens.forEach(function (item) {
    var botao  = item.querySelector('.serv-item__cab');
    var painel = item.querySelector('.serv-item__painel');
    if (!botao || !painel) return;

    // estado inicial: todos fechados
    definir(item, botao, painel, false, true);

    botao.addEventListener('click', function () {
      var vaiAbrir = botao.getAttribute('aria-expanded') !== 'true';
      definir(item, botao, painel, vaiAbrir, false);
    });

    // ao terminar de abrir, solta a altura p/ 'auto' (acompanha reflow/responsivo)
    painel.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'height') return;
      if (botao.getAttribute('aria-expanded') === 'true') painel.style.height = 'auto';
    });
  });

  // ----- abertura por âncora (#id) + scroll suave -----
  function abrirPorHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    var alvo;
    try { alvo = document.getElementById(hash.slice(1)); } catch (e) { return; }
    if (!alvo || alvo.className.indexOf('serv-item') === -1) return;

    var botao  = alvo.querySelector('.serv-item__cab');
    var painel = alvo.querySelector('.serv-item__painel');
    if (botao && painel && botao.getAttribute('aria-expanded') !== 'true') {
      definir(alvo, botao, painel, true, false);
    }
    requestAnimationFrame(function () {
      alvo.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'start' });
    });
  }

  abrirPorHash();
  window.addEventListener('hashchange', abrirPorHash);

  function focaveisDoPainel(painel) {
    return painel.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), [tabindex]'
    );
  }

  function definirPainelAcessivel(painel, aberto) {
    painel.setAttribute('aria-hidden', String(!aberto));
    if ('inert' in painel) painel.inert = !aberto;

    Array.prototype.forEach.call(focaveisDoPainel(painel), function (el) {
      if (!aberto) {
        if (!el.hasAttribute('data-tabindex-original')) {
          el.setAttribute('data-tabindex-original', el.getAttribute('tabindex') || '');
        }
        el.setAttribute('tabindex', '-1');
        return;
      }

      if (!el.hasAttribute('data-tabindex-original')) return;
      var original = el.getAttribute('data-tabindex-original');
      if (original) el.setAttribute('tabindex', original);
      else el.removeAttribute('tabindex');
      el.removeAttribute('data-tabindex-original');
    });
  }

  function definir(item, botao, painel, aberto, inicial) {
    botao.setAttribute('aria-expanded', String(aberto));
    item.classList.toggle('serv-item--aberto', aberto);
    definirPainelAcessivel(painel, aberto);

    if (aberto) {
      if (inicial) {
        painel.style.height = 'auto';
      } else {
        painel.style.height = painel.scrollHeight + 'px';
      }
    } else {
      if (inicial) {
        painel.style.height = '0px';
      } else {
        painel.style.height = painel.scrollHeight + 'px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { painel.style.height = '0px'; });
        });
      }
    }
  }
})();

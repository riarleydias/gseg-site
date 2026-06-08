/* =============================================================================
   GSEG · formulario.js — validação + envio Web3Forms (sem backend)
   -----------------------------------------------------------------------------
   Fluxo: previne o submit nativo → valida (campos obrigatórios, e-mail) com
   mensagens em PT-BR → estado "Enviando…" (aria-busy) → fetch JSON →
   sucesso: troca o form por um card ✓ (role="status", foco na mensagem);
   erro: card de erro (role="alert") com atalho para o WhatsApp, mantendo os
   dados preenchidos.
   Sem JS: o <form> envia nativamente ao endpoint do Web3Forms (action/method).
   ⚠️ Requer o access_key real (ver checklist-lancamento_RAFAEL.md).
   ============================================================================= */
(function () {
  'use strict';

  var form = document.getElementById('form-contato');
  if (!form) return;

  var botao   = form.querySelector('[type="submit"]');
  var labelEnviar = botao ? botao.querySelector('.btn__texto') : null;

  var WPP = 'https://wa.me/5534992076152?text=' +
    encodeURIComponent('Olá! Tentei enviar uma mensagem pelo site da GSEG e gostaria de falar com a consultoria.');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validar()) return;
    enviar();
  });

  /* limpa o erro ao corrigir o campo */
  Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (campo) {
    campo.addEventListener('input', function () { marcarErro(campo, ''); });
    campo.addEventListener('blur', function () { validarCampo(campo); });
  });

  function validar() {
    var ok = true;
    var obrigatorios = form.querySelectorAll('[required]');
    Array.prototype.forEach.call(obrigatorios, function (campo) {
      if (!validarCampo(campo) && ok) {
        ok = false;
        campo.focus();
      } else {
        validarCampo(campo);
      }
    });
    return ok;
  }

  function validarCampo(campo) {
    var valor = (campo.value || '').trim();
    if (!valor) {
      marcarErro(campo, 'Campo obrigatório.');
      return false;
    }
    if (campo.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      marcarErro(campo, 'Informe um e-mail válido.');
      return false;
    }
    if (campo.id === 'nome' && valor.length < 3) {
      marcarErro(campo, 'Digite seu nome completo.');
      return false;
    }
    marcarErro(campo, '');
    return true;
  }

  function marcarErro(campo, msg) {
    var span = document.getElementById('erro-' + campo.id);
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (span) span.textContent = msg;
  }

  function enviar() {
    if (botao) {
      botao.disabled = true;
      botao.setAttribute('aria-busy', 'true');
      if (labelEnviar) labelEnviar.textContent = 'Enviando…';
    }

    var dados = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: dados
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j && res.j.success) { sucesso(); }
        else { falha(); }
      })
      .catch(function () { falha(); });
  }

  function sucesso() {
    var card = document.createElement('div');
    card.className = 'form-msg form-msg--ok';
    card.setAttribute('role', 'status');
    card.setAttribute('tabindex', '-1');
    card.innerHTML =
      '<i class="ph ph-check-circle" aria-hidden="true"></i>' +
      '<h3>Mensagem enviada!</h3>' +
      '<p>Recebemos seu contato e retornamos em até 24 horas úteis. ' +
      'Se preferir, fale agora pelo WhatsApp.</p>' +
      '<a class="btn btn--primary" href="' + WPP + '" target="_blank" rel="noopener noreferrer">' +
      '<i class="ph ph-whatsapp-logo" aria-hidden="true"></i> Falar no WhatsApp</a>';
    form.replaceWith(card);
    card.focus();
  }

  function falha() {
    if (botao) {
      botao.disabled = false;
      botao.removeAttribute('aria-busy');
      if (labelEnviar) labelEnviar.textContent = 'Enviar mensagem';
    }
    var antigo = form.querySelector('.form-msg--erro');
    if (antigo) antigo.remove();

    var alerta = document.createElement('div');
    alerta.className = 'form-msg form-msg--erro';
    alerta.setAttribute('role', 'alert');
    alerta.innerHTML =
      '<i class="ph ph-warning-circle" aria-hidden="true"></i>' +
      '<p>Não foi possível enviar agora. Tente novamente ou fale direto pelo ' +
      '<a href="' + WPP + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>';
    form.insertBefore(alerta, form.firstChild);
    alerta.scrollIntoView({ block: 'center' });
  }
})();

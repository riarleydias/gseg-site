/* =============================================================================
   GSEG · whatsapp.js — botão flutuante (ajuste fino)
   -----------------------------------------------------------------------------
   O botão é renderizado e estilizado por HTML/CSS (funciona sem JS). Este
   módulo apenas o afasta do botão "Enviar" quando o formulário de contato está
   em foco, para não cobrir a ação principal (dev-specs §6).
   ============================================================================= */
(function () {
  'use strict';

  var float = document.querySelector('.whatsapp-float');
  var form  = document.getElementById('form-contato');
  if (!float || !form) return;

  function recolher() { float.style.bottom = '92px'; }
  function restaurar() {
    // só restaura se o foco saiu de vez do formulário
    if (!form.contains(document.activeElement)) float.style.bottom = '';
  }

  form.addEventListener('focusin', recolher);
  form.addEventListener('focusout', function () {
    window.setTimeout(restaurar, 0);
  });
})();

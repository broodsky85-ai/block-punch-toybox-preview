/* Presentation experiment only. Original game, rules, scores, ads and account logic are untouched. */
(function () {
  'use strict';
  var enabled = true;
  document.body.classList.add('toybox-on');
  function compareButton(className) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'toybox-compare ' + className;
    button.setAttribute('aria-label', '기존 그래픽과 입체 시험본 비교');
    button.addEventListener('click', function () {
      enabled = !enabled;
      document.body.classList.toggle('toybox-on', enabled);
      updateButtons();
    });
    return button;
  }
  var home = document.querySelector('#screen-title .title-lockup > div');
  var game = document.querySelector('#screen-game .topbar-center');
  var tutorial = document.querySelector('#screen-tutorial .topbar-title');
  var buttons = [];
  if (home) {
    var note = document.createElement('span');
    note.className = 'toybox-preview-note';
    note.textContent = 'TOYBOX EDITION · 별도 그래픽 시험본';
    home.appendChild(note);
    var homeButton = compareButton('toybox-compare-home');
    home.appendChild(homeButton);
    buttons.push(homeButton);
  }
  if (game) {
    var gameButton = compareButton('toybox-compare-game');
    game.appendChild(gameButton);
    buttons.push(gameButton);
  }
  if (tutorial && tutorial.parentElement) {
    var tutorialButton = compareButton('toybox-compare-tutorial');
    tutorial.parentElement.appendChild(tutorialButton);
    buttons.push(tutorialButton);
  }
  function updateButtons() {
    buttons.forEach(function (button) {
      button.dataset.active = String(enabled);
      button.textContent = enabled ? '입체 시험본 ON · 원본 비교' : '원본 그래픽 · 입체 시험본 보기';
      button.setAttribute('aria-pressed', String(enabled));
    });
  }
  updateButtons();
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var lastBurst = 0;
  function onImpact(layer) {
    if (!enabled || (reduced && reduced.matches) || document.body.dataset.motion === 'reduced') return;
    if (!layer.classList.contains('impact-punch-layer') && !layer.className.includes('clear-tier')) return;
    var wrap = layer.closest('.board-wrap');
    if (!wrap || Date.now() - lastBurst < 125) return;
    lastBurst = Date.now();
    var burst = document.createElement('span');
    burst.className = 'toybox-shock';
    burst.setAttribute('aria-hidden', 'true');
    var cx = wrap.style.getPropertyValue('--impact-x') || '50%';
    var cy = wrap.style.getPropertyValue('--impact-y') || '50%';
    burst.style.setProperty('--cx',cx);
    burst.style.setProperty('--cy',cy);
    wrap.appendChild(burst);
    window.setTimeout(function () { burst.remove(); }, 650);
  }
  var observer = new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(function (node) {
        if (node.nodeType === 1 && node.classList && node.classList.contains('impact-layer')) onImpact(node);
      });
    });
  });
  ['#screen-game .board-wrap', '#screen-tutorial .board-wrap'].forEach(function (selector) {
    var wrap = document.querySelector(selector);
    if (wrap) observer.observe(wrap, { childList: true });
  });
  window.BlockPunchToyboxPreview = Object.freeze({
    get enabled() { return enabled; },
    switchVisual: function () { if (buttons.length) buttons[0].click(); },
    version: '2026-11-17'
  });
})();


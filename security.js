/**
 * Coverly Security & Asset Protection
 * Industry-grade client defense:
 * 1. Image & Asset Anti-Theft: Prevents right-click saving, drag-and-drop extraction, and mobile press-and-hold saving.
 * 2. Source Code & Inspection Deterrence: Blocks DevTools shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S).
 * 3. Self-XSS Protection: Displays enterprise console warning banner (similar to Facebook, Discord, PayPal).
 * 4. Safe Whitelist: Never interferes with legitimate user actions (input typing, pasting, selecting form text).
 */
(function() {
  'use strict';

  // 1. Self-XSS Console Warning (Defense against social-engineering script injection)
  try {
    const warningTitle = 'font-size: 32px; font-weight: 900; color: #ff3b30; text-shadow: 1px 1px 0 #000;';
    const warningText = 'font-size: 14px; font-weight: 600; color: #29233f; line-height: 1.5;';
    const warningCaution = 'font-size: 13px; font-weight: 700; color: #b33918; background: #fff1e8; padding: 4px 8px; border-radius: 4px;';

    console.log('%cSTOP!', warningTitle);
    console.log(
      '%cThis is a browser feature intended for developers. If someone told you to copy and paste code here to unlock discounts or features, it is a scam and will compromise your account or browser.',
      warningText
    );
    console.log('%cCoverly Official Security Shield is active.', warningCaution);
  } catch (_) {}

  // Helper: check if target is an interactive form input where copy/paste must always work
  function isFormInput(target) {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toUpperCase() : '';
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target.isContentEditable ||
      (target.closest && target.closest('input, textarea, select, [contenteditable="true"]'))
    );
  }

  // 2. Smart Context Menu Guard (Disable right-click on assets, but preserve form pasting)
  document.addEventListener('contextmenu', function(e) {
    if (isFormInput(e.target)) {
      return; // Allow right-click in text fields for easy Paste / Select All
    }
    e.preventDefault();
  }, { capture: true, passive: false });

  // 3. Image & Media Drag-and-Drop Blocker
  document.addEventListener('dragstart', function(e) {
    const target = e.target;
    if (!target) return;
    const tag = target.tagName ? target.tagName.toUpperCase() : '';
    if (tag === 'IMG' || tag === 'PICTURE' || tag === 'CANVAS' || (target.closest && target.closest('img, .image, .design-card, .cover-photo, .detail-image'))) {
      e.preventDefault();
    }
  }, { capture: true, passive: false });

  // 4. Developer Shortcut & View Source Blocker
  document.addEventListener('keydown', function(e) {
    // If inside a normal form field, allow normal typing shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z)
    const isInput = isFormInput(e.target);
    const key = e.key || '';
    const code = e.keyCode || e.which;
    const ctrlOrMeta = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // F12 (Developer Tools)
    if (code === 123 || key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I or Cmd+Option+I (Inspect Element)
    if (ctrlOrMeta && shift && (key === 'I' || key === 'i' || code === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J or Cmd+Option+J (DevTools Console)
    if (ctrlOrMeta && shift && (key === 'J' || key === 'j' || code === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C or Cmd+Option+C (Inspect Element cursor)
    if (ctrlOrMeta && shift && (key === 'C' || key === 'c' || code === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U or Cmd+U (View Page Source)
    if (ctrlOrMeta && (key === 'U' || key === 'u' || code === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S or Cmd+S (Save Webpage Complete)
    if (ctrlOrMeta && (key === 'S' || key === 's' || code === 83)) {
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true, passive: false });

  // 5. Anti-Tampering CSS & Selection Lock
  function applySecurityStyles() {
    if (document.getElementById('coverly-security-styles')) return;
    const style = document.createElement('style');
    style.id = 'coverly-security-styles';
    style.textContent = `
      /* Protect brand assets, designs and photos from drag-and-drop extraction */
      img, .image, .design-card, .cover-photo, .detail-image, .builder-thumb-img, .thumb, .mini-design {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -webkit-touch-callout: none !important;
      }
      /* Ensure customers have zero friction inside input fields */
      input, textarea, select {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySecurityStyles);
  } else {
    applySecurityStyles();
  }
})();

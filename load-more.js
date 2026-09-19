/* Infinite automatic loading for Coverly designs catalog. */
(() => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'load-more.css';
  document.head.append(style);

  const install = () => {
    const PAGE_SIZE = 16;
    let visible = PAGE_SIZE;
    let observer = null;
    let isLoading = false;

    const grid = () => document.getElementById('products');

    const loadNextBatch = () => {
      if (isLoading) return;
      isLoading = true;
      const productGrid = grid();
      if (!productGrid) {
        isLoading = false;
        return;
      }
      const cards = [...productGrid.querySelectorAll('.product')];
      if (visible < cards.length) {
        visible += PAGE_SIZE;
        update();
      }
      setTimeout(() => {
        isLoading = false;
      }, 150);
    };

    window.coverlyLoadMoreBatch = loadNextBatch;

    const update = () => {
      const productGrid = grid();
      if (!productGrid) return;
      const cards = [...productGrid.querySelectorAll('.product')];
      const old = document.getElementById('catalogPagination');
      if (old) old.remove();

      let control = document.getElementById('coverlyLoadMore');
      if (!control) {
        control = document.createElement('div');
        control.id = 'coverlyLoadMore';
        control.className = 'load-more-flow';
      }

      if (!cards.length) {
        control.remove();
        return;
      }

      const shown = Math.min(visible, cards.length);
      cards.forEach((card, index) => {
        card.style.display = '';
        card.hidden = index >= visible;
      });

      const remaining = Math.max(0, cards.length - shown);

      if (remaining > 0) {
        control.innerHTML = `
          <div class="auto-load-container">
            <div class="auto-load-indicator">
              <span class="auto-load-spinner"></span>
              <span>Auto-loading designs... (<b>${shown}</b> of <b>${cards.length}</b>)</span>
            </div>
            <div class="quick-policy-bar">
              <span>Store info:</span>
              <a href="pages/privacy.html">Privacy</a>
              <span class="policy-dot">·</span>
              <a href="pages/terms.html">Terms</a>
              <span class="policy-dot">·</span>
              <a href="pages/returns-refunds.html">Returns</a>
              <span class="policy-dot">·</span>
              <a href="pages/shipping.html">Shipping</a>
              <span class="policy-dot">·</span>
              <a href="pages/track-order.html">Track Order</a>
            </div>
          </div>
        `;
      } else {
        control.innerHTML = `
          <div class="auto-load-finished-box">
            <span class="finished-badge">✓ All ${cards.length} designs loaded · You’ve seen every vibe</span>
            <div class="quick-policy-bar">
              <a href="pages/privacy.html">Privacy Policy</a>
              <span class="policy-dot">·</span>
              <a href="pages/terms.html">Terms</a>
              <span class="policy-dot">·</span>
              <a href="pages/returns-refunds.html">Returns & Refunds</a>
              <span class="policy-dot">·</span>
              <a href="pages/shipping.html">Shipping</a>
              <span class="policy-dot">·</span>
              <a href="pages/track-order.html">Track Order</a>
            </div>
          </div>
        `;
      }

      if (!control.isConnected) {
        productGrid.parentElement.append(control);
      }

      // Re-observe sentinel for 100% automatic scroll loading
      if (observer) observer.disconnect();
      if (remaining > 0 && window.IntersectionObserver) {
        observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loadNextBatch();
          }
        }, {
          root: null,
          rootMargin: '350px 0px',
          threshold: 0.01
        });
        observer.observe(control);
      }
    };

    // Backup scroll listener
    let scrollThrottle = 0;
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollThrottle < 200) return;
      scrollThrottle = now;
      const control = document.getElementById('coverlyLoadMore');
      if (control && control.getBoundingClientRect().top < window.innerHeight + 350) {
        loadNextBatch();
      }
    }, { passive: true });

    const baseRender = window.renderProducts;
    if (!baseRender || baseRender.__coverlyAutoScroll) return;

    const progressiveRender = () => {
      visible = PAGE_SIZE;
      baseRender();
      update();
    };
    progressiveRender.__coverlyAutoScroll = true;
    window.renderProducts = progressiveRender;
    window.updateCatalogPagination = update;
    update();
  };

  window.addEventListener('load', install);
  window.addEventListener('coverlydesignsready', install);
})();

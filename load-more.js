/* Infinite auto-loading for Coverly designs catalog. */
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
          <div class="auto-load-indicator">
            <span class="auto-load-spinner"></span>
            <span>Loading more designs... (<b>${shown}</b> of <b>${cards.length}</b>)</span>
          </div>
        `;
      } else {
        control.innerHTML = `
          <div class="auto-load-finished">
            <span>Showing all <b>${cards.length}</b> designs · You’ve seen every vibe</span>
          </div>
        `;
      }

      if (!control.isConnected) {
        productGrid.parentElement.append(control);
      }

      // Re-observe sentinel for infinite scroll
      if (observer) observer.disconnect();
      if (remaining > 0 && window.IntersectionObserver) {
        observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loadNextBatch();
          }
        }, {
          root: null,
          rootMargin: '450px 0px',
          threshold: 0.01
        });
        observer.observe(control);
      }
    };

    // Backup scroll listener in case IntersectionObserver is unsupported or throttled
    let scrollThrottle = 0;
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollThrottle < 200) return;
      scrollThrottle = now;
      const control = document.getElementById('coverlyLoadMore');
      if (control && control.getBoundingClientRect().top < window.innerHeight + 450) {
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

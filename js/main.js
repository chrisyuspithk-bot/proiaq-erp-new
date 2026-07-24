/* ============================================================
   PRO-IAQ ERP Suite - Main Application Logic
   ============================================================ */

(function () {
  'use strict';

  // --- State ---
  const state = {
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    activeNavSection: null,
    currentPage: null,
  };

  // --- DOM References ---
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  // --- Initialize Lucide Icons ---
  function initLucide() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- Sidebar Toggle (Desktop) ---
  function initSidebarToggle() {
    const sidebar = $('.sidebar');
    const toggle = $('.sidebar-toggle');
    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', () => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
      localStorage.setItem('sidebar-collapsed', state.sidebarCollapsed);
      // Re-render charts after transition
      setTimeout(initLucide, 300);
    });

    // Restore state
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      state.sidebarCollapsed = true;
      sidebar.classList.add('collapsed');
    }
  }

  // --- Mobile Sidebar ---
  function initMobileSidebar() {
    const sidebar = $('.sidebar');
    const overlay = $('.sidebar-overlay');
    const trigger = $('.header-mobile-trigger');
    if (!sidebar || !trigger) return;

    trigger.addEventListener('click', () => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
      sidebar.classList.toggle('mobile-open', state.sidebarMobileOpen);
      if (overlay) overlay.classList.toggle('active', state.sidebarMobileOpen);
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        state.sidebarMobileOpen = false;
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }
  }

  // --- Navigation Section Accordion ---
  function initNavSections() {
    $$('.nav-section').forEach(section => {
      const title = $('.nav-section-title', section);
      if (!title) return;

      title.addEventListener('click', () => {
        const isOpen = section.classList.contains('open');
        // Close all others
        $$('.nav-section').forEach(s => s.classList.remove('open'));
        if (!isOpen) {
          section.classList.add('open');
          state.activeNavSection = section;
        } else {
          state.activeNavSection = null;
        }
      });
    });

    // Open section containing active nav item
    const activeItem = $('.nav-item.active');
    if (activeItem) {
      const section = activeItem.closest('.nav-section');
      if (section) section.classList.add('open');
    }

    // Also open section based on current URL path
    const path = window.location.pathname;
    $$('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      if (href && path.includes(href.replace(/^\//, '').replace('index.html', ''))) {
        item.classList.add('active');
        const section = item.closest('.nav-section');
        if (section) section.classList.add('open');
      }
    });
  }

  // --- Active Nav Highlighting ---
  function setActiveNav() {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/index\.html$/, '') || 'index.html';
    $$('.nav-item').forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (!href) return;
      const hrefBase = href.replace(/\.html$/, '');
      // Match: "finance/budgeting" against "finance/budgeting.html"
      if (path === href || path === hrefBase || path + '.html' === href) {
        item.classList.add('active');
        const section = item.closest('.nav-section');
        if (section) section.classList.add('open');
      }
    });
  }

  // --- Global Search ---
  function initGlobalSearch() {
    const searchInput = $('.header-search input');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          // In production: redirect to search results
          console.log('Global search:', query);
        }
      }
    });
  }

  // --- Notification Toggle ---
  function initNotifications() {
    const notifBtn = $('.header-btn[title="Notifications"]');
    if (!notifBtn) return;
    notifBtn.addEventListener('click', () => {
      console.log('Notifications clicked');
      // In production: toggle notification panel
    });
  }

  // --- Quick Create ---
  function initQuickCreate() {
    const qcBtn = $('#quick-create-btn');
    if (!qcBtn) return;
    qcBtn.addEventListener('click', () => {
      console.log('Quick create clicked');
      // In production: open quick create dropdown
    });
  }

  // --- Responsive Header Search ---
  function initResponsiveSearch() {
    const handleResize = () => {
      const searchContainer = $('.header-search');
      if (searchContainer && window.innerWidth < 640) {
        searchContainer.style.maxWidth = '160px';
      } else if (searchContainer) {
        searchContainer.style.maxWidth = '';
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
  }

  // --- Date/Time Formatting Helpers ---
  window.PROIAQ = window.PROIAQ || {};

  window.PROIAQ.formatCurrency = function (amount, currency = 'HKD') {
    const symbols = { HKD: 'HK$', USD: 'US$', CNY: '¥', EUR: '€' };
    const sym = symbols[currency] || currency;
    if (amount >= 1000000) {
      return `${sym}${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${sym}${(amount / 1000).toFixed(0)}K`;
    }
    return `${sym}${Number(amount).toLocaleString('en-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  window.PROIAQ.formatDate = function (dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-HK', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  window.PROIAQ.formatDateTime = function (dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('en-HK', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  window.PROIAQ.relativeTime = function (dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return window.PROIAQ.formatDate(dateStr);
  };

  // --- Toast Notification ---
  window.PROIAQ.toast = function (message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      background: var(--text-primary);
      color: white;
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      font-weight: 500;
      z-index: 9999;
      opacity: 0;
      transform: translateY(8px);
      transition: all 0.3s ease;
      box-shadow: var(--shadow-lg);
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // --- Modal Helper ---
  window.PROIAQ.openModal = function (modalId) {
    const overlay = $(`#${modalId}`);
    if (overlay) overlay.classList.add('active');
  };

  window.PROIAQ.closeModal = function (modalId) {
    const overlay = $(`#${modalId}`);
    if (overlay) overlay.classList.remove('active');
  };

  // Close modals on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
      e.target.classList.remove('active');
    }
  });

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $$('.modal-overlay.active').forEach(o => o.classList.remove('active'));
    }
  });

  let initialized = false;

  // --- Initialize Everything ---
  function init() {
    if (initialized) return;
    initialized = true;
    initSidebarToggle();
    initMobileSidebar();
    initNavSections();
    initGlobalSearch();
    initNotifications();
    initQuickCreate();
    initResponsiveSearch();
    initLucide();

    setActiveNav();

    console.log('PRO-IAQ ERP Suite initialized');
  }

  // Expose for shell.js / index.html to call after DOM is ready
  window.initMain = init;
})();

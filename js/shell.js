/* ============================================================
   PRO-IAQ ERP Suite - Shared Shell Injection
   Renders sidebar + header into any page.
   Each page just needs: <div id="shell-app"></div> + content-area
   ============================================================ */

(function () {
  'use strict';

  // Detect current page path for active nav highlighting
  function getCurrentPath() {
    const p = window.location.pathname;
    // Remove leading slash, trailing index.html
    return p.replace(/^\/+/, '').replace(/\/index\.html$/, '') || 'index.html';
  }

  // Navigation structure
  const NAV = [
    { type: 'item', href: 'index.html', icon: 'layout-dashboard', label: 'Dashboard' },
    { type: 'section', label: 'Finance', items: [
      { href: 'finance/index.html', label: 'Overview' },
      { href: 'finance/chart-of-accounts.html', label: 'Chart of Accounts' },
      { href: 'finance/invoices.html', label: 'Invoices', badge: '24', badgeType: 'count' },
      { href: 'finance/payments.html', label: 'Payments' },
      { href: 'finance/expenses.html', label: 'Expenses', badge: '3', badgeType: 'warn' },
      { href: 'finance/budgeting.html', label: 'Budgeting' },
      { href: 'finance/reports.html', label: 'Reports' },
    ]},
    { type: 'section', label: 'Sales', items: [
      { href: 'sales/index.html', label: 'Overview' },
      { href: 'sales/pipeline.html', label: 'Pipeline', badge: '18', badgeType: 'info' },
      { href: 'sales/customers.html', label: 'Customers' },
      { href: 'sales/orders.html', label: 'Orders' },
      { href: 'sales/quotes.html', label: 'Quotes' },
      { href: 'sales/products.html', label: 'Products' },
    ]},
    { type: 'section', label: 'Inventory', items: [
      { href: 'inventory/index.html', label: 'Overview' },
      { href: 'inventory/products.html', label: 'Products' },
      { href: 'inventory/stock.html', label: 'Stock Levels' },
      { href: 'inventory/warehouses.html', label: 'Warehouses' },
      { href: 'inventory/movements.html', label: 'Movements' },
    ]},
    { type: 'section', label: 'Procurement', items: [
      { href: 'procurement/index.html', label: 'Overview' },
      { href: 'procurement/purchase-orders.html', label: 'Purchase Orders' },
      { href: 'procurement/suppliers.html', label: 'Suppliers' },
      { href: 'procurement/goods-receipt.html', label: 'Goods Receipt' },
    ]},
    { type: 'section', label: 'Production', items: [
      { href: 'production/index.html', label: 'Overview' },
      { href: 'production/bom.html', label: 'Bill of Materials' },
      { href: 'production/work-orders.html', label: 'Work Orders' },
      { href: 'production/planning.html', label: 'Planning' },
    ]},
    { type: 'section', label: 'Human Resources', items: [
      { href: 'hr/index.html', label: 'Overview' },
      { href: 'hr/employees.html', label: 'Employees' },
      { href: 'hr/attendance.html', label: 'Attendance' },
      { href: 'hr/leave.html', label: 'Leave', badge: '5', badgeType: 'warn' },
      { href: 'hr/payroll.html', label: 'Payroll' },
      { href: 'hr/performance.html', label: 'Performance' },
    ]},
    { type: 'section', label: 'Projects', items: [
      { href: 'projects/index.html', label: 'Overview' },
      { href: 'projects/list.html', label: 'All Projects' },
      { href: 'projects/detail.html', label: 'Project Detail' },
    ]},
    { type: 'item', href: 'reports/index.html', icon: 'bar-chart-3', label: 'Reports' },
    { type: 'item', href: 'ai-insights/index.html', icon: 'sparkles', label: 'AI Insights', badge: 'New', badgeType: 'info' },
    { type: 'section', label: 'Settings', items: [
      { href: 'settings/index.html', label: 'General' },
      { href: 'settings/users-roles.html', label: 'Users & Roles' },
      { href: 'settings/workflows.html', label: 'Workflows' },
      { href: 'settings/company.html', label: 'Company' },
      { href: 'settings/audit-log.html', label: 'Audit Log' },
    ]},
  ];

  function isActive(href) {
    const cp = getCurrentPath();
    if (cp === 'index.html' && href === 'index.html') return true;
    if (href === 'index.html') return false;
    // Match: cp="finance/invoices" against href="finance/invoices.html"
    const hrefBase = href.replace(/\.html$/, '');
    return cp === hrefBase || cp.startsWith(hrefBase + '/');
  }

  function renderNavItem(item, depth) {
    const active = isActive(item.href);
    const pad = depth > 0 ? ' style="padding-left:' + (28 + (depth - 1) * 16) + 'px;"' : '';
    let badgeHtml = '';
    if (item.badge) {
      badgeHtml = `<span class="nav-badge ${item.badgeType || 'count'}">${item.badge}</span>`;
    }
    const iconHtml = item.icon
      ? `<i data-lucide="${item.icon}"></i>`
      : '';
    return `<a href="${item.href}" class="nav-item${active ? ' active' : ''}"${pad}>
      ${iconHtml}<span class="nav-label">${item.label}</span>${badgeHtml}
    </a>`;
  }

  function renderSidebar() {
    let html = '';
    for (const entry of NAV) {
      if (entry.type === 'item') {
        html += `<div class="nav-section">${renderNavItem(entry, 0)}</div>`;
      } else if (entry.type === 'section') {
        const anyActive = entry.items.some(i => isActive(i.href));
        html += `<div class="nav-section${anyActive ? ' open' : ''}">`;
        html += `<div class="nav-section-title">
          <span class="nav-label">${entry.label}</span>
          <i data-lucide="chevron-right" class="nav-chevron"></i>
        </div>`;
        html += '<div class="nav-sub">';
        for (const item of entry.items) {
          html += renderNavItem(item, 1);
        }
        html += '</div></div>';
      }
    }
    return html;
  }

  function injectShell() {
    const app = document.getElementById('shell-app');
    if (!app) return;

    const currentPath = getCurrentPath();
    const isDashboard = currentPath === 'index.html';
    const breadcrumbSegments = currentPath.replace(/\.html$/, '').replace(/-/g, ' ').split('/');
    const pageTitle = breadcrumbSegments[breadcrumbSegments.length - 1]
      .replace(/\b\w/g, c => c.toUpperCase());
    const moduleName = breadcrumbSegments.length > 1
      ? breadcrumbSegments[0].replace(/\b\w/g, c => c.toUpperCase())
      : '';

    const breadcrumbHtml = breadcrumbSegments.map((seg, i) => {
      const label = seg.replace(/\b\w/g, c => c.toUpperCase());
      if (i === breadcrumbSegments.length - 1) {
        return `<span>${label}</span>`;
      }
      return `<a href="${breadcrumbSegments.slice(0, i + 1).join('/')}/index.html">${label}</a>`;
    }).join('<i data-lucide="chevron-right"></i>');

    app.innerHTML = `
<div class="app-shell">

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">P</div>
      <div>
        <div class="brand-text">PRO-IAQ</div>
        <div class="brand-sub">Professional 2026</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${renderSidebar()}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar">CY</div>
        <div>
          <div class="nav-label" style="color:white;font-size:0.8125rem;font-weight:600;">Chris Yu</div>
          <div style="font-size:0.7rem;color:var(--text-sidebar);">Administrator</div>
        </div>
      </div>
    </div>
  </aside>

  <button class="sidebar-toggle" id="sidebar-toggle" title="Toggle Sidebar">
    <i data-lucide="panel-left"></i>
  </button>
  <div class="sidebar-overlay"></div>

  <!-- Main Area -->
  <main class="main-area">
    <header class="top-header">
      <button class="header-mobile-trigger" title="Menu">
        <i data-lucide="menu"></i>
      </button>
      <div class="header-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search across modules… (Ctrl+K)">
      </div>
      <div class="header-actions">
        <div class="company-switcher">
          <i data-lucide="building-2"></i>
          <span>PRO-IAQ HK Ltd.</span>
          <i data-lucide="chevron-down" style="width:14px;height:14px;"></i>
        </div>
        <div class="header-divider"></div>
        <button class="header-btn" title="Notifications">
          <i data-lucide="bell"></i>
          <span class="badge-count">3</span>
        </button>
        <button class="header-btn" title="Messages">
          <i data-lucide="mail"></i>
          <span class="dot pulse"></span>
        </button>
        <button class="btn-primary" id="quick-create-btn">
          <i data-lucide="plus"></i>
          <span>Quick Create</span>
        </button>
        <div class="avatar" title="Chris Yu — Administrator">CY</div>
      </div>
    </header>

    <div class="content-area">
      <div class="page-header">
        <div class="page-header-left">
          <div class="breadcrumbs">
            <a href="index.html"><i data-lucide="home"></i></a>
            <i data-lucide="chevron-right"></i>
            ${breadcrumbHtml}
          </div>
          <h1>${pageTitle}${isDashboard ? ' — Executive Overview' : ''}</h1>
          <p class="text-sm text-muted">${isDashboard ? 'FY 2026 · PRO-IAQ HK Ltd.' : moduleName + ' Module'}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn-secondary btn-sm"><i data-lucide="download"></i> Export</button>
          <button class="btn-secondary btn-sm"><i data-lucide="refresh-cw"></i> Refresh</button>
        </div>
      </div>
      <div id="page-content"></div>
    </div>
  </main>
</div>`;
  }

  // --- Expose ---
  window.PROIAQ = window.PROIAQ || {};
  window.PROIAQ.getCurrentPath = getCurrentPath;
  window.PROIAQ.injectShell = injectShell;
  window.PROIAQ.pageContent = function (html) {
    const el = document.getElementById('page-content');
    if (el) el.innerHTML = html;
  };

  // Auto-inject on DOM ready
  function init() {
    injectShell();
    // Load main.js logic (sidebar toggle etc.)
    if (typeof window.initMain === 'function') window.initMain();
    // Re-render Lucide icons
    if (typeof lucide !== 'undefined') {
      setTimeout(() => lucide.createIcons(), 50);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

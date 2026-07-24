/* ============================================================
   PRO-IAQ ERP Suite - Chart.js Configurations
   Realistic Mock Data – Hong Kong / APAC Context | HKD
   ============================================================ */

(function () {
  'use strict';

  // --- Chart.defaults (Global) ---
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600', size: 13 };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  }

  const COLORS = {
    blue: '#1E88E5',
    teal: '#00BFA5',
    green: '#4CAF50',
    amber: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    navy: '#0A1628',
    grey: '#94A3B8',
  };

  const GRADIENTS = {};

  function getGradient(ctx, colorStart, colorEnd) {
    const key = `${colorStart}-${colorEnd}`;
    if (GRADIENTS[key]) return GRADIENTS[key];
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    GRADIENTS[key] = gradient;
    return gradient;
  }

  // ============================================================
  //  MOCK DATA
  // ============================================================

  // Monthly revenue data for H2 2025 – H1 2026 (HKD)
  const MONTHLY_REVENUE = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [4.2, 3.8, 5.1, 4.9, 5.6, 6.2, 5.8, 6.5, 7.1, 7.8, 8.4, 9.2],
    expenses: [2.8, 2.6, 3.1, 3.0, 3.2, 3.5, 3.3, 3.6, 3.9, 4.1, 4.3, 4.6],
    profit: [1.4, 1.2, 2.0, 1.9, 2.4, 2.7, 2.5, 2.9, 3.2, 3.7, 4.1, 4.6],
  };

  // Revenue by region (HKD millions, 2026 YTD)
  const REVENUE_BY_REGION = {
    labels: ['Hong Kong', 'Singapore', 'Tokyo', 'Shanghai', 'Sydney', 'Seoul', 'Bangkok'],
    values: [28.5, 18.2, 14.8, 12.1, 9.6, 7.3, 5.5],
  };

  // Cash flow (monthly, HKD millions)
  const CASH_FLOW = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    inflow: [7.2, 7.8, 8.1, 8.6, 9.1, 9.8, 9.4, 8.9, 9.6, 10.2, 10.8, 11.5],
    outflow: [5.4, 5.6, 5.9, 6.1, 6.3, 6.8, 6.5, 6.3, 6.7, 7.0, 7.3, 7.6],
  };

  // Expense breakdown (HKD millions, current month)
  const EXPENSE_BREAKDOWN = {
    labels: ['COGS', 'Payroll', 'Rent', 'Marketing', 'Logistics', 'IT', 'Utilities', 'Others'],
    values: [3200, 1800, 450, 380, 290, 220, 160, 140],
  };

  // Receivables aging (HKD)
  const RECEIVABLES_AGING = {
    labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
    values: [18500, 8200, 3400, 1200, 680],
  };

  // Order pipeline (units & value)
  const ORDER_PIPELINE = {
    labels: ['Quoted', 'Confirmed', 'In Production', 'Shipped', 'Delivered'],
    values: [42, 28, 18, 14, 32],
    amounts: [6.8, 4.5, 3.2, 2.6, 5.4],
  };

  // Headcount by department
  const HEADCOUNT_BY_DEPT = {
    labels: ['Engineering', 'Sales', 'Operations', 'Finance', 'HR', 'Marketing', 'IT'],
    values: [85, 42, 38, 18, 8, 12, 10],
  };

  // Attendance rate (last 7 days)
  const ATTENDANCE_RATE = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    rates: [96, 94, 97, 93, 95, 88, 72],
  };

  // Inventory turnover
  const INVENTORY_TURNOVER = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    turnover: [4.2, 4.5, 4.1, 4.8, 5.0, 5.3],
    industry: [3.8, 3.9, 3.7, 4.0, 4.1, 4.2],
  };

  // ============================================================
  //  DASHBOARD CHARTS
  // ============================================================

  window.PROIAQ = window.PROIAQ || {};

  /**
   * Chart 1: Revenue vs Expenses (Line/Area)
   */
  window.PROIAQ.initRevenueChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: MONTHLY_REVENUE.labels,
        datasets: [
          {
            label: 'Revenue',
            data: MONTHLY_REVENUE.revenue,
            borderColor: COLORS.blue,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;
              const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              grad.addColorStop(0, 'rgba(30, 136, 229, 0.2)');
              grad.addColorStop(1, 'rgba(30, 136, 229, 0.0)');
              return grad;
            },
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: COLORS.blue,
          },
          {
            label: 'Expenses',
            data: MONTHLY_REVENUE.expenses,
            borderColor: COLORS.red,
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            borderDash: [6, 3],
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: COLORS.red,
          },
          {
            label: 'Net Profit',
            data: MONTHLY_REVENUE.profit,
            borderColor: COLORS.teal,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return;
              const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              grad.addColorStop(0, 'rgba(0, 191, 165, 0.15)');
              grad.addColorStop(1, 'rgba(0, 191, 165, 0.0)');
              return grad;
            },
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: COLORS.teal,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 20, boxWidth: 8 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: HK$${ctx.parsed.y.toFixed(1)}M`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `HK$${v}M` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 2: Revenue by Region (Horizontal Bar)
   */
  window.PROIAQ.initRegionChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: REVENUE_BY_REGION.labels,
        datasets: [{
          label: 'Revenue (HK$M)',
          data: REVENUE_BY_REGION.values,
          backgroundColor: [
            'rgba(0, 191, 165, 0.85)',
            'rgba(30, 136, 229, 0.75)',
            'rgba(30, 136, 229, 0.65)',
            'rgba(76, 175, 80, 0.7)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(148, 163, 184, 0.5)',
          ],
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` HK$${ctx.parsed.x.toFixed(1)}M` },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `HK$${v}M` },
          },
          y: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 3: Cash Flow (Bar + Line)
   */
  window.PROIAQ.initCashFlowChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: CASH_FLOW.labels,
        datasets: [
          {
            label: 'Inflow',
            data: CASH_FLOW.inflow,
            backgroundColor: 'rgba(0, 191, 165, 0.7)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Outflow',
            data: CASH_FLOW.outflow,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.dataset.label}: HK$${ctx.parsed.y.toFixed(1)}M` },
          },
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `HK$${v}M` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 4: Expense Breakdown (Doughnut)
   */
  window.PROIAQ.initExpenseChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    const colors = [
      COLORS.blue, COLORS.teal, COLORS.amber, COLORS.red,
      COLORS.purple, COLORS.green, COLORS.navy, COLORS.grey,
    ];

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: EXPENSE_BREAKDOWN.labels,
        datasets: [{
          data: EXPENSE_BREAKDOWN.values,
          backgroundColor: colors,
          borderColor: '#FFFFFF',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverBorderColor: '#FFFFFF',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 14, boxWidth: 8, font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = EXPENSE_BREAKDOWN.values.reduce((a, b) => a + b, 0);
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ${ctx.label}: HK$${ctx.parsed.toLocaleString()} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  };

  /**
   * Chart 5: Receivables Aging (Pie / Doughnut)
   */
  window.PROIAQ.initReceivablesChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: RECEIVABLES_AGING.labels,
        datasets: [{
          data: RECEIVABLES_AGING.values,
          backgroundColor: [
            COLORS.green, COLORS.blue, COLORS.amber, '#F97316', COLORS.red,
          ],
          borderColor: '#FFFFFF',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { usePointStyle: true, padding: 14, boxWidth: 8 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const total = RECEIVABLES_AGING.values.reduce((a, b) => a + b, 0);
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ${ctx.label}: HK$${(ctx.parsed / 1000).toFixed(1)}K (${pct}%)`;
              },
            },
          },
        },
      },
    });
  };

  /**
   * Chart 6: Inventory Turnover (Line)
   */
  window.PROIAQ.initInventoryChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: INVENTORY_TURNOVER.labels,
        datasets: [
          {
            label: 'PRO-IAQ Turnover',
            data: INVENTORY_TURNOVER.turnover,
            borderColor: COLORS.teal,
            backgroundColor: 'rgba(0, 191, 165, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: COLORS.teal,
          },
          {
            label: 'Industry Avg',
            data: INVENTORY_TURNOVER.industry,
            borderColor: COLORS.grey,
            borderDash: [6, 4],
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: COLORS.grey,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } },
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `${v}x` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 7: Sales Pipeline Funnel (Bar)
   */
  window.PROIAQ.initPipelineChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ORDER_PIPELINE.labels,
        datasets: [{
          label: 'Orders (#)',
          data: ORDER_PIPELINE.values,
          backgroundColor: [
            'rgba(30, 136, 229, 0.8)',
            'rgba(0, 191, 165, 0.8)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(76, 175, 80, 0.8)',
          ],
          borderRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { stepSize: 10 },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 8: Headcount by Department (Bar)
   */
  window.PROIAQ.initHeadcountChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: HEADCOUNT_BY_DEPT.labels,
        datasets: [{
          label: 'Employees',
          data: HEADCOUNT_BY_DEPT.values,
          backgroundColor: 'rgba(30, 136, 229, 0.75)',
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            beginAtZero: true,
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 9: Attendance Rate (Line)
   */
  window.PROIAQ.initAttendanceChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ATTENDANCE_RATE.labels,
        datasets: [{
          label: 'Attendance Rate',
          data: ATTENDANCE_RATE.rates,
          borderColor: COLORS.green,
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: COLORS.green,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` },
          },
        },
        scales: {
          y: {
            min: 60,
            max: 100,
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `${v}%` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Chart 10: Profit Margin Trend (Line)
   */
  window.PROIAQ.initMarginChart = function (canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    const margins = [28, 26, 31, 30, 34, 36, 35, 37, 38, 42, 44, 46];

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: MONTHLY_REVENUE.labels,
        datasets: [{
          label: 'Gross Margin %',
          data: margins,
          borderColor: COLORS.teal,
          backgroundColor: 'rgba(0, 191, 165, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: COLORS.teal,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` },
          },
        },
        scales: {
          y: {
            min: 20,
            max: 50,
            grid: { color: 'rgba(226, 232, 240, 0.5)' },
            ticks: { callback: (v) => `${v}%` },
          },
          x: { grid: { display: false } },
        },
      },
    });
  };

  /**
   * Universal Mini Sparkline (for KPI cards)
   */
  window.PROIAQ.initSparkline = function (canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data: data,
          borderColor: color || COLORS.teal,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        }],
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });
  };

  console.log('PRO-IAQ Charts module initialized');
})();

import { Component, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { ChartData, ChartEvent, ChartOptions, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CATEGORY_ICONS } from '../../../util/categories';
import { DashboardService } from '../../../services/dashboard.service';
import { categoryPalette, chartTheme, themeVersion } from '../../../util/chart-theme';
/**
 * Displays product counts by category in a doughnut chart.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [BaseChartDirective],
})
export class DoughnutChartComponent implements OnInit {
  // ---- Injected dependencies --------------------------------------------------------------------
  /**
   * Create the component with its dashboard data service.
   * @param dashboardService - Provides the category statistics.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  constructor(private dashboardService: DashboardService) {}

  // ---- Component lifecycle ----------------------------------------------------------------------
  /**
   * Load the chart statistics when the component initializes.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.loadStats();
  }

  // ---- State (signals) --------------------------------------------------------------------------
  public total = signal(0);
  public error = signal(false);
  private version = themeVersion();
  private theme = computed(() => {
    this.version();
    return chartTheme();
  });
  private rows = signal<{ name: string; total: number }[]>([]);

  // ---- Chart configuration ----------------------------------------------------------------------
  public doughnutChartLabels: string[] = CATEGORY_ICONS.map((c) => c.name).sort((a, b) =>
    a.localeCompare(b),
  );

  /**
   * Configure the doughnut chart's layout, legend, and theme-aware tooltips.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public options = computed<ChartOptions<'doughnut'>>(() => {
    const t = this.theme();
    return {
      // Let the canvas size follow its container rather than a fixed aspect ratio.
      responsive: true,
      maintainAspectRatio: false,
      // Keep enough room in the center for the total-count plugin.
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          // Use point markers and theme colors to match the chart presentation.
          labels: {
            color: t.text,
            font: { family: t.font, size: 13 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
        // Keep tooltip contrast aligned with the active application theme.
        tooltip: {
          backgroundColor: t.surface,
          titleColor: t.text,
          bodyColor: t.text,
          titleFont: { family: t.font },
          bodyFont: { family: t.font },
          borderColor: t.border,
          borderWidth: 1,
        },
      },
    };
  });

  /**
   * Build Chart.js labels and dataset values from the loaded category totals.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public chartData = computed<ChartData<'doughnut'>>(() => {
    // Track theme changes so the chart recomputes when its category palette changes.
    this.version();
    const rows = this.rows();
    return {
      // Keep each label, value, and color at the same category index.
      labels: rows.map((r) => r.name),
      datasets: [
        {
          data: rows.map((r) => r.total),
          backgroundColor: categoryPalette(rows.length),
          borderWidth: 0,
          spacing: 2,
          borderRadius: 4,
          hoverOffset: 6,
        },
      ],
    };
  });

  /**
   * Draw the total product count and its caption in the chart's center.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public centerPlugins: Plugin<'doughnut'>[] = [
    {
      id: 'centerText',
      afterDraw: (chart) => {
        const t = this.theme();
        const { ctx, chartArea } = chart;
        // Use the plot area, not the full canvas, because the legend takes up space.
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        // Save and restore canvas state so these text styles do not affect Chart.js.
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = t.text;
        ctx.font = `800 40px ${t.heading}`;
        ctx.fillText(String(this.total()), x, y - 8);
        ctx.fillStyle = t.muted;
        ctx.font = `500 14px ${t.font}`;
        ctx.fillText('products', x, y + 22);
        ctx.restore();
      },
    },
  ];

  // ---- Public chart API -------------------------------------------------------------------------
  public doughnutChartType = 'doughnut' as const;

  /**
   * Log the chart event and its active elements.
   * @param event - Chart event.
   * @param active - Active chart elements.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public chartClicked({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }

  /**
   * Log the chart hover event and its active elements.
   * @param event - Chart event.
   * @param active - Active chart elements.
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public chartHovered({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }

  // ---- Data loading (API calls) -----------------------------------------------------------------
  /**
   * Loads all the stats for the doughnut chart
   * @author Oriol Plazas
   * @since 1.0.0
   */
  private loadStats() {
    this.dashboardService.getDoughnutGraphStats().subscribe({
      next: (data) => {
        const sorted = [...data].sort((a, b) =>
          a.categoryName.localeCompare(b.categoryName, 'es', { sensitivity: 'base' }),
        );
        this.total.set(sorted.reduce((sum, c) => sum + c.total_products, 0));
        this.rows.set(sorted.map((c) => ({ name: c.categoryName, total: c.total_products })));
      },
      error: () => {
        this.error.set(true);
      },
    });
  }
}

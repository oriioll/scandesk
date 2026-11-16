import { Component, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { ChartData, ChartEvent, ChartOptions, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CATEGORY_ICONS } from '../../../util/categories';
import { DashboardService } from '../../../services/dashboard.service';
import { categoryPalette, chartTheme, themeVersion } from '../../../util/chart-theme';
@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [BaseChartDirective],
})
export class DoughnutChartComponent implements OnInit {
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.loadStats();
  }
  public total = signal(0);
  public error = signal(false);
  private version = themeVersion();
  private theme = computed(() => {
    this.version();
    return chartTheme();
  });
  private rows = signal<{ name: string; total: number }[]>([]);

  private numberData = signal<number[]>([]);
  public doughnutChartLabels: string[] = CATEGORY_ICONS.map((c) => c.name).sort((a, b) =>
    a.localeCompare(b),
  );

  public options = computed<ChartOptions<'doughnut'>>(() => {
    const t = this.theme();
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: t.text,
            font: { family: t.font, size: 13 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
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

  public chartData = computed<ChartData<'doughnut'>>(() => {
    this.version();
    const rows = this.rows();
    return {
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

  public centerPlugins: Plugin<'doughnut'>[] = [
    {
      id: 'centerText',
      afterDraw: (chart) => {
        const t = this.theme();
        const { ctx, chartArea } = chart;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
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
  private palette(n: number): string[] {
    const { primary, accent } = this.theme();
    return Array.from({ length: n }, (_, i) => {
      const pct = n > 1 ? Math.round((i / (n - 1)) * 100) : 0;
      return `color-mix(in srgb, ${accent} ${pct}%, ${primary})`;
    });
  }
  //Chart type (doughnut)
  public doughnutChartType = 'doughnut' as const;

  // Chart Events
  public chartClicked({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: object[] }): void {
    console.log(event, active);
  }

  /**
   * Loads all the stats for the doughnut chart
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

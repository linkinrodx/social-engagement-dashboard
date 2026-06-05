import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SkeletonComponent } from '../../components/skeleton/skeleton';
import { SupabaseService, ExecutionLog } from '../../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, MatCardModule, SkeletonComponent],
  template: `
    <h2>Dashboard</h2>
    <p>Resumen de actividad del bot.</p>

    @if (loading()) {
      <app-skeleton variant="card-grid" />
    } @else {
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <mat-card style="flex: 1; min-width: 200px; padding: 16px;">
          <h3>Comentarios Hoy</h3>
          <p style="font-size: 2rem;">{{ todayCount }}</p>
        </mat-card>
        <mat-card style="flex: 1; min-width: 200px; padding: 16px;">
          <h3>Última Ejecución</h3>
          <p>{{ lastRun ? (lastRun.started_at | date: 'short') : '—' }}</p>
          <p>Estado: {{ lastRun?.status }}</p>
        </mat-card>
        <mat-card style="flex: 1; min-width: 200px; padding: 16px;">
          <h3>Total Ejecuciones</h3>
          <p style="font-size: 2rem;">{{ totalRuns }}</p>
        </mat-card>
      </div>
    }
  `,
})
export default class DashboardPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  loading = signal(true);
  todayCount = 0;
  lastRun: ExecutionLog | null = null;
  totalRuns = 0;

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      this.todayCount = await this.supabase.getDailyCommentCount();
      const logs = await this.supabase.getExecutionLogs(1);
      this.lastRun = logs[0] ?? null;
      const all = await this.supabase.getExecutionLogs(9999);
      this.totalRuns = all.length;
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }
}

import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SkeletonComponent } from '../../components/skeleton/skeleton';
import { SupabaseService, ExecutionLog } from '../../services/supabase.service';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [DatePipe, SkeletonComponent],
  template: `
    <h2>Historial de Ejecuciones</h2>

    @if (loading()) {
      <app-skeleton variant="table" [rows]="5" [cols]="6" />
    } @else {
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Posts</th>
              <th>Comentarios</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs; track log.id) {
              <tr>
                <td>{{ log.started_at | date: 'short' }}</td>
                <td>{{ log.finished_at | date: 'short' }}</td>
                <td>{{ log.status }}</td>
                <td>{{ log.posts_scanned }}</td>
                <td>{{ log.comments_posted }}</td>
                <td>{{ log.error_message || '—' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export default class ExecutionsPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  loading = signal(true);
  logs: ExecutionLog[] = [];

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      this.logs = await this.supabase.getExecutionLogs();
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }
}

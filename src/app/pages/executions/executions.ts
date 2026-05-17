import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupabaseService, ExecutionLog } from '../../services/supabase.service';

@Component({
  selector: 'app-executions',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h2>Historial de Ejecuciones</h2>

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
  `
})
export default class ExecutionsPage {
  private supabase = inject(SupabaseService);
  logs: ExecutionLog[] = [];

  async ngOnInit() {
    this.logs = await this.supabase.getExecutionLogs();
  }
}

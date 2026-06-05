import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../components/skeleton/skeleton';
import { SupabaseService, Settings } from '../../services/supabase.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, SkeletonComponent],
  template: `
    <h2>Configuración del Bot</h2>

    @if (loading()) {
      <app-skeleton variant="form" />
    } @else if (settings) {
      <form class="settings-form" (ngSubmit)="save()">
        <div class="form-field">
          <label for="enabled">Habilitado</label>
          <input id="enabled" type="checkbox" [(ngModel)]="settings.enabled" name="enabled" />
        </div>
        <div class="form-field">
          <label for="maxComments">Máx. comentarios por día</label>
          <input id="maxComments" type="number" [(ngModel)]="settings.max_comments_per_day" name="maxComments" />
        </div>
        <div class="form-field">
          <label for="minDelay">Delay mínimo (seg)</label>
          <input id="minDelay" type="number" [(ngModel)]="settings.min_delay_seconds" name="minDelay" />
        </div>
        <div class="form-field">
          <label for="maxDelay">Delay máximo (seg)</label>
          <input id="maxDelay" type="number" [(ngModel)]="settings.max_delay_seconds" name="maxDelay" />
        </div>
        <button type="submit" class="save-button">Guardar</button>
      </form>
    }
  `,
})
export default class SettingsPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  loading = signal(true);
  settings: Settings | null = null;

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    try {
      this.settings = await this.supabase.getSettings();
    } finally {
      this.loading.set(false);
      this.cdr.detectChanges();
    }
  }

  async save() {
    if (!this.settings) return;
    const ok = await this.supabase.updateSettings(this.settings);
    if (ok) alert('Configuración guardada');
  }
}

import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService, Settings } from '../../services/supabase.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Configuración del Bot</h2>

    @if (settings) {
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
    } @else {
      <p>Cargando configuración...</p>
    }
  `,
})
export default class SettingsPage {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  settings: Settings | null = null;

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    this.settings = await this.supabase.getSettings();
    this.cdr.detectChanges();
  }

  async save() {
    if (!this.settings) return;
    const ok = await this.supabase.updateSettings(this.settings);
    if (ok) alert('Configuración guardada');
  }
}

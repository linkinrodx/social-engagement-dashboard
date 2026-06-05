import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (variant()) {
      @case ('card-grid') {
        <div class="skeleton-card-grid">
          <div class="skeleton-card">
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-30 skeleton-value"></div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-30 skeleton-value"></div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-30 skeleton-value"></div>
          </div>
        </div>
      }
      @case ('table') {
        <div class="skeleton-table">
          <div class="skeleton-table-row skeleton-table-header">
            @for (_ of colCount(); track $index) {
              <div class="skeleton-cell"></div>
            }
          </div>
          @for (_ of rowItems(); track $index) {
            <div class="skeleton-table-row">
              @for (_ of colCount(); track $index) {
                <div class="skeleton-cell"></div>
              }
            </div>
          }
        </div>
      }
      @case ('form') {
        <div class="skeleton-form">
          @for (_ of [1,2,3,4]; track $index) {
            <div class="skeleton-line w-50"></div>
            <div class="skeleton-line w-100 skeleton-field"></div>
          }
          <div class="skeleton-line w-25 skeleton-button"></div>
        </div>
      }
    }
  `,
  styles: `
    .skeleton-card-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .skeleton-card {
      flex: 1;
      min-width: 200px;
      padding: 16px;
      border-radius: 4px;
      background: var(--mat-sys-surface);
    }
    .skeleton-table {
      border-radius: 4px;
      background: var(--mat-sys-surface);
    }
    .skeleton-table-row {
      display: flex;
      gap: 16px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }
    .skeleton-table-header .skeleton-cell {
      height: 14px;
    }
    .skeleton-line,
    .skeleton-field,
    .skeleton-cell,
    .skeleton-button {
      border-radius: 4px;
      background-color: var(--mat-sys-surface-variant);
      background-image: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      background-size: 200% 100%;
      background-repeat: no-repeat;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    .skeleton-line {
      height: 16px;
      margin-bottom: 12px;
    }
    .skeleton-value {
      height: 32px;
      margin-bottom: 0;
    }
    .skeleton-field {
      height: 40px;
      margin-bottom: 20px;
    }
    .skeleton-button {
      height: 36px;
      margin-top: 8px;
    }
    .skeleton-cell {
      height: 16px;
      flex: 1;
    }
    .w-25 { width: 25%; }
    .w-30 { width: 30%; }
    .w-50 { width: 50%; }
    .w-60 { width: 60%; }
    .w-100 { width: 100%; }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
})
export class SkeletonComponent {
  variant = input.required<'card-grid' | 'table' | 'form'>();
  rows = input(5);
  cols = input(6);
  rowItems = computed(() => Array.from({ length: this.rows() }));
  colCount = computed(() => Array.from({ length: this.cols() }));
}

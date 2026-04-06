import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="spinner-wrapper" [class.overlay]="overlay()">
      <div class="spinner" [style.width.px]="size()" [style.height.px]="size()"></div>
      @if (label()) {
        <span class="spinner-label">{{ label() }}</span>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
    }
    .spinner-wrapper.overlay {
      position: fixed;
      inset: 0;
      background: rgba(244, 246, 251, 0.85);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }
    .spinner {
      border: 3px solid rgba(99, 102, 241, 0.15);
      border-top-color: #6366f1;
      border-right-color: #06b6d4;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-label {
      font-size: 0.85rem;
      color: #64748b;
    }
  `],
})
export class LoadingSpinnerComponent {
  size = input<number>(40);
  label = input<string>('');
  overlay = input<boolean>(false);
}

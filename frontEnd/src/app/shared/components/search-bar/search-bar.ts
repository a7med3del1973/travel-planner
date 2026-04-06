import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-wrapper">
      <span class="search-icon" aria-hidden="true"><i class="fa-solid fa-magnifying-glass"></i></span>
      <input
        type="search"
        class="search-input"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
        (keydown.enter)="searchSubmit.emit(internalValue())"
        [attr.aria-label]="placeholder()"
        autocomplete="off"
      />
      @if (internalValue()) {
        <button class="clear-btn" (click)="clear()" aria-label="Clear search"><i class="fa-solid fa-xmark"></i></button>
      }
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 0.875rem;
      font-size: 0.85rem;
      color: #94a3b8;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.7rem 2.75rem 0.7rem 2.5rem;
      background: rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 10px;
      color: #1e293b;
      font-size: 0.9rem;
      font-family: inherit;
      transition: all 0.3s;
      outline: none;
    }
    .search-input::placeholder { color: #94a3b8; }
    .search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
      background: #fff;
    }
    .clear-btn {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 0.2rem;
      border-radius: 4px;
      transition: color 0.2s;
    }
    .clear-btn:hover { color: #1e293b; }
  `],
})
export class SearchBarComponent {
  placeholder = input<string>('Search destinations…');
  value = input<string>('');

  searchChange = output<string>();
  searchSubmit = output<string>();

  internalValue = signal('');

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.searchChange.emit(val);
  }

  clear(): void {
    this.internalValue.set('');
    this.searchChange.emit('');
    this.searchSubmit.emit('');
  }
}

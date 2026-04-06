import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pagination" role="navigation" aria-label="Pagination">
      <button
        class="page-btn"
        [class.disabled]="currentPage() === 0"
        (click)="currentPage() > 0 && pageChange.emit(currentPage() - 1)"
        aria-label="Previous page"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      @for (page of pages(); track page) {
        <button
          class="page-btn"
          [class.active]="page === currentPage()"
          (click)="pageChange.emit(page)"
          [attr.aria-current]="page === currentPage() ? 'page' : null"
          [attr.aria-label]="'Page ' + (page + 1)"
        >
          {{ page + 1 }}
        </button>
      }

      <button
        class="page-btn"
        [class.disabled]="currentPage() === totalPages() - 1 || totalPages() === 0"
        (click)="currentPage() < totalPages() - 1 && pageChange.emit(currentPage() + 1)"
        aria-label="Next page"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <span class="page-info">
        {{ totalElements() }} result{{ totalElements() === 1 ? '' : 's' }}
      </span>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      flex-wrap: wrap;
    }
    .page-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 0.5rem;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.08);
      background: #fff;
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .page-btn:hover:not(.disabled):not(.active) {
      background: #f1f5f9;
      border-color: rgba(99,102,241,0.3);
      color: #1e293b;
    }
    .page-btn.active {
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      border-color: transparent;
      color: #fff;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(99,102,241,0.25);
    }
    .page-btn.disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .page-info {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }
  `],
})
export class PaginationComponent {
  currentPage = input<number>(0);
  totalPages = input<number>(0);
  totalElements = input<number>(0);

  pageChange = output<number>();

  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    const start = Math.max(0, current - delta);
    const end = Math.min(total - 1, current + delta);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  });
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { Destination, DestinationRequest } from '../../../core/models/destination.model';
import { Page } from '../../../core/models/page.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card';

@Component({
  selector: 'app-fetch-api',
  templateUrl: './fetch-api.html',
  styleUrl: './fetch-api.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, PaginationComponent, DestinationCardComponent],
})
export class FetchApiComponent {
  private readonly adminService = inject(AdminService);

  page = signal<Page<Destination> | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  isBulkSaving = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  currentPage = signal(0);
  pageSize = 10;
  savingId = signal<string | null>(null);

  selectedIds = signal<Set<string>>(new Set());
  hasSelection = computed(() => this.selectedIds().size > 0);
  selectionCount = computed(() => this.selectedIds().size);

  fetchDestinations(p = 0): void {
    this.currentPage.set(p);
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.selectedIds.set(new Set());
    this.adminService.fetchFromApi(p, this.pageSize).subscribe({
      next: (data) => { this.page.set(data); this.isLoading.set(false); },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Failed to fetch from API.');
        this.isLoading.set(false);
      },
    });
  }

  toggleSelect(dest: Destination): void {
    const key = dest.name;
    const current = new Set(this.selectedIds());
    if (current.has(key)) current.delete(key);
    else current.add(key);
    this.selectedIds.set(current);
  }

  isSelected(dest: Destination): boolean {
    return this.selectedIds().has(dest.name);
  }

  selectAll(): void {
    const all = new Set((this.page()?.content ?? []).map((d) => d.name));
    this.selectedIds.set(all);
  }

  clearSelection(): void { this.selectedIds.set(new Set()); }

  addSingle(dest: Destination): void {
    this.savingId.set(dest.name);
    const payload = this.toRequest(dest);
    this.adminService.addDestination(payload).subscribe({
      next: () => {
        this.showSuccess(`"${dest.name}" added successfully!`);
        this.savingId.set(null);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? `Failed to add "${dest.name}".`);
        this.savingId.set(null);
      },
    });
  }

  bulkAdd(): void {
    if (!this.hasSelection()) return;
    const selected = (this.page()?.content ?? []).filter((d) => this.isSelected(d));
    const payload = selected.map(this.toRequest);
    this.isBulkSaving.set(true);
    this.adminService.bulkAddDestinations(payload).subscribe({
      next: (result) => {
        this.showSuccess(
          `Bulk add complete: ${result.saved} saved, ${result.skipped} skipped.`
        );
        this.isBulkSaving.set(false);
        this.clearSelection();
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Bulk add failed.');
        this.isBulkSaving.set(false);
      },
    });
  }

  onPageChange(p: number): void { this.fetchDestinations(p); }

  private toRequest(dest: Destination): DestinationRequest {
    return {
      name: dest.name,
      capital: dest.capital,
      region: dest.region,
      population: dest.population,
      currency: dest.currency,
      flagUrl: dest.flagUrl,
    };
  }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    this.errorMsg.set('');
    setTimeout(() => this.successMsg.set(''), 4000);
  }
}

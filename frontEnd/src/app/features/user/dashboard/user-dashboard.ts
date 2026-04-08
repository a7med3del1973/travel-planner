import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestinationService } from '../../../core/services/destination.service';
import { AuthStore } from '../../../core/store/auth.store';
import { Destination } from '../../../core/models/destination.model';
import { Page } from '../../../core/models/page.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { DestinationCardComponent } from '../../../shared/components/destination-card/destination-card';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingSpinnerComponent,
    PaginationComponent,
    SearchBarComponent,
    DestinationCardComponent,
  ],
})
export class UserDashboardComponent implements OnInit {
  private readonly destService = inject(DestinationService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  page = signal<Page<Destination> | null>(null);
  searchResults = signal<Destination[] | null>(null);
  isLoading = signal(false);
  isSearching = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  currentPage = signal(0);
  pageSize = 9;
  searchQuery = signal('');
  wantLoadingId = signal<number | null>(null);

  isSearchMode = computed(() => this.searchQuery().trim().length > 0);
  displayedItems = computed<Destination[]>(() =>
    this.isSearchMode()
      ? (this.searchResults() ?? [])
      : (this.page()?.content ?? [])
  );

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q.trim()) {
            this.searchResults.set(null);
            this.isSearching.set(false);
            return [];
          }
          this.isSearching.set(true);
          return this.destService.searchDestinations(q);
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (results) => {
          this.searchResults.set(results as Destination[]);
          this.isSearching.set(false);
        },
        error: () => this.isSearching.set(false),
      });
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(p: number): void {
    this.currentPage.set(p);
    this.isLoading.set(true);
    this.destService.getApprovedDestinations(p, this.pageSize).subscribe({
      next: (data) => { this.page.set(data); this.isLoading.set(false); },
      error: () => { this.errorMsg.set('Failed to load destinations.'); this.isLoading.set(false); },
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  onSearchSubmit(query: string): void {
    if (query.trim()) this.searchSubject.next(query);
  }

  viewDetails(dest: Destination): void {
    this.router.navigate(['/user/destination', dest.id]);
  }

  markWantToVisit(destId: number): void {
    const userId = this.authStore.userId();
    if (!userId) { this.errorMsg.set('Could not identify user. Please re-login.'); return; }
    this.wantLoadingId.set(destId);
    this.destService.markWantToVisit(destId, userId).subscribe({
      next: () => {
        // Update the item locally
        if (this.searchResults()) {
          const results = [...this.searchResults()!];
          const idx = results.findIndex(d => d.id === destId);
          if (idx !== -1) results[idx].isLiked = true;
          this.searchResults.set(results);
        }
        if (this.page()) {
          const content = [...this.page()!.content];
          const idx = content.findIndex(d => d.id === destId);
          if (idx !== -1) content[idx].isLiked = true;
          this.page.set({ ...this.page()!, content });
        }
        this.wantLoadingId.set(null);
        this.showSuccess('Added to your wish list! ❤️');
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Failed to mark destination.');
        this.wantLoadingId.set(null);
      },
    });
  }

  onPageChange(p: number): void { this.loadPage(p); }

  isWantLoading(id: number): boolean { return this.wantLoadingId() === id; }

  private showSuccess(msg: string): void {
    this.successMsg.set(msg);
    this.errorMsg.set('');
    setTimeout(() => this.successMsg.set(''), 3000);
  }
}

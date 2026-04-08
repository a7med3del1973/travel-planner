import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Destination, DestinationRequest } from '../../../core/models/destination.model';
import { Page } from '../../../core/models/page.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { PopulationPipe } from '../../../shared/pipes/population.pipe';

@Component({
  selector: 'app-admin-destinations',
  templateUrl: './admin-destinations.html',
  styleUrl: './admin-destinations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent, PaginationComponent, PopulationPipe],
})
export class AdminDestinationsComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  page = signal<Page<Destination> | null>(null);
  isLoading = signal(false);
  isAdding = signal(false);
  deletingId = signal<number | null>(null);
  errorMsg = signal('');
  successMsg = signal('');
  showModal = signal(false);
  currentPage = signal(0);
  pageSize = 8;

  form = this.fb.nonNullable.group({
    name:       ['', Validators.required],
    capital:    ['', Validators.required],
    region:     ['', Validators.required],
    population: [0, [Validators.required, Validators.min(0)]],
    currency:   ['', Validators.required],
    flagUrl:    [''],
  });

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(p = 0): void {
    this.currentPage.set(p);
    this.isLoading.set(true);
    this.adminService.getAllDestinations(p, this.pageSize).subscribe({
      next: (data) => { this.page.set(data); this.isLoading.set(false); },
      error: () => { this.errorMsg.set('Failed to load destinations.'); this.isLoading.set(false); },
    });
  }

  openModal(): void {
    this.form.reset({ name: '', capital: '', region: '', population: 0, currency: '', flagUrl: '' });
    this.showModal.set(true);
  }

  closeModal(): void { this.showModal.set(false); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isAdding.set(true);
    this.errorMsg.set('');
    const payload = this.form.getRawValue() as DestinationRequest;
    this.adminService.addDestination(payload).subscribe({
      next: () => {
        this.isAdding.set(false);
        this.showModal.set(false);
        this.successMsg.set('Destination added successfully!');
        this.loadDestinations(this.currentPage());
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Failed to add destination.');
        this.isAdding.set(false);
      },
    });
  }

  deleteDestination(id: number): void {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    this.deletingId.set(id);
    this.adminService.deleteDestination(id).subscribe({
      next: () => {
        this.successMsg.set('Destination deleted.');
        this.deletingId.set(null);
        this.loadDestinations(this.currentPage());
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Failed to delete destination.');
        this.deletingId.set(null);
      },
    });
  }

  onPageChange(p: number): void { this.loadDestinations(p); }
}

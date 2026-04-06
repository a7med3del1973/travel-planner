import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationService } from '../../../core/services/destination.service';
import { AuthStore } from '../../../core/store/auth.store';
import { Destination } from '../../../core/models/destination.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { PopulationPipe } from '../../../shared/pipes/population.pipe';

@Component({
  selector: 'app-destination-detail',
  templateUrl: './destination-detail.html',
  styleUrl: './destination-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, PopulationPipe],
})
export class DestinationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destService = inject(DestinationService);
  private readonly authStore = inject(AuthStore);

  destination = signal<Destination | null>(null);
  isLoading = signal(true);
  isWanted = signal(false);
  wantLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/user/dashboard']); return; }
    this.destService.getDestinationById(id).subscribe({
      next: (d) => { this.destination.set(d); this.isLoading.set(false); },
      error: () => { this.errorMsg.set('Destination not found.'); this.isLoading.set(false); },
    });
  }

  markWantToVisit(): void {
    const userId = this.authStore.userId();
    const dest = this.destination();
    if (!userId || !dest) return;
    this.wantLoading.set(true);
    this.destService.markWantToVisit(dest.id, userId).subscribe({
      next: () => {
        this.isWanted.set(true);
        this.wantLoading.set(false);
        this.successMsg.set('Added to your wish list! ❤️');
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Failed to mark destination.');
        this.wantLoading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/user/dashboard']);
  }
}

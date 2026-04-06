import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Destination } from '../../../core/models/destination.model';
import { PopulationPipe } from '../../pipes/population.pipe';

@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopulationPipe],
})
export class DestinationCardComponent {
  destination = input.required<Destination>();
  isWanted    = input<boolean>(false);
  wantLoading = input<boolean>(false);

  showDetails     = input<boolean>(false);
  showWantToVisit = input<boolean>(false);
  showDelete      = input<boolean>(false);
  showAdd         = input<boolean>(false);

  viewDetails  = output<Destination>();
  wantToVisit  = output<number>();
  delete       = output<number>();
  add          = output<Destination>();
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'population', pure: true })
export class PopulationPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '—';
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  }
}

export interface Destination {
  id: number;
  name: string;
  capital: string;
  region: string;
  population: number;
  currency: string;
  flagUrl: string;
  approved?: boolean;
}

export interface DestinationRequest {
  name: string;
  capital: string;
  region: string;
  population: number;
  currency: string;
  flagUrl: string;
}

export interface BulkAddResult {
  saved: number;
  skipped: number;
  skippedNames: string[];
}

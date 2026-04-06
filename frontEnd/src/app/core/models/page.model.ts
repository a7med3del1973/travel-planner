export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
}

import { FilterQuery, ProjectionType, SortOrder } from 'mongoose';

export interface PaginationParams<T> {
  readonly limit?: number;
  readonly page?: number;
  condition?: FilterQuery<T>;
  sort?:
    | string
    | { [key: string]: SortOrder | { $meta: 'textScore' } }
    | [string, SortOrder][];
  projection?: ProjectionType<T>;
  populate?: string | string[];
}

export interface PaginationResult<T> {
  data: T[];
  count: number;
  currentPage: number;
  totalPage: number;
}

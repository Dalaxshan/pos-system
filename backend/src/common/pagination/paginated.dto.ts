class PageMetaDto {
  readonly page: number;
  readonly limit: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor(page: number, limit: number, itemCount: number) {
    this.page = page;
    this.limit = limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(itemCount / limit);
    this.hasPreviousPage = page > 1;
    this.hasNextPage = page < this.pageCount;
  }
}

export class PaginatedDto<T> {
  readonly meta: PageMetaDto;
  readonly results: T[];

  constructor(page: number, limit: number, itemCount: number, data: T[]) {
    this.meta = new PageMetaDto(page, limit, itemCount);
    this.results = data;
  }
}

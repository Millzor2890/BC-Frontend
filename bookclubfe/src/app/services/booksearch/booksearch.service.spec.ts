import { TestBed } from '@angular/core/testing';

import { BooksearchService } from './booksearch.service';

describe('BooksearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BooksearchService = TestBed.get(BooksearchService);
    expect(service).toBeTruthy();
  });
});

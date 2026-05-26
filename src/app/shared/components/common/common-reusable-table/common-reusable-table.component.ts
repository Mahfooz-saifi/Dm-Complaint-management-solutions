import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-common-reusable-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './common-reusable-table.component.html',
  styleUrls: ['./common-reusable-table.component.css']
})
export class CommonReusableTableComponent
    implements OnChanges {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  filteredData: any[] = [];
  paginatedData: any[] = [];

  searchText: string = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage: number = 1;
  pageSize: number = 5;

  darkMode: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {

    this.filteredData = [...this.data];

    this.updatePagination();
  }

  // SORTING
  sort(column: string): void {

    if (this.sortColumn === column) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    } else {

      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a: any, b: any) => {

      const valueA = a[column];
      const valueB = b[column];

      if (typeof valueA === 'string') {

        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return this.sortDirection === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    });

    this.updatePagination();
  }

  // SEARCH
  applyFilter(): void {

    const search =
      this.searchText.toLowerCase();

    this.filteredData = this.data.filter(
      (row: any) => {

        return Object.values(row).some(
          (value: any) =>

            String(value)
              .toLowerCase()
              .includes(search)
        );
      }
    );

    this.currentPage = 1;

    this.updatePagination();
  }

  // PAGINATION
  updatePagination(): void {

    const start =
      (this.currentPage - 1) * this.pageSize;

    const end = start + this.pageSize;

    this.paginatedData =
      this.filteredData.slice(start, end);
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();
    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();
    }
  }

  get totalPages(): number {

    return Math.ceil(
      this.filteredData.length / this.pageSize
    );
  }

  get startIndex(): number {

    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredData.length
    );
  }

  // DARK MODE
  // toggleDarkMode(): void {

  //   this.darkMode = !this.darkMode;
  // }
}
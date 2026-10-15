import { MatPaginatorIntl } from '@angular/material/paginator';

export function createZhPaginatorIntl(): MatPaginatorIntl {
  const paginator = new MatPaginatorIntl();
  paginator.itemsPerPageLabel = '每頁筆數：';
  paginator.nextPageLabel = '下一頁';
  paginator.previousPageLabel = '上一頁';
  paginator.firstPageLabel = '第一頁';
  paginator.lastPageLabel = '最後一頁';
  paginator.getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) return `共 ${length} 筆`;
    const start = page * pageSize + 1;
    const end = Math.min(start + pageSize - 1, length);
    return `${start}－${end}，共 ${length} 筆`;
  };
  return paginator;
}
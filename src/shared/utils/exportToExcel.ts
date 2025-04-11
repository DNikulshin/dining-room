// helpers.ts
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IResultItem } from '@/types/types';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export const handleExportToExcel = (resultItems: IResultItem[]) => {
  const formattedResultItems = resultItems.map(item => ({
    UserID: item.userId,
    Total: item.total,
    Order: Object.entries(item.order).map(([key, { quantity, price }]) => {
      return `${key} (x${quantity}) - ${price * quantity}р`;
    }).join(', '),
    CreatedAt: item.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedResultItems);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
  saveAs(data, `orders_${new Date().toLocaleString().replace(':', '_').replace(',', '_')}.xlsx`);
};
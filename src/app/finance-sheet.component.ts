import { Component } from '@angular/core';

@Component({
  selector: 'app-finance-sheet',
  imports: [],
  templateUrl: './finance-sheet.component.html',
  styleUrl: './finance-sheet.component.scss'
})
export class FinanceSheetComponent {
  financialData = {
    invoice: 30000,
    payments: 15000,
    creditMemo: 2000,
    debitMemo: 1000,
    aging: '15 days'
  };
}

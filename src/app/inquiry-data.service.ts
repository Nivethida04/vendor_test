import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InquiryDataService {

  constructor() { }
  private data: any = null;

  setInquiryData(data: any) {
    this.data = data;
  }

  getInquiryData(): any {
    return this.data;
  }

  clearInquiryData() {
    this.data = null;
  }
}

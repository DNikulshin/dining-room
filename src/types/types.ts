export interface IOrder {
    id: number; 
    quantity: number; 
    price: number;
  }
  
  export interface IResultItem {
    userId: string; 
    order: { [key: string]: IOrder };
    total: number; 
    createdAt: string; 
  }

  export interface IMenu {
    id: number;
    name: string;
    price: number;
    key: string;
  }
  
  export interface IActionKey {
    name: string;
    key: string;
  }
  
  
  export type IResultItems = IResultItem[]



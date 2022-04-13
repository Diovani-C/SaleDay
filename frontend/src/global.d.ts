/// <reference types="@sveltejs/kit" />

interface Sale {
  _id: string;
  customerId: string;
  paid: boolean;
  total: number;
  products: { productId: string; tags: Array<number> }[];
}

type Subproduct = {
  _id: string;
  name: string;
  price: number;
};

type ProductInfo = {
  productId: string;
  max: number;
  subproductTags: {
    tag: number;
    subproductId: string;
    sold: boolean;
    barcode: string;
    price: number;
  }[];
};

type SalesGroup = {
  _id: string;
  createdAt: string;
  productsInfo: ProductInfo[];
  sales: Sale[];
};

type Product = {
  _id: string;
  name: string;
  barcode?: string;
  price?: number;
};

type Customer = {
  _id: string;
  name: string;
  cellphone?: string;
  phone?: string;
  email?: string;
};

type Operation = "add" | "edit" | "remove" | "get";

type CustomerRequest = { operation: Operation; data: Customer };

type ProductRequest = { operation: Operation; data: Product };

type SubproductRequest = { operation: Operation; data: Subproduct };

type SaleRequest = {
  operation: Operation;
  data: { salesGroupId: string; sale: Sale };
};

type SaleResponse = {
  operation: Operation;
  data: { salesGroupId: string; sales: Sale[] };
};

type ErrorResponse = {
  errors: { [key: string]: { message: string; path: string } };
};

type SalesGroupRequest = {
  operation: Operation;
  data: {
    _id: SalesGroup["_id"];
    createdAt: SalesGroup["createdAt"];
    productsInfo: ProductInfo[];
  };
};

type Header =
  | { key: string; value: string; empty?: boolean }
  | { key: string; empty: boolean; value?: string };

type TableType = {
  headers: Header[];
  rows: { id: string; [key: string]: any }[];
};

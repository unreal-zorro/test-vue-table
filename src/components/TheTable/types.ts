export interface ClientDate {
  start_date: string;
  end_date: string;
}

export interface Client {
  o_id: number;
  client_name: string;
  diets: Array<string>;
  tariff: Array<string>;
  address: string;
  phone: string;
  dates: Array<ClientDate>;
  discount: number;
  order_sum: number;
  order_payed: string;
  pay_status: string;
  courier_comment: string;
  inner_comment: string;
}

export type Sort = 'asc' | 'desc' | 'none';

export interface SortDirection {
  o_id: Sort;
  client_name: Sort;
  diets: Sort;
  tariff: Sort;
  address: Sort;
  phone: Sort;
  dates: Sort;
  discount: Sort;
  payment: Sort;
  payment_method: Sort;
  courier_comment: Sort;
  inner_comment: Sort;
  status: Sort;
}

export type GetNameOfDay = (day: number) => string;

export type SortType = 'start' | 'end-today' | 'end-tomorrow' | 'end' | 'ended' | '';

export interface SortOption {
  text: string;
  value: SortType;
}

export type StringOrClientDate = string | ClientDate;

export interface ObjectWithInternalClientProps<StringOrClientDate> {
  item: StringOrClientDate;
  index: number;
}

export interface FlooredDates {
  startDateFloor: number;
  endDateFloor: number;
  nowFloor: number;
}

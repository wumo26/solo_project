export interface User {
  id?: number; // id 在新增時是可選的，由後端生成
  name: string;
  phone: string;
  email: string;
  password?: string; // password 在接收資料時是可選的，且通常不應該被儲存
  age?: number; // age 是可選的
  createdAt?: Date; // createdAt 在接收資料時是可選的
}

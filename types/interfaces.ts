export interface Category {
  id: string;
  name: string;
  type: string;
  incomes?: Income[];
  expenses?: Expense[];
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: Date;
  userId: string;
  categoryId: string;
  user?: User;
  category?: Category;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: Date;
  userId: string;
  categoryId: string;
  user?: User;
  category?: Category;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  incomes?: Income[];
  expenses?: Expense[];
}
export interface CustomerCompany {
  department: string;
  name: string;
  title: string;
}

export interface CustomerAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  role: string;
  company?: CustomerCompany;
  address?: CustomerAddress;
}

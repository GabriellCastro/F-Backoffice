import { Address } from "./form";

export interface IUser {
  id: string;
  name: string;
  cpf: string;
  email: string;
  whatsApp: string;
  role: string;
  profile?: any;
  address: Address;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserVerifyData {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IPaginationRoot {
  totalElements: number;
  currentPage?: number;
  firstPage?: number;
  lastPage?: number;
  perPage?: number;
}

export interface IUsersPaginatedResponse {
  statusCode: number;
  error?: any;
  message: string;
  data: IUsersPaginated;
}

export interface IUsersPaginated extends IPaginationRoot {
  elements: IUser[];
}

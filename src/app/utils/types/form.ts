export interface Address {
  cep: string;
  address: string;
  number: string;
  city: string;
  street: string;
  state: string;
  complement?: string;
}

export interface ICreateUserContent {
  role: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword?: string;
  whatsApp: string;
  profile?: string;
  address: Address;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IEditUserContent {
  role?: string;
  name?: string;
  email?: string;
  cpf?: string;
  whatsApp?: string;
  profile?: string;
  address?: Address;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

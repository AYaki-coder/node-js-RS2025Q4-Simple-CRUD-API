import { User } from './user';

export interface UserInfo {
  username: string;
  age: number;
  hobbies: string[];
}

export interface LinkDetails {
  searchParams: URLSearchParams;
  hash: string;
  apiName?: string;
  route?: string;
  id?: string;
  rest: string[];
}

export enum Method {
  Get = 'GET',
  Put = 'PUT',
  Post = 'POST',
  Delete = 'DELETE',
}

export interface ToResponse {
  msg: string | User[] | User;
  code: number;
}

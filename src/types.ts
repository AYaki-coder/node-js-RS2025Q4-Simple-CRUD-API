export interface User {
  username: string;
  age: number;
  hobbies: string[];
}

export interface LinkDetails {
  searchParams: URLSearchParams;
  hash: string;
  pathnameChunks: string[];
}

export enum Method {
  Get = 'GET',
  Put = 'PUT',
  Post = 'POST',
  Delete = 'DELETE',
}

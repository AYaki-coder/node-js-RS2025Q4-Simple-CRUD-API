import { v4 as uuid } from 'uuid';
import { CustomError } from './custom-error';

export class User {
  public username: string;
  public age: number;
  public hobbies: string[];

  constructor(
    body: string,
    public readonly id: string = uuid(),
  ) {
    if (!body) {
      throw new CustomError(400, 'Fields "username", "age" and "hobbies" are required');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(body);
    } catch (error) {
      throw new CustomError(500, 'Invalid JSON');
    }

    this.checkBody(jsonData);
    this.username = jsonData.username;
    this.age = jsonData.age;
    this.hobbies = jsonData.hobbies;
  }

  private checkBody(jsonData: any): void {
    if (!jsonData.username) {
      throw new CustomError(400, 'Field "username" is required');
    }

    if (typeof jsonData.username !== 'string') {
      throw new CustomError(400, 'Field "username" should be a string');
    }

    if (!jsonData.age) {
      throw new CustomError(400, 'Field "age" is required');
    }

    if (typeof jsonData.age !== 'number') {
      throw new CustomError(400, 'Field "age" should be a number');
    }

    if (!jsonData.hobbies) {
      throw new CustomError(400, 'Field "hobbies" is required');
    }

    if (!Array.isArray(jsonData.hobbies)) {
      throw new CustomError(400, 'Field "hobbies" should be a massive');
    }

    if (jsonData.hobbies.length > 1 && !jsonData.hobbies.every((x: unknown) => typeof x === 'string')) {
      throw new CustomError(400, 'Field "hobbies" should contain a massive with strings');
    }
  }
}

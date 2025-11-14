import { IncomingMessage, ServerResponse } from 'node:http';
import { Method, ToResponse } from './types';
import { sendResponse } from './send-response';
import { getLinkDetails, isLinkValid } from './link';
import { CustomError } from './custom-error';
import { handleErrors } from './handle-errors';
import { User } from './user';
import { validate } from 'uuid';

export class Api {
  private readonly users: User[] = [];

  public run(req: IncomingMessage, res: ServerResponse) {
    const linkDetails = getLinkDetails(req);

    if (!isLinkValid(linkDetails)) {
      throw new CustomError(
        404,
        'This route is not supported or your request contains hash or search parameters',
      );
    }

    let reqBody = '';

    req.on('data', (chunk) => {
      reqBody += chunk;
    });

    req.on('end', () => {
      try {
        const response = this.composeResponse(req, reqBody, linkDetails.id);
        sendResponse(res, JSON.stringify(response.msg), response.code);
      } catch (error) {
        handleErrors(error, res);
      }
    });
  }

  private composeResponse(req: IncomingMessage, body: string, id?: string): ToResponse {
    let toResponse: ToResponse;

    switch (req.method) {
      case Method.Get:
        toResponse = id ? this.get(id) : this.getAll();
        break;

      case Method.Put:
        toResponse = this.put(body, id);
        break;

      case Method.Post:
        if (id) {
          throw new CustomError(404, "This method doesn't support id route");
        }
        toResponse = this.post(body);
        break;

      case Method.Delete:
        toResponse = this.delete(id);
        break;

      default:
        throw new CustomError(400, `Method ${req.method} not supported`);
    }
    return toResponse;
  }

  private getAll(): ToResponse {
    return { msg: this.users, code: 200 };
  }

  private get(id: string): ToResponse {
    if (!validate(id)) {
      throw new CustomError(400, `Id: ${id} has not supported format`);
    }

    const user = this.users.find((x) => x.id === id);
    if (!user) {
      console.log(`Id: ${id} has not supported format`);
      throw new CustomError(404, `User ${id} not found`);
    }

    return { msg: user, code: 200 };
  }

  private put(body: string, id?: string): ToResponse {
    if (!validate(id)) {
      throw new CustomError(400, `Id: ${id} has not supported format`);
    }

    const updatedInfo = new User(body, id);

    const user = this.users.find((x) => x.id === id);
    if (!user) {
      throw new CustomError(404, `User ${id} not found`);
    }

    user.username = updatedInfo.username;
    user.age = updatedInfo.age;
    user.hobbies = updatedInfo.hobbies;

    return { msg: user, code: 200 };
  }

  private post(body: string): ToResponse {
    const user = new User(body);
    this.users.push(user);

    return { msg: user, code: 201 };
  }

  private delete(id?: string): ToResponse {
    if (!validate(id)) {
      throw new CustomError(400, `Id: ${id} has not supported format`);
    }

    const userId = this.users.findIndex((x) => x.id === id);

    if (userId < 0) {
      throw new CustomError(404, `User ${id} not found`);
    }

    this.users.splice(userId, 1);

    return { msg: `User ${id} was deleted`, code: 204 };
  }
}

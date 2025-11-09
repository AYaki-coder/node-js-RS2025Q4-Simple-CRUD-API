import { IncomingMessage, ServerResponse } from 'node:http';
import { Method, ToResponse, User } from './types';
import { sendResponse } from './send-response';
import { getLinkDetails, isLinkValid } from './link';
import { CustomError } from './custom-error';
import { handleErrors } from './handle-errors';

export class Api {
  private readonly Users: User[] = [
    {
      username: 'Vredina',
      age: 41,
      hobbies: ['zastavlyat delat'],
    },
    { username: 'Mary', age: 23, hobbies: ['sport'] },
    { username: 'Julia', age: 36, hobbies: ['bakery', 'dancing'] },
    { username: 'John', age: 51, hobbies: ['gardening', 'spanish', 'detective stories'] },
  ];

  public run(req: IncomingMessage, res: ServerResponse) {
    const linkDetails = getLinkDetails(req);

    if (!isLinkValid(linkDetails)) {
      throw new CustomError(
        404,
        'This route is not supported or your request contains hash or search parameters',
      );
    }

    let reqData = '';

    req.on('data', (chunk) => {
      reqData += chunk;
    });

    req.on('end', () => {
      try {
        const response = this.handleRequest(req, reqData, linkDetails.id);
        sendResponse(res, JSON.stringify(response.msg), response.code);
      } catch (error) {
        handleErrors(error, res);
      }
    });
  }

  private handleRequest(req: IncomingMessage, data: string, id?: string): ToResponse {
    let toResponse: ToResponse;

    switch (req.method) {
      case Method.Get:
        toResponse = this.get(data, id);
        break;

      case Method.Put:
        toResponse = this.put(data, id);
        break;

      case Method.Post:
        toResponse = this.post(data, id);
        break;

      case Method.Delete:
        toResponse = this.delete(data, id);
        break;

      default:
        throw new CustomError(400, `Method ${req.method} not supported`);
    }
    return toResponse;
  }

  private get(data: string, id?: string): ToResponse {
    console.log(`method "get" works with data: ${data} and id: ${id}`);
    return { msg: this.Users, code: 200 };
  }

  private put(data: string, id?: string): ToResponse {
    return { msg: `method "PUT" works with data: ${data} and id: ${id}`, code: 200 };
  }

  private post(data: string, id?: string): ToResponse {
    return { msg: `method "POST" works with data: ${data} and id: ${id}`, code: 200 };
  }

  private delete(data: string, id?: string): ToResponse {
    return { msg: `method "DELETE" works with data: ${data} and id: ${id}`, code: 200 };
  }
}

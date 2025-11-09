import { IncomingMessage, ServerResponse } from 'node:http';
import { LinkDetails, Method, User } from './types';
import { API_LINK } from './constants';
import { sendResponse } from './send-response';
import { getLinkDetails } from './link-details';

export class App {
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
  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse,
  ) {}

  public run() {
    console.table({ method: this.req.method, status: this.req.statusCode, url: this.req.url });

    if (!this.req.url?.toLocaleLowerCase().startsWith(API_LINK)) {
      sendResponse(this.res, 'not supported link!', 404);
    }

    let reqData = '';

    this.req.on('data', (chunk) => {
      reqData += chunk;
    });

    this.req.on('end', () => {
      this.handleRequest(reqData);
    });
  }

  private handleRequest(data: string): void {
    const linkDetails = getLinkDetails(this.req);

    switch (this.req.method) {
      case Method.Get:
        this.get(linkDetails, data);
        break;

      case Method.Put:
        this.put(linkDetails, data);
        break;

      case Method.Post:
        this.post(linkDetails, data);
        break;

      case Method.Delete:
        this.delete(linkDetails, data);
        break;

      default:
        sendResponse(this.res, 'resource not found', 404);
        break;
    }
  }

  private get(linkDetails: LinkDetails, data: string): void {
    // if (currentPath[2] === 'users' && currentPath.length == 3) {
    //   sendResponse(this.res, JSON.stringify(initialUsers), 200);
    //   return;
    // }

    // sendResponse(this.res, 'resource not found', 404);
    console.log(linkDetails, data);
    sendResponse(this.res, ` ${JSON.stringify(this.Users)}`, 200);
  }

  private put(linkDetails: LinkDetails, data: string): void {
    console.log(linkDetails, data);
    sendResponse(this.res, `method "PUT" works with data: ${data}`, 200);
  }

  private post(linkDetails: LinkDetails, data: string): void {
    console.log(linkDetails, data);
    sendResponse(this.res, `method "POST" works with data: ${data}`, 200);
  }

  private delete(linkDetails: LinkDetails, data: string): void {
    console.log(linkDetails, data);
    sendResponse(this.res, `method "DELETE" works with data: ${data}`, 200);
  }
}

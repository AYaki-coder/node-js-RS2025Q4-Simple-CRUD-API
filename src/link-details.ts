import { IncomingMessage } from 'node:http';
import { LinkDetails } from './types';

export const getLinkDetails = (req: IncomingMessage): LinkDetails => {
  const { searchParams, pathname, hash } = new URL(req.url ?? '', `http://${req.headers.host}`);

  const pathnameChunks = pathname.split('/');

  return {
    searchParams,
    pathnameChunks,
    hash,
  };
};

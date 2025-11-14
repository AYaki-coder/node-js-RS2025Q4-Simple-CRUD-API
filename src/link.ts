import { IncomingMessage } from 'node:http';
import { LinkDetails } from './types';
import { API_LINK, SUPPORTED_ROUTE } from './constants';

export const getLinkDetails = (req: IncomingMessage): LinkDetails => {
  const { searchParams, pathname, hash } = new URL(req.url ?? '', `http://${req.headers.host}`);

  const [apiName, route, id, ...rest] = pathname.split('/').slice(1);

  return {
    searchParams,
    apiName,
    route,
    id,
    rest,
    hash,
  };
};

export const isLinkValid = (link: LinkDetails): boolean => {
  if (
    link.apiName?.toLocaleLowerCase() !== API_LINK ||
    link.route?.toLowerCase() !== SUPPORTED_ROUTE ||
    link.rest.length > 0 ||
    link.hash ||
    link.searchParams.keys.length > 0
  ) {
    return false;
  }
  return true;
};

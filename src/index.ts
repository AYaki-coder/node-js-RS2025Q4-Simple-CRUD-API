import { startCluster } from './cluster';
import { config } from './common/config';
import { startServer } from './server';

if (config.multi) {
  //start server
  startCluster();
} else {
  //start server
  console.log('start server');
  startServer(config.port);
}

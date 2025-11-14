import cluster from 'cluster';
import { cpus } from 'os';
import { config } from './common/config';
import http, { ServerResponse, IncomingMessage } from 'node:http';
import { startServer as startDataBase } from './server';

export const startCluster = () => {
  const cores = cpus();
  const databasePort = config.port + cores.length + 1;
  if (cluster.isPrimary) {
    cluster.fork({ DATABASE: true, WORKER_PORT: databasePort });

    cores.map((_, index) => {
      const workerPort = config.port + index + 1;
      return cluster.fork({ WORKER_PORT: workerPort });
    });

    // this console.log is for cross-check to control cluster start
    console.log('Primary process start!', config.port);

    let shift: number = 0;
    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
      let postData = '';

      const targetPort = config.port + 1 + shift;
      shift = (shift + 1) % cores.length;

      req.on('data', (partOfData) => {
        postData += partOfData;
      });
      req.on('end', () => {
        const options = {
          host: 'localhost',
          port: targetPort,
          path: req.url,
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const reqToWorker = http.request(options, (balancerRes) => {
          let postDataFromBase = '';

          balancerRes.setEncoding('utf8');
          balancerRes.on('data', (chunk) => {
            postDataFromBase += chunk;
          });
          balancerRes.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = balancerRes.statusCode ?? 500;
            res.end(postDataFromBase);
          });
        });

        reqToWorker.on('error', (e) => {
          console.error(`request error: ${e.message}`);
        });

        reqToWorker.write(postData);
        reqToWorker.end();
      });
    });

    server.listen(config.port);
  } else {
    const port = config.workerPort ?? config.port;

    if (config.database) {
      startDataBase(databasePort);
    } else {
      // this console.log is for cross-check to control worker start
      console.log('Worker start on port', port);

      const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
        // this console.log is for cross-check to control worker get request
        console.log('Worker on port', port, '; Method:', req.method, '; request url:', req.url);

        let postData = '';
        req.on('data', (partOfData) => {
          postData += partOfData;
        });
        req.on('end', () => {
          const options = {
            host: 'localhost',
            port: databasePort,
            path: req.url,
            method: req.method,
            headers: {
              'Content-Type': 'application/json',
            },
          };

          const reqToDataBase = http.request(options, (resFromDataBase) => {
            let postDataFromBase = '';

            resFromDataBase.setEncoding('utf8');
            resFromDataBase.on('data', (chunk) => {
              postDataFromBase += chunk;
            });
            resFromDataBase.on('end', () => {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = resFromDataBase.statusCode ?? 500;
              res.end(postDataFromBase);
            });
          });

          reqToDataBase.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
          });

          reqToDataBase.write(postData);
          reqToDataBase.end();
        });
      });

      server.listen(port);
    }
  }
};

import http from "node:http";
import path from "node:path";
import serveStatic from "serve-static";

const port = 80;
const root = path.join(import.meta.dirname, `site`);
const serve = serveStatic(root);

const server = http.createServer((request, response) => {
  serve(request, response, () => {
    response.statusCode = 404;
    response.end();
  });
});

server.listen(port, () => {
  process.stdout.write(`Site server listening on port ${port}\n`);
});

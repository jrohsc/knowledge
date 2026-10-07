import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/knowledge";
const root = path.resolve("out");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
};
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    if (pathname === base && base) {
      res.writeHead(308, { Location: base + "/" });
      res.end();
      return;
    }
    if (base && !pathname.startsWith(base + "/")) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    let file = path.resolve(root, "." + pathname.slice(base.length));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(path.join(root, "404.html")));
      return;
    }
    res.writeHead(200, {
      "content-type": mime[path.extname(file)] ?? "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4315, "127.0.0.1", () =>
    console.log(`Static preview: http://127.0.0.1:4315${base}/`),
  );

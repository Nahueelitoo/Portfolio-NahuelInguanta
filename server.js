const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 5500;
const types = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml"
};

http.createServer((request, response) => {
    const url = new URL(request.url, "http://localhost");
    const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${requestedPath}`);

    const relativeFile = path.relative(root, file);
    if (relativeFile.startsWith("..") || path.isAbsolute(relativeFile)) {
        response.writeHead(403);
        return response.end("Forbidden");
    }

    fs.readFile(file, (error, content) => {
        if (error) {
            response.writeHead(404);
            return response.end("Not found");
        }

        response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
        response.end(content);
    });
}).listen(port, () => {
    console.log(`Portfolio disponible en http://localhost:${port}`);
});

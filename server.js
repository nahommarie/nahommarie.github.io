const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Serve index.html for the root path
    if (path === "/") {
      path = "/index.html";
    }

    // Serve the file
    const file = Bun.file(path.slice(1)); // Remove leading slash
    return new Response(file);
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
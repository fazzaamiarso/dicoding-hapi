import Hapi from "@hapi/hapi";
import routes from "./routes";

async function main() {
  const server = Hapi.server({
    host: "localhost",
    port: process.env.PORT ?? 5000,
    routes: { cors: true },
  });

  server.route(routes);

  await server.start();
  console.log("server started:", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

main();

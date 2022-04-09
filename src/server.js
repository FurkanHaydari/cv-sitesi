require("dotenv").config();

// global çağırımlar
const fastify = require("fastify")({ logger: true });

// lokal çağırımlar
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/user");
const guestRoutes = require("./routes/guest");

// değişkenler
const PORT = process.env.PORT || 3000;

// haberler için routelar
// newsRoutes.forEach((route, index) => {
//   fastify.route(route);
// });

// kullanıcılar için routelar

jobRoutes.forEach((route, index) => {
  fastify.route(route);
});
userRoutes.forEach((route, index) => {
  fastify.route(route);
});
guestRoutes.forEach((route, index) => {
  fastify.route(route);
});

// server
const start = async () => {
  try {
    await fastify.listen(PORT, () => {
      fastify.log.info(`server listening on ${PORT}`);
    });
  } catch (err) {
    fastify.log.error(err);
  }
};

start();

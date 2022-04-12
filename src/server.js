require("dotenv").config();

const fastify = require("fastify")({ logger: true });

const PORT = process.env.PORT || 3000;

fastify.register(require("fastify-cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

const userRoutes = require("./routes/user");
const guestRoutes = require("./routes/guest");
const adminRoutes = require("./routes/admin");


userRoutes.forEach((route, index) => {
  fastify.route(route);
});
guestRoutes.forEach((route, index) => {
  fastify.route(route);
});
adminRoutes.forEach((route, index) => {
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

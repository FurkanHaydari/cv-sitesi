const guestControllers = require("../controllers/guest");

const routes = [
  /* NEWS */

  {
    method: "GET",
    url: "/guest/jobs",
    handler: guestControllers.getAllJobs,
  },

  {
    method: "GET",
    url: "/guest/jobs/:id",
    handler: guestControllers.getOneJob,
  },

  {
    method: "POST",
    url: "/guest/register",
    handler: guestControllers.registerGuest,
  },
  {
    method: "POST",
    url: "/guest/sendfeedback",
    handler: guestControllers.sendFeedback,
  },

  {
    method: "POST",
    url: "/login",
    handler: guestControllers.loginGuest,
  },
  // {
  //   method: "POST",
  //   url: "/guest/feedback",
  //   handler: guestControllers.guestFeedback,
  // },
];

module.exports = routes;

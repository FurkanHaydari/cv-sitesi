const userControllers = require("../controllers/user");

const routes = [
  /* USER */

  // {
  //   method: 'PUT',
  //   url: '/user/settings/:id',
  //   preHandler: userTokenValidation,
  //   handler: userControllers.userSettings,
  // },

  {
    method: "GET",
    url: "/jobs",
    handler: userControllers.getAllJobs,
  },
  {
    method: "GET",
    url: "/jobs/:id",
    handler: userControllers.getOneJob,
  },
  {
    method: "GET",
    url: "/users/:id",
    handler: userControllers.getOneUser,
  },
  {
    method: "PATCH",
    url: "/users/updateProfile/:id",
    handler: userControllers.updateProfile,
  },
  {
    method: "PATCH",
    url: "/users/resetPassword/:id",
    handler: userControllers.updatePassword,
  },
  {
    method: "GET",
    url: "/user/:userID/apply/:jobID",
    handler: userControllers.applyJob,
  },
  {
    method: "GET",
    url: "/user/:userID/applications",
    handler: userControllers.myApplications,
  },
  {
    method: "POST",
    url: "/user/sendfeedback",
    handler: userControllers.sendFeedback,
  },
  //   {
  //     method: "DELETE",
  //     url: "/jobs/:id",
  //     handler: jobsControllers.deleteJobs,
  //   },
  //   {
  //     method: "PATCH",
  //     url: "/jobs/:id",
  //     handler: jobsControllers.updateJobs,
  //   },
  // {
  //   method: 'POST',
  //   url: '/user/feedback',
  //   preHandler: userTokenValidation,
  //   handler: userControllers.userFeedback,
  // },
];

module.exports = routes;

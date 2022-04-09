const jobsControllers = require("../controllers/jobs");

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
    handler: jobsControllers.getAllJobs,
  },
  {
    method: "GET",
    url: "/jobs/:id",
    handler: jobsControllers.getOneJob,
  },
  {
    method: "POST",
    url: "/createjobs",
    handler: jobsControllers.createJobs,
  },
  {
    method: "DELETE",
    url: "/jobs/:id",
    handler: jobsControllers.deleteJobs,
  },
  {
    method: "PATCH",
    url: "/jobs/:id",
    handler: jobsControllers.updateJobs,
  },
  // {
  //   method: 'POST',
  //   url: '/user/feedback',
  //   preHandler: userTokenValidation,
  //   handler: userControllers.userFeedback,
  // },
];

module.exports = routes;

const adminControllers = require("../controllers/admin");
// const { adminTokenValidation } = require("../../models/validation");
const routes = [
  /* admin */

  //TÜM KİŞİLERİ GETİR
  {
    method: "GET",
    url: "/admin/users",
    handler: adminControllers.allUsersAdmin,
  },

  //BİR KİŞİYİ GETİR
  {
    method: "GET",
    url: "/admin/users/:userID",
    handler: adminControllers.singleUserAdmin,
  },
  //TÜM İŞLERİ GETİR
  {
    method: "GET",
    url: "/admin/alljobs",
    handler: adminControllers.allJobsAdmin,
  },
  {
    method: "GET",
    url: "/admin/openjobs",
    handler: adminControllers.allOpenJobsAdmin,
  },
  //BİR İŞİ GETİR
  {
    method: "GET",
    url: "/admin/jobs/:id",
    handler: adminControllers.getOneJob,
  },
  {
    method: "POST",
    url: "/admin/create/jobs",
    handler: adminControllers.createJobs,
  },
  {
    method: "DELETE",
    url: "/admin/delete/jobs/:id",
    handler: adminControllers.deleteJob,
  },
  {
    method: "PATCH",
    url: "/admin/update/jobs/:id",
    handler: adminControllers.updateJobs,
  },
  //TÜM BAŞVURULAR
  {
    method: "GET",
    url: "/admin/applications",
    handler: adminControllers.allApplications,
  },
  //BAŞVURUYU REDDET
  {
    method: "GET",
    url: "/admin/application/:jobID/reject/:userID",
    handler: adminControllers.rejectApplication,
  },
  //BAŞVURUYU KABUL ET
  {
    method: "GET",
    url: "/admin/application/:jobID/accept/:userID",
    handler: adminControllers.acceptApplication,
  },

  //SPESİFİK İŞE BAŞVURAN TÜM KİŞİLER
  {
    method: "GET",
    url: "/admin/jobs/:jobID/applicants",
    handler: adminControllers.applicantsAdmin,
  },
  //BİR KİŞİNİN BAŞVURDUĞU TÜM İŞLER
  {
    method: "GET",
    url: "/admin/users/:userID/applications",
    handler: adminControllers.kisininBaşvurduğTumJobsAdmin,
  },
  //BAŞVURUYU REDDET
  {
    method: "GET",
    url: "/admin/application/:jobID/:userID",
    handler: adminControllers.singleApplication,
  },
  {
    method: "GET",
    url: "/admin/feedbacks",
    handler: adminControllers.allFeedbacks,
  },
  {
    method: "GET",
    url: "/admin/feedback/:id",
    handler: adminControllers.singleFeedback,
  },
  // {
  //   method: "POST",
  //   url: "/admin/login",
  //   handler: adminControllers.loginAdmin,
  // },
  // {
  //   method: "POST",
  //   url: "/admin/addAdmin",
  //   // preHandler: adminTokenValidation,
  //   handler: adminControllers.addAdmin,
  // },
];

module.exports = routes;

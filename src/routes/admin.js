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
    url: "/admin/jobs",
    handler: adminControllers.allJobsAdmin,
  },
  //SPESİFİK İŞİ GETİR
  // {
  //   method: "GET",
  //   url: "/admin/jobs",
  //   handler: adminControllers.singleUserAdmin,
  // },
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

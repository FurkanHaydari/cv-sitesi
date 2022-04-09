const adminControllers = require('../controllers/admin');
const { adminTokenValidation } = require('../../models/validation');
const routes = [
  /* admin */
  // {
  //   method: 'POST',
  //   url: '/admin/log/:id',
  //   handler: adminControllers.adminLog,
  // },
  {
    method: 'PUT',
    url: '/admin/confirmComment/:id',
    preHandler: adminTokenValidation,
    handler: adminControllers.confirmCommentAdmin,
  },
  {
    method: 'PUT',
    url: '/admin/confirmNews/:id',
    preHandler: adminTokenValidation,
    handler: adminControllers.confirmNewsAdmin,
  },
  {
    method: 'POST',
    url: '/admin/login',
    handler: adminControllers.loginAdmin,
  },
  {
    method: 'POST',
    url: '/admin/addAdmin',
    preHandler: adminTokenValidation,
    handler: adminControllers.addAdmin,
  },
];

module.exports = routes;

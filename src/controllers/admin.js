const boom = require("boom");
const jwt = require("jsonwebtoken");
const Admin = require("../models");
const nodemailer = require("nodemailer");
const knex = require("../lib/knex");

const { boomify } = require("boom");

// ERRORS KULLANILACAK

exports.allUsersAdmin = async (req, res) => {
  let key = adminPermissions.allUsers;
  let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);

  if (perm) {
    let response = await Admin.findAll("user");
    res.status(200).send({
      status: "success",
      msg: "Tüm Kullanıcılar Gösterildi.",
      response,
    });
  } else {
    res.status(403).send({
      status: "fail",
      msg: "Bu yetkiye sahip değilsiniz",
    });
  }
};

exports.singleUserAdmin = async (req, res) => {
  let key = adminPermissions.singleUser;
  let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);

  if (perm) {
    try {
      let userID = req.params.id;
      let response = await Admin.findOne("user", { ID: userID });
      res.status(200).send({
        status: "success",
        msg: `${userID} numaralı ID'ye sahip kullanıcı gösterildi.`,
        response,
      });
    } catch (err) {
      console.log("single user içindeki error: ", err);
      res.status(403).send({ status: "error", msg: err });
      throw boom.boomify(err);
    }
  } else {
    res.status(403).send({
      status: "fail",
      msg: "Bu yetkiye sahip değilsiniz",
    });
  }
};

exports.addUserAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "addUser");
    const username = await Admin.createUsername(req.body);
    createdObject.username = username;
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = userRegisterValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen kullanıcı için gerekli tüm bilgileri giriniz.",
      });
    } else {
      let key = adminPermissions.addUser;
      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let isUserExists = await Admin.findOne("user", function () {
          this.where({ email: createdObject.email }).orWhere({
            username: createdObject.username,
          });
        });
        if (isUserExists) {
          res.status(400).send({
            status: "fail",
            msg: "Bu kullanıcı adı veya email'e kayıtlı hesap bulunmaktadır.",
          });
        } else {
          const response = await Admin.insert("user", createdObject);
          console.log("response in addUser: ", response);
          const addedUser = await Admin.findOne("user", { ID: response[0] });
          console.log("\n\n New User : ", addedUser, "\n\n");
          let logObject = {
            adminID: req.admin.admin_id,
            logdetail: adminLog.addUser,
            newvalue: JSON.stringify(addedUser),
            userID: response[0],
          };
          const adminLogResp = await Admin.insert("adminlog", logObject);

          res.status(201).send({
            status: "success",
            msg: "Kullanıcı başarıyla oluşturuldu.",
          });
        }
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    res.status(403).send({ status: "error", msg: err });
    throw boomify(err);
  }
};

exports.updateUserAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "updateUser");
    console.log("TEST TEST TEST", createdObject);
    const { error, result } = updateUserAdminValidation(req.body);

    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen kullanıcı için gerekli tüm bilgileri giriniz.",
      });
    } else {
      let key = adminPermissions.updateUser;
      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let oldUser = await Admin.findOne("user", { ID: req.params.id });
        let response = await Admin.updateOrDelete(
          "user",
          { ID: req.params.id },
          createdObject
        );
        console.log("updated user: ", response);
        let newUser = await Admin.findOne("user", { ID: req.params.id });
        let adminLogObj = {
          adminID: req.admin.admin_id,
          userID: req.params.id,
          logdetail: adminLog.updateUser,
          oldvalue: JSON.stringify(oldUser),
          newvalue: JSON.stringify(newUser),
        };
        const adminLogResp = await Admin.insert("adminlog", adminLogObj);

        res
          .status(202)
          .send({ status: "success", msg: "Kullanıcı bilgileri güncellendi." });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("YANLISS : ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.deleteUserAdmin = async (req, res) => {
  try {
    let userID = req.params.id;
    let userStatus = 0;
    console.log("user id in deleteUser: ", userID);
    let key = adminPermissions.deleteUser;
    let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);

    if (perm) {
      let response = await Admin.updateOrDelete(
        "user",
        { ID: userID },
        { isActive: parseInt(userStatus) }
      );
      let adminLogObj = {
        adminID: req.admin.admin_id,
        userID: response,
        logdetail: adminLog.deleteUser,
      };
      const adminLogResp = await Admin.insert("adminlog", adminLogObj);
      console.log("delete user içinde response: ", response);
      res.status(200).send({ status: "success", msg: "Kullanıcı Silindi." });
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("delete user içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.allCommentsAdmin = async (req, res) => {
  try {
    let key = adminPermissions.allComments;
    let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);
    console.log("PERRRMMMMMMMM", perm);
    if (perm) {
      let response = await Admin.findAll("comment", true, allCommentsResp, [
        ["user", "authorID", "=", "user.ID"],
      ]);
      console.log("response in allComment: ", response);
      if (response)
        res.status(200).send({
          status: "success",
          msg: "Tüm yorumlar başarıyla listelendi.",
          response,
        });
      else
        res.status(404).send({ status: "fail", msg: "Yorumlar bulunamadı." });
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("Comment by ID içindeki error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw boom.boomify(err);
  }
};

exports.singleCommentAdmin = async (req, res) => {
  try {
    let newsID = req.params.newsID;
    let authorID = req.params.authorID;
    let key = adminPermissions.allComments;
    let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);
    if (perm) {
      let response = await Admin.findAll(
        "comment",
        {
          newsID: newsID,
          authorID: authorID,
        },
        allCommentsResp,
        [["user", "authorID", "=", "user.ID"]]
      );
      console.log("response in getcomment: ", response);
      if (response)
        res.status(200).send({
          status: "success",
          msg: "Yorum başarıyla gösterildi",
          response,
        });
      else res.status(404).send({ status: "fail", msg: "Yorum bulunamadı." });
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("Comment by ID içindeki error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw boom.boomify(err);
  }
};

exports.addCommentAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "addComment");
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = commentValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen yorumu uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.addComment;
      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let response = await Admin.insert("comment", createdObject);
        console.log("response in addComment: ", response);
        res.status(201).send({
          status: "success",
          msg: "Yorum başarılı bir şekilde eklendi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

// DELETING COMMENT
exports.deleteCommentAdmin = async (req, res) => {
  try {
    let commentID = req.params.id;
    let commentStatus = 0;
    let key = adminPermissions.deleteComment;
    let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);
    if (perm) {
      console.log("news id in deleteNews: ", commentID);

      let response = await Admin.updateOrDelete(
        "comment",
        { ID: commentID },
        { isActive: parseInt(commentStatus) }
      );

      console.log("delete comment içinde response: ", response);
      let adminLogObj = {
        adminID: req.admin.admin_id,
        commentID: req.params.id,
        logdetail: adminLog.deleteComment,
      };
      const adminLogResp = await Admin.insert("adminlog", adminLogObj);

      res.status(200).send({
        status: "success",
        msg: "Yorum başarılı bir şekilde silindi.",
      });
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("delete comment içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.updateCommentAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "updateComment");
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = commentValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen yorumu uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.updateComment;

      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let response = await Admin.updateOrDelete(
          "comment",
          { ID: createdObject.ID },
          createdObject
        );
        console.log("updated comment: ", response);

        res.status(202).send({
          status: "success",
          msg: "Mesaj başaralı bir şekilde güncellendi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("YANLISS : ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.confirmCommentAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "confirmCom");
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = confirmValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen yorumu uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.confirmComments;
      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let response = await Admin.updateOrDelete(
          "comment",
          { ID: createdObject.ID },
          { isAccepted: createdObject.adminChoice }
        );
        let adminLogObj = {
          adminID: req.admin.admin_id,
          commentID: req.params.id,
          logdetail: adminLog.confirmComment,
          newvalue: createdObject.adminChoice,
        };
        const adminLogResp = await Admin.insert("adminlog", adminLogObj);

        console.log("confirm comment içinde response: ", response);
        res.status(200).send({
          status: "success",
          msg: "İşlem başarılı bir şekilde gerçekleştirildi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("confirm comment içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

/* NEWS */
exports.allNewsAdmin = async (req, res) => {
  console.log("test", req.query);
  let key = adminPermissions.allNews;
  let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);
  if (perm) {
    let response = await Admin.findAll("news", true, allNewsResp, [
      ["user", "authorID", "=", "user.ID"],
      ["category", "news.categoryID", "=", "category.ID"],
      ["newstype", "typeID", "=", "newstype.ID"],
      ["content", "news.ID", "=", "content.newsID"],
    ]);
    res.status(200).send({
      status: "success",
      msg: "Tüm haberler başarılı bir şekilde listelendi.",
      response,
    });
  } else {
    res.status(403).send({
      status: "fail",
      msg: "Bu yetkiye sahip değilsiniz",
    });
  }
};

exports.singleNewsAdmin = async (req, res) => {
  try {
    let newsID = req.params.id;

    let response = {};
    let key = adminPermissions.singleNews;
    let perm = await permissionCheck("admin", { ID: req.admin.admin_id }, key);
    if (perm) {
      let newsResp = await Admin.findOne(
        "news",
        { "news.ID": newsID },
        singleNewsResp,
        [
          ["user", "authorID", "=", "user.ID"],
          ["category", "news.categoryID", "=", "category.ID"],
          ["newstype", "typeID", "=", "newstype.ID"],
          ["content", "news.ID", "=", "content.newsID"],
        ]
      );
      let commentResp = await Admin.findAll(
        "comment",
        {
          "comment.newsID": newsID,
        },
        allCommentsResp,
        [["user", "authorID", "=", "user.ID"]]
      );

      response.news = newsResp;
      response.comment = commentResp;

      if (response) {
        res.status(200).send({
          status: "success",
          msg: `${newsID} numaralı haber gösterildi.`,
          response,
        });
      } else {
        res
          .status(404)
          .send({ status: "fail", msg: "Bu ID'ye ait haber bulunamadı." });
      }
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("single news içindeki error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw boom.boomify(err);
  }
};

exports.addNewsAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body[0], req.params, "addNews");
    let createdObject2 = Admin.objectFunc(
      req.body[1],
      req.params,
      "addContentUser"
    );
    // console.log('CREATEDOBJECT ADMİN', createdObject);
    // console.log('CREATEDOBJECT ADMİN2', createdObject2);
    const { error, result } = newsValidation(req.body[0]);
    const { error2, result2 } = contentValidation(req.body[1]);
    if (error && error2) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen haberi uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.addNews;
      let perm = await newsValidation({ ID: req.admin.admin_id }, key);
      if (perm) {
        let response = await Admin.insert("news", createdObject);
        createdObject2.newsID = response[0];
        let response2 = await Admin.insert("content", createdObject2);
        let news = { ...req.body[0], ...req.body[1], newsID: response[0] };
        console.log("\n\n My News : ", news, "\n\n");
        let adminLogObj = {
          adminID: req.admin.admin_id,
          newsID: response[0],
          logdetail: adminLog.addNews,
          newvalue: JSON.stringify(news),
        };
        const adminLogResp = await Admin.insert("adminlog", adminLogObj);
        res.status(201).send({
          status: "success",
          msg: "Haber başarılı bir şekilde kaydedildi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    res.status(403).send({ status: "error", msg: err });
    throw boomify(err);
  }
};

exports.updateNewsAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body[0], req.params, "updateNews");
    let createdObject2 = Admin.objectFunc(
      req.body[1],
      req.params,
      "updateContentUser"
    );
    console.log("TEST TEST TEST", createdObject);
    let newsID = req.params.id;

    const { error, result } = newsValidation(req.body[0]);
    const { error2, result2 } = contentValidation(req.body[1]);
    if (error && error2) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen haberi uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.updateNews;
      let perm = await newsValidation({ ID: req.admin.admin_id }, key);
      if (perm) {
        let oldNews = await Admin.findOne("news", { ID: req.params.id });
        let oldContent = await Admin.findOne("content", {
          newsID: req.params.id,
        });
        let oldObj = {
          ...oldNews,
          ...oldContent,
          newsID: req.params.id,
        };
        let response = await Admin.updateOrDelete(
          "news",
          { ID: createdObject.ID },
          createdObject
        );
        let response2 = await Admin.updateOrDelete(
          "content",
          { newsID: createdObject.ID },
          createdObject2
        );
        let newNews = await Admin.findOne("news", { ID: req.params.id });
        let newContent = await Admin.findOne("content", {
          newsID: req.params.id,
        });
        let newObj = {
          ...newNews,
          ...newContent,
          newsID: req.params.id,
        };
        let adminLogObj = {
          adminID: req.admin.admin_id,
          newsID: req.params.id,
          logdetail: adminLog.updateNews,
          oldvalue: JSON.stringify(oldNews),
          newvalue: JSON.stringify(newNews),
        };
        const adminLogResp = await Admin.insert("adminlog", adminLogObj);
        console.log("updated news: ", response);

        res.status(202).send({
          status: "success",
          msg: "Haber başarılı bir şekilde güncellendi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("YANLISS : ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.deleteNewsAdmin = async (req, res) => {
  try {
    let newsID = req.params.id;
    let newsStatus = 0;
    console.log("news id in deleteNews: ", newsID);
    let key = adminPermissions.deleteNews;
    let perm = await newsValidation({ ID: req.admin.admin_id }, key);
    if (perm) {
      let response = await Admin.updateOrDelete(
        "news",
        { ID: newsID },
        { isActive: parseInt(newsStatus) }
      );

      console.log("delete news içinde response: ", response);
      let adminLogObj = {
        adminID: req.admin.admin_id,
        newsID: response,
        logdetail: adminLog.deleteNews,
      };
      const adminLogResp = await Admin.insert("adminlog", adminLogObj);
      res.status(200).send({
        status: "success",
        msg: "Haber başarılı bir şekilde silindi.",
      });
    } else {
      res.status(403).send({
        status: "fail",
        msg: "Bu yetkiye sahip değilsiniz",
      });
    }
  } catch (err) {
    console.log("delete news içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.confirmNewsAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "confirmNews");
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = confirmValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen yorumu uygun şekilde giriniz.",
      });
    } else {
      let key = adminPermissions.confirmComments;

      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let response = await Admin.updateOrDelete(
          "news",
          { ID: createdObject.ID },
          { isAccepted: createdObject.adminChoice }
        );
        let adminLogObj = {
          adminID: req.admin.admin_id,
          newsID: req.params.id,
          logdetail: adminLog.confirmNews,
          newvalue: createdObject.adminChoice,
        };
        const adminLogResp = await Admin.insert("adminlog", adminLogObj);

        console.log("confirm news içinde response: ", response);
        res.status(200).send({
          status: "success",
          msg: "İşlem başarıyla gerçekleştirildi.",
        });
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("confirm news içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.addAdmin = async (req, res) => {
  try {
    let createdObject = Admin.objectFunc(req.body, req.params, "addAdmin");
    const username = await Admin.createUsername(req.body);
    createdObject.username = username;
    console.log("TEST TEST TEST", createdObject);

    const { error, result } = addAdminValidation(req.body);
    if (error) {
      res.status(400).send({
        status: "fail",
        msg: "Lütfen Admin için gerekli tüm bilgileri giriniz.",
      });
    } else {
      let key = adminPermissions.addAdmin;
      let perm = await permissionCheck(
        "admin",
        { ID: req.admin.admin_id },
        key
      );
      if (perm) {
        let isUserExists = await Admin.findOne("admin", function () {
          this.where({ email: createdObject.email }).orWhere({
            username: createdObject.username,
          });
        });
        if (isUserExists) {
          res.status(400).send({
            status: "fail",
            msg: "Bu Admin adı veya email'e kayıtlı hesap bulunmaktadır.",
          });
        } else {
          let response = await Admin.insert("admin", createdObject);
          console.log("response in addUser: ", response);
          res.status(201).send({
            status: "success",
            msg: "Admin başarıyla oluşturuldu.",
          });
        }
      } else {
        res.status(403).send({
          status: "fail",
          msg: "Bu yetkiye sahip değilsiniz",
        });
      }
    }
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    res.status(403).send({ status: "error", msg: err });
    throw boomify(err);
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error, result } = loginValidation(req.body);
    if (error) {
      res.status(400).send({ status: "fail", msg: error.details[0] });
    } else {
      let isUserExists = await Admin.findOne("admin", { email: email });
      console.log(password);
      console.log(isUserExists);

      if (isUserExists && isUserExists.isActive == 1) {
        console.log("Bu maile kayıtlı hesap bulunmakta");
        if (email == isUserExists.email && password == isUserExists.password) {
          const token = jwt.sign(
            { admin_id: isUserExists.ID, email },
            process.env.ADMIN_TOKEN_KEY,
            {
              expiresIn: "48h",
            }
          );
          isUserExists.token = token;

          // user
          res
            .status(200)
            .send({ status: "success", msg: "Giriş işlemi başarılı", token });
        } else {
          res
            .status(400)
            .send({ status: "fail", msg: "Kullanıcı adı veya şifre yanlış." });
        }
      } else {
        res
          .status(404)
          .send({ status: "fail", msg: "Email'e kayıtlı hesap bulunamadı." });
      }
    }
  } catch (err) {
    console.log("error in login", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};
exports.emailSubscription = async (req, res) => {
  isSent = [];
  let response = await Admin.findAll("mailSubscription");
  await response.forEach(
    (element) =>
      (isSent.push = this.sendEmails(
        element.firstName,
        element.email,
        element.subscription,
        element.lastSentAt
      ))
  );
  await console.log("is send burası", isSent);
  console.log(isSent);
};
exports.sendEmails = async (firstName, email, subscription, sentAt) => {
  // console.log(
  //   'FirstName: ',
  //   firstName,
  //   '\n Email: ',
  //   email,
  //   '\n Subscription: ',
  //   subscription,
  //   '\n last email sent ',
  //   sentAt
  // );
  let response = knex.raw(
    "SELECT userID, firstName, email, lastSentAt, TIMESTAMPDIFF(HOUR, lastSentAt, CURRENT_TIMESTAMP) FROM mailsubscription;"
  );
  console.log("**** response burası*****", response);
  // flag = false;
  // switch (subscription) {
  //   case '1':
  //     reaction = userActivity.viewNews;
  //     break;
  //   case '2':
  //     reaction = userActivity.likeNews;
  //     break;
  //   case '3':
  //     reaction = userActivity.dislikeNews;
  //     break;
  //   default:
  //     reaction = null;
  // }

  const url = process.env.WEB_SITE_URL + "guest/news";
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "armahaber06@gmail.com",
      pass: "Arma2021",
    },
  });
  await transporter.sendMail(
    {
      from: "ARMANEWS <info@armanews.com>",
      to: email,
      subject: "Gündemdeki Haberler",
      html:
        "<b>Hey " +
        firstName +
        '! </b><br> <p>Son dakika gelişmelerini anında takip etmek için <a href="' +
        url +
        '">buraya tıkla</a><br/><p>',
    },
    (error, info) => {
      if (error) {
        console.log("bir hata oluştu " + error);
      }
      console.log("tipi bunun", info);
      isSent = (info.accepted, info.response);
      transporter.close();
    }
  );
  console.log("Şuan en son kısımdayız", isSent);
  return isSent;
};
let response = knex.raw(
  "SELECT userID, firstName, email, lastSentAt, TIMESTAMPDIFF(HOUR, lastSentAt, CURRENT_TIMESTAMP) AS difference FROM mailsubscription;"
);
a = knex
  .select("email", "difference", response)
  .from("employee as e")
  .whereRaw("dept_no = e.dept_no");
console.log("**** response burası*****", a.client);

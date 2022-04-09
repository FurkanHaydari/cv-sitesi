// const knex = require('../lib/knex');
const model = require("../models");
const knex = require("../lib/knex");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// local

exports.getAllJobs = async (req, res) => {
  try {
    let response = await model.findAllJobs("jobs");
    res
      .status(200)
      .send({ status: "success", msg: "Tüm haberler gösterildi.", response });
  } catch (err) {
    console.log(err);
  }
};

exports.getOneJob = async (req, res) => {
  try {
    jobID = req.params.id;
    let response = await model.findOne("jobs", { job_ID: jobID });
    res.status(200).send({
      status: "success",
      msg: `${jobID} numaralı ID'ye sahip job gösterildi.`,
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(404).send({ status: "fail", msg: "Job bulunamadı." });
  }
};

exports.registerGuest = async (req, res) => {
  try {
    let createdObject = {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      current_job: req.body.current_job,
      photo: req.body.photo,
    };
    // create token
    // json web tokeni için giriş yapma kısmındaki token'a gerek yok
    const isUserExists = await model.findOne("user", {
      email: createdObject.email,
    }); // user verisini komple dönüyor

    if (isUserExists) {
      return res.status(409).send({
        status: "fail",
        msg: "Bu kullanıcı adı veya emaile kayıtlı hesap bulunmaktadır.",
      });
    }
    // save user to db
    const registered = await model.insert("user", createdObject);
  } catch (err) {
    console.log("error in inserting", "*** register error***", err, "\n\n");
    res.status(403).send({ status: "error", msg: err });
    throw boom.boomify(err);
  }
};

exports.sendFeedback = async (req, res) => {
  try {
    feedback = {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      detail: req.body.detail,
    };
    await knex("messages")
      .insert(feedback)
      .then(() => console.log("data inserted"));
    res.send("Başvurunuz alındı.");
  } catch (err) {
    console.log(err);
  }
};
exports.loginGuest = async (req, res) => {
  try {
    let createdObject = {
      email: req.body.email,
      password: req.body.password,
    };
    if (!(createdObject.email && createdObject.password)) {
      res
        .status(400)
        .send({ status: "fail", msg: "Lütfen email ve şifrenizi giriniz." });
    }
    let isUserExists = await model.findOne("user", {
      email: createdObject.email,
    });

    if (isUserExists) {
      console.log("Bu maile kayıtlı hesap bulunmakta");

      if (
        createdObject.email == isUserExists.findoneResponse.email &&
        createdObject.password == isUserExists.findoneResponse.password
      ) {
        const token = jwt.sign(
          { user_id: isUserExists.ID, email: createdObject.email },
          process.env.USER_TOKEN_KEY,
          {
            expiresIn: "48h",
          }
        );

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
  } catch (err) {
    console.log("error in login", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.guestFeedback = async (req, res) => {
  try {
    let createdObject = Guest.objectFunc(req.body, req.params, "guestFeedback");
    console.log("TEST TEST TEST", createdObject);
    const { error, result } = feedbackValidation(req.body);

    if (error) {
      console.log("validation error: ", error);
      res.status(400).send({ status: "fail", msg: error.details[0] });
    } else {
      let response = await Guest.insert("messages", createdObject);
      console.log("response in userFeedback: ", response);
      res
        .status(201)
        .send({ status: "success", msg: "Feedback başarıyla gönderildi." });
    }
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

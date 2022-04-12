const model = require("../models");
const knex = require("../lib/knex");

exports.getOneUser = async (req, res) => {
  try {
    userID = req.params.id;
    let response = await model.findOne("user", { ID: userID });
    let result = {
      name: response.findoneResponse.name,
      lastName: response.findoneResponse.lastName,
      email: response.findoneResponse.email,
      address: response.findoneResponse.address,
      current_job: response.findoneResponse.current_job,
      photo: response.findoneResponse.photo,
    };
    res.send({ result });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let profile = {
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      current_job: req.body.current_job,
      cv: req.body.cv,
      photo: req.body.photo,
    };
    userID = req.params.id;
    let response = await model.updateOrDelete("user", { ID: userID }, profile);

    res.send("Profil güncellendi.");
  } catch (err) {
    console.log(err);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    oldPassword = req.body.oldPassword;
    newPassword1 = req.body.newPassword1;
    newPassword2 = req.body.newPassword2;

    userID = req.params.id;
    let response = await model.findOne("user", { ID: userID });
    if (oldPassword == response.findoneResponse.password) {
      if (newPassword1 == newPassword2) {
        let response2 = await model.updateOrDelete(
          "user",
          { ID: userID },
          { password: newPassword1 }
        );
        res.send("Parola başarıyla güncellendi");
      } else {
        res.send("Parolalar uyuşmuyor");
      }
    } else {
      res.send("Parola hatalı");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.applyJob = async (req, res) => {
  try {
    let apply = {
      userID: req.params.userID,
      jobID: req.params.jobID,
      status: 1,
    };

    await knex("archive")
      .insert(apply)
      .then(() => console.log("data inserted"));
    res.send("Başvurunuz alındı.");
  } catch (err) {
    console.log(err);
  }
};

exports.myApplications = async (req, res) => {
  try {
    userID = req.params.userID;
    let response = await model.findAllApplications("archive", {
      userID: userID,
    });
    res.send(response);
  } catch (err) {
    console.log(err);
  }
};

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
    res.send({ response });
  } catch (err) {
    console.log(err);
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

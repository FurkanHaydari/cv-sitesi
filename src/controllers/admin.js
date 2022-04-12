const boom = require("boom");
const jwt = require("jsonwebtoken");
const Admin = require("../models");
const nodemailer = require("nodemailer");
const knex = require("../lib/knex");
const model = require("../models");
const { boomify } = require("boom");

exports.allJobsAdmin = async (req, res) => {
  let response = await Admin.findAll("jobs");
  res.status(200).send({
    status: "success",
    msg: "Tüm İşler Gösterildi.",
    response,
  });
};

exports.allFeedbacks = async (req, res) => {
  let response = await Admin.findAll("messages");
  res.status(200).send({
    status: "success",
    msg: "Tüm İşler Gösterildi.",
    response,
  });
};

exports.singleFeedback = async (req, res) => {
  try {
    messageID = req.params.id;
    let response = await model.findOne("messages", { id: messageID });
    res.send({ response });
  } catch (err) {
    console.log(err);
  }
};

exports.allApplications = async (req, res) => {
  let response = await Admin.findAll("archive");
  res.status(200).send({
    status: "success",
    msg: "Tüm Başvurular Gösterildi.",
    response,
  });
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

exports.singleApplication = async (req, res) => {
  try {
    jobID = req.params.jobID;
    userID = req.params.userID;
    let response = await model.findOne("archive", {
      jobID: jobID,
      userID: userID,
    });
    res.send({ response });
  } catch (err) {
    console.log(err);
  }
};

exports.allOpenJobsAdmin = async (req, res) => {
  let response = await Admin.findAllJobs("jobs");
  res.status(200).send({
    status: "success",
    msg: "Tüm güncel işler Gösterildi.",
    response,
  });
};

exports.allUsersAdmin = async (req, res) => {
  let response = await Admin.findAll("user");
  res.status(200).send({
    status: "success",
    msg: "Tüm Kullanıcılar Gösterildi.",
    response,
  });
};

exports.singleUserAdmin = async (req, res) => {
  let userID = req.params.userID;
  let response = await Admin.findOne("user", { ID: userID });
  res.status(200).send({
    status: "success",
    msg: "Tüm Kullanıcılar Gösterildi.",
    response,
  });
};

exports.createJobs = async (req, res) => {
  try {
    let job = {
      jobName: req.body.jobName,
      jobDescription: req.body.jobDescription,
    };
    console.log("created job", job);
    await knex("jobs")
      .insert(job)
      .then(() => console.log("data inserted"));
    res.send("Job kaydedildi.");
  } catch (err) {
    console.log("işlem tamamlanamadı", err);
    throw err;
  }
};

exports.updateJobs = async (req, res) => {
  try {
    jobID = req.params.id;
    let job = {
      jobName: req.body.jobName,
      jobDescription: req.body.jobDescription,
    };
    let response = await model.updateOrDelete("jobs", { job_ID: jobID }, job);

    res.status(200).send({
      status: "success",
      msg: "Job başarılı bir şekilde güncellendi.",
    });
  } catch (err) {
    console.log("update jobs içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.deleteJob = async (req, res) => {
  try {
    jobID = req.params.id;

    let response = await model.updateOrDelete(
      "jobs",
      { job_ID: jobID },
      { isActive: 0 }
    );
    console.log("delete jobs içinde response: ", response);
    res.status(200).send({
      status: "success",
      msg: "Job başarılı bir şekilde silindi.",
    });
  } catch (err) {
    console.log("delete news içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};
exports.acceptApplication = async (req, res) => {
  try {
    jobID = req.params.jobID;
    userID = req.params.userID;

    let response = await model.updateOrDelete(
      "archive",
      { jobID: jobID, userID: userID },
      { status: 1 }
    );

    console.log("acceptApplication jobs içinde response: ", response);
    res.status(200).send({
      status: "success",
      msg: "Başvuru başarılı bir şekilde kabul edildi.",
    });
  } catch (err) {
    console.log("acceptApplication içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    jobID = req.params.jobID;
    userID = req.params.userID;

    let response = await model.updateOrDelete(
      "archive",
      { jobID: jobID, userID: userID },
      { status: -1 }
    );

    console.log("rejectApplication jobs içinde response: ", response);
    res.status(200).send({
      status: "success",
      msg: "Başvuru başarılı bir şekilde reddedildi.",
    });
  } catch (err) {
    console.log("acceptApplication içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
    throw err;
  }
};

exports.applicantsAdmin = async (req, res) => {
  jobID = req.params.jobID;
  let response = await model.findAllApplications("archive", {
    jobID: jobID,
  });
  res.status(200).send({
    status: "success",
    msg: "Tüm başvuranlar Gösterildi.",
    response,
  });
};
exports.kisininBaşvurduğTumJobsAdmin = async (req, res) => {
  userID = req.params.userID;
  let response = await model.findAllApplications("archive", {
    userID: userID,
  });
  res.status(200).send({
    status: "success",
    msg: "Tüm başvurulan işler Gösterildi.",
    response,
  });
};

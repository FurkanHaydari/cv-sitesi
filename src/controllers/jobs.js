const model = require("../models");
const knex = require("../lib/knex");

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

exports.deleteJobs = async (req, res) => {
  try {
    jobID = req.params.id;

    let response = await model.updateOrDelete(
      "jobs",
      { job_ID: jobID },
      { isActive: 0 }
    );
    if (response) {
      console.log("delete jobs içinde response: ", response);
      res.status(200).send({
        status: "success",
        msg: "Job başarılı bir şekilde silindi.",
      });
    } else {
      res.status(404).send({ status: "fail", msg: "Job bulunamadı." });
    }
  } catch (err) {
    console.log("delete news içinde error: ", err);
    res.status(403).send({ status: "error", msg: err });
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

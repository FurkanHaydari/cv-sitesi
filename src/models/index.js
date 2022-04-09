const { boomify } = require("boom");
const knex = require("../lib/knex");
const jwt = require("jsonwebtoken");
// kullanıcılar için
exports.findAll = async (table, select = "*") => {
  let response = await knex.from(table).select(select);
  // veri döner
  return { findallResponse: response };
};
exports.findAllJobs = async (table, select = "*") => {
  let response = await knex.from(table).select(select).where("isActive", 1);
  // veri döner
  return { findallResponse: response };
};

exports.findAllApplications = async (table, query, select = "*") => {
  let response = await knex.from(table).select(select).where(query);
  // veri döner
  return { findallResponse: response };
};
// bir tane kullanıcı bul
exports.findOne = async (table, query, select = "*") => {
  // key ve value hangi parametreler kullanılarak kullanıcıların çekileceğini gösterir
  // first ilk bulduğu elemanı verir
  let response = await knex.from(table).select(select).where(query).first();
  // console.log('response: findone: ', response);
  // console.log('findone response: ', typeof response, response);

  if (typeof response !== "undefined" && Object.keys(response).length > 0) {
    return { findoneResponse: response };
  } else {
    return false;
  }
};

// kullanıcıyı veritabanına kaydet
exports.insert = async (table, data) => {
  try {
    let response = await knex(table).insert(data);
    console.log("inserrdata response: ", response);
    return { insertResponse: response };
  } catch (err) {
    console.log("error in inserting: ", err);
    throw boomify(err);
  }
};

// veriyi güncelle
exports.updateOrDelete = async (table, query, data, select = "*") => {
  try {
    let response = await knex(table).select(select).where(query).update(data);
    console.log("response in updateOrDelete: ", response);
  } catch (err) {
    console.log("error in update: ", err);
    throw boomify(err);
  }
};

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
  SELECT *
  FROM users
  WHERE email = $1;
  `;
  const values = [email];
  return pool
    .query(queryString, values)
    .then((response) => {
      if (response.rows[0]) return response.rows[0];
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT *
  FROM users
  WHERE id = $1;
  `;
  const values = [id];
  return pool
    .query(queryString, values)
    .then((response) => {
      if (response.rows[0]) return response.rows[0];
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
  INSERT INTO users(name, email, password)
  VALUES($1, $2, $3)
  RETURNING *;
  `;
  const values = [user.name, user.email, user.password];
  return pool
    .query(queryString, values)
    .then((response) => {
      if (response.rows[0]) return response.rows[0];
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const todayDate = new Date().toISOString().slice(0, 10);
  const queryString = `
  SELECT * FROM reservations
  JOIN properties ON property_id = properties.id
  WHERE guest_id = $1
  AND start_date <> $2
  AND end_date <> $2
  LIMIT $3;
  `;
  const values = [guest_id, todayDate, limit];
  return pool
    .query(queryString, values)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  let existingWhere = 0;
  const pushQueryString = function (parameter, sign) {
    if (existingWhere > 0) {
      queryString += `AND ${parameter} ${sign} $${queryParams.length} `;
      existingWhere += 1;
    } else {
      queryString += `Where ${parameter} ${sign} $${queryParams.length} `;
      existingWhere += 1;
    }
  };

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    pushQueryString("city", "LIKE");
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    pushQueryString("owner_id", "=");
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    pushQueryString("cost_per_night", "<=");
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    pushQueryString("cost_per_night", ">=");
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    pushQueryString("property_reviews.rating", ">=");
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  let queryString = `INSERT INTO properties(`;
  let queryParams = [];
  let valueString = `VALUES(`;
  let valueCount = 1;
  for (let key in property) {
    queryString += key;
    queryString += ", ";
    queryParams.push(property[key]);
    valueString += "$";
    valueString += valueCount;
    valueString += ", ";
    valueCount += 1;
  }
  queryString = queryString.slice(0, queryString.length - 2);
  queryString += ") ";
  queryString += valueString;
  queryString = queryString.slice(0, queryString.length - 2);
  queryString += ") RETURNING *;";
  return pool
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;

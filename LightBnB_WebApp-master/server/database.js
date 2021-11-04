const db = require("../db");

// const properties = require("./json/properties.json");
// const users = require("./json/users.json");
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
  return db
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
  return db
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
  return db
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
const getFulfilledReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT * FROM reservations
  JOIN properties ON property_id = properties.id
  WHERE guest_id = $1
  LIMIT $2;
  `;
  const values = [guest_id, limit];
  return db
    .query(queryString, values)
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getFulfilledReservations = getFulfilledReservations;

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

  return db
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
  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;

const addReservation = function (reservation) {
  /*
   * Adds a reservation from a specific user to the database
   */
  return db
    .query(
      `
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `,
      [
        reservation.start_date,
        reservation.end_date,
        reservation.property_id,
        reservation.guest_id,
      ]
    )
    .then((res) => res.rows[0]);
};

exports.addReservation = addReservation;

//
//  Gets upcoming reservations
//
const getUpcomingReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params).then((res) => res.rows);
};

exports.getUpcomingReservations = getUpcomingReservations;

//
//  Updates an existing reservation with new information
//
const updateReservation = function (reservationId, newReservationData) {};

//
//  Deletes an existing reservation
//
const deleteReservation = function (reservationId) {};

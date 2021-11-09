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
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
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
  SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
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

  if (options.minimum_bedroom) {
    queryParams.push(options.minimum_bedroom);
    pushQueryString("number_of_bedrooms", ">=");
  }

  if (options.maximum_bedroom) {
    queryParams.push(options.maximum_bedroom);
    pushQueryString("number_of_bedrooms", "<=");
  }

  if (options.minimum_bathroom) {
    queryParams.push(options.minimum_bathroom);
    pushQueryString("number_of_bathrooms", ">=");
  }

  if (options.maximum_bathroom) {
    queryParams.push(options.maximum_bathroom);
    pushQueryString("number_of_bathrooms", "<=");
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

const getMyProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*
  FROM properties
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

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    pushQueryString("owner_id", "=");
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY properties.id
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
exports.getMyProperties = getMyProperties;

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
    queryString += `${key}, `;
    queryParams.push(property[key]);
    valueString += `$${valueCount}, `;
    valueCount += 1;
  }
  queryString = queryString.slice(0, queryString.length - 2);
  valueString = valueString.slice(0, valueString.length - 2);
  queryString += `) ${valueString}) RETURNING *;`;
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

const addMyProperty = function (property) {
  let queryString = `UPDATE properties SET `;
  let queryParams = [];
  let valueCount = 1;
  for (let key in property) {
    if (key !== "property_id" && property[key] !== "") {
      queryString += `${key} = $${valueCount}, `;
      queryParams.push(property[key]);
      valueCount += 1;
    }
  }
  queryString = queryString.slice(0, queryString.length - 2);
  queryString += ` WHERE id = ${property.property_id};`;

  return db
    .query(queryString, queryParams)
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addMyProperty = addMyProperty;

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

const blockProperty = function (reservation) {
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

exports.blockProperty = blockProperty;

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
  return db.query(queryString, params).then((res) => res.rows);
};

exports.getUpcomingReservations = getUpcomingReservations;

const getIndividualReservation = function (reservationID) {
  const queryString = `SELECT * FROM reservations WHERE reservations.id = $1`;
  return db.query(queryString, [reservationID]).then((res) => res.rows[0]);
};

exports.getIndividualReservation = getIndividualReservation;

const getBlockedProperty = function (propertyID) {
  const queryString = `SELECT * FROM reservations WHERE reservations.property_id = $1 ORDER BY reservations.id`;
  return db.query(queryString, [propertyID]).then((res) => res.rows);
};

exports.getBlockedProperty = getBlockedProperty;

//
//  Updates an existing reservation with new information
//
const updateReservation = function (reservationData) {
  // base string
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];
  let paramsCount = 0;
  if (reservationData.start_date) {
    paramsCount += 1;
    queryParams.push(reservationData.start_date);
    queryString += `start_date = $${paramsCount}`;
  }
  if (reservationData.end_date) {
    paramsCount += 1;
    queryParams.push(reservationData.end_date);
    queryString += `, end_date = $${paramsCount}`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`;
  queryParams.push(reservationData.reservation_id);
  return db
    .query(queryString, queryParams)
    .then((res) => res.rows[0])
    .catch((err) => console.error(err));
};

exports.updateReservation = updateReservation;

//
//  Deletes an existing reservation
//
const deleteReservation = function (reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1;`;
  return db
    .query(queryString, queryParams)
    .then(() => console.log("Successfully deleted!"))
    .catch((err) => console.error(err));
};

exports.deleteReservation = deleteReservation;

const deleteMyProperties = function (propertyId) {
  const queryParams = [propertyId];
  const queryString = `DELETE FROM properties WHERE id = $1;`;
  return db
    .query(queryString, queryParams)
    .then(() => console.log("Successfully deleted!"))
    .catch((err) => console.error(err));
};

exports.deleteMyProperties = deleteMyProperties;

const getReviewsByProperty = function (propertyId) {
  const queryString = `
    SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text, 
    users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
    FROM property_reviews
    JOIN reservations ON reservations.id = property_reviews.reservation_id  
    JOIN properties ON properties.id = property_reviews.property_id
    JOIN users ON users.id = property_reviews.guest_id
    WHERE properties.id = $1
    ORDER BY reservations.start_date ASC;
  `;
  const queryParams = [propertyId];
  return db.query(queryString, queryParams).then((res) => res.rows);
};

exports.getReviewsByProperty = getReviewsByProperty;

const addReview = function (review) {
  const queryString = `
    INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [
    review.guest_id,
    review.property_id,
    review.id,
    parseInt(review.rating),
    review.message,
  ];
  return db.query(queryString, queryParams).then((res) => res.rows);
};

exports.addReview = addReview;

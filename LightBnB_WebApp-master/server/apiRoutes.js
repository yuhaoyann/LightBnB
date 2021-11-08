module.exports = function (router, database) {
  router.get("/properties", (req, res) => {
    database
      .getAllProperties(req.query, 20)
      .then((properties) => res.send({ properties }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get("/myProperties", (req, res) => {
    database
      .getMyProperties(req.query, 20)
      .then((properties) => res.send({ properties }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get("/reservations", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    database
      .getFulfilledReservations(userId)
      .then((reservations) => res.send({ reservations }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get("/reservations/upcoming", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    database
      .getUpcomingReservations(userId)
      .then((reservations) => res.send({ reservations }))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/properties", (req, res) => {
    const userId = req.session.userId;
    database
      .addProperty({ ...req.body, owner_id: userId })
      .then((property) => {
        res.send(property);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/myProperties", (req, res) => {
    const userId = req.session.userId;
    database
      .addMyProperty({ ...req.body, owner_id: userId })
      .then((property) => {
        res.send(property);
      })
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/reservations", (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      database
        .addReservation({ ...req.body, guest_id: userId })
        .then((reservation) => {
          res.send(reservation);
        })
        .catch((e) => {
          console.error(e);
          res.send(e);
        });
    }
  });

  router.post("/blockProperty", (req, res) => {
    const userId = req.session.userId;
    if (userId) {
      database
        .blockProperty({ ...req.body, guest_id: userId })
        .then((reservation) => {
          res.send(reservation);
        })
        .catch((e) => {
          console.error(e);
          res.send(e);
        });
    }
  });

  router.get(`/reservations/:reservation_id`, (req, res) => {
    const reservationId = req.params.reservation_id;
    database
      .getIndividualReservation(reservationId)
      .then((reservation) => res.send(reservation))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.get(`/blockProperty/:property_id`, (req, res) => {
    const propertyId = req.params.property_id;
    database
      .getBlockedProperty(propertyId)
      .then((reservation) => res.send(reservation))
      .catch((e) => {
        console.error(e);
        res.send(e);
      });
  });

  router.post("/reservations/:reservationId", (req, res) => {
    const reservationId = req.params.reservationId;
    database
      .updateReservation({ ...req.body, reservation_id: reservationId })
      .then((reservation) => {
        res.send(reservation);
      });
  });

  router.delete("/reservations/:reservationId", (req, res) => {
    const reservationId = req.params.reservationId;
    database.deleteReservation(reservationId);
  });

  router.delete("/myProperties/:propertyId", (req, res) => {
    const propertyId = req.params.propertyId;
    database.deleteMyProperties(propertyId);
  });

  router.get("/reviews/:propertyId", (req, res) => {
    const propertyId = req.params.propertyId;
    database.getReviewsByProperty(propertyId).then((reviews) => {
      res.send(reviews);
    });
  });

  router.post("/reviews/:reservationId", (req, res) => {
    const reservationId = req.params.reservationId;
    database.addReview({ ...req.body }).then((review) => {
      res.send(review);
    });
  });

  return router;
};

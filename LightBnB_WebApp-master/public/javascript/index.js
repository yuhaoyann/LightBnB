$(() => {
  getAllListings().then(function (json) {
    propertyListings.addProperties(json.properties);
    views_manager.show("listings");

    $(document).on("click", ".reserve-button", function () {
      const idData = $(this).attr("id").substring(17);
      views_manager.show("newReservation", idData);
    });

    $(document).on("click", ".update-button", function () {
      const idData = $(this).attr("id").substring(16);
      getIndividualReservation(idData).then((data) => {
        views_manager.show("updateReservation", data);
      });
    });

    $(document).on("click", ".delete-button", function () {
      const idData = $(this).attr("id").substring(16);
      const data = {};
      data.reservation_Id = idData;
      deleteReservation(data).then(() => {});
      views_manager.show("none");
      propertyListings.clearListings();
      getFulfilledReservations().then(function (json) {
        propertyListings.addProperties(json.reservations, {
          upcoming: false,
        });
        getUpcomingReservations().then((json) => {
          propertyListings.addProperties(json.reservations, {
            upcoming: true,
          });
        });
        views_manager.show("listings");
      });
    });

    $(document).on("click", ".review_details", function () {
      const idData = $(this).attr("id").substring(15);
      views_manager.show("showReviews", idData);
    });

    $(document).on("click", ".add-review-button", function () {
      const idData = $(this).attr("id").substring(11);
      views_manager.show("newReview", idData);
    });

    $(document).on("click", ".modify-property-button", function () {
      const idData = $(this).attr("id").substring(16);
      views_manager.show("modifyProperty", idData);
    });
  });
});

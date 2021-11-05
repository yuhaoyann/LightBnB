$(() => {
  getAllListings().then(function (json) {
    propertyListings.addProperties(json.properties);
    views_manager.show("listings");

    $(document).on("click", ".reserve-button", function () {
      const idData = $(this).attr("id").substring(17);
      views_manager.show("newReservation", idData);
    });

    // if (isReservation) {
    $(document).on("click", ".update-button", function () {
      const idData = $(this).attr("id").substring(16);
      getIndividualReservation(idData).then((data) => {
        views_manager.show("updateReservation", data);
      });
    });

    $(document).on("click", ".delete-button", function () {
      const idData = $(this).attr("id").substring(16);
      console.log(`delete ${idData}`);
    });
    // }
  });
});

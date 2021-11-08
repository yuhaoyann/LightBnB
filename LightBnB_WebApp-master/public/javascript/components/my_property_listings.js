$(() => {
  const $myPropertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$myPropertyListings = $myPropertyListings;

  window.myPropertyListings = {};

  function addListing(listing) {
    $myPropertyListings.append(listing);
  }
  function clearListings() {
    $myPropertyListings.empty();
  }
  window.myPropertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false) {
    // if it's a reservation, we don't want to clear the listings a second time in the addProperties function call
    if (!isReservation) {
      clearListings();
    }
    // check for user login
    getMyDetails().then();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = myPropertyListing.createListing(property, isReservation);
      addListing(listing);
    }
  }
  window.myPropertyListings.addProperties = addProperties;
});

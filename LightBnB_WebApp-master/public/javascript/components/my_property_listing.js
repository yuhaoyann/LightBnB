$(() => {
  window.myPropertyListing = {};

  function createListing(property, isReservation) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          <button id="modify-property-${
            property.id
          }" class="modify-property-button">Modify</button>
          <button id="delete-property-${
            property.id
          }" class="delete-property-button">Delete</button>
          <footer class="property-listing__footer">
            <div class="property-listing__price">$${
              property.cost_per_night / 100.0
            }/night</div>
          </span>
          </footer>
        </section>
      </article>
    `;
  }

  window.myPropertyListing.createListing = createListing;
});

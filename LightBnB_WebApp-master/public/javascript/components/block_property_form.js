$(() => {
  const $blockPropertyForm = $(`
  <form action="/api/reservations" method="post" id="update-reservation-form" class="update-reservation-form">
  <h3 id="update-reservation-header">Start Date</h3>
  <div class="update-reservation-form__field_wrapper">
    <label for="update-reservation-form__start-date-day">Day</label>
    <select id="update-reservation-form__start-date-day" name="start-date-day">
      <option value="">Day</option>
      <option value="01">1</option>
      <option value="02">2</option>
      <option value="03">3</option>
      <option value="04">4</option>
      <option value="05">5</option>
      <option value="06">6</option>
      <option value="07">7</option>
      <option value="08">8</option>
      <option value="09">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
    </select>
  </div>

  <div class="update-reservation-form__field_wrapper">
    <label for="update-reservation-form__start-date-month">Month</label>
    <select id="update-reservation-form__start-date-month" name="start-date-month">
      <option value="">Month</option>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>

  <div class="update-reservation-form__field_wrapper">
    <select id="update-reservation-form__start-date-year" name="start-date-year">
      <option value="">Year</option>
      <option value="2021">2021</option>
      <option value="2022">2022</option>
      <option value="2023">2023</option>
      <option value="2024">2024</option>
      <option value="2025">2025</option>
      <option value="2026">2026</option>
      <option value="2027">2027</option>
      <option value="2028">2028</option>
      <option value="2029">2029</option>
      <option value="2030">2030</option>
    </select>
  </div>

  <h3>End Date</h3>
  <div class="update-reservation-form__field_wrapper">
    <label for="update-reservation-form__end-date-day">Day</label>
    <select id="update-reservation-form__end-date-day" name="end-date-day">
      <option value="">Day</option>
      <option value="01">1</option>
      <option value="02">2</option>
      <option value="03">3</option>
      <option value="04">4</option>
      <option value="05">5</option>
      <option value="06">6</option>
      <option value="07">7</option>
      <option value="08">8</option>
      <option value="09">9</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
    </select>
  </div>
  <div class="update-reservation-form__field_wrapper">
    <label for="update-reservation-form__end-date-month">Month</label>
    <select id="update-reservation-form__end-date-month" name="end-date-month">
      <option value="">Month</option>
      <option value="01">January</option>
      <option value="02">February</option>
      <option value="03">March</option>
      <option value="04">April</option>
      <option value="05">May</option>
      <option value="06">June</option>
      <option value="07">July</option>
      <option value="08">August</option>
      <option value="09">September</option>
      <option value="10">October</option>
      <option value="11">November</option>
      <option value="12">December</option>
    </select>
  </div>

  <div class="update-reservation-form__field_wrapper">
    <select id="update-reservation-form__end-date-year" name="end-date-year">
      <option value="">Year</option>
      <option value="2021">2021</option>
      <option value="2022">2022</option>
      <option value="2023">2023</option>
      <option value="2024">2024</option>
      <option value="2025">2025</option>
      <option value="2026">2026</option>
      <option value="2027">2027</option>
      <option value="2028">2028</option>
      <option value="2029">2029</option>
      <option value="2030">2030</option>
    </select>
  </div>

  <div class="update-reservation-form__field-wrapper">
    <button>Block period</button>
    <a id="reservation-form__cancel" href="#">Back</a>
  </div>
  <div id="datatag" class="hidden"></div>
</form>
  `);
  window.$blockPropertyForm = $blockPropertyForm;

  $blockPropertyForm.on("submit", function (event) {
    let errorMessage = "";
    let startDate;
    let endDate;

    event.preventDefault();
    views_manager.show("none");
    const formArray = $(this).serializeArray();
    // check for presence of variables, if they're there, assign them
    if (formArray[0].value && formArray[1].value && formArray[2].value) {
      startDate = `${formArray[2].value}-${formArray[1].value}-${formArray[0].value}`;
    }

    if (formArray[3].value && formArray[4].value && formArray[5].value) {
      endDate = `${formArray[5].value}-${formArray[4].value}-${formArray[3].value}`;
    }

    if (!startDate || !endDate) {
      errorMessage = `Please provide a complete start and end date.`;
    }

    if (new Date(endDate) <= Date.now()) {
      errorMessage = `End date cannot be on or before today's date.`;
    }

    if (new Date(startDate) < Date.now()) {
      errorMessage = `Start date cannot be before today's date.`;
    }

    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        errorMessage = "New start date cannot be on or after the new end date.";
      }
    }

    if ((startDate || endDate) && !errorMessage) {
      const propertyId = $(this).find("#datatag h4").text();
      const dataObj = {
        start_date: startDate,
        end_date: endDate,
        property_id: propertyId,
      };
      blockProperty(dataObj)
        .then(() => {
          propertyListings.clearListings();
          getBlockedProperty(propertyId).then((data) => {
            let data1 = data;
            data1.push(propertyId);
            views_manager.show("blockProperty", data1);
          });
        })
        .catch((error) => {
          console.error(error);
          views_manager.show("listings");
        });
    } else {
      console.log(errorMessage);
      // we can redisplay the form by pulling the information in the datatag!
      const propertyId = $(this).find("#datatag h4").text();
      propertyListings.clearListings();
      getBlockedProperty(propertyId).then((data) => {
        let data1 = data;
        data1.push(propertyId);
        views_manager.show("blockProperty", data1);
      });
    }
  });

  $("body").on("click", "#reservation-form__cancel", function () {
    getMyDetails().then(function (json) {
      propertyListings.clearListings();
      getMyListings(`owner_id=${json.user.id}`).then(function (json) {
        myPropertyListings.addProperties(json.properties);
        views_manager.show("myListings");
      });
    });
    return false;
  });
});

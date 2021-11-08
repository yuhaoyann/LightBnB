# LightBnB Project

LightBnB is a fullstack project which allows users to manage properties, make reservations, as well as adding reviews for their past bookings. 

A combination of HTML, CSS, JS, jQuery, AJAX and SQL skills plus usage of Node, Express and PSQL platforms are used to complete the project.

## Getting Started

1. Go to [LightBnB Page](https://github.com/yuhaoyann/LightBnB), fork and clone the repo to local.
2. Cd into the repository and install all dependencies (using the `npm install` command).
3. Go to PSQL, create an database named  lightbnb and use follow as login info:   
* `user:` "vagrant",
* `password:` "123",
* `host:` "localhost",
* `database:` "lightbnb"
4. Run schema and seeds in PSQL by using following code:<br />
`\i migrations/01_schema.sql`<br />
`\i seeds/01_seeds.sql`<br />
`\i seeds/02_seeds.sql`
5. Set up server by `npm run local` command in terminal.
6. In web browser (Chrome preferred) open [this page](http://localhost:3000/)

* known bugs: when deleting properties or avilabilities, if the page does not refresh after clicking delete button, need to manual refresh page

## Final Product
main page
!["main page"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/1.main_page.png)
!["search property"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/2.search_property_page.png)
!["create property"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/3.create_property_page.png)
!["my reservation"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/4.my_reservation_page.png)
!["my property"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/5.my_property_page.png)
!["manage property availability"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/6.manage_property_availability_page.png)
!["property review page"](https://github.com/yuhaoyann/LightBnB/blob/master/docs/7.review_page.png)

## Dependencies

- "bcrypt": "^3.0.6",
- "cookie-session": "^1.3.3",
- "express": "^4.17.1",
- "nodemon": "^1.19.1",
- "pg": "^8.7.1"
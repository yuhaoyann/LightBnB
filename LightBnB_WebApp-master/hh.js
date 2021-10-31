const { getUserWithEmail } = require("./server/database.js");
getUserWithEmail("yuhaoyann@gmail.com").then((data) => console.log(data));
// console.log(result);

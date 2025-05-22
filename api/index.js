const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Import endpoint loans
require("./routes/loans-API")(app);

// Import endpoint users
require("./routes/users-API")(app);

app.listen(port, () => {
  console.log(`Server Express jalan di http://localhost:${port}`);
});

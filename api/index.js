const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
const loansRoutes = require("./routes/loans");
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");

app.use(cors());
app.use(express.json());
// panggil cron
require("./cronJobs");

app.use("/peminjaman", loansRoutes);
app.use("/users", usersRoutes);
app.use("/login", loginRoutes);

app.listen(port, () => {
  console.log(`Server Express jalan di http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
const loansRoutes = require("./routes/loans");
const usersRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());

app.use("/peminjaman", loansRoutes);
app.use("/users", usersRoutes);

app.listen(port, () => {
  console.log(`Server Express jalan di http://localhost:${port}`);
});

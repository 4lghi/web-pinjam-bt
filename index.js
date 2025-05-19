const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Import endpoint loans
require('./loans-API')(app);

app.listen(port, () => {
  console.log(`Server Express jalan di http://localhost:${port}`);
});

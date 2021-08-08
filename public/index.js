const app = require("../App/App");


const port = process.env.PORT || 1000;

app.listen(port, () => {
  console.log(`REST at http://localhost:${port}`);
});

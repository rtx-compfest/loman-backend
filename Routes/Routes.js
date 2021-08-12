const {
  DonationCategoryController,
  DonationProgramController,
  UsersController,
} = require("../Controller")

function Route(app) {
  app.use("/donation_program", DonationProgramController)
  app.use("/donation_category", DonationCategoryController)
  app.use("/user", UsersController)
}

module.exports = Route

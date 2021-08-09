const {
  DonationCategoryController,
  DonationProgramController,
} = require("../Controller")

function Route(app) {
  app.use("/donation_program", DonationProgramController)
  app.use("/donation_category", DonationCategoryController)
}

module.exports = Route

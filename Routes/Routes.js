const {
  DonationCategoryController,
  DonationProgramController,
  UsersController,
  HistoryTransactionController,
} = require("../Controller")

function Route(app) {
  app.use("/donation_program", DonationProgramController)
  app.use("/donation_category", DonationCategoryController)
  app.use("/user", UsersController)
  app.use("/wallet", HistoryTransactionController)
}

module.exports = Route

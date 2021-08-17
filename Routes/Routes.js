const {
  DonationCategoryController,
  DonationProgramController,
  UsersController,
  WalletController,
} = require("../Controller")

function Route(app) {
  app.use("/donation_program", DonationProgramController)
  app.use("/donation_category", DonationCategoryController)
  app.use("/user", UsersController)
  app.use("/wallet", WalletController)
}

module.exports = Route

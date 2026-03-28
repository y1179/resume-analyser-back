const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true,'token is required']
  },
}, { timestamps: true });


const tokenBlackListModel = mongoose.model("BlacklistToken", blacklistTokenSchema);


module.exports = tokenBlackListModel;
/* This file is for testing mongodb using mongoose */

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://backend:${password}@cluster0.4fr4agd.mongodb.net/backendApp?retryWrites=true&w=majority`;

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  description: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");

    const user = new User({
      name: "Tehan",
      dob: new Date(1995, 11, 27),
      address: "92 Jurong West",
      description: "I dunno what to write here",
      createdAt: new Date(),
    });

    return user.save();
  })
  .then(() => {
    console.log("user saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));

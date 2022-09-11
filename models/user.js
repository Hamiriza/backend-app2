const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  address: String,
  description: String,
  createdAt: Date,
  username: String,
  passwordHash: String,
  relationshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Relationship",
  },
});

//transform the object(id) from mongodb to id, so that it can be used to compare id
//remove the versioning from mongodb when displaying on the backend
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzFjOGY2MzAxZjVmM2I3YzI3OTU2ZDAiLCJpYXQiOjE2NjI4NzI4NDMsImV4cCI6MTY2Mjg3NjQ0M30.OCOc2zmxzHJPXez153R4erh7x2JWW-v5wO_vPGQyDEA
*/

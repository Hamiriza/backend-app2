const User = require("../models/user");

const initialUsers = [
  {
    name: "Aegon Talgalen",
    dob: new Date(1990, 10, 23),
    address: "King's landings?",
    description: "an Impostor",
    createdAt: new Date(),
    username: "aegon",
    password: "asdf",
  },
  {
    name: "Darwis Murwatah",
    dob: new Date(1982, 9, 10),
    address: "Mill Avenue",
    description: "Greedy businessman",
    createdAt: new Date(),
    username: "darwis",
    password: "asdf",
  },
];

const nonExistingId = async () => {
  const user = new User({
    name: "will remove this soon",
    dob: new Date(),
    address: "will remove this soon",
    description: "will remove this soon",
    createdAt: new Date(),
    username: "hm",
    password: "hm",
  });

  await user.save();
  await user.remove();

  return user._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb,
};

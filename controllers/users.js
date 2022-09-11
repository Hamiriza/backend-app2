const usersRouter = require("express").Router();
const User = require("../models/user");
const Relationship = require("../models/relationship");
const bcrypt = require("bcrypt");

//get users
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.status(200).json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user) {
    response.json(user);
  } else {
    return response.status(404).json({ error: "user doesn't exist" });
  }
});

//create user
usersRouter.post("/", async (request, response) => {
  const body = request.body;
  const username = body.username;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: "username must be unique" });
  }

  if (!body.description) {
    body.description = "";
  }

  if (!body.address) {
    body.address = "";
  }

  if (!body.name || !body.dob || !body.username || !body.password) {
    return response.status(400).end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const relationship = new Relationship({
    username,
    friends: [],
  });

  const savedRelation = await relationship.save();

  const user = new User({
    name: body.name,
    dob: body.dob,
    address: body.address,
    description: body.description,
    createdAt: new Date(),
    username: body.username,
    passwordHash,
    relationshipId: savedRelation._id,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

//delete user
usersRouter.delete("/:id", async (request, response) => {
  const userToDelete = await User.findById(request.params.id);
  // const relationshipToDelete = await Relationship.findById(
  //   userToDelete.relationshipId
  // );

  if (userToDelete) {
    const relationshipToDelete = await Relationship.findById(
      userToDelete.relationshipId
    );
    if (relationshipToDelete) {
      await Relationship.findByIdAndRemove(userToDelete.relationshipId);
    } else {
      return response.status(404).json({ error: "relationship is not found" });
    }
    await User.findByIdAndRemove(request.params.id);
    return response.status(204).end();
  } else {
    return response.status(404).json({ error: "user doesn't exist" });
  }
});

//update user
usersRouter.put("/:id", async (request, response) => {
  const { name, dob, address, description } = request.body;

  if (!name && !dob && !address && !description) {
    response.status(400).end();
    return;
  }

  let users = await User.find({});
  users = users.map((u) => u.toJSON());
  const userToUpdate = users.find((u) => u.id === request.params.id);
  let user;
  if (!name && !dob && !address) {
    user = userToUpdate;
    user.description = description;
  } else if (!name && !dob && !description) {
    user = userToUpdate;
    user.address = address;
  } else if (!name && !address && !description) {
    user = userToUpdate;
    user.dob = dob;
  } else if (!dob && !address && !description) {
    user = userToUpdate;
    user.name = name;
  } else {
    user = {
      name: name || userToUpdate.name,
      dob: dob || userToUpdate.dob,
      address: address || userToUpdate.address,
      description: description || userToUpdate.description,
      username: userToUpdate.username,
      passwordHash: userToUpdate.passwordHash,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
    new: true,
  });
  response.status(200).json(updatedUser.toJSON());
});

module.exports = usersRouter;

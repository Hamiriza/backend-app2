const relationshipsRouter = require("express").Router();
const Relationship = require("../models/relationship");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

//get data
relationshipsRouter.get("/", async (request, response) => {
  const relationships = await Relationship.find({});
  response.json(relationships);
});

relationshipsRouter.get("/:id", async (request, response) => {
  const relationship = await Relationship.findById(request.params.id).populate(
    "friends"
  );
  if (relationship) {
    response.json(relationship);
  } else {
    return response.status(404).json({ error: "relationship doesn't exist" });
  }
});

//add friend
relationshipsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!body.userId) {
    return response.status(400).end();
  }

  const receiver = await User.findById(body.userId);
  const askerRelation = await Relationship.findById(request.params.id);

  if (askerRelation.friends.includes(receiver.id)) {
    return response.status(400).json({ error: "They are friends already" });
  }

  let users = await User.find({});
  const asker = users.find((user) => {
    return user.relationshipId == request.params.id;
  });

  if (JSON.stringify(asker) !== JSON.stringify(user)) {
    // only the user who owns the relationship collection can add friend into it
    return response.status(401).json({ error: "not authorized to add friend" });
  }

  if (JSON.stringify(body.userId) == JSON.stringify(asker.id)) {
    // prevents adding oneself as as friend
    return response.status(400).json({ error: "cannot add myself" });
  }
  const receiverRelation = await Relationship.findById(receiver.relationshipId);

  receiverRelation.friends = receiverRelation.friends.concat(asker.id);
  await receiverRelation.save();

  askerRelation.friends = askerRelation.friends.concat(receiver.id);
  const savedRelation = await askerRelation.save();
  response.json(savedRelation);
});

//delete friend
relationshipsRouter.delete("/:id", async (request, response) => {
  const { userId } = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!userId) {
    return response.status(400).end();
  }

  const receiver = await User.findById(userId);
  const askerRelation = await Relationship.findById(request.params.id);

  if (!askerRelation.friends.includes(userId)) {
    return response.status(400).json({ error: "id not found" });
  }

  let users = await User.find({});
  const asker = users.find((user) => user.relationshipId == request.params.id);

  if (JSON.stringify(asker) !== JSON.stringify(user)) {
    // only the user who owns the relationship collection can delete friend
    return response
      .status(401)
      .json({ error: "not authorized to delete friend" });
  }
  const receiverRelation = await Relationship.findById(receiver.relationshipId);

  receiverRelation.friends = receiverRelation.friends.filter(
    (id) => JSON.stringify(id) !== JSON.stringify(asker.id)
  );
  await receiverRelation.save();

  askerRelation.friends = askerRelation.friends.filter(
    (id) => JSON.stringify(id) !== JSON.stringify(receiver.id)
  );
  await askerRelation.save();

  return response.status(204).end();
});

module.exports = relationshipsRouter;

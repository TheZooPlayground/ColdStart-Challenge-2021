const { getUser } = require('../shared/user-utils');
const { QueueClient, QueueServiceClient } = require("@azure/storage-queue");

module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);

  // Get the pre-order from the request
  console.log(req.body);
  const order = {
    User: user.userDetails,
    IcecreamId: req.body.itemId
  };
  
  // TODO: add the pre-order JSON document in a queue
  
  // Retrieve the connection from an environment
  // variable called AZURE_STORAGE_CONNECTION_STRING
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  // Create a unique name for the queue
  const queueName = "PreOrders";

  console.log("Creating queue: ", queueName);

  // Instantiate a QueueServiceClient which will be used
  // to create a QueueClient and to list all the queues
  const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);

  // Get a QueueClient which will be used
  // to create and manipulate a queue
  const queueClient = queueServiceClient.getQueueClient(queueName);

  // Create the queue
  await queueClient.create();

  // Add a message to the queue
  await queueClient.sendMessage(JSON.stringify(order));

  context.res.status(201);
  context.res.body = order;
};

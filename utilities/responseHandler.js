class ResponseHandler {
  constructor() {}
  okResponse = (response, result) => {
    if (result) {
      response.status(200).json(result);
    } else {
      response.status(204).send();
    }
  };

  createdResponse = (response, result) => {
    if (result) {
      response.status(201).json(result);
    } else {
      response.status(204).send();
    }
  };
}

module.exports = new ResponseHandler();

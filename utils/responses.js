const responseStatusCode = {
  ACTION_COMPLETE: 200,
  CLIENT_ERROR: 400,
  SESSION_EXPIRED: 403,
  INTERNAL_SERVER_ERROR: 500
};


const actionCompleteResponse = ({ res, data = {} }) => {
  const response = {
    message: res.__('ACTION_COMPLETE'),
    status: responseStatusCode.ACTION_COMPLETE,
    data,
  };
  // if (logResponse) {
  //   logger.response(JSON.stringify(response));
  // }
  return res.status(responseStatusCode.ACTION_COMPLETE).json(response);
};

const sendError = ({ res, data = {}, error }) => {
  let status = responseStatusCode.INTERNAL_SERVER_ERROR;
  let message = res.__('ERROR_IN_EXECUTION');

  if (typeof error === 'string') {
    message = res.__(error);
    status = responseStatusCode.CLIENT_ERROR;
  }

  const response = { message, status, data };
  // if (logResponse) {
  //   logger.response(JSON.stringify(response));
  // }
  res.status(status).json(response);
};

// const newDataCreatedResponse = ({ res, data = {} }) => {
//   const response = {
//     message: res.__('NEW_DATA_CREATED'),
//     status: responseStatusCode.NEW_DATA_CREATED,
//     data,
//   };

//   return res.status(responseStatusCode.NEW_DATA_CREATED).json(response);
// };

module.exports = {
  actionCompleteResponse,
  sendError
};

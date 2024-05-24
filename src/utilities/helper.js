const customResponse = ({
    code = 200,
    status,
    message = "",
    data = {},
    err = {},
    totalResult,
    totalCount,
    totalPage,
  }) => {
    const responseStatus = status ? status : code < 300 ? true : false;
    return {
      success: responseStatus,
      code,
      totalResult,
      totalCount,
      data,
      message,
      error: err,
      totalPage,
    };
  };
  

  module.exports = {
    customResponse
  };
  
const handleHttpThrowErrors = {
  handleConflictError: (
    message = "El campo ya está registrado.",
    field
  ) => {
    const response = {
      statusCode: 409,
      message,
      error: "ConflictError",
    };

    if (field) {
      response.errors = [
        {
          field,
          message,
        },
      ];
    }

    return response;
  },

  handleBadRequestError: (
    message = "Los datos proporcionados no son válidos",
    field
  ) => {
    const response = {
      statusCode: 400,
      message,
      error: "BadRequestError",
    };

    if (field) {
      response.errors = [
        {
          field,
          message,
        },
      ];
    }

    return response;
  },

  handleBadRequestErrorMultiple: (
    errors = [],
    message = "Los datos proporcionados no son válidos"
  ) => {
    return {
      statusCode: 400,
      message,
      error: "BadRequestError",
      errors: Array.isArray(errors) ? errors : [],
    };
  },

  handleNotFound: (message = "Recurso no encontrado") => {
    return {
      statusCode: 404,
      message,
      error: "NotFoundError",
    };
  },

  handleUnauthorizedError: (message = "Acceso no autorizado") => {
    return {
      statusCode: 401,
      message,
      error: "UnauthorizedError",
    };
  },

  handleForbiddenError: (message = "Acceso prohibido") => {
    return {
      statusCode: 403,
      message,
      error: "ForbiddenError",
    };
  },

  handleDefaultErrorResponse: (
    message = "Se produjo un error interno del servidor. Por favor, inténtelo de nuevo más tarde."
  ) => {
    return {
      statusCode: 500,
      message,
      error: "ServerError",
    };
  },
};

export default handleHttpThrowErrors;
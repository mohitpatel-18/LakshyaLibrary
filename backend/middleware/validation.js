import { ApiError } from '../utils/apiResponse.js';

// Middleware to validate request using Joi or Zod schema
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw new ApiError(400, 'Validation Error', errors);
    }

    req.body = value;
    next();
  };
};

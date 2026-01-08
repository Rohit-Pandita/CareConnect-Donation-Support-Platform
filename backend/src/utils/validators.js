import Joi from 'joi';

export const registerValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('caretaker', 'donor').required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    institutionName: Joi.when('role', {
      is: 'caretaker',
      then: Joi.string().min(3).required(),
      otherwise: Joi.string().optional(),
    }),
    address: Joi.string().min(3).optional(),
  });

  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

export const createRequestValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().required(),
  });

  return schema.validate(data);
};

export const commentValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).max(500).required(),
  });

  return schema.validate(data);
};

export const updateProfileValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    address: Joi.string().min(5).optional(),
    institutionName: Joi.string().min(3).optional(),
  });

  return schema.validate(data);
};

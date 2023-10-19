//Validation manuelle title, director, year, color, duration
const Joi = require("joi");

const movieShema = Joi.object({
  title: Joi.string().max(255).required(),
  director: Joi.string().max(255).required(),
  year: Joi.string().max(255).pattern(/^\d+$/).required(),
  color: Joi.string().max(255).required(),
  duration: Joi.number().integer().min(1).required(),
});

const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration } = req.body;

  const { error } = movieShema.validate(
    { title, director, year, color, duration },
    { abortEarly: false }
  );

  if(error){
    res.status(422).json({validationErrors: error.details})
  } else {
    next()
  }
};

const userSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
  });
  
  const validateUser = (req, res, next) => {
    const { firstname, lastname, email } = req.body;
  
    const { error } = userSchema.validate(
      { firstname, lastname, email },
      { abortEarly: false }
    );
  
    if (error) {
      res.status(422).json({ validationErrors: error.details });
    } else {
      next();
    }
  };

module.exports = {
  validateMovie,
  validateUser
};

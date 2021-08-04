const express = require('express');
const { logger, validatePost , validateUserId, validateUser } = require('../middleware/middleware')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require('./users-model')
const Posts = require('../posts/posts-model');
const dbConfig = require('../../data/db-config');

const router = express.Router();
router.use(logger)

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
  .then( users => {
    res.status(200).json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId, (req, res,) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser,  (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
  .then((user) => {
    res.status(201).json(user)
  })
  .catch(next)
});

router.put('/:id', validateUser, validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    await Users.update(req.body, req.params.id)
    const updatedUser = await Users.getById(req.params.id)
    res.status(200).json(updatedUser)
  } catch(err) {
    next(err)
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const deletedUser = await Users.getById(req.params.id)
    await Users.remove(req.params.id)
    res.status(200).json(deletedUser)
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
});

router.post('/:id/posts', (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});


router.use((err, req, res, next)=> { // eslint-disable-line
  res.status(err.status || 500).json({
    note: 'something went wrong in the users router',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router
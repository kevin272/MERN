const router = require('express').Router();
const { userCreateDTO, userUpdateDTO } = require('./user.request');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const userController = require('./user.controller');
const { bodyValidator } = require('../../middlewares/validator.middleware');

router.get('/list-home', userController.listForHome);

router.use(loginCheck);

router.route('/')
  .get(
    hasPermission(['admin', 'member']),
    userController.userLists
  )
  .post(
    hasPermission(['admin']),
    setPath('user'),
    uploadFile().single('image'),
    bodyValidator(userCreateDTO),
    userController.userCreate
  );

router.route('/:id')
  .get(
    hasPermission(['admin', 'member']),
    userController.userDetailById
  )
  .patch(
    hasPermission(['admin']),
    setPath('user'),
    uploadFile().single('image'),
    bodyValidator(userUpdateDTO,{ stripUnknown: true }),
    userController.userUpdate
  )
  .delete(
    hasPermission(['admin']),
    userController.userRemove
  );

module.exports = router;

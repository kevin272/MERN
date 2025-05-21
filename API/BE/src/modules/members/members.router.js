const express = require('express');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middlware'); 
const { TeamMemberCreateDTO, TeamMemberUpdateDTO } = require('./members.request');
const memberController = require('./members.controller'); 

const router = express.Router();

// Public routes
router.get('/list-home', memberController.getMembersForAdmin); 
// router.get('/:id', memberController.getMemberById)

// Protected routes for Admin
router.route('/')
    .get(loginCheck, hasPermission(['admin']), memberController.getMembersForAdmin) 
    .post(
        loginCheck,
        hasPermission(['admin']),
        setPath('teammembers'),
        uploadFile().single('image'),
        bodyValidator(TeamMemberCreateDTO),
        memberController.createMember
    );

router.route('/:id')
    .get(memberController.getMemberById)
    .patch(
        loginCheck,
        hasPermission(['admin']),
        setPath('teammembers'),
        uploadFile().single('image'),
        bodyValidator(TeamMemberUpdateDTO),
        memberController.updateMember 
    )
    .delete(
        loginCheck,
        hasPermission(['admin']),
        memberController.deleteMember
    );

module.exports = router;

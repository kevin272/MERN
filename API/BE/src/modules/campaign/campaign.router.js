const { fileFilterType } = require('../../config/constants.config');
const { campaignAuth } = require('../../middlewares/campaignauth.middleware'); // Assuming this is where you saved it
const { hasPermission } = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const { CampaignCreateDTO, CampaignUpdateDTO } = require('./campaign.request');
const CampaignController = require('./campaign.controller');
const router = require('express').Router();

router.get('/list-home', CampaignController.ListForHome); // No auth for listing (or adjust as needed)


router.route('/')
    .post(
        loginCheck,
        hasPermission(['admin']), // Only admins can create
        setPath('campaigns'),
        uploadFile().single('image'),
        bodyValidator(CampaignCreateDTO),
        CampaignController.create
    )
    .get(CampaignController.index); // No auth for listing (or adjust as needed)

router.route('/:id')
    .get(CampaignController.view) // No auth for viewing (or adjust)
    .patch(
        loginCheck,
        campaignAuth, // Creator or admin can edit
        setPath('campaigns'),
        uploadFile().single('image'),
        bodyValidator(CampaignUpdateDTO),
        CampaignController.edit
    )
    .delete(
        loginCheck,
        campaignAuth, // Creator or admin can delete
        CampaignController.delete
    );

module.exports = router;
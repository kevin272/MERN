import CampaignSvc from "../../pages/campaign/campaigns.service";

export const getCampaignByName = async (_id : string) => {
    return await CampaignSvc.getRequest(`/campaign/${_id}`);
  };


import HttpService from "../../service/http.service";

class CampaignService extends HttpService{


    async createCampaign(data: any) {
        return await this.postRequest("/campaign", data, { auth: true, file: true });
    }
    
    async getCampaigns(params: any) {
        return await this.getRequest("/campaign", { auth: true, params });
    }
    
    async getCampaignById(id: string) {
        return await this.getRequest(`/campaign/${id}`, { auth: true });
    }
    
    async updateCampaign(id: string, data: any) {
        return await this.patchRequest(`/campaign/${id}`, data, { auth: true, file: true });
    }
    
    async deleteCampaign(id: string) {
        return await this.deleteRequest(`/campaign/${id}`, { auth: true });
    }
    async getCampaignsByUserId(userId: string) {
        return await this.getRequest(`/campaign/user/${userId}`, { auth: true });
    }
    async getCampaignsByCategory(category: string) {
        return await this.getRequest(`/campaign/category/${category}`, { auth: true });
    }

    async getCampaign(id: string) {
        return await this.getRequest(`/campaign/${id}`, { auth: true });
    }
    async getActiveCampaignsForPublicHome(limit: number = 5) {
        return await this.getRequest("/campaign/list-home", { params: { limit } });
    }
    async donateToCampaign(campaignId: string, userId: string, amount: number) {
        return await this.postRequest(`/campaign/${campaignId}/donate`, { userId, amount }, { auth: true });
    }
    async getUserDonationHistory(userId: string) {
        return await this.getRequest(`/campaign/user/${userId}`, { auth: true });
    }
}
const CampaignSvc = new CampaignService();
export default CampaignSvc;
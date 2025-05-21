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
}
const CampaignSvc = new CampaignService();
export default CampaignSvc;
import HttpService from "../../service/http.service";

class UserService extends HttpService {

    async createUser(data: any) {
        return await this.postRequest("/user", data, { auth: true, file: true });
    }
    
    async getUsers(params: any) {
        return await this.getRequest("/user", { auth: true, params });
    }
    
    async getUserById(id: string) {
        return await this.getRequest(`/user/${id}`, { auth: true });
    }
    
    async updateUser(id: string, data: any) {
        return await this.patchRequest(`/user/${id}`, data, { auth: true, file: true });
    }
    
    async deleteUser(id: string) {
        return await this.deleteRequest(`/user/${id}`, { auth: true });
    }

  async getTeamMembersForHome() {
    console.log("getTeamMembersForHome called"); // Add this log
    try {
      const response = await this.getRequest("/user/list-home");
      console.log("getTeamMembersForHome response:", response); // And this log
      return response;
    } catch (error) {
      console.error("Error fetching team members for home:", error);
      throw error;
    }
  }
}

const UserSvc = new UserService();

export default UserSvc;
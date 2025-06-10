import HttpService from "../../service/http.service";

class AuthService extends HttpService{

  signin = async (data: { email: string; password: string }) => {
    return this.postRequest("/auth/signin", data, { auth: false });
  };
}

const authSvc = new AuthService();

export default authSvc;

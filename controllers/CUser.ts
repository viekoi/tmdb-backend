import http from "http";
import MUser from "../models/MUser";
import VUser from "../views/VUser";

class CUser {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async register(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const {
        userName,
      }: {
        userName: string;
      } = JSON.parse(body);
      const password = String(req.headers["x-auth-password"]);
      if (!userName) {
        return this.resHandler(res, 404, "user name is required");
      }

      if (!password) {
        return this.resHandler(res, 404, "password is required");
      }
      try {
        const user = new MUser({ userName: userName, password: password });
        VUser.register(user, res);
      } catch (error) {
        console.log("[register_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async login(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const {
        userName,
      }: {
        userName: string;
      } = JSON.parse(body);
      const password = String(req.headers["x-auth-password"]);
      if (!userName) {
        return this.resHandler(res, 404, "user name is required");
      }

      if (!password) {
        return this.resHandler(res, 404, "password is required");
      }
      try {
        const user = new MUser({ userName: userName, password: password });
        VUser.login(user, res);
      } catch (error) {
        console.log("[login_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async resign(req: http.IncomingMessage, res: http.ServerResponse) {
    const token = req.headers.authorization?.split(" ")[1];
    VUser.resign(token,res)
  }
}

export default CUser;

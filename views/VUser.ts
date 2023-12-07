import prismadb from "../lib/prismadb";
import MUser from "../models/MUser";
import http from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class VCast {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async register(model: MUser, res: http.ServerResponse) {
    try {
      const existedUser = await prismadb.user.findFirst({
        where: {
          userName: model.userName,
        },
      });

      if (existedUser) {
        return this.resHandler(res, 404, "user name existed");
      }

      const hashedPassword = await bcrypt.hash(model.password!, 12);

      const user = await prismadb.user.create({
        data: {
          userName: model.userName!,
          hashedPassword: hashedPassword,
        },
      });

      if (!user) {
        return this.resHandler(res, 404, "user did not get created");
      }

      return this.resHandler(res, 200, "user created");
    } catch (error) {
      console.log("[user_CREATE]", error);
      return this.resHandler(res, 500, error);
    }
  }

  static async login(model: MUser, res: http.ServerResponse) {
    try {
      const user = await prismadb.user.findFirst({
        where: {
          userName: model.userName,
        },
        include: {
          token: true,
        },
      });

      if (!user) {
        return this.resHandler(res, 404, "User not found");
      } else {
        const passwordMatch = await bcrypt.compare(
          model.password!,
          user.hashedPassword
        );
        if (!passwordMatch) {
          return this.resHandler(res, 404, "Unauthorized");
        }

        const currentDate = new Date();

        // Add one month to the current date
        const oneMonthFromNow = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );

        const token = jwt.sign({ userId: user.id }, "your-secret-key");

        let dbToken;
        if (user.token) {
          dbToken = await prismadb.token.update({
            where: {
              id: user.token.id,
            },
            data: {
              expiresAt: oneMonthFromNow,
              value: token,
            },
          });
        } else {
          dbToken = await prismadb.token.create({
            data: {
              userId: user.id,
              expiresAt: oneMonthFromNow,
              value: token,
            },
          });
        }

        if (!dbToken) {
          return this.resHandler(res, 404, "Generate token failed");
        }
        return this.resHandler(res, 200, {
          userName: user.userName,
          token: token,
        });
      }
    } catch (error) {
      console.log("[user_Login]", error);
      return this.resHandler(res, 500, error);
    }
  }

  static async resign(token: string | undefined, res: http.ServerResponse) {
    if (token) {
      const verifyToken = await prismadb.token.findFirst({
        where: {
          value: token,
        },
        include: {
          user: true,
        },
      });

      if (!verifyToken) {
        return this.resHandler(res, 404, "Login sessison expired");
      } else {
        const currentDate = new Date();

        // Add one month to the current date
        const oneMonthFromNow = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        );

        const token = jwt.sign(
          { userId: verifyToken.user.id },
          "your-secret-key"
        );
        const dbToken = await prismadb.token.update({
          where: {
            id: verifyToken.id,
          },
          data: {
            expiresAt: oneMonthFromNow,
            value: token,
          },
        });
        if (!dbToken) return this.resHandler(res, 404, "fail to generate token");
        return this.resHandler(res, 200, {
          userName: verifyToken.user.userName,
          token: token,
        });
      }
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify("Unauthorized"));
    }
  }
}

export default VCast;

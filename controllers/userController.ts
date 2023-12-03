import prismadb from "../lib/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, {
    "Content-Type": "application/json,",
  });

  res.end(JSON.stringify(data));
};

async function register(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  console.log(body);

  req.on("end", async () => {
    const {
      userName,
    }: {
      userName: string;
    } = JSON.parse(body);

    const password = String(req.headers["x-auth-password"]);
    console.log(password)
    try {
      if (!userName) {
        return resHandler(res, 404, "user name is required");
      }

      if (!password) {
        return resHandler(res, 404, "password is required");
      }

      const existedUser = await prismadb.user.findFirst({
        where: {
          userName: userName,
        },
      });

      if (existedUser) {
        return resHandler(res, 404, "user name existed");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prismadb.user.create({
        data: {
          userName,
          hashedPassword: hashedPassword,
        },
      });

      if (!user) {
        return resHandler(res, 404, "user did not get created");
      }

      return resHandler(res, 200, "user created");
    } catch (error) {
      console.log("[user_CREATE]", error);
      return resHandler(res, 500, error);
    }
  });
}

async function login(req: http.IncomingMessage, res: http.ServerResponse) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  console.log(body);

  req.on("end", async () => {
    const {
      userName,
    }: {
      userName: string;
    } = JSON.parse(body);
    const password = String(req.headers["x-auth-password"]);
    console.log(userName);
    console.log(password)

    try {
      if (!userName) {
        return resHandler(res, 404, "user name is required");
      }

      if (!password) {
        return resHandler(res, 404, "password is required");
      }

      const user = await prismadb.user.findFirst({
        where: {
          userName: userName,
        },
        include: {
          token: true,
        },
      });

      if (!user) {
        return resHandler(res, 404, "User not found");
      } else {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordMatch) {
          return resHandler(res, 404, "Unauthorized");
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
          return resHandler(res, 404, "Generate token failed");
        }
        return resHandler(res, 200, {
          userName: user.userName,
          token: token,
        });
      }
    } catch (error) {
      console.log("[user_Login]", error);
      return resHandler(res, 500, error);
    }
  });
}

async function resign(req: http.IncomingMessage, res: http.ServerResponse) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
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
      return resHandler(res, 404, "Login sessison expired");
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
      if (!dbToken) return resHandler(res, 404, "fail to generate token");
      return resHandler(res, 200, {
        userName: verifyToken.user.userName,
        token: token,
      });
    }
  } else {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Unauthorized"));
  }
}

export { register, login, resign };

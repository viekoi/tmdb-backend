import http from "http";
import MGenre from "../models/MGenre";
import VCast from "../views/VCast";
import { Genre } from "@prisma/client";
import MCast from "../models/MCast";

class CCast {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async createCast(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { character, personId, mediaId } = JSON.parse(body);
        const cast = new MCast({
          character: character,
          personId: personId,
          mediaId: mediaId,
        });
        VCast.createCast(cast, res);
      } catch (error) {
        console.log("[cast_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async patchCastById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const {character, personId, mediaId } = JSON.parse(body);
        const cast = new MCast({
          id:id,
          character: character,
          personId: personId,
          mediaId: mediaId,
        });
        VCast.patchCastById(cast, res);
      } catch (error) {
        console.log("[cast_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteCastById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const cast = new MCast({ id: id });
        VCast.deleteCastById(cast, res);
      } catch (error) {
        console.log("[cast_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }
}

export default CCast;

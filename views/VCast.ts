import prismadb from "../lib/prismadb";
import MCast from "../models/MCast";
import http from "http";

class VCast {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async createCast(model: MCast, res: http.ServerResponse) {
    try {
      const cast = await prismadb.cast.create({
        data: {
          character: model.character!,
          personId: model.personId!,
          mediaId: model.mediaId!,
        },
      });
      this.resHandler(res, cast !== null ? 200 : 404, cast);
    } catch (error) {
      console.log("[cast_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async patchCastById(model: MCast, res: http.ServerResponse) {
    try {
      const cast = await prismadb.cast.update({
        where: {
          id: model.id,
        },
        data: {
          character: model.character,
          personId: model.personId,
          mediaId: model.mediaId,
        },
      });

      this.resHandler(res, cast !== null ? 200 : 404, cast);
    } catch (error) {
      console.log("[cast_PATCH]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteCastById(model: MCast, res: http.ServerResponse) {
    try {
      const cast = await prismadb.cast.delete({
        where: {
          id: model.id,
        },
      });

      this.resHandler(res, cast !== null ? 200 : 404, cast);
    } catch (error) {
      console.log("[cast_DELETE]", error);
      this.resHandler(res, 404, { message: "cast Not DElETE" });
    }
  }
}

export default VCast;

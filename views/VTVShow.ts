import prismadb from "../lib/prismadb";

import http from "http";
import MMedia from "../models/MMedia";
import { Media } from "@prisma/client";

class VTVShow {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async getTVShows(res: http.ServerResponse) {
    try {
      const shows = await prismadb.media.findMany({
        where: {
          mediaType: "TVShow",
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: {
            include: {
              genre: true,
            },
          },
          director: true,
        },
      });

      this.resHandler(res, shows !== null ? 200 : 404, shows);
    } catch (error) {
      console.log("[TVShows_GET]", error);
      this.resHandler(res, 404, { message: "TVShows Not Found" });
    }
  }

  static async getTVShowById(model: MMedia, res: http.ServerResponse) {
    try {
      const show = await prismadb.media.findUnique({
        where: {
          id: model.id,
          mediaType: "TVShow",
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: true,
          director: true,
        },
      });

      this.resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_GET]", error);
      this.resHandler(res, 404, { message: "TVShow Not Found" });
    }
  }

  static async getTVShowsByFilter(model: MMedia, res: http.ServerResponse) {
    try {
      let take;
      let skip;

      if (!model.pageSize) {
        take = 10;
      } else {
        take = model.pageSize;
      }

      if (!model.pageNumber) {
        skip = 0;
      } else {
        skip = (model.pageNumber - 1) * take;
      }

      const shows = await prismadb.media.findMany({
        skip,
        take,
        where: {
          title: {
            contains: model.title?.trim(),
          },
          mediaType: "TVShow",
          releasedDay: {
            gte: model.releasedDayStart,
            lte: model.releasedDayEnd,
          },
          genres: {
            some: {
              genreId: {
                in: model.genreIds,
              },
            },
          },
        },
        include: {
          casts: {
            include: {
              person: true,
            },
          },
          genres: true,
          director: true,
        },
      });

      const totalCount = await prismadb.media.count({
        where: {
          title: {
            contains: model.title?.trim(),
          },
          mediaType: "TVShow",
          releasedDay: {
            gte: model.releasedDayStart,
            lte: model.releasedDayEnd,
          },
        },
      });

      const totalPages = Math.ceil(totalCount / take);

      const response = {
        media: shows,
        totalCount,
        totalPages,
      };

      this.resHandler(res,shows !== null ? 200 : 404, response);
    } catch (error) {
      console.log("[TVShow_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async createTVShow(model: MMedia, res: http.ServerResponse) {
    try {
      const show: Media = await prismadb.media.create({
        data: {
          title: model.title!,
          mediaType: "TVShow",
          originalLanguage: model.originalLanguage!,
          imageUrl: model.imageUrl!,
          backDropImageUrl: model.backDropImageUrl!,
          trailerUrl: model.trailerUrl!,
          runTime: model.runTime!,
          overview: model.overview!,
          budget: model.budget!,
          revenue: model.revenue!,
          status: model.status!,
          releasedDay: model.releasedDay!,
          genres: {
            createMany: {
              data: model.genreIds!.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId: model.directorId!,
        },
      });

      this.resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_POST]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async patchTVShowById(model: MMedia, res: http.ServerResponse) {
    try {
      const show: Media = await prismadb.media.update({
        where: {
          id: model.id,
          mediaType: "TVShow",
        },
        data: {
          title: model.title,
          mediaType: "TVShow",
          originalLanguage: model.originalLanguage,
          imageUrl: model.imageUrl,
          backDropImageUrl: model.backDropImageUrl,
          trailerUrl: model.trailerUrl,
          runTime: model.runTime,
          overview: model.overview,
          budget: model.budget,
          revenue: model.revenue,
          status: model.status,
          releasedDay: model.releasedDay,
          genres: {
            deleteMany:{},
            createMany: {
              data: model.genreIds!.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId: model.directorId!,
        },
      });
      this.resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_Patch]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteTVShowsByIds(model: MMedia, res: http.ServerResponse) {
    try {
      const shows = await prismadb.media.deleteMany({
        where: {
          id: {
            in: model.mediaIds,
          },
        },
      });

      this.resHandler(res, shows !== null ? 200 : 404, shows);
    } catch (error) {
      console.log("[TVShows_delete]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async deleteTVShowById(model: MMedia, res: http.ServerResponse) {
    try {
      const show = await prismadb.media.delete({
        where: {
          id: model.id,
        },
      });

      this.resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_DELETE]", error);
      this.resHandler(res, 404, { message: "TVShow Not DElETE" });
    }
  }
}

export default VTVShow;

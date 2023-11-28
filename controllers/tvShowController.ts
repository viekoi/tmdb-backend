import { Media} from "@prisma/client";
import prismadb from "../lib/prismadb";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

async function getTVShows(req: http.IncomingMessage, res: http.ServerResponse) {
  try {
    const shows = await prismadb.media.findMany({
      where: {
        mediaType:"TVShow"
      },
      include: {
        casts: {
          include:{
            person:true
          }
        },
        genres: {
          include: {
            genre: true,
          },
        },
        director: true,
      },
    });

    resHandler(res, shows !== null ? 200 : 404, shows);
  } catch (error) {
    console.log("[TVShows_GET]", error);
    resHandler(res, 404, { message: "TVShows Not Found" });
  }
}

async function getTVShowById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const show = await prismadb.media.findUnique({
      where: {
        id: id,
        mediaType:"TVShow"
      },
      include: {
        casts:{
          include:{
            person:true
          }
        },
        genres: true,
        director: true,
      },
    });

    resHandler(res, show !== null ? 200 : 404, show);
  } catch (error) {
    console.log("[TVShow_GET]", error);
    resHandler(res, 404, { message: "TVShow Not Found" });
  }
}

async function createTVShow(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const {
      title,
      originalLanguage,
      imageUrl,
      backDropImageUrl,
      trailerUrl,
      runTime,
      overview,
      budget,
      revenue,
      status,
      releasedDay,
      genreIds,
      directorId,
    }: Media & { genreIds: any } = JSON.parse(body);

    try {
      const show: Media = await prismadb.media.create({
        data: {
          title,
          mediaType:"TVShow",
          originalLanguage,
          imageUrl,
          backDropImageUrl,
          trailerUrl,
          runTime,
          overview,
          budget,
          revenue,
          status,
          releasedDay,
          genres: {
            createMany: {
              data: genreIds.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId
        },
      });

      resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_POST]", error);
      resHandler(res, 404, error);
    }
  });
}

async function patchTVShowById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const {
      title,
      imageUrl,
      originalLanguage,
      backDropImageUrl,
      trailerUrl,
      runTime,
      overview,
      budget,
      revenue,
      status,
      releasedDay,
      genreIds,
      directorId
    }: Media & {  genreIds: any } = JSON.parse(body);

    try {
      console.log(genreIds);
      const show: Media = await prismadb.media.update({
        where: {
          id: id,
          mediaType:"TVShow"
        },
        data: {
          title,
          originalLanguage,
          imageUrl,
          backDropImageUrl,
          trailerUrl,
          runTime,
          overview,
          budget,
          revenue,
          status,
          releasedDay,
          genres: {
            deleteMany: {},
            createMany: {
              data: genreIds.map((id: string) => {
                return { genreId: id };
              }),
            },
          },
          directorId
        },
      });
      resHandler(res, show !== null ? 200 : 404, show);
    } catch (error) {
      console.log("[TVShow_Patch]", error);
      resHandler(res, 404, error);
    }
  });
}

async function deleteTVShowsByIds(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const ids: string[] = JSON.parse(body);

      const shows = await prismadb.media.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      resHandler(res, shows !== null ? 200 : 404, shows);
    });
  } catch (error) {
    console.log("[TVShows_DELETE]", error);
    resHandler(res, 404, { message: "TVShows Not DElETE" });
  }
}

async function deleteTVShowById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const show = await prismadb.media.delete({
      where: {
        id: id,
      },
    });

    resHandler(res, show !== null ? 200 : 404, show);
  } catch (error) {
    console.log("[TVShow_DELETE]", error);
    resHandler(res, 404, { message: "TVShow Not DElETE" });
  }
}

export {
  getTVShows,
  getTVShowById,
  createTVShow,
  deleteTVShowById,
  deleteTVShowsByIds,
  patchTVShowById,
};
import prismadb from "../lib/prismadb";
import { Genre, Prisma } from "@prisma/client";
import http from "http";

const resHandler = (res: http.ServerResponse, status: number, data: any) => {
  res.writeHead(status, {
    "Content-Type": "application/json,",
  });

  res.end(JSON.stringify(data));
};

async function getAllGenres(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  try {
    const genres = await prismadb.genre.findMany({
      where: {},
      include: {
        medias: true,
      },
    });
    resHandler(res, genres !== null ? 200 : 404, genres);
  } catch (error) {
    console.log("[genres_GET]", error);
    resHandler(res, 404, { message: "genre Not Found" });
  }
}

async function getGenreById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const genre = await prismadb.genre.findUnique({
      where: {
        id: id,
      },
      include: {
        medias: true,
      },
    });

    resHandler(res, genre !== null ? 200 : 404, genre);
  } catch (error) {
    console.log("[genre_GET]", error);
    resHandler(res, 404, { message: "genre Not Found" });
  }
}

async function getGenreByName(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  name: string
) {
  try {
    const genre = await prismadb.genre.findUnique({
      where: { name: name },
      include: {
        medias: true,
      },
    });
    resHandler(res, genre !== null ? 200 : 404, genre);
  } catch (error) {
    console.log("[genre_GET_NAME]", error);
    resHandler(res, 404, { message: "genre Not Found" });
  }
}

async function createGenre(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { name }: Genre = JSON.parse(body);

    try {
      const genre = await prismadb.genre.create({
        data: {
          name,
        },
      });
      resHandler(res, genre !== null ? 200 : 404, genre);
    } catch (error) {
      console.log("[genre_POST]", error);
      resHandler(res, 404, error);
    }
  });
}

async function patchGenreById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { name }: Genre = JSON.parse(body);

    try {
      const genre = await prismadb.genre.update({
        where: {
          id: id,
        },
        data: {
          name,
        },
      });

      resHandler(res, genre !== null ? 200 : 404, genre);
    } catch (error) {
      console.log("[genre_PATCH]", error);
      resHandler(res, 404, error);
    }
  });
}

async function deleteGenresByIds(
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

      const genres = await prismadb.genre.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      resHandler(res, genres !== null ? 200 : 404, genres);
    });
  } catch (error) {
    console.log("[genres_DELETE]", error);
    resHandler(res, 404, { message: "genres Not DELETE" });
  }
}

async function deleteGenreById(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: string
) {
  try {
    const genre = await prismadb.genre.delete({
      where: {
        id: id,
      },
    });

    resHandler(res, genre !== null ? 200 : 404, genre);
  } catch (error) {
    console.log("[genre_DELETE]", error);
    resHandler(res, 404, { message: "genre Not DElETE" });
  }
}

export {
  getAllGenres,
  getGenreById,
  getGenreByName,
  createGenre,
  deleteGenresByIds,
  patchGenreById,
  deleteGenreById,
};
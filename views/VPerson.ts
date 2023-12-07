import prismadb from "../lib/prismadb";
import MPerson from "../models/MPerson";
import http from "http";

class VPerson {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }

  static async getAllPeople(res: http.ServerResponse) {
    try {
      const people = await prismadb.person.findMany({
        where: {},
        include: {
          castIn: {
            include: {
              media: true,
            },
          },
          director: true,
        },
      });
      this.resHandler(res, people !== null ? 200 : 404, people);
    } catch (error) {
      console.log("[people_GET]", error);
      this.resHandler(res, 404, { message: "people Not Found" });
    }
  }

  static async getPersonById(model: MPerson, res: http.ServerResponse) {
    try {
      const person = await prismadb.person.findUnique({
        where: {
          id: model.id,
        },
        include: {
          castIn: {
            include: {
              media: true,
            },
          },
          director: true,
        },
      });

      this.resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[person_GET]", error);
      this.resHandler(res, 404, { message: "person Not Found" });
    }
  }

  static async getPersonByFullName(model: MPerson, res: http.ServerResponse) {
    try {
      const people = await prismadb.person.findMany({
        where: { fullName: { contains: model.fullName } },
        include: {
          castIn: true,
          director: true,
        },
      });
      this.resHandler(res, people !== null ? 200 : 404, people);
    } catch (error) {
      console.log("[people_GET_NAME]", error);
      this.resHandler(res, 404, { message: "people Not Found" });
    }
  }

  static async createPerson(model: MPerson, res: http.ServerResponse) {
    try {
      const person = await prismadb.person.create({
        data: {
          imageUrl: model.imageUrl!,
          fullName: model.fullName!,
          biography: model.biography!,
          knownFor: model.knownFor!,
          dob: model.dob!,
          pob: model.pob!,
          gender: model.gender!,
        },
      });

      this.resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[peple_CREATE]", error);
      this.resHandler(res, 404, { message: "people Not CREATE" });
    }
  }

  static async patchPersonById(model: MPerson, res: http.ServerResponse) {
    try {
      const person = await prismadb.person.update({
        where: {
          id: model.id,
        },
        data: {
          imageUrl: model.imageUrl,
          fullName: model.fullName,
          biography: model.biography,
          knownFor: model.knownFor,
          dob: model.dob,
          pob: model.pob,
          gender: model.gender,
        },
      });

      this.resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[peple_PATCH]", error);
      this.resHandler(res, 404, { message: "people Not PATCH" });
    }
  }

  static async deleteGroupOfPeopleByIds(model: MPerson, res: http.ServerResponse) {
    try {
      const person = await prismadb.person.deleteMany({
        where: {
          id: {
            in: model.peopleIds,
          },
        },
      });

      this.resHandler(res, person !== null ? 200 : 404, person);
    } catch (error) {
      console.log("[peple_DELETE]", error);
      this.resHandler(res, 404, { message: "people Not DElETE" });
    }
  }

  static async deletePersonById(model: MPerson, res: http.ServerResponse) {
    try {
        const person = await prismadb.person.delete({
          where: {
            id: model.id,
          },
        });
    
        this.resHandler(res, person !== null ? 200 : 404, person);
      } catch (error) {
        console.log("[person_DELETE]", error);
        this.resHandler(res, 404, { message: "person Not DElETE" });
      }
}

}
export default VPerson

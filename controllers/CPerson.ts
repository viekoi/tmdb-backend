import http from "http";
import MPerson from "../models/MPerson";
import VPerson from "../views/VPerson";
import { Genre } from "@prisma/client";

class CPerson {
  static resHandler(res: http.ServerResponse, status: number, data: any) {
    res.writeHead(status, {
      "Content-Type": "application/json,",
    });

    res.end(JSON.stringify(data));
  }
  static async getAllPeople(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    try {
      VPerson.getAllPeople(res);
    } catch (error) {
      console.log("[people_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getPersonById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: string
  ) {
    try {
      const person = new MPerson({ id: id });
      VPerson.getPersonById(person, res);
    } catch (error) {
      console.log("[person_GET]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async getPersonByFullName(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    name: string
  ) {
    try {
      const person = new MPerson({ fullName: name });
      VPerson.getPersonByFullName(person, res);
    } catch (error) {
      console.log("[person_GET_NAME]", error);
      this.resHandler(res, 404, error);
    }
  }

  static async createPerson(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { fullName, biography, knownFor, dob, pob, gender, imageUrl } =
          JSON.parse(body);
        const person = new MPerson({
          fullName: fullName,
          biography: biography,
          knownFor: knownFor,
          dob: dob,
          pob: pob,
          gender: gender,
          imageUrl: imageUrl,
        });
        VPerson.createPerson(person, res);
      } catch (error) {
        console.log("[person_POST]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async patchPersonById(
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
        const { fullName, biography, knownFor, dob, pob, gender,imageUrl } =
          JSON.parse(body);
        const person = new MPerson({
          id:id,
          fullName: fullName,
          biography: biography,
          knownFor: knownFor,
          dob: dob,
          pob: pob,
          gender: gender,
          imageUrl: imageUrl,
        });
        VPerson.patchPersonById(person, res);
      } catch (error) {
        console.log("[person_PATCH]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deleteGroupOfPeopleByIds(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const ids: string[] = JSON.parse(body);
        const people = new MPerson({ peopleIds: ids });
        VPerson.deleteGroupOfPeopleByIds(people, res);
      } catch (error) {
        console.log("[people_delete]", error);
        this.resHandler(res, 404, error);
      }
    });
  }

  static async deletePersonById(
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
        const person = new MPerson({ id: id });
        VPerson.deletePersonById(person, res);
      } catch (error) {
        console.log("[person_delete]", error);
        this.resHandler(res, 404, error);
      }
    });
  }
}

export default CPerson;

import { ObjectID } from "typeorm";

export interface JwtPayload {
    name: string;
    id: ObjectID;
    email: string;
}
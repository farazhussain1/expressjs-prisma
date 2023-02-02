import { ObjectId } from "mongoose";
import { Data } from "./model";
import { USER } from "./userSchema";

export class UserService {
    constructor() { }

    get(data: Data) {
        return USER.findOne({ $or: [{ email: data.email }, { _id: data.id }] });
    }

    isExists(email: string) {
        console.log("here");

        return USER.exists({ email })
    }

    create(data: Object) {
        return USER.create(data);
    }

    delete(id:ObjectId) {
        return USER.deleteOne({_id:id})
    }

    update(filter: Data,data:any) {
        return USER.findOneAndUpdate({ $or: [{ email: filter.email }, { _id: filter.id }] },data);
    }
}  
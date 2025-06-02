import UserController from "../controllers/UserController";

export default class User {
    constructor(name, password, role) {
        this.name = name;
        this.password = password;
        this.role = "inactive";
    }
    
    async readIndex() {
        await UserController.readIndex();
    }

    userType() {
        return "User";
    }
}

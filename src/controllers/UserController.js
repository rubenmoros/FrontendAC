import UserAJAX from "../ajax/UserAJAX";


export default class UserController {
    constructor() {
        this.userAJAX = new UserAJAX();
    }

    async login(name, password) {
        return await this.userAJAX.login(name, password);
        
    }

    async logout() {
        return await this.userAJAX.logout();
    }

    async getAllUsers() {
        return await this.userAJAX.getAll();
    }

    async getUser(id) {
        try {
            return await this.userAJAX.getUser(id);
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        return this.userAJAX.getCurrentUser();
    }

    async saveUser(user,token) {
        return await this.userAJAX.save(user,token);
    }

    async saveNewUser(user) {
        return await this.userAJAX.saveNew(user);
    }

    async deleteUser(id) {
        return await this.userAJAX.delete(id);
    }

    async updateUser(user) {
        return await this.userAJAX.update(user);
    }
    
    async readIndex() {
        return await this.userAJAX.readIndex();
    }

    async register(username,password,email){
        return await this.userAJAX.register(username,password,email);
    }

}
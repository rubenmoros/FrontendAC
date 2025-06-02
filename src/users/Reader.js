import EntityController from "../controllers/EntityController";
import ProductController from "../controllers/ProductController";
import PersonController from "../controllers/PersonController";
import User from "./User";

export default class Reader extends User{
    constructor(name, password,role){
        super(name,password,role);
        role = "reader";
    }

    async readIndex(){
        return await super.readIndex();
    }

    async readPerson(name){
        this.readIndex();
        await PersonController.getPerson(name);
    }

    async readEntity(name){
        this.readIndex();
        await EntityController.getEntity(name);
    }

    async readProduct(name){
        this.readIndex();
        await ProductController.getProduct(name);
    }

    
    
    userType(){
        return "Reader";
    }
}
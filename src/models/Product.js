import Element from "./Element.js";

export default class Product extends Element{
    constructor(name, birth, death, wiki, image){
        super(name,birth,death,wiki);
        this.image = image;
        this.peopleInvolved = [];
        this.entitiesInvolved = [];
    }
}
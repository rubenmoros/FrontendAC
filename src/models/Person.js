import Element from "./Element.js";

export default class Person extends Element {
    constructor(name, birth, death, wiki, image) {
        super(name, birth, death, wiki);
        this.image = image;
        this.productsInvolved = [];
        this.entitiesInvolved = [];
    }
}
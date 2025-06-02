import Element from "./Element.js";

export default class Association extends Element {
    constructor(name, birthDate, deathDate, wikiUrl, imageUrl, url) {
        super(name, birthDate, deathDate, wikiUrl);
        this.name = name;
        this.birthDate = birthDate;
        this.deathDate = deathDate;
        this.wikiUrl = wikiUrl;
        this.imageUrl = imageUrl;
        this.url = url;
        this.entities = [];
    }
}
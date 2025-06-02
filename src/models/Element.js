export default class Element{
    constructor(name, birth, death, wiki) {
        this.name = name;
        this.birth = birth;
        this.death = death;
        this.wiki = wiki;
    }

    get getName() {
        return `Nombre: ${this.name}`;
    }
}
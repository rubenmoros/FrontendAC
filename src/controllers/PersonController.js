import PersonAJAX from "../ajax/PersonAJAX.js";
export default class PersonController {
    constructor() {
        this.personAJAX = new PersonAJAX();
    }

    async getAllPeople() {
        return await this.personAJAX.getAll();
    }

    async getPerson(id) {
        return await this.personAJAX.get(id);
    }

    async savePerson(person,token) {
        return await this.personAJAX.save(person,token);
    }

    async updatePerson(updatedPerson) {
        await this.personAJAX.update(updatedPerson);
    }

    async deletePerson(id) {
        await this.personAJAX.delete(id);
    }

    async getProductsByPersonId(personId) {
        return await this.personAJAX.getProductsByPersonId(personId);
    }

    async getEntitiesByPersonId(personId) {
        return await this.personAJAX.getEntitiesByPersonId(personId);
    }

    async addProductToPerson(personId, productId) {
        await this.personAJAX.addProductToPerson(personId, productId);
    }

    async addEntityToPerson(personId, entityId) {
        await this.personAJAX.addEntityToPerson(personId, entityId);
    }

    async removeProductFromPerson(personId, productId) {
        await this.personAJAX.removeProductFromPerson(personId, productId);
    }

    async removeEntityFromPerson(personId, entityId) {
        await this.personAJAX.removeEntityFromPerson(personId, entityId);
    }
}

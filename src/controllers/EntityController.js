import EntityAJAX from "../ajax/EntityAJAX.js";

export default class EntityController {
    constructor() {
        this.entityAJAX = new EntityAJAX();
    }

    async getAllEntities() {
        return await this.entityAJAX.getAll();
    }

    async getEntity(id) {
        return await this.entityAJAX.get(id);
    }

    async saveEntity(entity,token) {
        return await this.entityAJAX.save(entity,token);
    }

    async updateEntity(updatedEntity) {
        await this.entityAJAX.update(updatedEntity);
    }

    async deleteEntity(id) {
        await this.entityAJAX.delete(id);
    }

    async getProductsByEntityId(entityId) {
        return await this.entityAJAX.getProductsByEntityId(entityId);
    }

    async getPersonsByEntityId(entityId) {
        return await this.entityAJAX.getPersonsByEntityId(entityId);
    }

    async addProductToEntity(entityId, productId) {
        await this.entityAJAX.addProductToEntity(entityId, productId);
    }

    async addPersonToEntity(entityId, personId) {
        await this.entityAJAX.addPersonToEntity(entityId, personId);
    }

    async removeProductFromEntity(entityId, productId) {
        await this.entityAJAX.removeProductFromEntity(entityId, productId);
    }

    async removePersonFromEntity(entityId, personId) {
        await this.entityAJAX.removePersonFromEntity(entityId, personId);
    }

}
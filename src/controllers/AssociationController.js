import AssociationAJAX from "../ajax/AssociationAJAX";

export default class AssociationController {
    constructor() {
        this.associationAJAX = new AssociationAJAX();
    }

    async getAllAssociations() {
        return await this.associationAJAX.getAll();
    }

    async getAssociation(id) {
        return await this.associationAJAX.get(id);
    }

    async saveAssociation(association, token) {
        return await this.associationAJAX.save(association, token);
    }

    async updateAssociation(updatedAssociation) {
        await this.associationAJAX.update(updatedAssociation);
    }

    async deleteAssociation(id) {
        await this.associationAJAX.delete(id);
    }

    async getEntitiesByAssociationId(associationId) {
        return await this.associationAJAX.getEntitiesByAssociationId(associationId);
    }

}
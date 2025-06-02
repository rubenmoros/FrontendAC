import ProductAJAX from "../ajax/ProductAJAX";
export default class ProductController {
    constructor() {
        this.productAJAX = new ProductAJAX();
    }

    async getAllProducts() {
        return await this.productAJAX.getAll();
    }

    async getProduct(id) {
        return await this.productAJAX.get(id);
    }

    async saveProduct(product,token) {
        return await this.productAJAX.save(product,token);
    }

    async updateProduct(updatedProduct) {
        await this.productAJAX.update(updatedProduct);
    }

    async deleteProduct(id) {
        await this.productAJAX.delete(id);
    }

    async getPersonsByProductId(productId) {
        return await this.productAJAX.getPersonsByProductId(productId);
    }

    async getEntitiesByProductId(productId) {
        return await this.productAJAX.getEntitiesByProductId(productId);
    }

    async addPersonToProduct(productId, personId) {
        await this.productAJAX.addPersonToProduct(productId, personId);
    }

    async addEntityToProduct(productId, entityId) {
        await this.productAJAX.addEntityToProduct(productId, entityId);
    }

    async removePersonFromProduct(productId, personId) {
        await this.productAJAX.removePersonFromProduct(productId, personId);
    }

    async removeEntityFromProduct(productId, entityId) {
        await this.productAJAX.removeEntityFromProduct(productId, entityId);
    }
}
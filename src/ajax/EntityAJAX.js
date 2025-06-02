import ModelAJAXB from "./ModelAJAXB.js";

export default class EntityAJAX extends ModelAJAXB {
    constructor(productAJAX = null, personAJAX = null) {
        super();
        this.url = "http://localhost:8081/api/v1/entities";
        this.productAJAX = productAJAX;
        this.personAJAX = personAJAX;
    }

    setAJAXInstances(productAJAX, personAJAX) {
        this.productAJAX = productAJAX;
        this.personAJAX = personAJAX;
    }

    async getAll() {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Fallo al obtener entidades");
        return await response.json();
    }

    async get(id) {
        const response = await fetch(`${this.url}/${id}`);
        if (!response.ok) throw new Error("Fallo al obtener entidad");
        return await response.json();
    }

    async save(entity, token) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: entity.name,
                birthDate: entity.birthDate,
                deathDate: entity.deathDate,
                wikiUrl: entity.wikiUrl,
                imageUrl: entity.imageUrl
            })
        });
        if (!response.ok) throw new Error("Fallo al guardar entidad");
        const data = await response.json();
        return data.entity.id;
    }

    async update(entity) {
        const token = localStorage.getItem("token");
        const getCurrentResponse = await fetch(`${this.url}/${entity.id}`);
        const etag = getCurrentResponse.headers.get('ETag');

        const response = await fetch(`${this.url}/${entity.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": etag || "*"
            },
            body: JSON.stringify({
                name: entity.name,
                birthDate: entity.birthDate,
                deathDate: entity.deathDate,
                wikiUrl: entity.wikiUrl,
                imageUrl: entity.imageUrl
            })
        });

        if (!response.ok) {
            console.error("Update failed:", response.status);
            throw new Error("Fallo al actualizar entidad");
        }
    }

    async delete(id) {
        const token = localStorage.getItem("token");
        const personsResponse = await this.getPersonsByEntityId(id);
        const productsResponse = await this.getProductsByEntityId(id);

        const persons = personsResponse.persons || [];
        const products = productsResponse.products || [];

        persons.map(async (person) => {
            await this.removePersonFromEntity(id, person.id, true);
        });
        products.map(async (product) => {
            await this.removeProductFromEntity(id, product.id, true);
        });
        const response = await fetch(`${this.url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al borrar entidad");
    }

    async getPersonsByEntityId(entityId) {
        const response = await fetch(`${this.url}/${entityId}/persons`);
        if (!response.ok) throw new Error("Fallo al obtener personas por entidad");
        return await response.json();
    }

    async getProductsByEntityId(entityId) {
        const response = await fetch(`${this.url}/${entityId}/products`);
        if (!response.ok) throw new Error("Fallo al obtener productos por entidad");
        return await response.json();
    }

    async addPersonToEntity(entityId, personId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${entityId}/persons/add/${personId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir persona a entidad");

        await this.personAJAX.addEntityToPerson(personId, entityId);
    }

    async removePersonFromEntity(entityId, personId, skipReverse = false) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${entityId}/persons/rem/${personId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar persona de entidad");

        if (!skipReverse && this.personAJAX) {
            await this.personAJAX.removeEntityFromPerson(personId, entityId, true);
        }
    }

    async addProductToEntity(entityId, productId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${entityId}/products/add/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir producto a entidad");

        await this.productAJAX.addEntityToProduct(productId, entityId);
    }

    async removeProductFromEntity(entityId, productId, skipReverse = false) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${entityId}/products/rem/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar producto de entidad");

        if (!skipReverse && this.productAJAX) {
            await this.productAJAX.removeEntityFromProduct(productId, entityId, true);
        }
    }
}
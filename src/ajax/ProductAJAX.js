import ModelAJAXB from "./ModelAJAXB";
import PersonAJAX from "./PersonAJAX";
import EntityAJAX from "./EntityAJAX";

export default class ProductAJAX extends ModelAJAXB {
    constructor(personAJAX = null, entityAJAX = null) {
        super();
        this.url = "http://localhost:8081/api/v1/products";
        this.personAJAX = personAJAX;
        this.entityAJAX = entityAJAX;
    }

    setAJAXInstances(personAJAX, entityAJAX) {
        this.personAJAX = personAJAX;
        this.entityAJAX = entityAJAX;
    }

    async getAll() {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Fallo al obtener productos");
        return await response.json();
    }

    async get(id) {
        const response = await fetch(`${this.url}/${id}`);
        if (!response.ok) throw new Error("Fallo al obtener producto");
        return await response.json();
    }
    async save(product, token) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: product.name,
                birthDate: product.birthDate,
                deathDate: product.deathDate,
                wikiUrl: product.wikiUrl,
                imageUrl: product.imageUrl
            })
        });
        if (!response.ok) throw new Error("Fallo al guardar producto");
        const data = await response.json();
        return data.product.id;
    }

    async update(product) {
        const token = localStorage.getItem("token");
        const getCurrentResponse = await fetch(`${this.url}/${product.id}`);
        const etag = getCurrentResponse.headers.get('ETag');
        const response = await fetch(`${this.url}/${product.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": etag || "*",
            },
            body: JSON.stringify({
                name: product.name,
                birthDate: product.birthDate,
                deathDate: product.deathDate,
                wikiUrl: product.wikiUrl,
                imageUrl: product.imageUrl
            })
        });
        if (!response.ok) {
            console.error("Update failed:", response.status);
            throw new Error("Fallo al actualizar producto");
        }
    }

    async delete(id) {
        const token = localStorage.getItem("token");
        const personsResponse = await this.getPersonsByProductId(id);
        const entitiesResponse = await this.getEntitiesByProductId(id);

        const persons = personsResponse.persons || [];
        const entities = entitiesResponse.entities || [];
        persons.map(person => {
            if (person && person.id) {
                this.personAJAX.removeProductFromPerson(person.id, id, true);
            }
        });
        entities.map(entity => {
            if (entity && entity.id) {
                this.entityAJAX.removeProductFromEntity(entity.id, id, true);
            }
        });
        const response = await fetch(`${this.url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al borrar producto");
    }

    async getPersonsByProductId(productId) {
        const response = await fetch(`${this.url}/${productId}/persons`);
        if (!response.ok) throw new Error("Fallo al obtener personas por producto");
        return await response.json();
    }

    async addPersonToProduct(productId, personId) {
        const response = await fetch(`${this.url}/${productId}/persons/add/${personId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir persona a producto");

        await this.personAJAX.addProductToPerson(personId, productId);
    }

    async removePersonFromProduct(productId, personId, skipReverse = false) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${productId}/persons/rem/${personId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar persona del producto");

        if (!skipReverse && this.personAJAX) {
            await this.personAJAX.removeProductFromPerson(personId, productId, true);
        }
    }

    async getEntitiesByProductId(productId) {
        const response = await fetch(`${this.url}/${productId}/entities`);
        if (!response.ok) throw new Error("Fallo al obtener entidades por producto");
        return await response.json();
    }

    async addEntityToProduct(productId, entityId) {
        const response = await fetch(`${this.url}/${productId}/entities/add/${entityId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir entidad a producto");
        await this.entityAJAX.addProductToEntity(entityId, productId);
    }

    async removeEntityFromProduct(productId, entityId,skipReverse = false) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${productId}/entities/rem/${entityId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar entidad del producto");

        if (!skipReverse && this.entityAJAX) {
            await this.entityAJAX.removeProductFromEntity(personId, productId, true);
        }
    }
}

import ModelAJAXB from "./ModelAJAXB.js";
import ProductAJAX from "./ProductAJAX.js";
import EntityAJAX from "./EntityAJAX.js";


export default class PersonAJAX extends ModelAJAXB {
    constructor(productAJAX = null, entityAJAX = null) {
        super();
        this.url = "http://localhost:8081/api/v1/persons";
        this.productAJAX = productAJAX;
        this.entityAJAX = entityAJAX;
    }

    setAJAXInstances(productAJAX, entityAJAX) {
        this.productAJAX = productAJAX;
        this.entityAJAX = entityAJAX;
    }

    async getAll() {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Fallo al obtener personas");
        return await response.json();
    }

    async get(id) {
        const response = await fetch(`${this.url}/${id}`);
        if (!response.ok) throw new Error("Fallo al obtener persona");
        return await response.json();
    }

    async save(person, token) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: person.name,
                birthDate: person.birthDate,
                deathDate: person.deathDate,
                wikiUrl: person.wikiUrl,
                imageUrl: person.imageUrl
            })
        });
        if (!response.ok) throw new Error("Fallo al guardar persona");
        const data = await response.json();
        return data.person.id;
    }

    async update(person) {
        const token = localStorage.getItem("token");
        const getCurrentResponse = await fetch(`${this.url}/${person.id}`);
        const etag = getCurrentResponse.headers.get('ETag');

        const response = await fetch(`${this.url}/${person.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": etag || "*",
            },
            body: JSON.stringify({
                name: person.name,
                birthDate: person.birthDate,
                deathDate: person.deathDate,
                wikiUrl: person.wikiUrl,
                imageUrl: person.imageUrl
            })
        });

        if (!response.ok) {
            console.error("Update failed:", response.status);
            throw new Error("Fallo al actualizar persona");
        }
    }

    async delete(id) {
        const token = localStorage.getItem("token");
        const productsResponse = await this.getProductsByPersonId(id);
        const entititiesResponse = await this.getEntitiesByPersonId(id);

        const products = productsResponse.products || [];
        const entities = entititiesResponse.entities || [];
        products.map(product => {
            if (product && product.id) {
                this.productAJAX.removePersonFromProduct(product.id, id, true);
            }
        });
        entities.map(entity => {
            if (entity && entity.id) {
                this.entityAJAX.removePersonFromEntity(entity.id, id, true);
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
        if (!response.ok) throw new Error("Fallo al borrar persona");
    }



    async getProductsByPersonId(personId) {
        const response = await fetch(`${this.url}/${personId}/products`);
        if (!response.ok) throw new Error("Fallo al obtener productos por persona");
        return await response.json();
    }

    async addProductToPerson(personId, productId) {
        const response = await fetch(`${this.url}/${personId}/products/add/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir producto a persona");

        await this.productAJAX.addPersonToProduct(productId, personId);
    }

    async removeProductFromPerson(personId, productId, skipReverse = false) {
        const response = await fetch(`${this.url}/${personId}/products/rem/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar producto de persona");

        if (!skipReverse && this.productAJAX) {
            await this.productAJAX.removePersonFromProduct(productId, personId, true);
        }
    }

    async getEntitiesByPersonId(personId) {
        const response = await fetch(`${this.url}/${personId}/entities`);
        if (!response.ok) throw new Error("Fallo al obtener entidades por persona");
        return await response.json();
    }

    async addEntityToPerson(personId, entityId) {
        const response = await fetch(`${this.url}/${personId}/entities/add/${entityId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir entidad a persona");

        await this.entityAJAX.addPersonToEntity(entityId, personId);
    }

    async removeEntityFromPerson(personId, entityId, skipReverse = false) {
        const response = await fetch(`${this.url}/${personId}/entities/rem/${entityId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar entidad de persona");

        if (!skipReverse && this.entityAJAX) {
            await this.entityAJAX.removePersonFromEntity(entityId, personId, true);
        }
    }
}
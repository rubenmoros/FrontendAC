import ModelAJAXB from "./ModelAJAXB";

export default class AssociationAJAX extends ModelAJAXB {
    constructor(entityAJAX = null) {
        super();
        this.url = "http://localhost:8081/api/v1/associations";
        this.entityAJAX = entityAJAX;
    }

    setAJAXInstances(entityAJAX) {
        this.entityAJAX = entityAJAX;
    }

    async getAll() {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error("Fallo al obtener asociaciones");
        return await response.json();
    }

    async get(id) {
        const response = await fetch(`${this.url}/${id}`);
        if (!response.ok) throw new Error("Fallo al obtener asociación");
        return await response.json();
    }

    async save(association, token) {
        try {
            if (!token) {
                throw new Error("No hay token de autorización");
            }

            const response = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: association.name,
                    url: association.url,
                    entities: []
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Save failed:", response.status, errorText);
                throw new Error("Fallo al guardar asociación");
            }

            const data = await response.json();
            if (!data || !data.association || !data.association.id) {
                throw new Error("Respuesta inválida del servidor");
            }
            return data.association.id;
        } catch (error) {
            console.error("Error in save:", error);
            throw error;
        }
    }

    async update(association) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        // Get current version for ETag
        const getCurrentResponse = await fetch(`${this.url}/${association.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const etag = getCurrentResponse.headers.get('ETag');

        const response = await fetch(`${this.url}/${association.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": etag || "*"
            },
            body: JSON.stringify({
                name: association.name,
                url: association.url || "",
                entities: association.entities || []
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update failed:", response.status, errorText);
            throw new Error("Fallo al actualizar asociación");
        }

        return await response.json();

    }

    async delete(id) {
        const entitiesResponse = await this.getEntitiesByAssociationId(id);
        const entities = entitiesResponse.entities || [];
        entities.map(async (entity) => {
            this.removeEntity(id, entity.id);
        });
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al borrar asociación");
    }

    async getEntitiesByAssociationId(associationId) {
        const response = await fetch(`${this.url}/${associationId}/entities`);
        if (!response.ok) throw new Error("Fallo al obtener entidades de la asociación");
        const data = await response.json();
        return {
            entities: data.entities.map(e => e.entity)
        };
    }

    async addEntity(associationId, entityId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${associationId}/entities/add/${entityId}`, {
            method: "PUT", // Changed from POST to PUT
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al añadir entidad a la asociación");
        return await response.json();
    }

    async removeEntity(associationId, entityId) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${associationId}/entities/rem/${entityId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al eliminar entidad de la asociación");
    }

}
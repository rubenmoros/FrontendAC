import ModelAJAXB from "./ModelAJAXB.js";
import ProductController from "../controllers/ProductController";
import EntityController from "../controllers/EntityController";
import PersonController from "../controllers/PersonController";
import UserController from "../controllers/UserController";
import AssociationController from "../controllers/AssociationController";

export default class UserAJAX extends ModelAJAXB {
    constructor() {
        super();
        this.url = "http://localhost:8081/api/v1/users";
    }

    async getAll() {
        const token = localStorage.getItem("token");
        const response = await fetch(this.url, {
            headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error("Fallo al obtener usuarios");
        return await response.json();
    }

    async getUser(id) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`

            }
        });
        if (!response.ok) throw new Error("Fallo al obtener usuario");
        return await response.json();
    }

    async login(username, password) {
        const response = await fetch("http://localhost:8081/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) throw new Error("Credenciales incorrectas");

        const data = await response.json();
        const loggedUser = this.decodeJWT(data.access_token);
        localStorage.setItem("token", data.access_token);
        return loggedUser;
    }

    decodeJWT(token) {
        try {
            const payload = token.split('.')[1];
            const user = JSON.parse(atob(payload));
            if (user.uid && !user.id) user.id = user.uid;
            return user;
        } catch (e) {
            console.error("Error al decodificar JWT", e);
            return null;
        }
    }


    async register(username, password, email) {
        const checkResponse = await fetch(`${this.url}/username/${username}`);
        if (checkResponse.status === 204) {
            throw new Error("El usuario ya existe");
        }
        let newUser = {
            username: username,
            password: password,
            email: email,
        };
        const createdUser = await this.saveNew(newUser);
        return createdUser;
    }

    async getCurrentUser() {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = token.split(".")[1];
            const user = JSON.parse(atob(payload));
            console.log("Payload JWT:", user);
            return JSON.parse(atob(payload));
        }
        catch (e) {
            console.error("Error al obtener usuario actual", e);
            return null;
        }
    }


    async logout() {
        const token = localStorage.getItem("token");
        if (token) {
            await fetch("http://localhost:8081/access_token", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "If-Match": "*"
                }
            });
        }
        if (!response.ok) throw new Error("Fallo al cerrar sesión");
        localStorage.removeItem("token");
    }

    async save(user, token) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password,
                role: user.role
            })
        });
        if (!response.ok) throw new Error("Fallo al guardar usuario");
        const data = await response.json();
        return data.user.id;
    }

    async saveNew(user) {
        const response = await fetch(this.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
            })
        });
        if (!response.ok) throw new Error("Fallo al guardar usuario");
        const data = await response.json();
        return data.user;
    }

    async delete(id) {
        const token = localStorage.getItem("token");
        const response = await fetch(`${this.url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": "*"
            }
        });
        if (!response.ok) throw new Error("Fallo al borrar usuario");
    }

    async update(user) {
        const token = localStorage.getItem("token");
        const getCurrentResponse = await fetch(`${this.url}/${user.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const etag = getCurrentResponse.headers.get('ETag');
        const response = await fetch(`${this.url}/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "If-Match": etag || "*"
            },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                role: user.role
            })
        });
        if (!response.ok) throw new Error("Fallo al actualizar usuario");
        return await response.json();
    }

    async readIndex() {
        const productController = new ProductController();
        const personController = new PersonController();
        const entityController = new EntityController();
        const associationController = new AssociationController();

        const products = await productController.getAllProducts();
        const people = await personController.getAllPeople();
        const entities = await entityController.getAllEntities();
        const associations = await associationController.getAllAssociations();

        const token = localStorage.getItem("token");
        const user = this.decodeJWT(token);
        let isWriter = user?.scopes?.includes("writer") || user?.role === "writer";

        if (isWriter) {
            const userController = new UserController();
            const users = await userController.getAllUsers();
            return {
                products: products.products,
                people: people.persons,
                entities: entities.entities,
                associations: associations.associations,
                users: users.users,
            };
        } else {
            return {
                products: products.products,
                people: people.persons,
                entities: entities.entities,
                associations: associations.associations,
            };
        }
    }
}

import User from "./User.js";
import PersonController from "../controllers/PersonController.js";
import EntityController from "../controllers/EntityController.js";
import ProductController from "../controllers/ProductController.js";
import UserController from "../controllers/UserController.js";
import AssociationController from "../controllers/AssociationController.js";

export default class Writer extends User {
    constructor() {
        super();
        this.productController = new ProductController();
        this.personController = new PersonController();
        this.entityController = new EntityController();
        this.userController = new UserController();
        this.associationController = new AssociationController();
    }

    async readIndex() {
        return await super.readIndex();
    }

    async createPerson(navigate) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        let newPerson = {
            name: "Nueva Persona",
            birthDate: "",
            deathDate: "",
            wikiUrl: "",
            imageUrl: "",
            productsInvolved: [],
            entitiesInvolved: []
        };
        const idNeeded = await this.personController.savePerson(newPerson, token);
        return await this.editPerson(idNeeded, navigate);
    }

    async updatePerson(person) {
        return await this.editPerson(person, navigate);
    }

    async editPerson(id, navigate) {
        navigate(`/forms/PersonForm/${id}`);
    }


    async deletePerson(id) {
        return await this.personController.deletePerson(id);
    }

    async createEntity(navigate) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        let newEntity = {
            name: "Nueva Entidad",
            birthDate: "",
            deathDate: "",
            wikiUrl: "",
            imageUrl: ""
        };
        const idNeeded = await this.entityController.saveEntity(newEntity, token);
        return await this.editEntity(idNeeded, navigate);
    }

    async updateEntity(entity) {
        await this.editEntity(entity, navigate);
    }

    async editEntity(id, navigate) {
        navigate(`/forms/EntityForm/${id}`);
    }

    async deleteEntity(id) {
        return await this.entityController.deleteEntity(id);
    }


    async createProduct(navigate) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        let newProduct = {
            name: "Nuevo Producto",
            birthDate: "",
            deathDate: "",
            wikiUrl: "",
            imageUrl: "",
            peopleInvolved: [],
            entitiesInvolved: []
        };
        const idNeeded = await this.productController.saveProduct(newProduct, token);
        return await this.editProduct(idNeeded, navigate);
    }

    async updateProduct(product) {
        return await this.productController.updateProduct(product);
    }

    async editProduct(id, navigate) {
        navigate(`/forms/ProductForm/${id}`);
    }

    async deleteProduct(id) {
        return await this.productController.deleteProduct(id);
    }

    async createUser(navigate) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        let newUser = {
            username: "Nuevo Usuario",
            password: "",
            role: "inactive"
        };
        const idNeeded = await this.userController.saveUser(newUser, token);
        return await this.editUser(idNeeded, navigate);
    }

    async updateUser(user) {
        return await this.userController.updateUser(user);
    }

    async editUser(user, navigate) {
        navigate(`/forms/UserWriterForm/${user.id}`, {
            state: {
                initialData: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }

    async deleteUser(id) {
        return await this.userController.deleteUser(id);
    }

    async createAssociation(navigate) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autorización");
        }

        let newAssociation = {
            name: "Nueva Asociacion",
            url: "http://nueva-asociacion.com",
            entities: []
        };
        const idNeeded = await this.associationController.saveAssociation(newAssociation, token);
        return await this.editAssociation(idNeeded, navigate);
    }

    async updateAssociation(association) {
        return await this.associationController.updateAssociation(association);
    }

    async editAssociation(id, navigate) {
        navigate(`/forms/AssociationForm/${id}`);
    }

    async deleteAssociation(id) {
        return await this.associationController.deleteAssociation(id);
    }

}

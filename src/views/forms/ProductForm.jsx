import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductController from "../../controllers/ProductController";
import UserController from "../../controllers/UserController";

function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const productController = new ProductController();
    const userController = new UserController();


    const [form, setForm] = useState({
        name: "",
        birthDate: "",
        deathDate: "",
        wikiUrl: "",
        imageUrl: "",
        peopleInvolved: [],
        entitiesInvolved: []
    });
    useEffect(() => {
        const loadProduct = async () => {
            const data = await productController.getProduct(id);
            const peopleInvolved = await productController.getPersonsByProductId(id);
            const entitiesInvolved = await productController.getEntitiesByProductId(id);
            const product = data.product;
            setForm({
                name: product.name,
                birthDate: product.birthDate,
                deathDate: product.deathDate,
                wikiUrl: product.wikiUrl,
                imageUrl: product.imageUrl,
                peopleInvolved: peopleInvolved.persons.map(p => p.id).join(", "),
                entitiesInvolved: entitiesInvolved.entities.map(e => e.id).join(", ")
            });

        };
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productBasicData = {
            id: Number(id),
            name: form.name,
            birthDate: form.birthDate,
            deathDate: form.deathDate,
            wikiUrl: form.wikiUrl,
            imageUrl: form.imageUrl
        };
        await productController.updateProduct(productBasicData);

        const currentPersons = await productController.getPersonsByProductId(id);
        const newPersonIds = form.peopleInvolved
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => Number(s))
            .filter(n => !isNaN(n));
        for (const person of currentPersons.persons) {
            if (!newPersonIds.includes(person.id) && person.id) {
                console.log("Removing person:", person.id);
                await productController.removePersonFromProduct(id, person.id);
            }
        }
        for (const personId of newPersonIds) {
            if (personId && !currentPersons.persons.some(p => p.id === personId)) {
                console.log("Adding person:", personId);
                await productController.addPersonToProduct(id, personId);
            }
        }

        navigate("/WriterView");

    };

    const goHome = () => {
        navigate("/WriterView");
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>
            <div className="form-container" style={{ maxWidth: 500, margin: "0 auto" }}>
                <h2 className="element-title">PANEL DE EDICIÓN DEL PRODUCTO</h2>
                <form
                    className="form-container"
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <label>Nombre
                        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
                    </label>
                    <label>Nacimiento
                        <input name="birthDate" placeholder="Nacimiento" value={form.birthDate} onChange={handleChange} />
                    </label>
                    <label>Muerte
                        <input name="deathDate" placeholder="Muerte" value={form.deathDate} onChange={handleChange} />
                    </label>
                    <label>Enlace Wikipedia
                        <input name="wikiUrl" placeholder="Wiki" value={form.wikiUrl} onChange={handleChange} />
                    </label>
                    <label>Imagen (URL)
                        <input name="imageUrl" placeholder="URL imagen" value={form.imageUrl} onChange={handleChange} />
                    </label>
                    <label>Personas involucradas (separadas por comas)
                        <input name="peopleInvolved" placeholder="Personas involucradas" value={form.peopleInvolved} onChange={handleChange} />
                    </label>
                    <label>Entidades involucradas
                        <input name="entitiesInvolved" placeholder="Entidades involucradas" value={form.entitiesInvolved} onChange={handleChange} />
                    </label>
                    <button className="button" type="submit">
                        Guardar Producto
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PersonController from "../../controllers/PersonController";
import UserController from "../../controllers/UserController";

function PersonForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const personController = new PersonController();

    const [form, setForm] = useState({
        name: "",
        birthDate: "",  
        deathDate: "",   
        wikiUrl: "",      
        imageUrl: "",    
        productsInvolved: "",
        entitiesInvolved: ""
    });

    useEffect(() => {
        const loadPerson = async () => {
            const data = await personController.getPerson(id);
                const productsInvolved = await personController.getProductsByPersonId(id);
                const entitiesInvolved = await personController.getEntitiesByPersonId(id)
            setForm({
                name: data.person.name,
                birthDate: data.person.birthDate,  
                deathDate: data.person.deathDate,  
                wikiUrl: data.person.wikiUrl,     
                imageUrl: data.person.imageUrl,    
                productsInvolved: productsInvolved.products.map(p => p.id).join(", "),
                entitiesInvolved: entitiesInvolved.entities.map(e => e.id).join(", ")
            });
        };
        loadPerson();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const personBasicData = {
            id: Number(id),
            name: form.name,
            birthDate: form.birthDate, 
            deathDate: form.deathDate,  
            wikiUrl: form.wikiUrl,      
            imageUrl: form.imageUrl     
        };
        
        await personController.updatePerson(personBasicData);
        const currentProducts = await personController.getProductsByPersonId(id);
        const newProductIds = form.productsInvolved
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => Number(s))
            .filter(n => !isNaN(n));

        for (const product of currentProducts.products) {
            if (!newProductIds.includes(product.id)) {
                await personController.removeProductFromPerson(id, product.id);
            }
        }
        for (const productId of newProductIds) {
            await personController.addProductToPerson(id, productId);
        }

        const currentEntities = await personController.getEntitiesByPersonId(id);
        const newEntityIds = form.entitiesInvolved
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => Number(s))
            .filter(n => !isNaN(n));

        for (const entity of currentEntities.entities) {
            if (!newEntityIds.includes(entity.id)) {
                await personController.removeEntityFromPerson(id, entity.id);
            }
        }
        for (const entityId of newEntityIds) {
            await personController.addEntityToPerson(id, entityId);
        }

        navigate("/WriterView");
    };

    const goHome = () => {
        navigate("/WriterView");
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>
            <div className="form-container" style={{ maxWidth: 500, margin: "0 auto" }}>
                <h2 className="element-title">PANEL DE EDICIÓN DE LA PERSONA</h2>
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
                    <label>Productos involucrados (separados por comas)
                        <input name="productsInvolved" placeholder="Productos involucrados" value={form.productsInvolved} onChange={handleChange} />
                    </label>
                    <label>Entidades involucradas
                        <input name="entitiesInvolved" placeholder="Entidades involucradas" value={form.entitiesInvolved} onChange={handleChange} />
                    </label>
                    <button className="button" type="submit">Guardar Persona</button>
                </form>
            </div>
        </div>
    );
}

export default PersonForm;
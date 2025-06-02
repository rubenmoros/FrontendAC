import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EntityController from "../../controllers/EntityController";

function EntityForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const entityController = new EntityController();

    const [form, setForm] = useState({
        name: "",
        birthDate: "",
        deathDate: "",
        wikiUrl: "",
        imageUrl: ""
    });

    useEffect(() => {
        const loadEntity = async () => {
            const data = await entityController.getEntity(id);
            setForm({
                name: data.entity.name,
                birthDate: data.entity.birthDate,
                deathDate: data.entity.deathDate,
                wikiUrl: data.entity.wikiUrl,
                imageUrl: data.entity.imageUrl
            });
        };
        loadEntity();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entityBasicData = {
            id: Number(id),
            name: form.name,
            birthDate: form.birthDate,
            deathDate: form.deathDate,
            wikiUrl: form.wikiUrl,
            imageUrl: form.imageUrl
        };
        
        await entityController.updateEntity(entityBasicData);
        navigate("/WriterView");
    };

    const goHome = () => {
        navigate("/WriterView");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>
            <div className="form-container" style={{ maxWidth: 500, margin: "0 auto" }}>
                <h2 className="element-title">PANEL DE EDICIÓN DE LA ENTIDAD</h2>
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
                    <button className="button" type="submit">Guardar Entidad</button>
                </form>
            </div>
        </div>
    );
}

export default EntityForm;
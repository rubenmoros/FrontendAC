import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Writer from '../../users/Writer';
import EntityController from '../../controllers/EntityController';
import AssociationController from '../../controllers/AssociationController';
function AssociationForm() {
    const associationController = new AssociationController();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [allEntities, setAllEntities] = useState([]);
    const [selectedEntities, setSelectedEntities] = useState([]);
    const [form, setForm] = useState({
        id: null,
        name: ""
    });

    useEffect(() => {
        const loadData = async () => {
            const entityController = new EntityController();
            const response = await entityController.getAllEntities();
            setAllEntities(response.entities);

            if (location.state?.association) {
                const { association } = location.state;
                setForm({
                    id: association.id,
                    name: association.name
                });
                setSelectedEntities(association.entities || []);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const associationData = {
                id: Number(id),
                name: form.name,
            };
            await associationController.updateAssociation(associationData);
            navigate('/WriterView');
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar la asociación");
        }
    };

    const goBack = () => {
        navigate('/WriterView');
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>

            <a className="element-item" onClick={goBack}>INICIO</a>

            <div className="form-container">
                <h2 className="element-title">
                    {form.id ? 'EDITAR ASOCIACIÓN' : 'CREAR ASOCIACIÓN'}
                </h2>

                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre de la asociación"
                />
                <label>Url</label>
                <input
                    type="text"
                    name="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="Url de la asociación"
                />

                <div className="entities-selector">
                    <label>Entidades involucradas
                        <input name="entitiesInvolved" placeholder="Entidades involucradas" value={form.entitiesInvolved} onChange={handleChange} />
                    </label>
                </div>

                <div className="button-container">
                    <button className="button" onClick={handleSubmit}>
                        {form.id ? 'Actualizar' : 'Crear'}
                    </button>
                    <button className="button" onClick={goBack}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AssociationForm;
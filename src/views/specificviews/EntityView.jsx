import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import EntityController from "../../controllers/EntityController";
import UserController from "../../controllers/UserController";

function EntityView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entity, setEntity] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const userController = new UserController();

    useEffect(() => {
        const loadEntity = async () => {
            const current = await userController.getCurrentUser();
            setCurrentUser(current);
            const controller = new EntityController();
            const data = await controller.getEntity(parseInt(id));
            setEntity(data.entity);
        };
        loadEntity();
    }, [id]);

    const isWriter = currentUser?.scopes?.includes("writer");

    const goHome = () => {
        const scopes = currentUser?.scopes ?? [];
        if (scopes.includes("reader")) navigate("/ReaderView");
        else if (scopes.includes("writer")) navigate("/WriterView");
        else navigate("/");
    };

    if (!entity) return <p>Cargando entidad...</p>;

    return (
        <div className="container">
            <a className="element-item" onClick={goHome}>INICIO</a>

            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>

            <h2 className="element-title">{entity.name}</h2>
            <p className="element-title">{entity.birthDate}</p>
            {entity.death && (
                <p className="element-title">{entity.deathDate}</p>
            )}

            <div className="view-container">
                <img src={entity.imageUrl} alt={entity.name} className="element-img" />
                <iframe
                    src={entity.wikiUrl}
                    title="Wikipedia"
                    width="600"
                    height="400"
                />
            </div>
            <div className="people-container">
            </div>
            {isWriter && (
                <button
                    className="button"
                    onClick={() => navigate(`/forms/EntityForm/${id}`, {
                        state: {
                            entity: {
                                id: entity.id,
                                name: entity.name,
                                birthDate: entity.birthDate,
                                deathDate: entity.deathDate,
                                wikiUrl: entity.wikiUrl,
                                imageUrl: entity.imageUrl
                            }
                        }
                    })}
                >
                    Editar entidad
                </button>
            )}
        </div>
    );
}

export default EntityView;
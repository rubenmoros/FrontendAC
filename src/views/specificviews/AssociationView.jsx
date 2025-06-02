import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AssociationController from "../../controllers/AssociationController";
import UserController from "../../controllers/UserController";

function AssociationView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [association, setAssociation] = useState(null);
    const [entities, setEntities] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const userController = new UserController();

    useEffect(() => {
        const loadAssociation = async () => {
            const current = await userController.getCurrentUser();
            setCurrentUser(current);
            const controller = new AssociationController();
            const data = await controller.getAssociation(parseInt(id));
            setAssociation(data.association);

            const entitiesData = await controller.getEntitiesByAssociationId(parseInt(id));
            setEntities(entitiesData.entities);
        };
        loadAssociation();
    }, [id]);

    const isWriter = currentUser?.scopes?.includes("writer");

    const goHome = () => {
        const scopes = currentUser?.scopes ?? [];
        if (scopes.includes("reader")) navigate("/ReaderView");
        else if (scopes.includes("writer")) navigate("/WriterView");
        else navigate("/");
    };

    if (!association) return <p>Cargando asociación...</p>;

    return (
        <div className="container">
            <a className="element-item" onClick={goHome}>INICIO</a>

            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>

            <h2 className="element-title">{association.name}</h2>
            <h2 className="element-title">{association.url}</h2>

            <div className="entities-container">
                <h3>Entidades en esta asociación:</h3>
                <div className="element-list">
                    {entities.map((entity) => (
                        <div className="element" key={entity.id}>
                            <h4 className="element-item" 
                                onClick={() => navigate(`/EntityView/${entity.id}`)}>
                                {entity.name}
                            </h4>
                            <img 
                                className="element-img" 
                                src={entity.imageUrl} 
                                alt={entity.name} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {isWriter && (
                <button
                    className="button"
                    onClick={() => navigate(`/forms/AssociationForm/${id}`, {
                        state: {
                            association: {
                                id: association.id,
                                name: association.name,
                                entities: entities.map(e => e.id)
                            }
                        }
                    })}
                >
                    Editar asociación
                </button>
            )}
        </div>
    );
}

export default AssociationView;
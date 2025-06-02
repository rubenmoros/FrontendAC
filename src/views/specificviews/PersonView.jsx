import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import PersonController from "../../controllers/PersonController";
import UserController from "../../controllers/UserController";

function PersonView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [products, setProducts] = useState([]); // Add this
    const [entities, setEntities] = useState([]); // Add this
    const [currentUser, setCurrentUser] = useState(null);
    const userController = new UserController();

    useEffect(() => {
        const loadPerson = async () => {
            try {
                const current = await userController.getCurrentUser();
                setCurrentUser(current);
                const controller = new PersonController();
                const data = await controller.getPerson(parseInt(id));
                setPerson(data.person);

                const productsData = await controller.getProductsByPersonId(parseInt(id));
                setProducts(productsData.products.map(p => p.product));

                const entitiesData = await controller.getEntitiesByPersonId(parseInt(id));
                setEntities(entitiesData.entities.map(e => e.entity));
            } catch (error) {
                console.error("Error loading person data:", error);
            }
        };
        loadPerson();
    }, [id]);

    const isWriter = currentUser?.scopes?.includes("writer");

    const goHome = () => {
        const scopes = currentUser?.scopes ?? [];
        if (scopes.includes("reader")) navigate("/ReaderView");
        else if (scopes.includes("writer")) navigate("/WriterView");
        else navigate("/");
    };

    if (!person) return <p>Cargando persona...</p>;

    return (
        <div className="container">
            <a className="element-item" onClick={goHome}>INICIO</a>
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <h2 className="element-title">{person.name}</h2>
            <p className="element-title">{person.birthDate}</p>
            {person.death && (
                <p className="element-title">{person.deathDate}</p>
            )}
            <div className="view-container">
                <img src={person.imageUrl} alt={person.name} className="element-img" />
                <iframe
                    src={person.wikiUrl}
                    title="Wikipedia"
                    width="600"
                    height="400"
                />
            </div>
            <h3>Productos de Persona:</h3>
            <div className="element-list">
                {products.map((product) => (
                    <div className="element" key={product.id}>
                        <h4 className="element-item"
                            onClick={() => navigate(`/ProductView/${person.id}`)}>
                            {product.name}
                        </h4>
                        <img
                            className="element-img"
                            src={product.imageUrl}
                            alt={product.name}
                        />
                    </div>
                ))}
            </div>
            <h3>Entidades de Persona:</h3>
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
            {isWriter && (
                <button
                    className="button"
                    onClick={() => navigate(`/forms/PersonForm/${id}`, {
                        state: {
                            person: {
                                id: person.id,
                                name: person.name,
                                birthDate: person.birthDate,
                                deathDate: person.deathDate,
                                wikiUrl: person.wikiUrl,
                                imageUrl: person.imageUrl,
                                productsInvolved: person.productsInvolved || [],
                                entitiesInvolved: person.entitiesInvolved || []
                            }
                        }
                    })}
                >
                    Editar persona
                </button>
            )}
        </div>
    );
}

export default PersonView;
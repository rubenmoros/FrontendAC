import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ProductController from "../../controllers/ProductController";
import UserController from "../../controllers/UserController";

function ProductView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [people, setPeople] = useState([]); 
    const [entities, setEntities] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null);
    const userController = new UserController();

    useEffect(() => {
        const loadProduct = async () => {

            const current = await userController.getCurrentUser();
            setCurrentUser(current);
            const controller = new ProductController();
            const data = await controller.getProduct(parseInt(id));
            setProduct(data.product);

            const peopleData = await controller.getPersonsByProductId(parseInt(id));
            setPeople(peopleData.persons.map(p => p.person));

            const entitiesData = await controller.getEntitiesByProductId(parseInt(id));
            setEntities(entitiesData.entities.map(e => e.entity));

        };
        loadProduct();
    }, [id]);

    const isWriter = currentUser?.scopes?.includes("writer");

    const goHome = () => {
        const scopes = currentUser?.scopes;
        if (scopes.includes("reader")) navigate("/ReaderView");
        else if (scopes.includes("writer")) navigate("/WriterView");
        else navigate("/");
    };

    if (!product) return <p>Cargando producto...</p>;

    return (
        <div className="container">
            <a className="element-item" onClick={goHome}>INICIO</a>
            <header className="header">
            <h1>Anales de la Ciencia</h1>
            </header>
            <h2 className="element-title">{product.name}</h2>
            <p className="element-title">{product.birth}</p>
            {product.death && (
                <p className="element-title">{product.death}</p>
            )}
            <div className="view-container">
                <img src={product.imageUrl} alt={product.name} className="element-img" />
                <iframe
                    src={product.wikiUrl}
                    title="Wikipedia"
                    width="600"
                    height="400"
                />
            </div>
            <h3>Personas en Producto:</h3>
            <div className="element-list">
                {people.map((person) => (
                    <div className="element" key={person.id}>
                        <h4 className="element-item"
                            onClick={() => navigate(`/PersonView/${person.id}`)}>
                            {person.name}
                        </h4>
                        <img
                            className="element-img"
                            src={person.imageUrl}
                            alt={person.name}
                        />
                    </div>
                ))}
            </div>
            <h3>Entidades en Producto:</h3>
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
                    onClick={() => navigate(`/forms/ProductForm/${id}`, {
                        state: {
                            product: {
                                id: product.id,
                                name: product.name,
                                birthDate: product.birthDate,
                                deathDate: product.deathDate,
                                wikiUrl: product.wikiUrl,
                                imageUrl: product.imageUrl,
                                peopleInvolved: product.peopleInvolved || [],
                                entitiesInvolved: product.entitiesInvolved || []
                            }
                        }
                    })}
                >
                    Editar producto
                </button>
            )}
        </div>
    );
}

export default ProductView;
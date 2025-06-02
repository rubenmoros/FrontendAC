import React, { useState, useEffect } from "react";
import ProductController from "../../controllers/ProductController";
import EntityController from "../../controllers/EntityController";
import PersonController from "../../controllers/PersonController";
import UserController from "../../controllers/UserController";
import AssociationController from "../../controllers/AssociationController";
import { useNavigate } from "react-router-dom";
import "../../styles/globalCSS.css";

function PublicView() {
    const [products, setProducts] = useState([]);
    const [entities, setEntities] = useState([]);
    const [people, setPeople] = useState([]);
    const [associations, setAssociations] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const productController = new ProductController();
    const entityController = new EntityController();
    const personController = new PersonController();
    const userController = new UserController();
    const associationController = new AssociationController();

    useEffect(() => {
        const loadData = async () => {
            const readProducts = await productController.getAllProducts();
            const readEntities = await entityController.getAllEntities();
            const readPeople = await personController.getAllPeople();
            const readAssociations = await associationController.getAllAssociations();
            setProducts(readProducts.products.map(p => p.product));
            setEntities(readEntities.entities.map(e => e.entity));
            setPeople(readPeople.persons.map(p => p.person));
            setAssociations(readAssociations.associations.map(a => a.association));
            
        };
        loadData();
    }, []);

    const login = async (username, password) => {
        const userLog = await userController.login(username, password);
        if (!userLog) {
            alert("Usuario no encontrado");
            return;
        }

        setUser(userLog);

        if (userLog.scopes.includes("writer")) {
            navigate("/WriterView");
        } else if (userLog.scopes.includes("reader")) {
            navigate("/ReaderView");
        }
    };

    const register = async (username, password) => {
        const email = username + "@example.com";
        navigate("forms/UserForm", { state: {                 
            initialData: {
                    username: username,
                    password: password,
                    email: email
                } 
            }
        });
    }

    return (
        <div className="container">
            <header>
                <h1 className="header">Anales de la ciencia</h1>
            </header>
            <div className="login-container">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="button" onClick={() => login(username, password)}>Login</button>
            </div>
            <div className="register-container">
                <input
                    type="text"
                    placeholder="Usuario"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Contraseña"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button className="button" onClick={() => register(registerUsername, registerPassword)}>Registrarse</button>
            </div>
            <div className="element-list">
                <section className="products">
                    {products.map((product) => (
                        <div className="element" key={`product-${product.id}`}>
                            <h3 className="element-item">{product.name}</h3>
                            <img className="element-img" src={product.imageUrl} alt={product.name} />
                        </div>
                    ))}
                </section>

                <section className="people">
                    {people.map((person) => (
                        <div className="element" key={`person-${person.id}`}>
                            <h3 className="element-item">{person.name}</h3>
                            <img className="element-img" src={person.imageUrl} alt={person.name} />
                        </div>
                    ))}
                </section>

                <section className="entities">
                    {entities.map((entity) => (
                        <div className="element" key={`entity-${entity.id}`}>
                            <h3 className="element-item">{entity.name}</h3>
                            <img className="element-img" src={entity.imageUrl} alt={entity.name} />
                        </div>
                    ))}
                </section>

                <section className="associations">
                    <h2>Asociaciones</h2>
                    {associations.map(association => (
                        <div className="element" key={`association-${association.id}`}>
                            <h3 className="element-item"> {association.name} </h3>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default PublicView;
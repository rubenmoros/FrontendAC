import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Reader from "../../users/Reader";
import UserController from "../../controllers/UserController";
import "../../styles/globalCSS.css";

function ReaderView() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [people, setPeople] = useState([]);
    const [associations, setAssociations] = useState([]);
    const [entities, setEntities] = useState([]);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const userController = new UserController();

    useEffect(() => {
        const loadData = async () => {
            const loadedReader = await userController.getCurrentUser();
            setUser(loadedReader);
            const data = await userController.readIndex();
            setProducts(data.products.map(p => p.product));
            setPeople(data.people.map(p => p.person));
            setEntities(data.entities.map(e => e.entity));
            setAssociations(data.associations.map(a => a.association));
        };
        loadData();
    }, []);

    const login = async (username, password) => {
        try {
            const userLog = await userController.login(username, password);
            if (!userLog) {
                alert("Usuario no encontrado");
                return;
            }

            if (userLog.scopes.includes("writer")) {
                navigate("/WriterView");
            } else if (userLog.scopes.includes("reader")) {
                const data = await userController.readIndex();
                setProducts(data.products.map(p => p.product));
                setPeople(data.people.map(p => p.person));
                setEntities(data.entities.map(e => e.entity));
                setAssociations(data.associations.map(a => a.association));
                setUser(userLog);
            }
            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Error en login:", error);
            alert("Error al iniciar sesión");
        }
    };

    const profile = () => {
        navigate("/forms/Profile", {
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

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la ciencia</h1>
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
                <button className="button"
                    onClick={() => login(username, password)}>Cambiar Usuario
                </button>
            </div>
            <div>
                <button className="button"
                    onClick={profile}
                    disabled={!user}
                >
                    Editar Perfil
                </button>
            </div>
            <div className="element-list">
                <section className="products">
                    {products.map((product) => (
                        <div className="element" key={product.id}>
                            <h3 className="element-item" onClick={() => navigate(`/ProductView/${product.id}`)}>{product.name}</h3>
                            <img className="element-img" src={product.imageUrl} />
                        </div>
                    ))}
                </section>

                <section className="people">
                    {people.map((person) => (
                        <div className="element" key={person.id}>
                            <h3 className="element-item" onClick={() => navigate(`/PersonView/${person.id}`)}>{person.name}</h3>
                            <img className="element-img" src={person.imageUrl} />
                        </div>
                    ))}
                </section>

                <section className="entities">
                    {entities.map((entity) => (
                        <div className="element" key={entity.id}>
                            <h3 className="element-item" onClick={() => navigate(`/EntityView/${entity.id}`)}>{entity.name}</h3>
                            <img className="element-img" src={entity.imageUrl} />
                        </div>
                    ))}
                </section>

                <section className="associations">
                    <h2>Asociaciones</h2>
                    {associations.map((association) => (
                        <div className="element" key={association.id}>
                            <h3 className="element-item" onClick={() => navigate(`/AssociationView/${association.id}`)}>{association.name}</h3>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
}

export default ReaderView;
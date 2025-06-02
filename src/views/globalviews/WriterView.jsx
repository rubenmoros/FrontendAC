import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Writer from "../../users/Writer";
import "../../styles/globalCSS.css";
import UserController from "../../controllers/UserController";

function WriterView() {
    const [writer, setWriter] = useState(null);
    const [products, setProducts] = useState([]);
    const [people, setPeople] = useState([]);
    const [entities, setEntities] = useState([]);
    const [associations, setAssociations] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const userController = new UserController();
    const writerExecuter = new Writer();

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadedUser = await userController.getCurrentUser();
                setWriter(loadedUser);
                const data = await userController.readIndex();
                setProducts(data.products.map(p => p.product));
                setPeople(data.people.map(p => p.person));
                setEntities(data.entities.map(e => e.entity));
                setAssociations(data.associations.map(a => a.association));
                setUsers(data.users.map(u => u.user));
            } catch (error) {
                console.error("Error loading data:", error);
                navigate("/");
            }
        };
        loadData();
    }, [navigate]);

    const logout = async () => {
        localStorage.removeItem('token');
        navigate("/");
    }

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

    const handleCreateProduct = async () => {
        await writerExecuter.createProduct(navigate);
    };

    const handleCreatePerson = async () => {
        await writerExecuter.createPerson(navigate);
    };

    const handleCreateEntity = async () => {
        await writerExecuter.createEntity(navigate);
    };

    const handleCreateUser = async () => {
        await writerExecuter.createUser(navigate);
    };

    const handleCreateAssociation = async () => {
        await writerExecuter.createAssociation(navigate);
    };

    const handleDeleteAssociation = async (id) => {
        await writerExecuter.deleteAssociation(id);
        setAssociations(associations.filter(association => association.id !== id));
    };

    const handleDeleteProduct = async (id) => {
        await writerExecuter.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
    };

    const handleDeletePerson = async (id) => {
        await writerExecuter.deletePerson(id);
        setPeople(people.filter(person => person.id !== id));
    };

    const handleDeleteEntity = async (id) => {
        await writerExecuter.deleteEntity(id);
        setEntities(entities.filter(entity => entity.id !== id));
    }

    const handleEditUser = async (user) => {
        await writerExecuter.editUser(user, navigate);
    };

    const handleDeleteUser = async (id) => {
        await writerExecuter.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="container">
            <header>
                <h1 className="header">Anales de la ciencia</h1>
            </header>
            <div className="login-container">
                <button className="button" onClick={() => logout()}>Logout</button>
            </div>
            <button className="button"
                onClick={() => login(username, password)}>Cambiar Usuario
            </button>
            <div className="element-list">
                <section className="products">
                    {products.map((product) => (
                        <div className="element" key={product.id}>
                            <h3 className="element-item" onClick={() => navigate(`/ProductView/${product.id}`)}>{product.name}</h3>
                            <img className="element-img" src={product.imageUrl} />
                            <button className="button" onClick={() => handleDeleteProduct(product.id)}>delete</button>
                        </div>
                    ))}
                    <button className="button" onClick={handleCreateProduct}>create</button>
                </section>

                <section className="people">
                    {people.map((person) => (
                        <div className="element" key={person.id}>
                            <h3 className="element-item" onClick={() => navigate(`/PersonView/${person.id}`)}>{person.name}</h3>
                            <img className="element-img" src={person.imageUrl} />
                            <button className="button" onClick={() => handleDeletePerson(person.id)}>delete</button>
                        </div>
                    ))}
                    <button className="button" onClick={handleCreatePerson}>create</button>
                </section>

                <section className="entities">
                    {entities.map((entity) => (
                        <div className="element" key={entity.id}>
                            <h3 className="element-item" onClick={() => navigate(`/EntityView/${entity.id}`)}>{entity.name}</h3>
                            <img className="element-img" src={entity.imageUrl} />
                            <button className="button" onClick={() => handleDeleteEntity(entity.id)}>delete</button>
                        </div>
                    ))}
                    <button className="button" onClick={handleCreateEntity}>create</button>
                </section>

                <section className="users">
                    {users.map((user) => (
                        <div className="element" key={user.id}>
                            <h3 className="element-item">{user.username}</h3>
                            <button className="button" onClick={() => handleDeleteUser(user.id)}>delete</button>
                            <button className="button" onClick={() => handleEditUser(user)}>edit</button>
                        </div>
                    ))}
                    <button className="button" onClick={handleCreateUser}>create</button>
                </section>

                <section className="associations">
                    {associations.map((association) => (
                        <div className="element" key={association.id}>
                            <h3 className="element-item" onClick={() => navigate(`/AssociationView/${association.id}`)}>{association.name}</h3>
                            <button className="button" onClick={() => handleDeleteAssociation(association.id)}>delete</button>
                        </div>
                    ))}
                    <button className="button" onClick={handleCreateAssociation}>create</button>
                </section>

            </div>
        </div>
    );
}

export default WriterView;
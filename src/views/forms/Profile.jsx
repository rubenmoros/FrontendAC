import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';

function Profile() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({});
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const userController = new UserController();
    const initialData = location.state?.initialData || {
        username: "",
        email: "",
        role: "inactive"
    };

    const [form, setForm] = useState({
        username: initialData.username,
        email: initialData.email,
        role: initialData.role
    });

    useEffect(() => {
        const loadUser = async () => {
            const userData = await userController.getCurrentUser();
            if (!userData) {
                console.error("Missing required data:", { id, state: location.state });
                navigate('/WriterView');
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        const loadCurrentUser = async () => {
            const currentUser = await userController.getCurrentUser();
            if (currentUser){
                setCurrentUser(currentUser);
                setUserRole(currentUser.role);
            } 
        };
        loadCurrentUser();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const goHome = () => {
        if (userRole === "writer") {
            navigate('/WriterView');
        } else if (userRole === "reader") {
            navigate('/ReaderView');
        } else {
            navigate('/'); // O a donde quieras para otros roles
        }
    };

    const handleSubmit = async () => {
        await userController.updateUser(form);
        goHome();
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>

            <div className="form-container">
                <h2 className="element-title">PERFIL DEL USUARIO</h2>
                <label>Nombre de Usuario</label>
                <input
                    name="username"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}

                />
                <p></p>

                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <p></p>
                <label>Rol del Usuario: {userRole} </label>
                <p></p>

                <button className="button" onClick={handleSubmit}>Guardar Usuario</button>
            </div>
        </div>
    );
}

export default Profile;
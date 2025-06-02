import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import UserController from '../../controllers/UserController';

function UserWriterForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const userController = new UserController();
    const initialData = location.state?.initialData || {
        username: "",
        email: "",
        role: "inactive"
    };

    const [form, setForm] = useState({
        id: Number(id),
        username: initialData.username,
        email: initialData.email,
        role: initialData.role
    });

    useEffect(() => {
        const loadUser = async () => {
            const userData = await userController.getUser(Number(id));
            if (!userData) {
                console.error("Missing required data:", { id, state: location.state });
                navigate('/WriterView');
            }
        };
        loadUser();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await userController.updateUser(form);
        navigate('/WriterView');
    };

    const goHome = () => {
        navigate('/WriterView');
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>

            <div className="form-container">
                <h2 className="element-title">PANEL DE EDICIÓN DEL USUARIO</h2>

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
                <label>Rol</label>
                <select
                    name="role" value={form.role}
                    onChange={handleChange}>
                    <option value="inactive">Inactivo</option>
                    <option value="reader">Lector</option>
                    <option value="writer">Escritor</option>
                </select>
                <p></p>

                <button className="button" onClick={handleSubmit}>Guardar Usuario</button>
            </div>
        </div>
    );
}

export default UserWriterForm;
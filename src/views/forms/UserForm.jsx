import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserController from '../../controllers/UserController';

function UserWriterForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialData = location.state?.initialData || {
        username: "",
        password: "",
        email: ""
    };

    const [form, setForm] = useState({
        username: initialData.username,
        password: initialData.password,
        email: initialData.email,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const userController = new UserController();
            await userController.register(form.username, form.password, form.email);
            navigate("/");
        } catch (error) {
            console.error("Error en registro:", error);
            alert(error.message || "Error al registrar usuario");
        }
    };

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Anales de la Ciencia</h1>
            </header>
            <a className="element-item" onClick={goHome}>INICIO</a>

            <div className="form-container">
                <h2 className="element-title">REGISTRO DE USUARIO</h2>

                <label>Nombre de Usuario</label>
                <input
                    name="username"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}

                />
                <p></p>

                <label>Contraseña</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
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

                <button className="button" onClick={handleSubmit}>Completar Registro</button>
            </div>
        </div>
    );
}

export default UserWriterForm;
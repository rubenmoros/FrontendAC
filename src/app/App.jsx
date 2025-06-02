import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReaderView from "../views/globalviews/ReaderView.jsx";
import WriterView from "../views/globalviews/WriterView.jsx";
import PublicView from "../views/globalviews/PublicView.jsx";
import ProductView from "../views/specificviews/ProductView.jsx";
import PersonView from "../views/specificviews/PersonView.jsx";
import EntityView from "../views/specificviews/EntityView.jsx";
import AssociationView from "../views/specificviews/AssociationView.jsx";
import ProductForm from "../views/forms/ProductForm.jsx";
import PersonForm from "../views/forms/PersonForm.jsx";
import EntityForm from "../views/forms/EntityForm.jsx";
import UserForm from "../views/forms/UserForm.jsx";
import UserWriterForm from "../views/forms/UserWriterForm.jsx";
import AssociationForm from "../views/forms/AssociationForm.jsx";
import Profile from "../views/forms/Profile.jsx";
import AJAXService from '../ajax/AJAXService';


const App = () => {
    useEffect(() => {
        AJAXService.initialize();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PublicView />} />
                <Route path="/ReaderView" element={<ReaderView />} />
                <Route path="/WriterView" element={<WriterView />} />
                <Route path="/ProductView/:id" element={<ProductView />} />
                <Route path="/PersonView/:id" element={<PersonView />} />
                <Route path="/EntityView/:id" element={<EntityView />} />
                <Route path="/AssociationView/:id" element={<AssociationView />} />
                <Route path="/forms/ProductForm/:id" element={<ProductForm />} />
                <Route path="/forms/PersonForm/:id" element={<PersonForm />} />
                <Route path="/forms/EntityForm/:id" element={<EntityForm />} />
                <Route path="/forms/AssociationForm/:id" element={<AssociationForm />} />
                <Route path="/forms/UserWriterForm/:id" element={<UserWriterForm />} />
                <Route path="/forms/UserForm" element={<UserForm />} />
                <Route path="/forms/Profile/" element={<Profile />} />
            </Routes>
            <footer className="footer">
                <p>© 2025 Anales de la ciencia</p>
                <p>Desarrollado por Rubén Moros</p>
            </footer>
        </BrowserRouter>
    );
};

export default App;
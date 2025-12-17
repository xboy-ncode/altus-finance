"use client"

import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Página no encontrada</h2>
                <p>Lo sentimos, la página que estás buscando no existe.</p>
                <Link to="/" className="btn btn-primary">Volver al inicio</Link>
            </div>
        </div>
    );
};

export default NotFound;
import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoute = () => {

    const isAuthenticated = JSON.parse(sessionStorage.getItem("user"));

    return (
        <>
            {isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />}
        </>
    )
}

export default ProtectedRoute
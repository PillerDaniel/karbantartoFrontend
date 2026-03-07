import React from 'react';

import { useAuth } from '../context/AuthContext';

import { Navigate } from 'react-router-dom';

import spinner from '../assets/spinner.svg';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#9db2bf]">
                <img src={spinner} alt="Loading..." className="w-12 h-12" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
};

export default ProtectedRoute;

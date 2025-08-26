import React from 'react';
import { Navigate } from 'react-router-dom';
import {isAuthenticated} from "@/services/login.ts";


interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
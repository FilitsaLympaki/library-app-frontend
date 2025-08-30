import './App.css';
//import Footer from "./components/Footer.tsx";
//import NavBar from "./components/NavBar.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import BooksPage from "@/pages/BooksPage.tsx";
import CreateBookPage from "@/pages/CreateBookPage.tsx";

import EditBookPage from "@/pages/EditBookPage.tsx";
import {ProtectedRoute} from "@/protectedRoute.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/signup" element={<RegisterPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/books" element={<ProtectedRoute><BooksPage/></ProtectedRoute>}/>
                <Route path="/books/:id" element={<ProtectedRoute> <EditBookPage/> </ProtectedRoute>}/>
                <Route path="/create/book" element={<ProtectedRoute> <CreateBookPage/> </ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

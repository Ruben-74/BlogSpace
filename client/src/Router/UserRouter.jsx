import { Routes, Route } from "react-router-dom";

import Header from "../Components/Partials/Header";
import Home from "../Components/Home";
import PostDetail from "../Components/PostDetail";
import Login from "../Components/auth/Login";
import Register from "../Components/auth/Register";
import Dashboard from "../Components/Dashboard";
import ProtectedRoute from "../HOC/ProtectedRoute";
import Footer from "../Components/Partials/Footer";
import PrivacyPolicy from "../Components/PrivacyPolicy";
import TermsOfUse from "../Components/TermsOfUse";
import Contact from "../Components/Contact";
import NotFound404 from "../Components/Notfound404";

function UserRouter() {
  return (
    <>
      <Header />
      <Routes>
        {/* User */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />

        {/* Authentification */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        <Route
          path="dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfUse />} />
        <Route path="contact" element={<Contact />} />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      <Footer />
    </>
  );
}

export default UserRouter;
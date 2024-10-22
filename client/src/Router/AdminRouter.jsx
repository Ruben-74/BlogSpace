import { Routes, Route } from "react-router-dom";
import Header from "../Components/admin/Partials/Header";
import User from "../Components/admin/User/User";
import Category from "../Components/admin/Category/Category";
import Comment from "../Components/admin/Comment/Comment";
import Post from "../Components/admin/Post/Post";
import PanelAdmin from "../Components/admin/PanelAdmin";
import Footer from "../Components/Partials/Footer";
import Contact from "../Components/admin/Contact/Contact";
import ProtectedRoute from "../HOC/ProtectedRoute";
import Dashboard from "../Components/Dashboard";

function AdminRouter() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<PanelAdmin />} />
        <Route path="/user" element={<User />} />
        <Route path="/category" element={<Category />} />
        <Route path="/post" element={<Post />} />
        <Route path="/comment" element={<Comment />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
      <Footer />
    </>
  );
}

export default AdminRouter;

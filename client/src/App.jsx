import { Routes, Route } from "react-router-dom";
import Header from "./Components/Partials/Header";
import Footer from "./Components/Partials/Footer";
import Home from "./Components/Home";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import PostDetail from "./Components/PostDetail";
import Dashboard from "./Components/admin/Dashboard";
import List from "./Components/admin/post/List";
import Create from "./Components/admin/post/Create";
import Update from "./Components/admin/post/Update";

function App() {
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

        {/* admin */}
        <Route path="/admin/" element={<Dashboard />} />
        <Route path="/admin/list" element={<List />} />
        <Route path="/admin/create" element={<Create />} />
        <Route path="/admin/update" element={<Update />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

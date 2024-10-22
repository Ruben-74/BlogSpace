import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Partials/Card";
import SearchBar from "./Partials/SearchBar";

function Home() {
  useCloseMenu();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Indiquer que le chargement commence
      try {
        const response = await fetch("http://localhost:9000/api/v1/post/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des posts. Code: ${response.status}`
          );
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Erreur de récupération:", error);
        setError("Une erreur est survenue lors de la récupération des posts.");
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="posts-container">
      <SearchBar
        setPosts={setPosts}
        setLoading={setLoading}
        setError={setError}
      />
      {loading && <p className="loading-message">Chargement...</p>}
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0
        ? posts.map((post) => <Card key={post.id} post={post} />)
        : !loading && <p>Aucun post disponible.</p>}
    </section>
  );
}

export default Home;

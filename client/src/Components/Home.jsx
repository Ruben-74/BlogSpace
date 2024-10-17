import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Partials/Card";

function Home() {
  useCloseMenu();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    document.title = "Tous les postes";
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/v1/post/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Une erreur est survenue lors de la récupération des posts.");
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="posts-container">
      <h2 className="posts-title">Tous les Posts</h2>
      {loading && <p className="loading-message">Chargement...</p>}
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0
        ? posts.map((post) => <Card key={post.id} post={post} />)
        : !loading && <p>Aucun post disponible.</p>}
    </section>
  );
}

export default Home;

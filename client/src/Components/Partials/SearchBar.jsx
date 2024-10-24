import React, { useState, useEffect } from "react";

const SearchBar = ({ setPosts, setLoading, setError }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query) {
        setLoading(true);
        setError(""); // Réinitialiser les erreurs avant une recherche
        fetchPosts(query);
      } else {
        // Si la query est vide, récupérer tous les posts
        fetchAllPosts();
      }
    }, 300); // Délais de debouncing

    return () => {
      clearTimeout(handler); // Nettoie le timeout
    };
  }, [query, setLoading, setError]);

  const fetchPosts = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/search/${query}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche des posts.");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true); // Démarre le chargement
    setError(""); // Réinitialiser les erreurs
    try {
      const response = await fetch("http://localhost:9000/api/v1/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des posts.");
      }

      const data = await response.json();
      setPosts(data); // Met à jour tous les posts
    } catch (error) {
      console.error("Erreur de récupération:", error);
      setError(error.message); // Mettez à jour l'erreur ici
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-bar">
      <input
        type="text"
        placeholder="Rechercher des articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" disabled={!query}>
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;

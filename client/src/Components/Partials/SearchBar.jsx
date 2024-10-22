import React, { useState, useEffect, useContext } from "react";
import { PostContext } from "../../store/post/PostContext";

const SearchBar = ({ setLoading }) => {
  const [query, setQuery] = useState("");
  const { listPost } = useContext(PostContext); // On utilise listPost pour mettre à jour les posts

  // Fonction pour effectuer la recherche
  const fetchPosts = async (searchQuery) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/search?title=${searchQuery}`, // Vérifiez la requête ici
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche des posts.");
      }

      const data = await response.json();
      console.log("Résultats des posts:", data);
      listPost(data); // Met à jour les posts via listPost
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Utilisation d'un useEffect pour rafraîchir la recherche au changement de la query
  useEffect(() => {
    if (query) {
      fetchPosts(query); // Appel direct de la fonction de recherche
    } else {
      listPost([]); // Réinitialisation des posts si la query est vide
    }
  }, [query, listPost]); // Dépendance sur query et listPost

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-bar">
      <input
        type="text"
        placeholder="Rechercher des articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Rechercher</button>
    </form>
  );
};

export default SearchBar;

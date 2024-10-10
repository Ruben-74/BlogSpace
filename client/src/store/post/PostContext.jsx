import React, { createContext, useState } from "react";

// Création du context
const PostContext = createContext();

// Fournisseur de context
const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // Fonction pour lister les posts
  const listPost = (data) => {
    setPosts(data);
  };

  // Fonction pour créer un post
  const createPost = async (postData) => {
    try {
      const postResponse = await fetch(
        "http://localhost:9000/api/v1/post/create",
        {
          method: "POST",
          body: postData, // FormData est déjà un objet
          credentials: "include",
        }
      );

      if (!postResponse.ok) {
        const errorMessage = await postResponse.text();
        throw new Error(errorMessage || "Erreur lors de la création du post");
      }

      const { postId } = await postResponse.json();
      // Vous pourriez vouloir récupérer l'image ou d'autres détails ici
      setPosts((prevPosts) => [...prevPosts, { ...postData, id: postId }]);
    } catch (error) {
      console.error("Erreur lors de la création du post:", error.message);
    }
  };

  // Fonction pour mettre à jour un post
  const updatePost = async (postData) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/update/${postData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          errorMessage || "Erreur lors de la mise à jour du post"
        );
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post:", error.message);
    }
  };

  return (
    <PostContext.Provider value={{ posts, createPost, updatePost, listPost }}>
      {children}
    </PostContext.Provider>
  );
};

export { PostProvider, PostContext };

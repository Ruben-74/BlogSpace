import React, { useState, useEffect } from "react";
import useCloseMenu from "../Hook/useCloseMenu";
import Card from "./Card";

function Home() {
  useCloseMenu();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.title = "Tous les postes";
  }, [posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:9000/api/v1/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="posts-container">
      <h2 className="posts-title">Tous les Posts</h2>
      {posts.length ? (
        posts.map((post) => <Card key={post.id} post={post} />)
      ) : (
        <p className="loading-message">Chargement...</p>
      )}
    </section>
  );
}

export default Home;

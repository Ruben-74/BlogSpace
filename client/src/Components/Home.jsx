import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`http://localhost:9000/api/v1/posts/`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des posts");
        }
        const datas = await response.json();
        setPosts(datas);
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section className="posts-container">
      <h2 className="posts-title">Tous les Posts</h2>
      {posts.length ? (
        posts.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="post-image">
              <img src={`../../public/images/${post.url}`} alt={post.title} />
            </div>
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-description">{post.description}</p>
              <div className="post-categories">
                <span lassName="post-category">{post.label}</span>
              </div>
              <Link to={`/post/${post.id}`} className="read-more-button">
                Read More
              </Link>
            </div>
          </article>
        ))
      ) : (
        <p className="loading-message">Chargement...</p>
      )}
    </section>
  );
}

export default Home;

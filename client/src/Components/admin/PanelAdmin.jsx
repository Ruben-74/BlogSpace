import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import CircularProgressBar from "../../utils/circularProgressBar";

function PanelAdmin() {
  const [stats, setStats] = useState({
    totalUsers: 1000,
    activeUsers: 300,
    totalArticles: 500,
    publishedArticles: 300,
    totalCategories: 50,
    activeCategories: 40,
    totalComments: 200,
    approvedComments: 150,
  });

  const userPercentage = (stats.activeUsers / stats.totalUsers) * 100;
  const articlePercentage =
    (stats.publishedArticles / stats.totalArticles) * 100;
  const categoryPercentage =
    (stats.activeCategories / stats.totalCategories) * 100;
  const commentPercentage =
    (stats.approvedComments / stats.totalComments) * 100;

  useEffect(() => {
    // Simulez une récupération de données (fetch API dans un cas réel)
    // setStats({ ... });
  }, []);

  return (
    <>
      <section className="container">
        <h1>My dashboard</h1>
        <section>
          <h2>Statistiques</h2>
          <ul className="stats-list">
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(userPercentage)} />
              <span>Nombre d&apos;utilisateurs : {stats.totalUsers}</span>
            </li>
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(articlePercentage)} />
              <span>Nombre d&apos;articles : {stats.totalArticles}</span>
            </li>
            <li className="stats-item">
              <CircularProgressBar
                percentage={Math.round(categoryPercentage)}
              />
              <span>Nombre de catégories : {stats.totalCategories}</span>
            </li>
            <li className="stats-item">
              <CircularProgressBar percentage={Math.round(commentPercentage)} />
              <span>Nombre de commentaires : {stats.totalComments}</span>
            </li>
          </ul>
        </section>
      </section>
      <Outlet />
    </>
  );
}

export default PanelAdmin;

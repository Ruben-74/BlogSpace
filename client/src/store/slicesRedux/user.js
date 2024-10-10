import { createSlice } from "@reduxjs/toolkit";

// Initialisation des données reçues du back
const initialState = {
  username: "", // Add username
  email: "",
  password: "",
  avatar: "user.png",
  isLogged: false,
  msg: "",
  role: "user",
  authError: null,
  userId: null, // Ajout de userId
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      console.log(action.payload); // Vérifiez la charge utile de l'action
      state.username = action.payload.user.username;
      state.email = action.payload.user.email; // Récupération de l'email
      state.password = ""; // Réinitialisation du mot de passe
      state.isLogged = action.payload.isLogged; // État de connexion
      state.avatar = action.payload.user.avatar || "user.png"; // Récupération de l'avatar
      state.role = action.payload.user.role || "user"; // Récupération du rôle
      state.userId = action.payload.user.id || null; // Récupération de userId (assurez-vous que le bon chemin est utilisé)
      state.authError = null; // Réinitialisation des erreurs
    },
    loginFailed(state, action) {
      state.authError = action.payload.error;
    },
    logout(state) {
      // Réinitialisation de l'état lors de la déconnexion
      state.username = "";
      state.email = "";
      state.password = "";
      state.avatar = "user.png";
      state.role = "user";
      state.isLogged = false;
      state.userId = null; // Réinitialiser userId
    },
    setMsg(state, action) {
      state.msg = action.payload; // Définition du message
    },
    setAvatar(state, action) {
      state.avatar = action.payload; // Définition de l'avatar
    },
    updateField(state, action) {
      state.email = action.payload.email; // Mise à jour de l'email
      state.password = action.payload.password; // Mise à jour du mot de passe
      state.username = action.payload.username || state.username;
    },
  },
});

// Exportation des actions et du réducteur
export const { login, loginFailed, logout, setMsg, setAvatar, updateField } =
  userSlice.actions;
export default userSlice.reducer;

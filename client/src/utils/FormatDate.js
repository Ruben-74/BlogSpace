function FormatDate(dateString) {
  if (typeof dateString === "string") {
    // Convertir "2024-09-11 15:22:58" en "2024-09-11T15:22:58"
    const isoDateString = dateString.replace(" ", "T");
    return new Date(isoDateString);
  }
  // Retourner une date par défaut ou gérer le cas où dateString n'est pas valide
  return new Date();
}

export default FormatDate;

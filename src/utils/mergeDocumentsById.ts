interface Document {
  id: number;
  nom: string;
  type: string;
  url: string;
}

/**
 * Filtre et retourne les documents dont les ID sont dans la liste fournie.
 *
 * @param ids - Liste d'identifiants sélectionnés
 * @param allDocuments - Tous les documents disponibles
 * @param preserveOrder - Si vrai, conserve l'ordre des IDs (par défaut: false)
 */
function mergeDocumentsById(
  ids: number[],
  allDocuments: Document[],
  preserveOrder = false
): Document[] {
  if (preserveOrder) {
    return ids
      .map(id => allDocuments.find(doc => doc.id === id))
      .filter((doc): doc is Document => !!doc);
  } else {
    return allDocuments.filter(doc => ids.includes(doc.id));
  }
}
export default mergeDocumentsById;
/* ============================================================
   ATMOSPHERE.JS — Contrôleur des états d'humeur
   ============================================================
   Ce fichier gère les transitions visuelles de l'atmosphère.
   Il ne contient PAS de données de scénario — seulement
   la logique qui applique un mood à l'interface.

   MOODS DISPONIBLES :
   - 'calm'     → nuages beiges doux, fond gris-violet
   - 'tense'    → nuages rouge-sombre, fond sombre
   - 'critical' → nuages rouge vif, quasi-noir

   UTILISATION depuis engine.js :
     Atmosphere.setMood('tense');
   ============================================================ */

const Atmosphere = (() => {

  /* ----------------------------------------------------------
     État interne : mood actuellement affiché
  ---------------------------------------------------------- */
  let currentMood = 'calm';

  /* ----------------------------------------------------------
     Moods valides — protège contre les erreurs de frappe
  ---------------------------------------------------------- */
  const VALID_MOODS = ['calm', 'tense', 'critical'];


  /* ----------------------------------------------------------
     setMood(mood)
     Applique un nouvel état d'humeur à toute l'interface.

     - Retire la classe mood-* actuelle du <body>
     - Ajoute la nouvelle classe mood-*
     - Met à jour les textes des bulles de pensée
     - Mémorise l'état courant

     Les effets visuels (couleurs, positions des nuages) sont
     gérés entièrement par atmosphere.css via ces classes.
  ---------------------------------------------------------- */
  function setMood(mood) {

    /* Vérification de sécurité */
    if (!VALID_MOODS.includes(mood)) {
      console.warn(`[Atmosphere] Mood inconnu : "${mood}". Moods valides : ${VALID_MOODS.join(', ')}`);
      return;
    }

    /* Pas de changement si déjà dans ce mood */
    if (mood === currentMood) return;

    /* Transition : retirer l'ancienne classe, ajouter la nouvelle */
    document.body.classList.remove(`mood-${currentMood}`);
    document.body.classList.add(`mood-${mood}`);

    currentMood = mood;

    console.log(`[Atmosphere] Mood → ${mood}`);
  }


  /* ----------------------------------------------------------
     getMood()
     Retourne le mood actuellement actif.
  ---------------------------------------------------------- */
  function getMood() {
    return currentMood;
  }


  /* ----------------------------------------------------------
     init()
     Applique le mood de départ au chargement de la page.
     Doit être appelé une seule fois, au lancement.
  ---------------------------------------------------------- */
  function init(startMood = 'calm') {
    document.body.classList.add(`mood-${startMood}`);
    currentMood = startMood;
  }


  /* ----------------------------------------------------------
     API publique — seules ces fonctions sont accessibles
     depuis l'extérieur de ce module.
  ---------------------------------------------------------- */
  return { setMood, getMood, init };

})();

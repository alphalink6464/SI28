/* ============================================================
   ENGINE.JS — Moteur narratif
   ============================================================
   Ce fichier lit les données de scenario.js et pilote
   l'affichage : il est le chef d'orchestre du récit.

   RESPONSABILITÉS :
   - Charger et afficher une scène donnée
   - Gérer les choix du joueur
   - Déclencher les transitions d'atmosphère
   - Mémoriser le prénom du joueur
   - Garder un historique de navigation

   CE FICHIER NE CONTIENT PAS DE CONTENU NARRATIF.
   Tout le texte et les données viennent de scenario.js.
   ============================================================ */

const Engine = (() => {

  /* ----------------------------------------------------------
     État interne du moteur
  ---------------------------------------------------------- */
  let playerName   = 'vous';       // prénom saisi par le joueur
  let currentScene = null;         // scène actuellement affichée
  let history      = [];           // pile d'historique (pour un futur bouton "retour")


  /* ----------------------------------------------------------
     Références aux éléments DOM
     On les récupère une seule fois au init() pour éviter
     de les chercher dans le DOM à chaque mise à jour.
  ---------------------------------------------------------- */
  let DOM = {};

  function cacheDom() {
    DOM = {
      chapterLabel:  document.getElementById('chapter-label'),
      screenContent: document.getElementById('screen-content'),
      thoughtLeft:   document.getElementById('thought-left'),
      choicesArea:   document.getElementById('choices-area'),
    };
  }


  /* ==========================================================
     AFFICHAGE D'UNE SCÈNE
  ========================================================== */

  /* ----------------------------------------------------------
     goTo(sceneId)
     Point d'entrée principal : charge et affiche une scène.
  ---------------------------------------------------------- */
  function goTo(sceneId) {
    const scene = SCENARIO.scenes[sceneId];

    /* Sécurité : scène introuvable */
    if (!scene) {
      console.error(`[Engine] Scène introuvable : "${sceneId}"`);
      return;
    }

    /* Mémoriser pour l'historique */
    if (currentScene) history.push(currentScene.id);
    currentScene = scene;

    /* 1. Changer l'atmosphère */
    Atmosphere.setMood(scene.mood);

    /* 2. Mettre à jour le label de chapitre */
    if (DOM.chapterLabel) {
      DOM.chapterLabel.textContent = scene.chapter || '';
    }

    /* 3. Afficher l'écran du téléphone */
    renderScreen(scene.screen);

    /* 4. Afficher les bulles de pensée */
    renderThoughts(scene.thought);

    /* 5. Afficher les choix (ou avancer automatiquement) */
    renderChoices(scene);
  }


  /* ----------------------------------------------------------
     renderScreen(screenData)
     Génère le contenu de l'écran du téléphone selon
     le type de la scène (défini dans scenario.js).
  ---------------------------------------------------------- */
  function renderScreen(screen) {
    if (!DOM.screenContent || !screen) return;

    /* Vider le contenu précédent */
    DOM.screenContent.innerHTML = '';

    /* Choisir le bon rendu selon le type d'écran */
    switch (screen.type) {

      case 'boot':
        DOM.screenContent.innerHTML = buildBootScreen(screen);
        break;

      case 'fingerprint':
        DOM.screenContent.innerHTML = buildFingerprintScreen(screen);
        break;

      case 'notification':
        DOM.screenContent.innerHTML = buildNotificationScreen(screen);
        break;

      case 'message_thread':
        DOM.screenContent.innerHTML = buildMessageThread(screen);
        break;

      case 'popup':
        DOM.screenContent.innerHTML = buildPopup(screen);
        attachPopupListeners(screen);
        break;

      case 'now_playing':
        DOM.screenContent.innerHTML = buildNowPlaying(screen);
        break;

      case 'promo_popup':
        DOM.screenContent.innerHTML = buildPromoPopup(screen);
        attachPromoListeners(screen);
        break;

      case 'final_update':
      case 'update_popup':
        DOM.screenContent.innerHTML = buildUpdatePopup(screen);
        attachUpdateListeners(screen);
        break;

      case 'chaos_end':
        DOM.screenContent.innerHTML = buildChaosEnd(screen);
        break;

      case 'prevention':
        DOM.screenContent.innerHTML = buildPrevention(screen);
        break;

      /* Pour les types non encore implémentés */
      default:
        DOM.screenContent.innerHTML = `
          <div class="dl-logo">DataLand OS</div>
          <div class="screen-message" style="opacity:1;">
            [Écran de type "${screen.type}"<br>à implémenter]
          </div>
        `;
    }
  }


  /* ----------------------------------------------------------
     typeWriterEffect(element, text)
     Anime l'apparition progressive du texte dans la bulle.
     Crée un effet de dactylographie pour plus d'immersion narrative.
  ---------------------------------------------------------- */
  function typeWriterEffect(element, text) {
    /* Vider l'élément et réinitialiser */
    element.textContent = '';
    element.style.opacity = '1';
    
    /* Durée totale de l'animation (ajustez selon vos préférences) */
    const totalDuration = 2000; /* 2 secondes pour un texte court */
    const delayPerChar = totalDuration / (text.length || 1);
    
    /* Animer chaque caractère progressivement */
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        element.textContent += text[currentIndex];
        currentIndex++;
        /* Délai entre chaque caractère (avec variation aléatoire mineure pour naturel) */
        const randomVariation = delayPerChar * 0.15 * (Math.random() - 0.5);
        setTimeout(typeNextChar, delayPerChar + randomVariation);
      }
    };
    
    /* Démarrer l'animation */
    typeNextChar();
  }

  /* ----------------------------------------------------------
     Affiche la bulle de pensée narrative (unique).
     Fusionne left et right en un seul texte lisible.
     Ajoute l'effet de typing progressif.
  ---------------------------------------------------------- */
  function renderThoughts(thought) {
    if (!DOM.thoughtLeft) return;

    /* Combiner les deux bulles (left et right) en une seule narrative */
    let combinedText = '';
    
    if (thought && thought.left) {
      combinedText = thought.left;
    }
    if (thought && thought.right) {
      /* Si les deux existent, les combiner avec un espace */
      if (combinedText) {
        combinedText += ' ';
      }
      combinedText += thought.right;
    }

    if (combinedText) {
      /* Remplacer [NOM] par le prénom du joueur si présent */
      const finalText = combinedText.replace('[NOM]', playerName);
      
      /* Afficher la bulle et lancer l'animation de typing */
      DOM.thoughtLeft.style.display = 'block';
      typeWriterEffect(DOM.thoughtLeft, finalText);
    } else {
      DOM.thoughtLeft.style.display = 'none';
    }
  }


  /* ----------------------------------------------------------
     renderChoices(scene)
     Affiche les boutons de choix, ou programme une avance
     automatique vers la scène suivante.
  ---------------------------------------------------------- */
  function renderChoices(scene) {
    if (!DOM.choicesArea) return;

    DOM.choicesArea.innerHTML = '';

    if (scene.choices && scene.choices.length > 0) {
      /* Mode choix : créer un bouton par option */
      scene.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className   = 'choice-btn';
        btn.textContent = choice.label;

        btn.addEventListener('click', () => {
          /* Afficher la pensée associée au choix si elle existe */
          if (choice.thought && DOM.thoughtLeft) {
            DOM.thoughtLeft.textContent = choice.thought.replace('[NOM]', playerName);
            DOM.thoughtLeft.style.display = 'block';
          }

          /* Aller à la scène suivante après un court délai
             (laisser le temps au joueur de voir sa pensée) */
          setTimeout(() => goTo(choice.next), 900);
        });

        DOM.choicesArea.appendChild(btn);
      });

    } else if (scene.next) {
      /* Pas de choix : avance automatique sur clic ou délai */
      /* Pour l'instant : bouton "Continuer" */
      const btn = document.createElement('button');
      btn.className   = 'choice-btn choice-btn--continue';
      btn.textContent = 'Continuer';
      btn.addEventListener('click', () => goTo(scene.next));
      DOM.choicesArea.appendChild(btn);
    }
    /* Si ni choices ni next : fin du récit */
  }


  /* ==========================================================
     CONSTRUCTEURS D'ÉCRANS
     Chaque fonction retourne une chaîne HTML qui sera
     injectée dans .screen-content.
  ========================================================== */

  function buildBootScreen(screen) {
    return `
      <div class="dl-logo">${screen.logo || 'DataLand OS'}</div>
      <div class="fingerprint-ring">
        <svg class="fp-svg" viewBox="0 0 32 32" fill="none">
          <path d="M16 4C9.373 4 4 9.373 4 16" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round"/>
          <path d="M16 4C22.627 4 28 9.373 28 16" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
          <path d="M8 16C8 11.582 11.582 8 16 8" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round"/>
          <path d="M24 16C24 20.418 20.418 24 16 24" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
          <path d="M16 12C13.791 12 12 13.791 12 16C12 18.209 13.791 20 16 20" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round"/>
          <circle cx="16" cy="16" r="1.5" fill="#3a8bcd" opacity="0.6"/>
          <path d="M12 22C10.343 20.343 9.5 18.239 9.5 16" stroke="#3a8bcd" stroke-width="0.75" stroke-linecap="round" opacity="0.3"/>
        </svg>
      </div>
      <div class="screen-message">${(screen.message || '').replace('\n', '<br>')}</div>
      ${screen.notif ? buildInlineNotif(screen.notif) : ''}
    `;
  }

  function buildFingerprintScreen(screen) {
    return `
      <div class="dl-logo">DataLand OS</div>
      <div class="fingerprint-ring">
        <svg class="fp-svg" viewBox="0 0 32 32" fill="none">
          <path d="M16 4C9.373 4 4 9.373 4 16" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round"/>
          <path d="M16 4C22.627 4 28 9.373 28 16" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
          <path d="M8 16C8 11.582 11.582 8 16 8" stroke="#3a8bcd" stroke-width="1" stroke-linecap="round"/>
          <circle cx="16" cy="16" r="1.5" fill="#3a8bcd" opacity="0.6"/>
        </svg>
      </div>
      <div class="screen-message" style="opacity:1;">${(screen.message || '').replace('\n', '<br>')}</div>
    `;
  }

  function buildNotificationScreen(screen) {
    if (!screen.notifications) return '';
    return screen.notifications.map(n => buildInlineNotif(n)).join('');
  }

  function buildInlineNotif(notif) {
    return `
      <div class="notif">
        <div class="notif-header">
          <div class="notif-dot"></div>
          <div class="notif-app">${notif.app || 'DataLand'}</div>
        </div>
        <div class="notif-text">${notif.text || ''}</div>
      </div>
    `;
  }

  function buildMessageThread(screen) {
    return `
      <div class="dl-logo">Messages</div>
      <div class="screen-message" style="opacity:1; font-size:12px;">
        <strong style="display:block;margin-bottom:8px;">${screen.contact}</strong>
        <em style="opacity:0.6;">Message suggéré :</em><br>
        ${screen.suggested_message || ''}
      </div>
    `;
  }

  function buildPopup(screen) {
    const buttons = (screen.buttons || []).map(b => `
      <button class="screen-btn screen-btn--${b.style}" data-next="${b.next}">
        ${b.label}
      </button>
    `).join('');
    return `
      <div class="screen-popup">
        <div class="screen-popup-title">${screen.title || ''}</div>
        <div class="screen-popup-msg">${screen.message || ''}</div>
        <div class="screen-popup-btns">${buttons}</div>
      </div>
    `;
  }

  function buildNowPlaying(screen) {
    return `
      <div class="dl-logo">En lecture</div>
      <div class="screen-message" style="opacity:1;">
        ${screen.track}<br>
        <span style="opacity:0.5; font-size:12px;">${screen.artist}</span>
      </div>
      ${screen.sponsored ? `<div class="notif-app" style="margin-top:8px;">Sponsorisé par DataLand</div>` : ''}
    `;
  }

  function buildPromoPopup(screen) {
    const buttons = (screen.buttons || []).map(b => `
      <button class="screen-btn screen-btn--primary" data-next="${b.next}">
        ${b.label}
      </button>
    `).join('');
    return `
      <div class="screen-popup">
        <div class="screen-popup-title">${screen.brand}</div>
        <div class="screen-popup-msg">${screen.offer}<br>⭐ ${screen.rating} — ${screen.delivery}</div>
        <div class="screen-popup-btns">${buttons}</div>
      </div>
    `;
  }

  function buildUpdatePopup(screen) {
    const items = (screen.improvements || []).map(i => `<li>${i}</li>`).join('');
    return `
      <div class="screen-popup">
        <div class="screen-popup-title">Mise à jour ${screen.version || ''}</div>
        <ul style="font-size:11px;color:rgba(255,255,255,0.5);margin:8px 0;padding-left:16px;">${items}</ul>
        <div class="screen-popup-btns">
          <button class="screen-btn screen-btn--primary" data-update="yes">Installer</button>
          <button class="screen-btn screen-btn--ghost"   data-update="no">Plus tard</button>
        </div>
      </div>
    `;
  }

  function buildChaosEnd(screen) {
    return `
      <div class="screen-message" style="opacity:1; color:rgba(220,80,80,0.8);">
        Votre identité numérique<br>ne vous appartient plus.
      </div>
    `;
  }

  function buildPrevention(screen) {
    const lines = (screen.lines || []).map(l => `<p style="margin:6px 0;opacity:0.7;">${l}</p>`).join('');
    return `
      <div class="dl-logo" style="color:rgba(212,201,176,0.6);">${screen.title || ''}</div>
      <div class="screen-message" style="opacity:1; font-size:13px;">${lines}</div>
    `;
  }


  /* ==========================================================
     ÉCOUTEURS D'ÉVÉNEMENTS SUR LES BOUTONS D'ÉCRAN
  ========================================================== */

  function attachPopupListeners(screen) {
    setTimeout(() => {
      DOM.screenContent.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', () => goTo(btn.dataset.next));
      });
    }, 100);
  }

  function attachPromoListeners(screen) {
    setTimeout(() => {
      DOM.screenContent.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', () => goTo(btn.dataset.next));
      });
    }, 100);
  }

  function attachUpdateListeners(screen) {
    setTimeout(() => {
      DOM.screenContent.querySelectorAll('[data-update]').forEach(btn => {
        btn.addEventListener('click', () => {
          /* Les deux choix mènent au même résultat dans le Chapitre 3 */
          if (currentScene && currentScene.next) {
            goTo(currentScene.next);
          }
        });
      });
    }, 100);
  }


  /* ==========================================================
     INITIALISATION
  ========================================================== */

  /* ----------------------------------------------------------
     setPlayerName(name)
     Mémorise le prénom du joueur pour le réinjecter
     dans les textes via [NOM].
  ---------------------------------------------------------- */
  function setPlayerName(name) {
    playerName = name || 'vous';
  }


  /* ----------------------------------------------------------
     init()
     Démarre le récit depuis la scène de départ définie
     dans scenario.js.
  ---------------------------------------------------------- */
  function init() {
    cacheDom();
    Atmosphere.init('calm');
    goTo(SCENARIO.start);
  }


  /* ----------------------------------------------------------
     API publique
  ---------------------------------------------------------- */
  return { init, goTo, setPlayerName };

})();


/* ----------------------------------------------------------
   DÉMARRAGE AUTOMATIQUE
   Le moteur se lance dès que le DOM est prêt.
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  Engine.init();
});

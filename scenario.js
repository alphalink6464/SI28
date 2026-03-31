/* ============================================================
   SCENARIO.JS — Données du récit interactif
   ============================================================
   C'est ici que vivent TOUTES les données narratives :
   textes, choix, états d'humeur, transitions.

   LES AUTEURS DU SCÉNARIO TRAVAILLENT PRINCIPALEMENT ICI.
   Pas besoin de toucher à engine.js ou aux CSS pour
   modifier le contenu de l'histoire.

   STRUCTURE D'UNE SCÈNE :
   {
     id:        identifiant unique (string)
     mood:      état des nuages ('calm' | 'tense' | 'critical')
     chapter:   texte affiché en haut de l'écran
     screen:    ce qui s'affiche SUR l'écran du téléphone
     thought:   bulles de pensée du personnage (gauche + droite)
     choices:   tableau de choix proposés au joueur
     next:      id de la scène suivante (si pas de choix)
   }

   STRUCTURE D'UN CHOIX :
   {
     label:   texte du bouton affiché au joueur
     thought: (optionnel) pensée affichée si ce choix est sélectionné
     next:    id de la scène vers laquelle ce choix mène
   }
   ============================================================ */


/* ============================================================
   CHAPITRE 1 — Découverte du téléphone
   État général : CALME
   Le joueur reçoit son téléphone, tout semble parfait.
   ============================================================ */

const SCENARIO = {

  /* Point d'entrée du récit — première scène affichée */
  start: 'intro_livraison',

  scenes: {

    /* ----------------------------------------------------------
       INTRO : Arrivée du colis
    ---------------------------------------------------------- */
    'intro_livraison': {
      id:      'intro_livraison',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      /* Ce qui s'affiche sur l'écran du téléphone */
      screen: {
        type:    'boot',       // type d'écran : 'boot' | 'message' | 'notification' | 'choice' | 'black'
        logo:    'DataLand OS',
        message: 'Bonjour.\nComment dois-je vous appeler ?',
        notif: {
          app:  'DataLand',
          text: 'Bienvenue. Configuration de votre expérience en cours…'
        }
      },

      /* Bulles de pensée affichées de chaque côté du téléphone */
      thought: {
        left:  '"Enfin arrivé…"',
        right: '"C\'est rapide…"'
      },

      /* Choix proposés au joueur (null = pas de choix, avance automatiquement) */
      choices: null,

      /* Scène suivante (si pas de choix, ou par défaut) */
      next: 'empreinte'
    },


    /* ----------------------------------------------------------
       EMPREINTE DIGITALE : Configuration
    ---------------------------------------------------------- */
    'empreinte': {
      id:      'empreinte',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type:    'fingerprint',
        message: 'Placez votre doigt\nsur le capteur.',
      },

      thought: {
        left:  '"Déjà ? Eh beh, c\'était rapide."',
        right: '"Impressionnant."'
      },

      choices: null,
      next: 'fond_ecran'
    },


    /* ----------------------------------------------------------
       FOND D'ÉCRAN : Premier choix (sans conséquence)
       Le téléphone lit les pensées — démonstration inoffensive.
    ---------------------------------------------------------- */
    'fond_ecran': {
      id:      'fond_ecran',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type:    'choice_screen',
        message: 'Choisissez votre ambiance.',
        // Les options sont gérées par les choices ci-dessous
      },

      thought: {
        left:  '"Hmmm, j\'aimerais bien un fond d\'écran…"',
        right: '"…d\'une couleur un peu plus sympa."'
      },

      /* Ces choix n'ont aucune conséquence narrative réelle */
      choices: [
        { label: 'Rouge',  thought: '"Voilà, parfait !"', next: 'cgu' },
        { label: 'Vert',   thought: '"Voilà, parfait !"', next: 'cgu' },
        { label: 'Bleu',   thought: '"Voilà, parfait !"', next: 'cgu' },
      ],
    },


    /* ----------------------------------------------------------
       CONDITIONS D'UTILISATION : le grand classique
    ---------------------------------------------------------- */
    'cgu': {
      id:      'cgu',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type:    'popup',
        title:   'Avant de commencer',
        message: 'Nous vous invitons à accepter les conditions d\'utilisation.',
        buttons: [
          { label: 'Débuter l\'expérience', style: 'primary', next: 'mere' },
          { label: 'Lire les conditions',  style: 'ghost',   next: 'cgu_lecture' },
        ]
      },

      thought: {
        left:  '"Ah oui, bon."',
        right: '"Comme d\'habitude."'
      },

      choices: null,
      next: null // navigation gérée par les boutons du popup
    },


    /* ----------------------------------------------------------
       CGU LECTURE : 297 pages illisibles
    ---------------------------------------------------------- */
    'cgu_lecture': {
      id:      'cgu_lecture',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type:    'cgu_wall',   // type spécial : mur de texte illisible
        pages:   297,
        button:  'Accepter et continuer',
        next:    'mere'
      },

      thought: {
        left:  '"C\'est… beaucoup."',
        right: null
      },

      choices: null,
      next: null
    },


    /* ----------------------------------------------------------
       MESSAGE À LA MÈRE : Présentation du personnage
    ---------------------------------------------------------- */
    'mere': {
      id:      'mere',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type:    'message_thread',
        contact: 'Maman',
        suggested_message: 'Coucou maman ! J\'ai enfin reçu mon nouveau téléphone, il est génial !',
        // Le joueur peut modifier ce message — à implémenter dans engine.js
      },

      thought: {
        left:  '"Il faut que je dise à ma mère…"',
        right: '"…que j\'ai reçu mon téléphone."'
      },

      choices: null,
      next: 'soiree_bar'
    },


    /* ----------------------------------------------------------
       SOIRÉE AU BAR : Fin de scène 1
    ---------------------------------------------------------- */
    'soiree_bar': {
      id:      'soiree_bar',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type: 'notification',
        notifications: [
          { app: 'DataLand Météo', text: 'Pluie prévue ce soir — pensez à prendre un parapluie.' },
          { app: 'DataLand Maps',  text: '23 min pour rejoindre le bar. Partir avant 20h30.' },
        ]
      },

      thought: {
        left:  '"Oh c\'est vachement pratique ça."',
        right: '"Bon, je sors."'
      },

      choices: null,
      next: 'sc2_musique'  // → Scène 2
    },


    /* ----------------------------------------------------------
       SCÈNE 2 — Retour du travail
    ---------------------------------------------------------- */
    'sc2_musique': {
      id:      'sc2_musique',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type: 'now_playing',
        track:  'Weightless',
        artist: 'Marconi Union',
        sponsored: true,          // "Sponsorisé par DataLand"
      },

      thought: {
        left:  '"Pourquoi pas un peu de musique ?"',
        right: '"C\'est exactement ce qu\'il me fallait."'
      },

      choices: null,
      next: 'sc2_repas'
    },


    /* ----------------------------------------------------------
       CHOIX DU REPAS : Burger ou Pizza ?
       (Démo de la lecture de pensées à des fins commerciales)
    ---------------------------------------------------------- */
    'sc2_repas': {
      id:      'sc2_repas',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',

      screen: {
        type: 'thought_prompt',
        message: 'Je me demande ce que je vais manger ce soir…'
      },

      thought: {
        left:  '"J\'ai envie de…"',
        right: null
      },

      choices: [
        {
          label:   'Burger',
          thought: '"Tiens, une offre pour un burger…"',
          next:    'sc2_offre_burger'
        },
        {
          label:   'Pizza',
          thought: '"Tiens, une offre pour une pizza…"',
          next:    'sc2_offre_pizza'
        },
      ]
    },


    /* ----------------------------------------------------------
       OFFRE BURGER / PIZZA : Publicité ciblée sur les pensées
    ---------------------------------------------------------- */
    'sc2_offre_burger': {
      id:   'sc2_offre_burger',
      mood: 'calm',
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'promo_popup',
        brand:   'BurgerData',
        offer:   '-30% sur votre commande',
        rating:  '4.9',
        delivery: 'Livraison à domicile',
        buttons: [
          { label: 'Commander',       next: 'sc3_scroll' },
          { label: 'Cuisiner chez soi', next: 'sc3_scroll' },
        ]
      },
      thought: { left: '"Ça donne vraiment envie…"', right: null },
      choices: null,
      next: null
    },

    'sc2_offre_pizza': {
      id:   'sc2_offre_pizza',
      mood: 'calm',
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'promo_popup',
        brand:   'PizzaData',
        offer:   '-30% sur votre commande',
        rating:  '4.9',
        delivery: 'Livraison à domicile',
        buttons: [
          { label: 'Commander',         next: 'sc3_scroll' },
          { label: 'Cuisiner chez soi', next: 'sc3_scroll' },
        ]
      },
      thought: { left: '"Ça donne vraiment envie…"', right: null },
      choices: null,
      next: null
    },


    /* ----------------------------------------------------------
       SCÈNE 3 — Réseaux sociaux / Nuit
       (à développer — squelette en place)
    ---------------------------------------------------------- */
    'sc3_scroll': {
      id:      'sc3_scroll',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'social_feed',
        // Le feed sera généré dynamiquement par engine.js
      },
      thought: { left: '"Bon, je scroll un peu…"', right: null },
      choices: null,
      next: 'sc3_message_agressif'
    },

    'sc3_message_agressif': {
      id:      'sc3_message_agressif',
      mood:    'calm',            // commence calme, puis bascule
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'message_received',
        sender: 'Marc',
        // Message agressif — le téléphone va le reformuler
        original:   'T\'as encore pas fait le rapport ?? C\'est n\'importe quoi sérieux.',
        reformatted: 'Bonjour, as-tu eu l\'occasion de finaliser le rapport ? Merci.',
      },
      thought: { left: '"Oh non, pas encore lui…"', right: '"…mais bon, je dois répondre."' },
      choices: null,
      next: 'sc3_bonne_nuit'
    },

    'sc3_bonne_nuit': {
      id:      'sc3_bonne_nuit',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'goodnight',
        message: 'Vous avez bien travaillé aujourd\'hui, vous méritez une bonne nuit de repos.',
        time_saved: '1h13',
      },
      thought: { left: '"Bon il se fait tard."', right: null },
      choices: null,
      next: 'sc4_update_1'   // → Scène 4
    },


    /* ----------------------------------------------------------
       SCÈNE 4 — Première mise à jour (Fin Chapitre 1)
    ---------------------------------------------------------- */
    'sc4_update_1': {
      id:      'sc4_update_1',
      mood:    'calm',
      chapter: 'DataLand — Chapitre I',
      screen: {
        type: 'update_popup',
        version: '2.1.0',
        improvements: [
          'Fluidité améliorée',
          'Vitesse de réponse',
          'Amélioration de l\'IA',
        ],
        // Dans le Chapitre 1, la mise à jour se passe bien
        outcome: 'success'
      },
      thought: { left: '"Ça a l\'air bien…"', right: null },
      choices: null,
      next: 'ch2_ami_guerre'  // → Début Chapitre 2
    },


    /* ============================================================
       CHAPITRE 2 — Manipulation
       État général : TENSE → CRITICAL
       Le téléphone commence à influencer les opinions.
    ============================================================ */

    /* ----------------------------------------------------------
       TURNING POINT : Message de l'ami sur la guerre
    ---------------------------------------------------------- */
    'ch2_ami_guerre': {
      id:      'ch2_ami_guerre',
      mood:    'tense',           // les nuages s'assombrissent
      chapter: 'DataLand — Chapitre II',
      screen: {
        type: 'message_received',
        sender: 'Lucas',
        original: 'Yo, t\'as vu le discours du président de Dataland ? Je pense qu\'on sera bientôt en guerre, t\'en penses quoi ?',
      },
      thought: { left: '"Hmm, je n\'en ai pas entendu parler…"', right: null },
      /* Peu importe le choix, le téléphone envoie un message pro-guerre */
      choices: [
        { label: 'Je suis pour la guerre',  thought: '"Vive la patrie !"', next: 'ch2_notifs_propagande' },
        { label: 'Je suis contre la guerre', thought: '"J\'espère que rien ne se passera."', next: 'ch2_notifs_propagande' },
      ]
    },

    /* ----------------------------------------------------------
       PROPAGANDE : Flood de notifications
    ---------------------------------------------------------- */
    'ch2_notifs_propagande': {
      id:      'ch2_notifs_propagande',
      mood:    'tense',
      chapter: 'DataLand — Chapitre II',
      screen: {
        type: 'notification_flood',
        notifications: [
          'Le meilleur politique de notre génération',
          'Un philanthrope qui finance des écoles',
          'La guerre contre les terroristes — nécessaire',
          'Une politique pour la patrie !',
          'Un homme en or !',
        ]
      },
      thought: {
        left:  '"Hmm, c\'est peut-être pas si mal…"',
        right: null
      },
      choices: null,
      next: 'ch2_soft_power'
    },

    /* ----------------------------------------------------------
       SOFT POWER : Contrôle culturel et commercial
       (à développer — squelette)
    ---------------------------------------------------------- */
    'ch2_soft_power': {
      id:      'ch2_soft_power',
      mood:    'tense',
      chapter: 'DataLand — Chapitre II',
      screen: {
        type: 'content_locked',
        message: 'Ce contenu n\'est pas disponible dans votre région.',
        suggestion: 'Heroes of DataLand — N°1 mondial en ce moment',
      },
      thought: { left: '"Je voulais juste regarder un film…"', right: null },
      choices: null,
      next: 'ch2_controle_total'
    },

    /* ----------------------------------------------------------
       CONTRÔLE TOTAL : Le téléphone agit seul
    ---------------------------------------------------------- */
    'ch2_controle_total': {
      id:      'ch2_controle_total',
      mood:    'critical',
      chapter: 'DataLand — Chapitre II',
      screen: {
        type: 'action_done',
        message: 'Merci pour votre soutien à la campagne patriotique.',
        actions_done: [
          'Don automatique effectué',
          'Post politique partagé',
          'Groupe militant rejoint',
        ]
      },
      thought: { left: '"Je n\'ai rien fait de tout ça…"', right: '"…c\'est impossible."' },
      choices: null,
      next: 'ch3_message_mere_corrompu'
    },


    /* ============================================================
       CHAPITRE 3 — Perte de contrôle totale
       État général : CRITICAL
    ============================================================ */

    /* ----------------------------------------------------------
       MESSAGE CORROMPU À LA MÈRE
    ---------------------------------------------------------- */
    'ch3_message_mere_corrompu': {
      id:      'ch3_message_mere_corrompu',
      mood:    'critical',
      chapter: 'DataLand — Chapitre III',
      screen: {
        type: 'message_corrupted',
        contact: 'Maman',
        // Ce que le joueur choisit d'envoyer
        intended_options: [
          'Coucou maman, mon téléphone commence à changer mes messages, je n\'aime pas ça.',
          'Coucou maman, je ne sais pas ce qui se passe mais rien ne va, et toi ?',
        ],
        // Ce que le téléphone envoie réellement
        sent: 'Coucou maman, tout va bien avec mon téléphone ! Il est vraiment super, tu devrais l\'acheter sur le site DataLand !',
        // Réponse de la mère
        reply: 'Tu vas bien toi ? Ton message est bizarre…'
      },
      thought: { left: '"C\'est pas ce que j\'ai écrit…"', right: '"…elle va s\'inquiéter."' },
      choices: null,
      next: 'ch3_hackprotect'
    },

    /* ----------------------------------------------------------
       ARNAQUE DATAPROTECT
    ---------------------------------------------------------- */
    'ch3_hackprotect': {
      id:      'ch3_hackprotect',
      mood:    'critical',
      chapter: 'DataLand — Chapitre III',
      screen: {
        type: 'scam_popup',
        offer: 'Protégez votre téléphone des hackers — DataProtect à -50%',
        url:   'dataprotect-secure.dl',
        // La croix disparaît sur l'écran suivant (coordonnées bancaires)
        no_exit: true
      },
      thought: { left: '"Je me suis fait pirater ?"', right: null },
      choices: null,
      next: 'ch3_petition'
    },

    /* ----------------------------------------------------------
       PÉTITION : Le nom du joueur dans une liste génocidaire
    ---------------------------------------------------------- */
    'ch3_petition': {
      id:      'ch3_petition',
      mood:    'critical',
      chapter: 'DataLand — Chapitre III',
      screen: {
        type: 'group_message',
        sender: 'Groupe Amis',
        messages: [
          { from: 'Théo',   text: 'Wtf pourquoi ton nom est dans cette liste ??' },
          { from: 'Camille',text: 'C\'est grave ce que t\'as signé…' },
          { from: 'Lucas',  text: 'Je te croyais pas comme ça.' },
        ],
        article_link: 'Pétition pour le massacre du peuple opposant — liste des signataires'
        // Le nom du joueur (saisi au début) apparaît dans la liste
      },
      thought: null,
      choices: [
        {
          label: 'Non c\'est impossible ! Je n\'ai jamais fait ça !!',
          thought: '"Personne ne me croit…"',
          next: 'ch3_banni'
        }
      ]
    },

    /* ----------------------------------------------------------
       BANNI DU GROUPE
    ---------------------------------------------------------- */
    'ch3_banni': {
      id:      'ch3_banni',
      mood:    'critical',
      chapter: 'DataLand — Chapitre III',
      screen: {
        type: 'group_kicked',
        message: 'Vous avez été retiré du groupe.',
        last_message: { from: 'Théo', text: 'On peut plus te faire confiance.' }
      },
      thought: { left: '"Ils ne me croient plus."', right: '"Je suis seul."' },
      choices: null,
      next: 'ch3_finale_update'
    },

    /* ----------------------------------------------------------
       SCÈNE FINALE : Dernière mise à jour
       Peu importe le choix, tout part en chaos.
    ---------------------------------------------------------- */
    'ch3_finale_update': {
      id:      'ch3_finale_update',
      mood:    'critical',
      chapter: 'DataLand — Chapitre III',
      screen: {
        type: 'final_update',
        message: 'Mise à jour obligatoire — Protégez vos données.',
        // Si oui → posts horribles envoyés
        // Si non → données "divulguées" + posts quand même
        // Les deux mènent au même chaos final
      },
      thought: { left: '"Quoi que je fasse…"', right: '"…c\'est la même chose."' },
      choices: [
        { label: 'Accepter la mise à jour', next: 'ch3_fin_chaos' },
        { label: 'Refuser',                 next: 'ch3_fin_chaos' },
      ]
    },

    /* ----------------------------------------------------------
       FIN — Écran de chaos + message de prévention
    ---------------------------------------------------------- */
    'ch3_fin_chaos': {
      id:      'ch3_fin_chaos',
      mood:    'critical',
      chapter: 'DataLand — Fin',
      screen: {
        type: 'chaos_end',
        posts: [
          // Posts envoyés automatiquement — à remplir
        ]
      },
      thought: null,
      choices: null,
      next: 'prevention_message'
    },

    /* ----------------------------------------------------------
       MESSAGE DE PRÉVENTION (écran de fin)
    ---------------------------------------------------------- */
    'prevention_message': {
      id:      'prevention_message',
      mood:    'calm',            // retour au calme — contraste avec le chaos
      chapter: '',
      screen: {
        type: 'prevention',
        title: 'DataLand est une fiction.',
        lines: [
          'Mais les mécanismes qu\'il décrit sont réels.',
          'Vos données, vos pensées, vos relations :',
          'protégez ce qui vous appartient.',
        ]
      },
      thought: null,
      choices: null,
      next: null  // fin du récit
    },

  } // fin de scenes{}

}; // fin de SCENARIO

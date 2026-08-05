/* PetTriage — Arbre de décision vétérinaire */
(function () {
  'use strict';

  const R = {
    GREEN: { level: 'green', label: 'Surveillance simple', icon: '🟢', title: "Pas d'urgence immédiate", color: 'green', advice: [ "Surveillez l'évolution dans les 24h", 'Pas de changement de comportement inquiétant', 'Repos et hydratation' ], btn: '#22c55e' },
    YELLOW: { level: 'yellow', label: 'Consulter dans les 24h', icon: '🟡', title: 'À surveiller', color: 'yellow', advice: [ "Prenez rendez-vous chez votre vétérinaire dans la journée", "Surveillez l'apparition de nouveaux symptômes", "Si l'état empire, passez en urgence" ], btn: '#eab308' },
    ORANGE: { level: 'orange', label: 'Consulter rapidement', icon: '🟠', title: 'Urgence modérée', color: 'orange', advice: [ 'Contactez votre vétérinaire dès maintenant', "Une consultation aujourd'hui est recommandée", 'Ne pas attendre 24h' ], btn: '#f97316' },
    RED: { level: 'red', label: 'URGENCE VÉTÉRINAIRE', icon: '🔴', title: 'Urgence immédiate', color: 'red', advice: [ "Rendez-vous aux urgences vétérinaires SANS ATTENDRE", 'Ne donnez pas à manger ni à boire sauf avis contraire', 'Transportez votre animal calmement et en sécurité', 'Appelez la clinique pour les prévenir de votre arrivée' ], btn: '#ef4444' },
  };

  const tree = { id: 'species', question: 'Quel est votre animal ?', answers: [ { label: '🐶 Chien', next: 'dog-menu' }, { label: '🐱 Chat', next: 'cat-menu' } ] };

  const dogMenu = { id: 'dog-menu', question: 'Quel est le problème principal ?', answers: [
    { label: 'Difficultés respiratoires / toux', next: 'dog-breathing' },
    { label: 'Vomissements / diarrhée', next: 'dog-vomit' },
    { label: 'Ingestion / empoisonnement', next: 'dog-ingestion' },
    { label: 'Blessure / traumatisme', next: 'dog-injury' },
    { label: 'Problème urinaire', next: 'dog-urinary' },
    { label: 'Problème oculaire / oreille', next: 'dog-eye' },
    { label: 'Changement de comportement', next: 'dog-behavior' },
    { label: 'Problème de peau / allergie', next: 'dog-skin' },
  ]};

  const catMenu = { id: 'cat-menu', question: 'Quel est le problème principal ?', answers: [
    { label: 'Difficultés respiratoires / toux', next: 'cat-breathing' },
    { label: 'Vomissements / diarrhée', next: 'cat-vomit' },
    { label: 'Ingestion / empoisonnement', next: 'cat-ingestion' },
    { label: 'Blessure / traumatisme', next: 'cat-injury' },
    { label: 'Problème urinaire', next: 'cat-urinary' },
    { label: 'Problème oculaire / oreille', next: 'cat-eye' },
    { label: 'Changement de comportement', next: 'cat-behavior' },
    { label: 'Problème de peau / allergie', next: 'cat-skin' },
  ]};

  const dogBreathing = { id: 'dog-breathing', question: 'Décrivez les symptômes respiratoires :', answers: [
    { label: 'Toux grasse ou quinteuse depuis < 24h', next: 'result', result: R.YELLOW },
    { label: 'Toux persistante (> 24h)', next: 'result', result: R.ORANGE },
    { label: 'Respiration rapide / halètement excessif', next: 'result', result: R.ORANGE },
    { label: 'Respiration difficile, bouche ouverte, gencives bleues', next: 'result', result: R.RED },
    { label: 'Éternuements / écoulement nasal clair', next: 'result', result: R.GREEN },
  ]};

  const dogVomit = { id: 'dog-vomit', question: 'Décrivez les symptômes digestifs :', answers: [
    { label: 'Vomi 1 fois, animal en forme', next: 'result', result: R.GREEN },
    { label: 'Vomissements répétés (2+)', next: 'result', result: R.ORANGE },
    { label: 'Diarrhée liquide, animal en forme', next: 'result', result: R.YELLOW },
    { label: 'Diarrhée + vomissements', next: 'result', result: R.ORANGE },
    { label: 'Sang dans le vomi ou les selles', next: 'result', result: R.RED },
    { label: 'Vomi + abattement / refus de boire', next: 'result', result: R.RED },
  ]};

  const dogIngestion = { id: 'dog-ingestion', question: "Qu'a-t-il ingéré ?", answers: [
    { label: 'Chocolat (surtout noir / pâtisserie)', next: 'result', result: R.RED },
    { label: 'Raisins / oignons / xylitol (chewing-gum)', next: 'result', result: R.RED },
    { label: 'Médicament humain (paracétamol, ibuprofène…)', next: 'result', result: R.RED },
    { label: "Plante d'intérieur inconnue", next: 'result', result: R.ORANGE },
    { label: 'Objet (jouet, chaussette, caillou)', next: 'result', result: R.ORANGE },
    { label: 'Herbe / nourriture non dangereuse', next: 'result', result: R.GREEN },
  ]};

  const dogInjury = { id: 'dog-injury', question: 'Quel type de blessure ?', answers: [
    { label: 'Plaie qui saigne abondamment', next: 'result', result: R.RED },
    { label: 'Boite soudaine / ne pose pas la patte', next: 'result', result: R.ORANGE },
    { label: 'Petite coupure / éraflure superficielle', next: 'result', result: R.YELLOW },
    { label: "Piqûre d'insecte / gonflement local", next: 'result', result: R.YELLOW },
    { label: 'Gonflement du visage / difficulté à avaler', next: 'result', result: R.RED },
    { label: 'Choc / heurt par une voiture', next: 'result', result: R.RED },
  ]};

  const dogUrinary = { id: 'dog-urinary', question: 'Décrivez le problème urinaire :', answers: [
    { label: "N'urine pas depuis 12h+ ou essaie sans succès", next: 'result', result: R.RED },
    { label: 'Urine sanglante', next: 'result', result: R.ORANGE },
    { label: "Urine plus souvent que d'habitude", next: 'result', result: R.YELLOW },
    { label: "Urine dans la maison (propre d'habitude)", next: 'result', result: R.YELLOW },
    { label: 'Boit beaucoup + urine beaucoup', next: 'result', result: R.ORANGE },
  ]};

  const dogEye = { id: 'dog-eye', question: 'Décrivez le problème :', answers: [
    { label: 'Œil fermé / rouge / qui coule', next: 'result', result: R.YELLOW },
    { label: "Œil qui sort de l'orbite / globe bombé", next: 'result', result: R.RED },
    { label: "Secoue la tête / se gratte l'oreille", next: 'result', result: R.YELLOW },
    { label: 'Oreille sale / qui sent mauvais', next: 'result', result: R.YELLOW },
    { label: 'Pupilles de taille différente', next: 'result', result: R.RED },
  ]};

  const dogBehavior = { id: 'dog-behavior', question: 'Décrivez le changement :', answers: [
    { label: 'Abattu / ne veut plus se lever', next: 'result', result: R.ORANGE },
    { label: 'Ne mange ni ne boit depuis 24h', next: 'result', result: R.ORANGE },
    { label: 'Grogne / agressif inhabituellement', next: 'result', result: R.YELLOW },
    { label: 'Tourne en rond / désorienté / tombe', next: 'result', result: R.RED },
    { label: "Convulsions / crise d'épilepsie", next: 'result', result: R.RED },
    { label: 'Se lèche ou se mordille une zone', next: 'result', result: R.YELLOW },
  ]};

  const dogSkin = { id: 'dog-skin', question: 'Décrivez le problème de peau :', answers: [
    { label: 'Démangeaisons légères, pas de perte de poils', next: 'result', result: R.GREEN },
    { label: 'Plaque rouge / bouton / zone chaude', next: 'result', result: R.YELLOW },
    { label: 'Perte de poils par plaques', next: 'result', result: R.YELLOW },
    { label: 'Plaie suintante / pus / mauvaise odeur', next: 'result', result: R.ORANGE },
    { label: 'Gonflement sous la peau', next: 'result', result: R.ORANGE },
  ]};

  const catBreathing = { id: 'cat-breathing', question: 'Décrivez les symptômes respiratoires :', answers: [
    { label: 'Respiration rapide / bouche ouverte', next: 'result', result: R.RED },
    { label: 'Toux / éternuements fréquents', next: 'result', result: R.YELLOW },
    { label: 'Écoulement nasal / yeux qui coulent', next: 'result', result: R.YELLOW },
    { label: 'Respiration bruyante / ronflement soudain', next: 'result', result: R.ORANGE },
    { label: 'Gencives bleues / violettes', next: 'result', result: R.RED },
  ]};

  const catVomit = { id: 'cat-vomit', question: 'Décrivez les symptômes digestifs :', answers: [
    { label: 'Vomi 1 fois (boule de poils probable)', next: 'result', result: R.GREEN },
    { label: 'Vomissements répétés (2+ fois)', next: 'result', result: R.ORANGE },
    { label: 'Diarrhée liquide, chat en forme', next: 'result', result: R.YELLOW },
    { label: 'Diarrhée + vomissements', next: 'result', result: R.ORANGE },
    { label: 'Sang dans le vomi ou les selles', next: 'result', result: R.RED },
    { label: 'Ne mange ni ne boit depuis 24h', next: 'result', result: R.RED },
  ]};

  const catIngestion = { id: 'cat-ingestion', question: "Qu'a-t-il ingéré ?", answers: [
    { label: 'Lys / muguet / tulipe (plantes toxiques)', next: 'result', result: R.RED },
    { label: 'Médicament humain', next: 'result', result: R.RED },
    { label: 'Produit ménager / antigel', next: 'result', result: R.RED },
    { label: 'Fil / laine / petit objet', next: 'result', result: R.ORANGE },
    { label: 'Herbe / plante non toxique', next: 'result', result: R.GREEN },
  ]};

  const catInjury = { id: 'cat-injury', question: 'Quel type de blessure ?', answers: [
    { label: 'Plaie qui saigne / abcès ouvert', next: 'result', result: R.ORANGE },
    { label: 'Boite / ne pose pas la patte', next: 'result', result: R.ORANGE },
    { label: 'Morsure / griffure infectée (gonflée)', next: 'result', result: R.ORANGE },
    { label: "Chute d'une hauteur (balcon, fenêtre)", next: 'result', result: R.RED },
    { label: 'Petite coupure superficielle', next: 'result', result: R.YELLOW },
    { label: 'Griffe arrachée / saigne', next: 'result', result: R.YELLOW },
  ]};

  const catUrinary = { id: 'cat-urinary', question: 'Décrivez le problème urinaire :', answers: [
    { label: "Va dans la litière sans uriner / essaie sans succès", next: 'result', result: R.RED },
    { label: 'Urine sanglante', next: 'result', result: R.RED },
    { label: 'Urine en dehors de la litière', next: 'result', result: R.YELLOW },
    { label: 'Urine souvent, petites quantités', next: 'result', result: R.ORANGE },
    { label: 'Boit beaucoup + urine beaucoup', next: 'result', result: R.ORANGE },
  ]};

  const catEye = { id: 'cat-eye', question: 'Décrivez le problème :', answers: [
    { label: 'Œil rouge / qui coule / cligne', next: 'result', result: R.YELLOW },
    { label: 'Troisième paupière visible en permanence', next: 'result', result: R.YELLOW },
    { label: 'Œil trouble / blanc / bleuté', next: 'result', result: R.ORANGE },
    { label: "Se gratte l'oreille / tête penchée", next: 'result', result: R.YELLOW },
    { label: 'Pupilles de taille différente', next: 'result', result: R.RED },
  ]};

  const catBehavior = { id: 'cat-behavior', question: 'Décrivez le changement :', answers: [
    { label: 'Se cache / ne sort plus', next: 'result', result: R.YELLOW },
    { label: 'Ne mange ni ne boit depuis 24h', next: 'result', result: R.ORANGE },
    { label: 'Grogne / souffle / agressif', next: 'result', result: R.YELLOW },
    { label: 'Tourne en rond / tête qui penche / tombe', next: 'result', result: R.RED },
    { label: 'Convulsions / crise', next: 'result', result: R.RED },
    { label: 'Frotte son derrière par terre', next: 'result', result: R.YELLOW },
  ]};

  const catSkin = { id: 'cat-skin', question: 'Décrivez le problème de peau :', answers: [
    { label: 'Se gratte modérément, pas de lésion', next: 'result', result: R.GREEN },
    { label: 'Plaque rouge / croûte / perte de poils', next: 'result', result: R.YELLOW },
    { label: 'Boutons / points noirs sous le menton', next: 'result', result: R.YELLOW },
    { label: 'Plaie suintante / pus / odeur', next: 'result', result: R.ORANGE },
    { label: 'Gonflement / boule sous la peau', next: 'result', result: R.ORANGE },
  ]};

  const nodes = {
    'species': tree, 'dog-menu': dogMenu, 'cat-menu': catMenu,
    'dog-breathing': dogBreathing, 'dog-vomit': dogVomit, 'dog-ingestion': dogIngestion,
    'dog-injury': dogInjury, 'dog-urinary': dogUrinary, 'dog-eye': dogEye,
    'dog-behavior': dogBehavior, 'dog-skin': dogSkin,
    'cat-breathing': catBreathing, 'cat-vomit': catVomit, 'cat-ingestion': catIngestion,
    'cat-injury': catInjury, 'cat-urinary': catUrinary, 'cat-eye': catEye,
    'cat-behavior': catBehavior, 'cat-skin': catSkin,
  };

  let history = [];
  const $ = (s) => document.querySelector(s);
  const content = $('#content');
  const fill = $('#progressFill');

  function renderStart() {
    content.innerHTML = `
      <div class="start">
        <div class="start-icon">🐾</div>
        <h2>Bienvenue sur PetTriage</h2>
        <p>Répondez à quelques questions pour savoir</p>
        <p>si votre chien ou chat a besoin d'une consultation</p>
        <p>urgente, d'un simple rendez-vous, ou de surveillance.</p>
        <div class="note">⚠️ Cet outil ne remplace pas l'avis d'un vétérinaire. En cas de doute, consultez un professionnel.</div>
        <button class="btn-start" id="btnStart">Commencer l'évaluation</button>
      </div>`;
    fill.style.width = '0%';
    $('#btnStart').addEventListener('click', () => { history = []; goTo('species'); });
  }

  function goTo(id) {
    const node = nodes[id];
    if (!node) return;
    history.push(id);
    renderQuestion(node);
  }

  function renderQuestion(node) {
    fill.style.width = Math.min((history.length / 8) * 100, 85) + '%';
    content.innerHTML = `
      <div class="question">
        <h2>${node.question}</h2>
        <p class="context">Étape ${history.length}</p>
        <div class="answers">${node.answers.map((a, i) =>
          `<button class="btn-answer" data-index="${i}">${a.label}</button>`
        ).join('')}</div>
      </div>`;
    content.querySelectorAll('.btn-answer').forEach((btn) => {
      btn.addEventListener('click', () => {
        const a = node.answers[parseInt(btn.dataset.index, 10)];
        a.result ? renderResult(a.result) : goTo(a.next);
      });
    });
  }

  function renderResult(r) {
    fill.style.width = '100%';
    content.innerHTML = `
      <div class="result">
        <div class="result-icon">${r.icon}</div>
        <h2>${r.title}</h2>
        <div class="severity severity-${r.level}">${r.label}</div>
        <p><strong>Recommandations :</strong></p>
        <ul>${r.advice.map((a) => `<li>${a}</li>`).join('')}</ul>
        <button class="btn-restart" style="background:${r.btn}">Recommencer</button>
      </div>`;
    content.querySelector('.btn-restart').addEventListener('click', renderStart);
  }

  renderStart();
})();

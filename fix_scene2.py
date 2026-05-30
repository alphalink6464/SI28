import os

path = '/Users/amalsoufi/SI28 AS/scene2.html'
with open(path, 'r') as f:
    content = f.read()

# Replace 1: CSS
content = content.replace(
"""        .home-screen {
            width: 100%;
            height: 100%;
            background: #3b82f6; /* Bleu par défaut */
            transition: background 0.3s ease;
            padding: 40px 20px 20px;
            display: flex;
            flex-direction: column;
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 30px;
            font-family: 'Inter', sans-serif;
            color: #334155;
            mix-blend-mode: multiply;
        }""",
"""        .home-screen {
            width: 100%;
            height: 100%;
            background: #e8f4ff; /* Bleu très clair */
            transition: background 0.3s ease;
            padding: 40px 20px 20px;
            display: flex;
            flex-direction: column;
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 30px;
            font-family: 'Inter', sans-serif;
            color: #334155;
        }""")

# Extract runCookingBranch
start_idx = content.find("            async function runCookingBranch() {")
end_idx = content.find("            // --- ETAPE 9: Fin de scène ---")

runCookingBranch_str = content[start_idx:end_idx]

# Define new runCookingBranch
new_runCookingBranch_str = """        async function runCookingBranch() {
            // --- ETAPE 8B: Cuisiner ---
            await showThought(`C'est appétissant, mais je préfère cuisiner ce soir.<span class="instruction">(Cliquez)</span>`);
            await awaitClick();
            await hideThought();
            
            const recipeHTML = `
                <div class="app-screen recipe-app" id="recipe-app">
                    <div class="recipe-header">
                        <div class="recipe-title">🍳 Dataland Cuisine</div>
                        <div class="recipe-subtitle">🧊 Adapté à votre frigo</div>
                    </div>
                    <div class="recipe-body">
                        <h2 style="color: #0f172a; font-size: 1.5rem; margin: 0 0 5px 0;">Pâtes Carbonara</h2>
                        <div style="color: #64748b; font-size: 0.9rem; margin-bottom: 20px;">⏱ 20 min</div>
                        
                        <h3 style="color: #0f172a; font-size: 1.1rem; margin-bottom: 10px;">Ingrédients détectés :</h3>
                        <ul class="ingredient-list">
                            <li>Lardons fumés</li>
                            <li>Œufs frais</li>
                            <li>Parmesan affiné</li>
                            <li>Pâtes spaghetti</li>
                            <li>Poivre noir</li>
                        </ul>
                        
                        <button class="btn-primary mt" id="btn-start-recipe" style="margin-top: 30px;">Commencer la recette</button>
                    </div>
                </div>`;
            document.getElementById('screen').insertAdjacentHTML('beforeend', recipeHTML);
            
            await wait(1000);
            await showThought(`Attendez... il sait ce que j'ai dans mon frigo ?! 😳<span class="instruction">(Cliquez)</span>`);
            document.getElementById('thought-bubble').classList.add('shake-anim');
            await awaitClick();
            document.getElementById('thought-bubble').classList.remove('shake-anim');
            
            const fridgeNotifHTML = `
                <div class="ios-notification" id="notif-fridge">
                    <div class="ios-notification-header">🧊 Dataland SmartFridge™</div>
                    <div class="ios-notification-body">Synchronisation du réfrigérateur active.</div>
                </div>`;
            document.getElementById('screen').insertAdjacentHTML('beforeend', fridgeNotifHTML);
            
            await wait(800);
            await showThought(`Ok là c'est un peu trop.<span class="instruction">(Cliquez)</span>`);
            await awaitClick();
            await hideThought();
            document.getElementById('notif-fridge').classList.add('slide-up');
            await wait(500);
            
            await awaitElementClick('btn-start-recipe');
            const recipeBody = document.querySelector('.recipe-body');
            recipeBody.innerHTML = `
                <h2 style="color: #0f172a; font-size: 1.5rem; margin: 0 0 15px 0;">Préparation</h2>
                <div id="recipe-steps" style="display:flex; flex-direction:column; gap:10px;"></div>
            `;
            const steps = [
                "Étape 1 : Faire bouillir l'eau et cuire les pâtes al dente.",
                "Étape 2 : Faire revenir les lardons à feu vif.",
                "Étape 3 : Mélanger les œufs et le parmesan dans un bol.",
                "Étape 4 : Mélanger le tout hors du feu. Poivrer généreusement.",
                "Étape 5 : Servir immédiatement."
            ];
            const stepsContainer = document.getElementById('recipe-steps');
            for (let i = 0; i < steps.length; i++) {
                const stepEl = document.createElement('div');
                stepEl.style.opacity = '0';
                stepEl.style.animation = 'fadeInModal 0.3s forwards';
                stepEl.style.padding = '12px';
                stepEl.style.background = '#fff';
                stepEl.style.borderRadius = '8px';
                stepEl.style.border = '1px solid #f1f5f9';
                stepEl.style.fontSize = '0.9rem';
                stepEl.style.color = '#334155';
                stepEl.innerText = steps[i];
                stepsContainer.appendChild(stepEl);
                await wait(500);
            }
            await wait(2000);
        }
"""

branch_logic = """                } else {
                    await runCookingBranch();
                }
            } else {
                await runCookingBranch();
            }"""

new_branch_logic = """                } else {
                    document.getElementById('delivery-app').remove();
                    await wait(300);
                    await runCookingBranch();
                }
            } else {
                await showThought(`C'est tentant... mais non.<span class="instruction">(Cliquez pour continuer)</span>`);
                await awaitClick();
                await hideThought();
                await runCookingBranch();
            }"""

content = content.replace(branch_logic, new_branch_logic)
if runCookingBranch_str in content:
    content = content.replace(runCookingBranch_str, "")
else:
    print("Could not find runCookingBranch_str")

scenario_start_idx = content.find("        async function runScenario() {")
content = content[:scenario_start_idx] + new_runCookingBranch_str + "\n" + content[scenario_start_idx:]

fade_out_old = """            // Fade screen out
            const screenEl = document.getElementById('screen');
            Array.from(screenEl.children).forEach(child => {
                child.style.transition = 'opacity 1.5s ease';
                child.style.opacity = '0';
            });
            screenEl.style.background = '#000';
            
            await wait(1500);
            
            const endOverlay = document.getElementById('fade-end');
            endOverlay.classList.add('active');"""

fade_out_new = """            const fadeOverlay = document.createElement('div');
            fadeOverlay.style.position = 'absolute';
            fadeOverlay.style.top = '0';
            fadeOverlay.style.left = '0';
            fadeOverlay.style.width = '100%';
            fadeOverlay.style.height = '100%';
            fadeOverlay.style.background = '#000';
            fadeOverlay.style.opacity = '0';
            fadeOverlay.style.transition = 'opacity 1.5s ease';
            fadeOverlay.style.zIndex = '999';
            document.getElementById('screen').appendChild(fadeOverlay);
            
            // Force reflow
            void fadeOverlay.offsetWidth;
            fadeOverlay.style.opacity = '1';
            
            await wait(1500);
            
            const endOverlay = document.getElementById('fade-end');
            endOverlay.classList.add('active');"""

content = content.replace(fade_out_old, fade_out_new)

with open(path, 'w') as f:
    f.write(content)

print("Done")

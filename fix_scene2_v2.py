import os
import re

path = '/Users/amalsoufi/SI28 AS/scene2.html'
with open(path, 'r') as f:
    content = f.read()

# 1. SVG Fills
apps_data_start = content.find("const appsData = [")
apps_data_end = content.find("];", apps_data_start)
apps_data_str = content[apps_data_start:apps_data_end]
new_apps_data_str = apps_data_str.replace('<path d=', '<path fill="white" d=')
content = content[:apps_data_start] + new_apps_data_str + content[apps_data_end:]

# 2. Delivery app scroll
old_scroll_div = '<div style="flex: 1; overflow-y: auto; padding: 20px 20px 120px; background: #f8fafc;">'
new_scroll_div = '<div style="position: absolute; top: 80px; bottom: 120px; left: 0; right: 0; overflow-y: auto; padding: 20px; background: #f8fafc;">'
content = content.replace(old_scroll_div, new_scroll_div)

# 3. Add data attributes to food-item
old_food_item = """                itemsList.forEach(item => {
                    itemsHTML += `
                        <div class="food-item">"""

new_food_item = """                itemsList.forEach((item, index) => {
                    itemsHTML += `
                        <div class="food-item" id="food-item-${index}" data-name="${item.name}" data-price="${item.new}" style="cursor: pointer;">"""

content = content.replace(old_food_item, new_food_item)

# 4. Selection logic + btn-order state
old_insertion = """                document.getElementById('screen').insertAdjacentHTML('beforeend', deliveryAppHTML);
                
                const actionChoice = await Promise.race(["""

new_insertion = """                document.getElementById('screen').insertAdjacentHTML('beforeend', deliveryAppHTML);
                
                let selectedItem = null;
                const btnOrder = document.getElementById('btn-order');
                btnOrder.style.opacity = '0.5';
                btnOrder.style.pointerEvents = 'none';
                
                const foodItemsEls = document.querySelectorAll('.food-item');
                foodItemsEls.forEach(el => {
                    el.addEventListener('click', () => {
                        foodItemsEls.forEach(f => {
                            f.style.border = '1px solid #f1f5f9';
                            f.style.background = '#fff';
                        });
                        el.style.border = '2px solid #3b82f6';
                        el.style.background = '#eff6ff';
                        selectedItem = {
                            name: el.dataset.name,
                            new: el.dataset.price
                        };
                        btnOrder.style.opacity = '1';
                        btnOrder.style.pointerEvents = 'auto';
                    });
                });
                
                const actionChoice = await Promise.race(["""

content = content.replace(old_insertion, new_insertion)

# Update order summary to use selectedItem
old_summary = """                                <div class="summary-row"><span>${itemsList[0].name}</span><span>${itemsList[0].new}</span></div>
                                <div class="summary-row"><span>Frais de livraison</span><span style="color: #10b981;">Offerts</span></div>
                                <div class="summary-row total"><span>Total à payer</span><span>${itemsList[0].new}</span></div>"""

new_summary = """                                <div class="summary-row"><span>${selectedItem.name}</span><span>${selectedItem.new}</span></div>
                                <div class="summary-row"><span>Frais de livraison</span><span style="color: #10b981;">Offerts</span></div>
                                <div class="summary-row total"><span>Total à payer</span><span>${selectedItem.new}</span></div>"""

content = content.replace(old_summary, new_summary)

# 5. Fix recipe order
old_recipe_order = """            await wait(800);
            await showThought(`Ok là c'est un peu trop.<span class="instruction">(Cliquez)</span>`);
            await awaitClick();
            await hideThought();
            document.getElementById('notif-fridge').classList.add('slide-up');
            await wait(500);
            
            await awaitElementClick('btn-start-recipe');"""

new_recipe_order = """            await wait(3000);
            document.getElementById('notif-fridge').classList.add('slide-up');
            
            await showThought(`Ok là c'est un peu trop.<span class="instruction">(Cliquez)</span>`);
            await awaitClick();
            await hideThought();
            
            await awaitElementClick('btn-start-recipe');"""

content = content.replace(old_recipe_order, new_recipe_order)

with open(path, 'w') as f:
    f.write(content)
print("Done")

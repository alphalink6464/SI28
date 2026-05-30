import os

path = '/Users/amalsoufi/SI28 AS/scene2.html'
with open(path, 'r') as f:
    content = f.read()

old_css = """        .home-screen {
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
        }
        .apps-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px 12px;
        }
        .app-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .app {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 18px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s;
            margin-bottom: 5px;
        }
        .app:active { transform: scale(0.9); }
        .app svg { width: 28px; height: 28px; fill: #fff; }
        .app-label {
            font-size: 0.65rem;
            font-family: 'Inter', sans-serif;
            color: #475569;
            text-align: center;
            font-weight: 500;
            background: rgba(255,255,255,0.7);
            padding: 2px 6px;
            border-radius: 6px;
        }"""

new_css = """        .home-screen {
            width: 100%;
            height: 100%;
            background: #ffffff;
            transition: background 0.3s ease;
            padding: 48px 20px 20px;
            display: flex;
            flex-direction: column;
        }
        .status-bar {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 24px;
            font-family: 'Inter', sans-serif;
            color: #1e293b;
        }
        .apps-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px 16px;
            padding: 0 4px;
        }
        .app-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .app {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 22px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s;
            margin-bottom: 5px;
        }
        .app:active { transform: scale(0.9); }
        .app svg { width: 32px; height: 32px; fill: #fff; }
        .app-label {
            font-size: 0.65rem;
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            text-align: center;
            font-weight: 500;
            margin-top: 4px;
        }"""

if old_css in content:
    content = content.replace(old_css, new_css)
    with open(path, 'w') as f:
        f.write(content)
    print("CSS successfully replaced.")
else:
    print("Error: Could not find old CSS block.")


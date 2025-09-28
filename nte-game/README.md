# NTE-GURUPI - Jogo (Phaser 3)

Este repositório contém uma versão em HTML5 (Phaser 3) do jogo estilo Super Mario, com 5 fases, som sintetizado e controles de teclado/touch. O personagem principal usa o arquivo `assets/player.png` (com label `NTE GPI` aplicado na imagem dentro do jogo) e os inimigos vêm do `assets/enemies.png`.

## Como rodar localmente

1. Abra `index.html` no navegador (Chrome/Edge/Firefox). Se o navegador bloquear por CORS, rode um servidor simples no diretório do projeto:
```bash
python -m http.server 8000
# depois abra http://localhost:8000
```

## Como publicar no Streamlit Community Cloud

1. Faça push deste diretório para um repositório GitHub (inclua `index.html`, `streamlit_app.py` e `assets/`).
2. No https://share.streamlit.io escolha "New app" -> aponte para este repositório e o arquivo `streamlit_app.py`.
3. O Streamlit exibirá o jogo (ele injeta o conteúdo de `index.html` em um iframe).

## Arquivos incluídos
- `index.html` — jogo Phaser 3 (HTML5)
- `streamlit_app.py` — wrapper para deploy no Streamlit Cloud
- `assets/player.png` — sua imagem do personagem (copiada)
- `assets/enemies.png` — sua imagem com inimigos (copiada)

---
Divirta-se!

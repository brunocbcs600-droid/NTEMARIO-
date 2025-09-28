import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(page_title="NTE GURUPI - Jogo", layout="wide")
st.title("NTE GURUPI — World 1-1 (Phaser)")

here = Path(__file__).parent
html_path = here / "index.html"
if not html_path.exists():
    st.error("index.html não encontrado. Faça upload de index.html e da pasta assets/ no mesmo diretório.")
else:
    html = html_path.read_text(encoding='utf-8')
    components.html(html, height=700, scrolling=True)

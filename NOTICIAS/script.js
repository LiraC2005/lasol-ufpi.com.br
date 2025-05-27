function filtrarNoticias() {
  const termo = document.getElementById('pesquisa-noticia').value.toLowerCase();
  const noticias = document.querySelectorAll('.noticia');
  let encontrou = false;

  noticias.forEach(div => {
    const data = div.querySelector('.noticia-data') ? div.querySelector('.noticia-data').textContent.toLowerCase() : '';
    const titulo = div.querySelector('.noticia-titulo').textContent.toLowerCase();
    const texto = div.querySelector('.noticia-texto') ? div.querySelector('.noticia-texto').textContent.toLowerCase() : '';
    div.style.display =
      data.includes(termo) ||
      titulo.includes(termo) ||
      texto.includes(termo) ||
      termo === ""
      ? ''
      : 'none';
  });

  if (termo !== "") {
    for (const div of noticias) {
      const data = div.querySelector('.noticia-data') ? div.querySelector('.noticia-data').textContent.toLowerCase() : '';
      const titulo = div.querySelector('.noticia-titulo').textContent.toLowerCase();
      const texto = div.querySelector('.noticia-texto') ? div.querySelector('.noticia-texto').textContent.toLowerCase() : '';
      if (data.includes(termo) || titulo.includes(termo) || texto.includes(termo)) {
        div.scrollIntoView({ behavior: "smooth", block: "center" });
        encontrou = true;
        break;
      }
    }
  }
}

window.filtrarNoticias = filtrarNoticias;
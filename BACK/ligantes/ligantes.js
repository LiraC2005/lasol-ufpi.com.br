import { membros } from "./ligantesDB.js";

// Mapeamento de áreas para títulos e classes CSS
const areaConfig = {
  orientadores: {
    titulo: "Orientadores",
    layout: "simples"
  },
  presidencia: {
    titulo: "Presidência",
    layout: "simples",
  },
  diretoriaEnsino: {
    titulo: "Diretoria de Ensino",
    layout: "piramide-2"
  },
  diretoriaPesquisa: {
    titulo: "Diretoria de Pesquisa e Inovação",
    layout: "piramide-2"
  },
  diretoriaExtensao: {
    titulo: "Diretoria de Extensão",
    layout: "piramide-2"
  },
  diretoriaComunicacao: {
    titulo: "Marketing",
    layout: "piramide-2"
  },
  diretoriaGeral: {
    titulo: "Diretoria Geral",
    layout: "piramide-2"
  },
};

function criarCard(membro) {
  const card = document.createElement('div');
  card.className = 'card_diretores';

  const link = document.createElement('a');
  link.href = membro.link || '#';

  const img = document.createElement('img');
  img.src = membro.foto || './asset/ligantes/Exemplar.webp';
  img.alt = membro.nome;
  img.loading = "lazy";
  img.className = 'img_diretor img';

  const nome = document.createElement('h1');
  nome.className = 'img_diretor nome';
  nome.textContent = membro.nome;

  const cargo = document.createElement('p');
  cargo.className = 'img_diretor texto';
  cargo.textContent = membro.cargo.toUpperCase();

  link.appendChild(img);
  card.appendChild(link);
  card.appendChild(nome);
  card.appendChild(cargo);

  return card;
}

function criarSection(area, membrosArea) {
  const config = areaConfig[area];
  if (!config || !membrosArea || membrosArea.length === 0) return;

  const isMobile = window.innerWidth <= 768;
  const section = document.createElement('section');
  section.className = 'cards_diretoria';

  const titulo = document.createElement('h1');
  titulo.className = 'TITULO';
  titulo.textContent = config.titulo;
  section.appendChild(titulo);

  // Layout simples (igual em desktop e mobile)
  if (config.layout === 'simples') {
    const separador = document.createElement('div');
    separador.className = 'separador';

    membrosArea.forEach(membro => {
      separador.appendChild(criarCard(membro));
    });

    section.appendChild(separador);
  }

  // Layout em pirâmide (desktop) ou linhas (mobile)
  else if (isMobile) {
    for (let i = 0; i < membrosArea.length; i += 2) {
      const linha = document.createElement('div');
      linha.className = 'linha-mobile';

      linha.appendChild(criarCard(membrosArea[i]));
      if (membrosArea[i + 1]) {
        linha.appendChild(criarCard(membrosArea[i + 1]));
      }

      section.appendChild(linha);
    }
  }

  else {
    section.classList.add(`area-${area}`);

    const qtdDiretores = parseInt(config.layout.split('-')[1], 10);

    const diretores = membrosArea.slice(0, qtdDiretores);
    const ligantes = membrosArea.slice(qtdDiretores);

    const piramideSuperior = document.createElement('div');
    piramideSuperior.className = `piramide-superior${qtdDiretores}`;

    const separadorDir = document.createElement('div');
    separadorDir.className = 'separador dir';
    diretores.forEach(membro => separadorDir.appendChild(criarCard(membro)));
    piramideSuperior.appendChild(separadorDir);
    section.appendChild(piramideSuperior);

    if (ligantes.length > 0) {
      const piramideInferior = document.createElement('div');
      piramideInferior.className = 'piramide-inferior';

      const separadorLig = document.createElement('div');
      separadorLig.className = 'separador lig';
      ligantes.forEach(membro => separadorLig.appendChild(criarCard(membro)));
      piramideInferior.appendChild(separadorLig);
      section.appendChild(piramideInferior);
    }
  }

  document.body.insertBefore(section, document.querySelector('footer'));
}


// Função principal para criar todas as seções
export function criarTodasSections() {
  Object.keys(membros).forEach(area => {
    if (membros[area].length > 0) {
      criarSection(area, membros[area]);
    }
  });
}

// Chamada inicial
criarTodasSections();
// Esconde todos os módulos e aulas ao iniciar
document.querySelectorAll('.modulos').forEach(m => m.style.display = 'none');
document.querySelectorAll('.aulas').forEach(a => a.style.display = 'none');

// Cria botão de voltar
let btnVoltar = document.createElement('button');
btnVoltar.textContent = '← Voltar aos cursos';
btnVoltar.className = 'btn-voltar';
btnVoltar.style.display = 'none';
btnVoltar.style.marginBottom = '24px';
document.querySelector('.video-list').prepend(btnVoltar);

// Referência ao título dos cursos disponíveis
const tituloCursos = document.querySelector('.video-list h2');
// Referência ao nome do curso selecionado
const nomesCursos = document.querySelectorAll('.pasta-btn');

// Clique no curso mostra/esconde os módulos e muda cor do ícone
document.querySelectorAll('.pasta-btn').forEach(btn => {
    btn.style.marginBottom = "24px"; // Espaço entre cursos
    btn.addEventListener('click', function () {
        const modulos = btn.nextElementSibling;
        const isOpen = modulos.style.display === 'block';
        // Esconde todos os cursos exceto o selecionado
        document.querySelectorAll('.curso-pasta').forEach(curso => {
            if (curso.contains(btn)) {
                curso.style.display = 'block';
            } else {
                curso.style.display = 'none';
            }
        });
        // Fecha todos os módulos e reseta ícones
        document.querySelectorAll('.modulos').forEach(m => m.style.display = 'none');
        document.querySelectorAll('.pasta-btn').forEach(b => b.classList.remove('ativo'));
        // Alterna exibição e cor
        if (!isOpen) {
            modulos.style.display = 'block';
            btn.classList.add('ativo');
            btnVoltar.style.display = 'block';
            if (tituloCursos) tituloCursos.style.display = 'none'; // Esconde o título
            btn.style.display = 'none'; // Esconde o nome do curso selecionado
        } else {
            modulos.style.display = 'none';
            btn.classList.remove('ativo');
            // Se fechar, mostra todos os cursos novamente
            document.querySelectorAll('.curso-pasta').forEach(curso => curso.style.display = 'block');
            btnVoltar.style.display = 'none';
            if (tituloCursos) tituloCursos.style.display = 'block'; // Mostra o título
            btn.style.display = 'block'; // Mostra o nome do curso novamente
        }
        // Esconde todas as aulas ao fechar/abrir curso
        document.querySelectorAll('.aulas').forEach(a => a.style.display = 'none');
    });
});

// Clique no botão voltar mostra todos os cursos e esconde módulos/aulas
btnVoltar.addEventListener('click', function () {
    document.querySelectorAll('.curso-pasta').forEach(curso => curso.style.display = 'block');
    document.querySelectorAll('.modulos').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.pasta-btn').forEach(b => {
        b.classList.remove('ativo');
        b.style.display = 'block'; // Mostra todos os nomes dos cursos
    });
    document.querySelectorAll('.aulas').forEach(a => a.style.display = 'none');
    btnVoltar.style.display = 'none';
    if (tituloCursos) tituloCursos.style.display = 'block'; // Mostra o título
});

// Clique no módulo mostra/esconde as aulas e muda cor do ícone
document.querySelectorAll('.modulo-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const aulas = btn.nextElementSibling;
        const isOpen = aulas.style.display === 'block';
        // Fecha todas as aulas e reseta ícones
        btn.parentElement.parentElement.querySelectorAll('.aulas').forEach(a => a.style.display = 'none');
        btn.parentElement.parentElement.querySelectorAll('.modulo-btn').forEach(b => b.classList.remove('ativo'));
        // Alterna exibição e cor
        if (!isOpen) {
            aulas.style.display = 'block';
            btn.classList.add('ativo');
        } else {
            aulas.style.display = 'none';
            btn.classList.remove('ativo');
        }
    });
});

// Clique na aula troca o vídeo
document.querySelectorAll('.aulas button').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.aulas button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const videoId = btn.getAttribute('data-video');
        const title = btn.getAttribute('data-title');
        // Mostra vídeo e título, esconde apresentação
        document.getElementById('curso-video').src = 'https://www.youtube.com/embed/' + videoId;
        document.getElementById('curso-video').title = title;
        document.getElementById('video-title').textContent = title;
        document.getElementById('curso-video').style.display = 'block';
        document.getElementById('video-title').style.display = 'block';
        const apresentacao = document.getElementById('video-apresentacao');
        if (apresentacao) apresentacao.style.display = 'none';
    });
});

// Não abre nada automaticamente ao carregar a página

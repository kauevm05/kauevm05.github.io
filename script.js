// elementos do jogo
const flash = document.querySelector('.flash');////selecionar elemento
const gameContainer = document.querySelector('#game-container');//selecionar elemento
const scoreElement = document.getElementById('score');//selecionar elemento
const startBtn = document.getElementById('start-btn');//selecionar elemento

let isJumping = false;//bolinha pulando , se n estiver é false
let isGameOver = false;//indica se o jogo terminou , flase esta em andamento
let score = 0;// pontuação,começa em 0 
let positionX = 50; // posiçao horizontal da bolinha 
const speed = 10; // velocidade de movimento lateral

// pular
function jump() {
    if (isJumping) return;//verifica se é verdadeira, se nao for volta

    isJumping = true;//verdadeiro
    let position = 0;//altura atual do salto

    // sobe
    const upInterval = setInterval(() => {//loop que será executado a cada 15 milissegundos
        if (position >= 150) { // altura maxima do pulo
            clearInterval(upInterval);//limpar intervalo de subida

            // Desce
            const downInterval = setInterval(() => {
                if (position <= 0) { // menor ou igual a 0 volta ao chão
                    clearInterval(downInterval);//limpar intervalo de descida
                    isJumping = false;
                }
                position -= 10; // velocidade de descida
                flash.style.bottom = position + 50 + 'px'; // ajustado para ficar acima da plataforma
            }, 15); // Intervalo reduzido para descer mais rápido
        }
        position += 10; // velocidade de subida
        flash.style.bottom = position + 50 + 'px'; // Ajustado para ficar acima da plataforma
    }, 15); // intervalo reduzido para subir mais rápido
}

// mover a bolinha para a esquerda e direita
function moveFlash() {//para controlar bolinha
    document.addEventListener('keydown', (event) => {//precionar a tecla selecionada recebe a funçao de event
        if (isGameOver) return;//se o jogo finalizar ele retorna impedindomovimento adicional

        if (event.code === 'ArrowRight') {
            positionX += speed; //  pressionar  seta para a direita (arrowright),movendo  para a direita
            if (positionX > gameContainer.offsetWidth - flash.offsetWidth) {
                positionX = gameContainer.offsetWidth - flash.offsetWidth; // Impede de sair da tela
            }
        } else if (event.code === 'ArrowLeft') {
            positionX -= speed; // pressionar  seta para a esquerda (arrowleft),movendo  para a esquerda
            if (positionX < 0) {
                positionX = 0; // impede de sair da tela
            }
        }
        flash.style.left = positionX + 'px'; // atualiza a posição da bolinha no eixo horizontal
    });
}

// função para criar obstáculos
function createObstacle() {//criar obstaculo 
    const obstacle = document.createElement('div');//div criada e armazenada na contante obstacle
    obstacle.classList.add('obstacle');//classe adicionada a um elemento 
    gameContainer.appendChild(obstacle);//aparecer na tela

    let obstaclePosition = gameContainer.offsetWidth;//posição definida pela largura, obtaculo começar fora da tela
    obstacle.style.left = obstaclePosition + 'px';//posição é aplicada ao estilo do elemento obstacle no eixo horizontal da esquerda.

    const moveInterval = setInterval(() => {// mover
        if (isGameOver) {
            clearInterval(moveInterval);
            obstacle.remove();
            return; // se o jogo acabar limpa o intervalo e obstaculo é removido da tela
        }

        // detectar colisão
        const flashBottom = parseInt(window.getComputedStyle(flash).bottom);//posição do elemento flashse ve usando window.getComputedStyle, que da pra ver se houve uma colisão 
        if (
            obstaclePosition > positionX &&
            obstaclePosition < positionX + flash.offsetWidth &&
            flashBottom < 90    //se a bolinha está abaixo de 90 pixels (altura do obstáculo + tolerância). 
            
        ) {
            isGameOver = true;//perdeu
            alert('Game Over! Sua pontuação foi: ' + score);//mensagem da pontuação
            location.reload();//pagina recarregada
        }

        // move o obstáculo
        obstaclePosition -= 10;
        obstacle.style.left = obstaclePosition + 'px';//se n tiver colisao , movido para esquerda e muda seu estilo

        if (obstaclePosition < -40) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreElement.textContent = `Pontuação: ${score}`;//se sair pra fora da tela o intervalo é limpo e o obstaculo some e aumenta a sua pontuação
        }
    }, 20);

    setTimeout(createObstacle, Math.random() * 2000 + 1000);//novo obstaculo é programado para ser criado em um tempo entre 1000 e 3000 milissegundos
}

//  iniciar o jogo
function startGame() {
    score = 0;//pontuação inicia no 0
    scoreElement.textContent = `Pontuação: ${score}`;//pontuação atual
    isGameOver = false;//mostrar q jogo ta rodando
    positionX = 50;//posicção inicial de 50 pixel a partir da esquerda
    flash.style.left = positionX + 'px';//posição da bolinha atuslizada para ver a nova postionX
    
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            jump();
        } // quando apertar espaço pular
    });

    moveFlash();//iniciar movimento da bolinha
    createObstacle();//gerar obstaculos
    startBtn.style.display = 'none'; // esconder o botão de iniciar depoisde começar
}

// Inicializa o jogo ao clicar no botão
startBtn.addEventListener('click', startGame);

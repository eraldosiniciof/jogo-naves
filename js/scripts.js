function start() {
  $('#inicio').hide()

  $('#fundoGame').append('<div id="jogador" class="anima1"></div>')
  $('#fundoGame').append('<div id="inimigo1" class="anima2"></div>')
  $('#fundoGame').append('<div id="inimigo2"></div>')
  $('#fundoGame').append('<div id="amigo" class="anima3"></div>')
  $('#fundoGame').append('<div id="placar"></div>')
  $('#fundoGame').append('<div id="energia"></div>')

  const moveFundo = () => {
    const esquerda = parseInt($('#fundoGame').css('background-position'))
    $('#fundoGame').css('background-position', esquerda - 2)
  }

  let podeAtirar = true
  let pontos = 0
  let salvos = 0
  let perdidos = 0
  let energiaAtual = 3
  const jogo = {}
  const acao = {
    paraCima: 38,
    paraBaixo: 40,
    paraDireita: 39,
    paraEsquerda: 37,
    tiro: 81,
  }
  let velocidadeApache = 7
  let velocidadeCaminhao = 5

  const somDisparo = document.querySelector('#somDisparo')
  const somExplosao = document.querySelector('#somExplosao')
  const musica = document.querySelector('#musica')
  const somGameOver = document.querySelector('#somGameOver')
  const somPerdido = document.querySelector('#somPerdido')
  const somResgate = document.querySelector('#somResgate')

  musica.play()
  musica.addEventListener('ended', () => {
    musica.currentTime = 0
    musica.play()
  })

  const gameOver = () => {
    musica.pause()
    somGameOver.play()

    window.clearInterval(jogo.timer)
    jogo.timer = null

    $('#jogador').remove()
    $('#inimigo1').remove()
    $('#amigo').remove()
    $('#inimigo2').remove()

    $('#fundoGame').append('<div id="fim"></div>')
    $('#fim').html(
      `<h1> Game Over </h1><div id="resumo"><p>Sua pontuação foi: ${pontos}.</p><p>Você salvou ${salvos} amigos e ${perdidos} foram perdidos.</p></div><div id="reinicia" onClick="reiniciaJogo()"><h3>Jogar Novamente</h3></div>`
    )
  }

  const moveJogador = () => {
    const horizontal = parseInt($('#jogador').css('left'))
    if (jogo.pressionou[acao.paraDireita]) {
      const right = horizontal

      right >= 670
        ? $('#jogador').css('left', right - 10)
        : $('#jogador').css('left', right + 10)
    }

    if (jogo.pressionou[acao.paraEsquerda]) {
      const left = horizontal

      left <= 0
        ? $('#jogador').css('left', left + 10)
        : $('#jogador').css('left', left - 10)
    }

    if (jogo.pressionou[acao.paraCima]) {
      const topo = parseInt($('#jogador').css('top'))

      topo <= 0
        ? $('#jogador').css('top', topo + 10)
        : $('#jogador').css('top', topo - 10)
    }

    if (jogo.pressionou[acao.paraBaixo]) {
      const topo = parseInt($('#jogador').css('top'))

      topo >= 434
        ? $('#jogador').css('top', topo - 10)
        : $('#jogador').css('top', topo + 10)
    }

    if (jogo.pressionou[acao.tiro]) {
      disparo()
    }
  }

  let velocidade = 7
  const randomY = () => parseInt(Math.random() * 334)
  let posicaoY = randomY()

  const moveInimigo1 = () => {
    let posicaoX = parseInt($('#inimigo1').css('left'))
    $('#inimigo1').css('left', posicaoX - velocidadeApache)
    $('#inimigo1').css('top', posicaoY)

    if (posicaoX <= 0) {
      posicaoY = randomY()
      $('#inimigo1').css('left', 850)
      $('#inimigo1').css('top', posicaoY)
    }
  }

  const moveCaminhao = () => {
    let posicaoX = parseInt($('#inimigo2').css('left'))

    posicaoX <= 0
      ? $('#inimigo2').css('left', 900)
      : $('#inimigo2').css('left', posicaoX - velocidadeCaminhao)
  }

  const moveAmigo = () => {
    let posicaoX = parseInt($('#amigo').css('left'))

    posicaoX >= 900
      ? $('#amigo').css('left', 10)
      : $('#amigo').css('left', posicaoX + (velocidade - 4))
  }

  const disparo = () => {
    if (podeAtirar) {
      podeAtirar = false
      somDisparo.play()

      const topo = parseInt($('#jogador').css('top'))
      const posicaoX = parseInt($('#jogador').css('left'))
      const tiroX = posicaoX + 190
      const topoTiro = topo + 43

      $('#fundoGame').append('<div id="disparo"></div>')
      $('#disparo').css('top', topoTiro)
      $('#disparo').css('left', tiroX)

      const tempoDisparo = window.setInterval(() => {
        let posicaoX = parseInt($('#disparo').css('left'))
        $('#disparo').css('left', posicaoX + 30)

        if (posicaoX > 860) {
          window.clearInterval(tempoDisparo)
          $('#disparo').remove()
          podeAtirar = true
        }
      }, 30)
    }
  }

  const explosao = (divElement, imgExplosao, ...params) => {
    $('#fundoGame').append(`<div id='${divElement}'></div>`)
    $(`#${divElement}`).css(
      'background-image',
      `url(./imgs/${imgExplosao}.png)`
    )
    const div = $(`#${divElement}`)
    div.css('top', params[1])
    div.css('left', params[0])
    div.animate({ width: 200, opacity: 0 }, 'slow')

    const tempoExplosao = window.setInterval(() => {
      div.remove()
      window.clearInterval(tempoExplosao)
    }, 1000)
  }

  const explodeAmigo = (amigoX, amigoY) => {
    somPerdido.play()
    $('#fundoGame').append('<div id="explodeAmigo" class="anima4"></div>')
    $('#explodeAmigo').css('left', amigoX)
    $('#explodeAmigo').css('top', amigoY)
  }

  const colisao = () => {
    const colisao1 = !!$('#jogador').collision($('#inimigo1')).length
    const colisao2 = !!$('#jogador').collision($('#inimigo2')).length
    const colisao3 = !!$('#disparo').collision($('#inimigo1')).length
    const colisao4 = !!$('#disparo').collision($('#inimigo2')).length
    const colisao5 = !!$('#jogador').collision($('#amigo')).length
    const colisao6 = !!$('#inimigo2').collision($('#amigo')).length

    if (colisao6) {
      perdidos++
      const amigoX = parseInt($('#amigo').css('left'))
      const amigoY = parseInt($('#amigo').css('top'))
      explodeAmigo(amigoX, amigoY)
      $('#amigo').css('left', -400)
      setTimeout(() => {
        $('#explodeAmigo').remove()
      }, 1000)
    }

    if (colisao5) {
      somResgate.play()
      salvos++
      $('#amigo').css('left', -400)
    }

    if (colisao4) {
      pontos += 50
      velocidadeCaminhao += 0.7
      const inimigo2X = parseInt($('#inimigo2').css('left'))
      const inimigo2Y = parseInt($('#inimigo2').css('top'))
      explosao('explosao1', 'explosao', inimigo2X, inimigo2Y)

      $('#disparo').css('left', 960)
      $('#inimigo2').css('left', 1500)
    }

    if (colisao3) {
      pontos += 100
      velocidadeApache += 0.6
      const inimigo1X = parseInt($('#inimigo1').css('left'))
      const inimigo1Y = parseInt($('#inimigo1').css('top'))
      explosao('explosao1', 'explosao', inimigo1X, inimigo1Y)

      $('#disparo').css('left', 960)

      posicaoY = randomY()
      $('#inimigo1').css('left', 1500)
      $('#inimigo1').css('top', posicaoY)
    }

    if (colisao2) {
      somExplosao.play()
      energiaAtual--
      const inimigo2X = parseInt($('#inimigo2').css('left'))
      const inimigo2Y = parseInt($('#inimigo2').css('top'))
      explosao('explosao2', 'explosao', inimigo2X, inimigo2Y)

      $('#inimigo2').css('left', 1200)
    }

    if (colisao1) {
      somExplosao.play()
      energiaAtual--
      const inimigo1X = parseInt($('#inimigo1').css('left'))
      const inimigo1Y = parseInt($('#inimigo1').css('top'))
      explosao('explosao1', 'explosao', inimigo1X, inimigo1Y)

      posicaoY = randomY()
      $('#inimigo1').css('left', 694)
      $('#inimigo1').css('top', posicaoY)
    }
  }

  const placar = () => {
    $('#placar').html(
      `<h2>Pontos: ${pontos} | Amigos Salvos: ${salvos} | Amigos Perdidos: ${perdidos}</h2>`
    )
  }

  const energia = () => {
    const attEnergia = img =>
      $('#energia').css('background-image', `url(imgs/energia${img}.png)`)
    switch (energiaAtual) {
      case 3:
        attEnergia(3)
        break
      case 2:
        attEnergia(2)
        break
      case 1:
        attEnergia(1)
        break
      case 0:
        attEnergia(0)
        gameOver()
        break
    }
  }

  jogo.pressionou = []
  $(document).keydown(event => (jogo.pressionou[event.which] = true))
  $(document).keyup(event => (jogo.pressionou[event.which] = false))

  const loop = () => {
    moveFundo()
    moveJogador()
    moveInimigo1()
    moveCaminhao()
    moveAmigo()
    colisao()
    placar()
    energia()
  }
  jogo.timer = setInterval(loop, 30)
}

function reiniciaJogo() {
  somGameOver.pause()
  $('#fim').remove()
  start()
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
function shuffleDeck(deck) {
  const len = deck.length
  let shuffled = []
  let card
  for (let i = 0; i < len; i++) {
    ;[card, deck] = getRandomCard(deck)
    shuffled.push(card)
  }
  return shuffled
}
function getRandomCard(deck) {
  const id = getRandomInt(deck.length)
  return [deck[id], [...deck.slice(0, id), ...deck.slice(id + 1)]]
}

function loadDeck(id, { sections, automa }) {
  const app = document.getElementById('app')
  const ai = automa[id]
  let deck = shuffleDeck(ai.deck)
  console.log(deck)
  const drawCard = function() {
    const drawnCard = deck.shift()
    deck.push(drawnCard)

    const card = document.getElementById('card')
    card.innerHTML = ''
    sections.forEach(({ title, id, description, ordered }) => {
      if (drawnCard[id].length) {
        card.innerHTML += `<div id="card-${id}"><div class="title"><b>${title}</b>`
        if (description) {
          card.innerHTML += ` - <span>${description}</span></div>`
        }
        card.innerHTML += `<${ordered ? 'ol' : 'ul'}>${drawnCard[id]
          .map(s => `<li>${s}</li>`)
          .join('')}</${ordered ? 'ol' : 'ul'}></div>`
      }
    })
    card.innerHTML += `<div id="card-number">${drawnCard.card}</div>`

    if (drawnCard.shuffle) {
      deck = shuffleDeck(deck)
    }
  }
  app.innerHTML = `<section class="deck ${ai.id}"><header>${
    ai.name
  }</header><div id="notes"><ul>${ai.notes
    .map(n => `<li>${n}</li>`)
    .join(
      ''
    )}</ul></div><article id="card"></article><div id="draw">Draw Card</div></section>`
  const drawButton = document.getElementById('draw')
  const drawHandle = function(event) {
    drawCard()
  }
  drawButton.addEventListener('click', drawHandle)
}
function loadChooseAutoma(data) {
  const automaNames = data.automa.map(({ name }) => name)
  const app = document.getElementById('app')
  loadList()
  function deckSelect({ target }) {
    if (target.classList.contains('deck')) {
      app.removeEventListener('click', deckSelect)
      loadDeck(target.dataset.id, data)
    }
  }
  function loadList() {
    app.innerHTML = `<section><header>Choose Your Deck</header><ul>${automaNames
      .map((name, i) => `<li class="deck" data-id=${i}>${name}</li>`)
      .join('')}</ul></section>`

    app.addEventListener('click', deckSelect)
  }
}

;(async function() {
  let data
  try {
    const response = await fetch('outer_rim_solo_decks.json')
    if (!response.ok) {
      throw new Error('Network response was not ok.')
    }
    data = await response.json()
  } catch (error) {
    console.log(
      'There has been a problem with your fetch operation: ',
      error.message
    )
  }
  return data
})().then(loadChooseAutoma)

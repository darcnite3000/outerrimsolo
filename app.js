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
      let innerHTML = ''
      if (drawnCard[id].length) {
        innerHTML += `<div class="card-section ${id}"><div class="card-section-blurb"><span class="card-section-title">${title}</span>`
        if (description) {
          innerHTML += ` - <span class="card-section-description">${description}</span>`
        }
        innerHTML += `</div><${
          ordered ? 'ol' : 'ul'
        } class="card-section-actions">${drawnCard[id]
          .map(s => `<li>${s}</li>`)
          .join('')}</${ordered ? 'ol' : 'ul'}></div>`
      }
      card.innerHTML += innerHTML
    })
    card.innerHTML += `<div class="card-number">${drawnCard.card}</div>`

    if (drawnCard.shuffle) {
      deck = shuffleDeck(deck)
    }
  }
  app.innerHTML = `<section class="automa ${ai.id}"><header>${
    ai.name
  }</header><div class="notes"><ul>${ai.notes
    .map(n => `<li>${n}</li>`)
    .join(
      ''
    )}</ul></div><div class="controls"><div class="draw">Draw Card</div><div class="back">Back to Main</div></div><article id="card" title="Click to draw new card"></article></section>`
  const drawButton = document.getElementsByClassName('draw')[0]
  const backButton = document.getElementsByClassName('back')[0]
  const card = document.getElementById('card')
  const backHandle = function(event) {
    event.preventDefault()
    if (window.confirm('Do you really want to go back to the ai selction?')) {
      document.location.reload()
    }
  }
  const drawHandle = function(event) {
    event.preventDefault()
    drawCard()
  }
  drawButton.addEventListener('click', drawHandle)
  card.addEventListener('click', drawHandle)
  backButton.addEventListener('click', backHandle)
}
function loadChooseAutoma(data) {
  const automaNames = data.automa.map(({ name, id }) => ({
    name,
    id
  }))
  const app = document.getElementById('app')
  loadList()
  function deckSelect({ target }) {
    if (target.classList.contains('deck')) {
      event.preventDefault()
      app.removeEventListener('click', deckSelect)
      loadDeck(target.dataset.id, data)
    }
  }
  function loadList() {
    app.innerHTML = `<section class="main"><header>Choose Your Deck</header><ul>${automaNames
      .map(
        ({ name, id }, i) => `<li class="deck ${id}" data-id=${i}>${name}</li>`
      )
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

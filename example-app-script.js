let myLocalState = null

async function launchApp() {
  const response = await Core.send({ type: 'state' })
  myLocalState = response.state
  //  IMPORTANT: set initial local state with Core.interact
  //             so the core layer knows the starting point
  if (myLocalState) Core.interact(myLocalState)
  renderLocalState()
}

function renderLocalState() {
  const pre = document.querySelector('pre')
  pre.innerHTML = ""
  pre.appendChild(
    document.createTextNode(JSON.stringify(myLocalState, null, 4))
  )
}

window.resetState = function() {
  myLocalState = { initialState: 'for Example...' }
  Core.interact(myLocalState)
  renderLocalState()
}

window.addRandomKey = function() {
  myLocalState[Math.random()] = 'A value for a random key!'
  Core.interact(myLocalState)
  renderLocalState()
}

//  waiting for 'load' event is only necessary if you are asynchronously loading the api integration script
window.addEventListener('load', () => launchApp())

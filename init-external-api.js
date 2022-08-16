import { v1 as uuid } from 'uuid'
import { compare as JSONPatchCompare } from 'fast-json-patch'

let sessionId = null
let lastState = null
let messageIndex = 0

const upstreamMessageHandlers = {}
window.addEventListener('message', ({ data: { requestId, response, error } }) => {
  const handler = upstreamMessageHandlers[requestId]
  if (!handler) return

  if (error) handler.reject(error)
  else handler.resolve(response)
})

const postCoreMessage = message => {
  const requestId = uuid()
  messageIndex += 1
  //  default to window opener if present
  const upstream = window.opener || window.parent
  upstream.postMessage({ ...message, sessionId, requestId, index: messageIndex }, '*')

  return new Promise( (resolve, reject) => {
    upstreamMessageHandlers[requestId] = { resolve, reject }
  })
}

const copy = v => JSON.parse(JSON.stringify(v))

window.Core = {
  send: postCoreMessage,
  interact: async state => {
    const patch = state ? JSONPatchCompare(lastState || {}, state) : [{ op: 'set', path: '', value: null }]
    lastState = copy(state)
    if (patch.length) postCoreMessage({ type: 'interact', patch })
  }
}

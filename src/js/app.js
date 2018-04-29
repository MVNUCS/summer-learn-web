'use strict'

/** Submit user input with Submit button */
document.querySelector('.submit-button').addEventListener('click', (e) => sendUserText(document.querySelector('.user-input').value))

/** Submit user input with Enter key */
document.querySelector('.user-input').addEventListener('keypress', (e) => {
  if (e.which === 13) sendUserText(document.querySelector('.user-input').value)
})

/** Generate a unique session ID each time a user chats with the bot */
function generateSessionID () {
  function S4 () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) }
  return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}

const SESSION_ID = generateSessionID()

/**
 * Send user input to Dialogflow to get a response from the bot service
 * @param {string} text The input to send to Dialogflow for processing
 */
async function processUserInput (text) {
  const accessToken = '5a8c45794eef491495bcfaa8df11ab8e'
  const baseUrl = 'https://api.dialogflow.com/v1/'
  try {
    let res = await window.fetch(baseUrl + 'query?v=20170712', {
      method: 'POST',
      body: JSON.stringify({
        query: text,
        lang: 'en',
        sessionId: SESSION_ID
      }),
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    })
    let data = await res.json()
    sendBotText(data.result.fulfillment.speech)
  } catch (error) {
    console.log(error)
    sendBotText('Sorry! It seems I am having issues connecting. Try again later.')
  }
}

/**
 * Scroll the chat window as messages appear
 */
function scrollChatToBottom () {
  const div = document.querySelector('.chat-body')
  div.scrollTop = div.scrollHeight
}

/**
 * Send any bot input to the chat window with the correct styling
 * @param {string} text The text to send to the chat window
 */
function sendBotText (text) {
  const botText = document.createElement('p')
  botText.setAttribute('class', 'bot-text')
  botText.appendChild(document.createTextNode(text))
  document.querySelector('.chat-body').appendChild(botText)
  scrollChatToBottom()
}

/**
 * Send user input to the chat window with the correct styling
 * @param {string} text The text to send to the chat window
 */
function sendUserText (text) {
  if (validateText(text)) {
    const userText = document.createElement('p')
    userText.setAttribute('class', 'user-text')
    userText.appendChild(document.createTextNode(text))
    document.querySelector('.chat-body').appendChild(userText)
    document.querySelector('.user-input').value = ''
    processUserInput(text)
    scrollChatToBottom()
  }
}

/**
 * Validate the input the user says to make sure we aren't sending invalid input
 * @param {string} text The input to check
 */
function validateText (text) {
  return (text !== '' && text.trim() !== '')
}

/** Send the initial bot text */
sendBotText('Welcome to Summer Learn Bot. I can help answer questions about the summer learn program at MVNU. How can I help you?')

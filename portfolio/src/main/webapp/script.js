// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
      ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/**
 * Changes background color
 * @param {string} color 
 */
function changeBackgroundColor(color) {
    document.body.style.background = color;
}

/**
 * Fetches a message from the server and adds it to the DOM.
 */
async function getGreetingMessage() {
    const response = await fetch('/data');
    const message = await response.text();
    document.getElementById('message-container').textContent = message;
}

/**
 * Fetches a list of messages from the server and adds it to the DOM.
 */
async function getMessages() {
    const response = await fetch('/data');
    const json = await response.json();

    const ulElement = document.getElementById('messages-list');
    ulElement.textContent = '';
    for (message of json) {
        ulElement.appendChild(createListElement(message));
    }
}

/**
 * Creates and returns a list elements.
 * @param {string} text
 * @return {!Element}
 */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.textContent = text;
  return liElement;
}

/**
 * Fetches a list of comments from the server and adds it to the DOM.
 */
async function getComments() {
    const response = await fetch('/addcomment');
    const json = await response.json();

    const ulElement = document.getElementById('comments-list');
    for (comment of json) {
        ulElement.appendChild(createListElement(comment));
    }
    if (ulElement.textContent.trim() === '') {
        ulElement.textContent = 'No comments yet.';
    }
}

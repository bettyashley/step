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

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/**
 * Global variables
 */
let loginEl, addCommentsEl, nicknameEl;

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
    const response = await fetch(`/listcomment?num=${document.getElementById('num').value}`);
    const json = await response.json();

    const ulElement = document.getElementById('comments-list');
    ulElement.textContent = '';
    for (comment of json) {
        ulElement.appendChild(createListElement(comment));
    }
    if(json.length === 0) {
        ulElement.textContent = 'No comments yet.';
    }
}

/**
 * Sends a request to the servlet to delete all comments.
 */
function deleteComments() {
    fetch('/deletecomment').then(getComments());
}

/** 
 * Initializes all the variables needed for updateComments().
 */
function getLogin() {
    loginEl = document.getElementById("login");
    addCommentsEl = document.getElementById("comments-form");
    nicknameEl = document.getElementById("login-info");
    updateComments();
}

/** 
 * Fetches login status from the server.
 */
function updateComments() {
    fetch('/login').then(res => res.json()).then(json => {
        addCommentsEl.hidden = !json.loggedIn;
        nicknameEl.hidden = !json.loggedIn;
        updateLogin(json.displayText, json.url);
        if (json.loggedIn) {
            document.getElementById("nickname").value = json.nickname;
        }
    });
}

/** 
 * Updates the login element.
 * @param {string} text
 * @param {href} href
 */
function updateLogin(text, href){
    loginEl.textContent = text;
    loginEl.href = href;
}

/** 
 * Fetches color data and uses it to create a chart.
 */
function drawChart() {
    fetch('/colordata').then(response => response.json()).then((colorVotes) => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Color');
        data.addColumn('number', 'Votes');
        Object.keys(colorVotes).forEach((color) => {
            data.addRow([color, colorVotes[color]]);
        });
        
        const options = {
            'title': 'Favorite Pastel Colors',
            'width':600,
            'height':500,
            'colors': ['Pink', 'PeachPuff', 'LightYellow', 'Aquamarine', 'LightCyan', 'Lavender']
        };
        
        const chart = new google.visualization.PieChart(
            document.getElementById('chart-container'));
            chart.draw(data, options);
        }
    );
}

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const convertFactory = require('electron-html-to');

var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
  });


let data = {};

let questions = [
    {
        message: 'What is your github username?',
        name: 'username',
    },
    {
        message: 'What is your favorite color',
        name: 'color',
        type: 'list',
        choices: ['green', 'blue', 'pink', 'red'],
    }
]

function init() {
    inquirer
    .prompt(questions)
    .then(function ({username, color}) {
        const queryUrl = `https://api.github.com/users/${username}`; 

        axios
            .get(queryUrl)
            .then((res) => {    

                switch(color) {
                    case 'green':
                        data.color = 0;
                        break;
                    case 'blue':
                        data.color = 1;
                        break;  
                    case 'pink':
                        data.color = 2;
                        break;
                    case 'red':
                        data.color = 3;
                        break;
                }          
            })
    })
}

init();

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

                data.username = username;
                data.numOfRepo = res.data.public_repos;
                data.name = res.data.name
                data.followers = res.data.followers;
                data.following = res.data.following;
                data.portPic = res.data.avatar_url;
                data.location = res.data.location;
                data.blog = res.data.blog; 
                data.company = res.data.company
                data.bio = res.data.bio

                axios // Requires a different axios call to get stars
                    .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                    .then((res) => {
                       
                        data.stars = 0;
                        for (let i = 0; i < res.data.length; i++) { // Loop through each repository and count the number of stars
                            data.stars += res.data[i].stargazers_count;
                        }
                        

                        let resumeHTML = generateHTML(data);
                       

                        conversion({ html: resumeHTML }, function(err, result) {
                            if (err) {
                              return console.error(err);
                            }
                           
                            console.log(result.numberOfPages);
                            console.log(result.logs);
                            result.stream.pipe(fs.createWriteStream('./resume.pdf'));
                            conversion.kill();
                          });
                    })
            })
    })
}

init();

const colors = [ 
    { // Green
       wrapperBackground: "#E6E1C3",
       headerBackground: "#C1C72C",
       headerColor: "black",
       photoBorderColor: "#black"
     },
     { // Blue
       wrapperBackground: "#5F64D3",
       headerBackground: "#26175A",
       headerColor: "white",
       photoBorderColor: "#73448C"
     },
     {
      // Pink
       wrapperBackground: "#879CDF",
       headerBackground: "#FF8374",
       headerColor: "white",
       photoBorderColor: "#FEE24C"
     },
     { // Red
       wrapperBackground: "#DE9967",
       headerBackground: "#870603",
       headerColor: "white",
       photoBorderColor: "white"
     }
 ];
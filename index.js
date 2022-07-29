const express = require("express");

const path = require("path");

const { JSDOM } = require("jsdom");

const axios = require("axios");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || "8888";

const media_api = "http://api.mediastack.com/v1";

const livescore_api = "https://livescore-api.com/api-client/scores/live.json?";

let date = new Date();

let current_date = date.toISOString().slice(0,10);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

//set up static path (for use with CSS, client-side JS, and image files)
app.use(express.static(path.join(__dirname, "public")));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.get("/", (req, res) => {
    getNews(res ,'index','general', current_date);
});
app.get("/entertainment", (req, res) => {
    getNews(res,'entertainment' ,'entertainment' , '');
});

app.get("/live-sports", (req, res) => {
    getLiveSports(res);
});

//HTTP server listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});


/**
 * Function to retrieve latest business new
 * then render on the page.
 *
 * @param {Response} res The Response for the page to be used for rendering.
 * @param view
 * @param category
 */
function getNews(res,view,category = null , date = null  ) {

    axios(
        //config options
        {
            url: `${media_api}/news?access_key=${process.env.MEDIA_API_KEY}&countries=ca,us,gb&sources=cnn,bbc,metro,tmz&categories=${category}&date=${date}`,
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }
    ).then(function (response) {

        res.render(view, {name:view , title: view === 'index' ? 'Home' : capitalize(view), news: response.data });
    }).catch(function (error) {
        //Put error in console.
        console.log(error);
    });
}

/**
 * Function to retrieve live sports
 * then render on the page.
 *
 * @param {Response} res The Response for the page to be used for rendering.
 */
function getLiveSports(res) {
    console.log(`${livescore_api}key=${process.env.LIVE_SCORE_KEY}&secret=${process.env.LIVE_SCORE_SECRET}&compet`);
    axios(
        //config options
        {
            url: `${livescore_api}key=${process.env.LIVE_SCORE_KEY}&secret=${process.env.LIVE_SCORE_SECRET}&compet`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then(function (response) {

        res.render("live-sports", {name:'live-sports', title: "Live Sports", matches: response.data.data});
    }).catch(function (error) {
        //Put error in console.
        console.log(error);
    });
}

/**
 * Function to make first letter of the word capital
 * @param word
 */
function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

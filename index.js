//#!/usr/bin/env node
var request = require("request");
//var credentials = require("./credential.json");
var program = require('commander');

//


program
    .arguments('<url>')
    .option('-u, --username <username>', 'The user to authenticate as')
    .option('-p, --password <password>', 'The user\'s password')
    .action(function(url) {
        console.log('user: %s pass: %s file: %s', program.username, program.password, url);
        var credentials = {
            email: program.username || credential.email,
            password: program.password || credential.password
        }
        getPuzzleEnglishSrt(url, credentials, function(srtText) {
            var destinationName = getFilenameByUrl(url);
            fs = require('fs');
            fs.writeFileSync("./" + destinationName + ".srt", srtText);
        })
    })
    .parse(process.argv);
//*/

/*
var targetUrl = process.argv[2];
var destinationName = process.argv[3];
if(!targetUrl) {
    console.log("Error: No target url found. \n\nCommand example: node index.js https://puzzle-movies.com/films/a-dogs-purpose-2017");
    throw(new Error("Error: No target url found."))
} else {
    getPuzzleEnglishSrt(targetUrl, credentials, function(srtText) {
        var destinationName = destinationName || getFilenameByUrl(targetUrl);
        fs = require('fs');
        fs.writeFileSync("./" + destinationName + ".srt", srtText);
    })
}
//*/

function getPuzzleEnglishSrt(targetUrl, credentials, callback) {
    
    //console.log("options: ", options);
    var options = prepareSinginOptions(credentials);
    getHtmlForPageAsync(targetUrl, options, (body) => {
        //console.log("body length: ", body.length)
        var subtitles = getSubtitlesFromHtml(body);
        //console.log("subtitles length: ", subtitles.length);
        var srtText = convertToSrt(subtitles, 'en');
        callback(srtText);
    });
}

function prepareSinginOptions(credentials) {
    var host = "https://puzzle-movies.com";
    var url = "/api2/user/signin?"
    var urlData = `email=${credentials.email}&password=${credentials.password}&cookie=PHPSESSID%3Dkbl2me9u0fvauqbq02rkp3huu0%3B+_ga%3DGA1.2.717651690.1539265040%3B+_gid%3DGA1.2.1260821946.1539265040%3B+last_login%3D${credentials.encodedEmail}%3B+_gat_gtag_UA_123130201_1%3D1`;
    var options = {
        url: host+url + urlData, 
        headers: {
            'cookie': 'PHPSESSID=kbl2me9d0fvauqbq02rkp3hvv2'
        }
    };
    return options;
}

function getHtmlForPageAsync(url, options, done) {
    request.post(options, function(error, res){
        var data = JSON.parse(res.body);

        //var url = targetUrl?targetUrl:host + "/films/ferdinand-2017";
        headers = {
            'cookie': 'PHPSESSID=kbl2me9d0fvauqbq02rkp3hvv2',
            'cookie': data.logged_in_cookie_name + "=" + data.logged_in_cookie
        };
        request.get({
            url: url,
            headers: headers
        }, (err, res) => {
            var body = res.body;
            done(body)
        })
    });
};
function getSubtitlesFromHtml(body) {
    //START
    var startIndex = body.indexOf("window.SUBTITLES = ");
    if(startIndex == -1) {
        console.log("Subtitles are not found");
        throw new Error("Subtitles are not found");
        return;
    }
    startIndex = startIndex + 19;

    //END
    var endIndex = body.indexOf("}];", startIndex);
    if(endIndex == -1) {
        console.log("Subtitles are not found (endIndex)");
        throw new Error("Subtitles are not found (endIndex)");
        return;
    }
    endIndex = endIndex + 2;

    // SUBSTRING
    var subtitles = body.substr(startIndex, endIndex - startIndex);
    return JSON.parse(subtitles);
}

function convertToSrt(subtitles, lang = 'en'){
    var srt = subtitles.map((subTitle) => {
        var startTime = convertSrtTime(subTitle.start);//00:02:17,440
        var endTime = convertSrtTime(subTitle.finish);//00:02:20,375
        return `${subTitle.id}
${startTime} --> ${endTime}
${subTitle[lang]}
`
    }).join("\n");
    return srt;
}
function convertSrtTime(timestamp) {
    var hour = parseInt(timestamp/60/60);
    timestamp = timestamp - (hour*3600);
    var minutes = parseInt(timestamp/60);
    timestamp = timestamp - (minutes*60);
    var seconds = parseInt(timestamp);
    timestamp = timestamp - seconds;
    var miliseconds = parseInt(timestamp*1000);
    var checkZero = (int) => int < 10?"0"+int:int;
    hour = checkZero(hour);
    minutes = checkZero(minutes);
    seconds = checkZero(seconds);
    return `${hour}:${minutes}:${seconds},${miliseconds}`
}

function getFilenameByUrl(targetUrl) {
    var lastName = (targetUrl || "").split("/");
    lastName = lastName[lastName.length - 1];
    return lastName;
}

module.exports = getPuzzleEnglishSrt;
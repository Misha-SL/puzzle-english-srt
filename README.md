puzzle-english-srt
==================

Installing
----------
    npm i puzzle-english-srt
or
    npm i -g puzzle-english-srt

Usage
-----
This command will download srt file for movie:
    puzzle-english-srt <url> -u <username> -p <password>
or
    node index.js <puzzle-english-url> [<srt-filename>]
<srt-filename> - is name of movie from url

Usage as library
----------------
getPuzzleEnglishSrt(url, credentials, callback)
```
var getPuzzleEnglishSrt = require("puzzle-english-srt");
getPuzzleEnglishSrt("https://puzzle-movies.com/films/hotel-transylvania-3-summer-vacation-2018", {email:"username", password: "password"}, function(strText) {
    console.log(srtText);
});
```
Examples
--------
    node index.js https://puzzle-movies.com/films/a-dogs-purpose-2017
    node index.js https://puzzle-movies.com/films/a-dogs-purpose-2017 [dogs-purpose]
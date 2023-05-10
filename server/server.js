const express = require('express')
const app = express()
const fetch = require("node-fetch");

const LastWeek = [];
var spot_data = [];
var urls = new Array();

function fetchJSON(url) {
    return fetch(url).then(response => response.json());
}

var timeFrom = (X) => {
    var dates = [];
    for(let I = 0; I < Math.abs(X); I++){
        dates.push(new Date(new Date().getTime() - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000)).toLocaleDateString());
    }
    return dates;
}

LastWeek.push(timeFrom(8));

app.get("/api", (req, res) => {
    res.json({"dates": [LastWeek[0][0], LastWeek[0][1], LastWeek[0][2], LastWeek[0][3], LastWeek[0][4], LastWeek[0][5], LastWeek[0][6], LastWeek[0][7]]})
})

app.listen(5000, () => { console.log("Server started on port 5000")})


// testi yhdelle elementille
var temp = LastWeek[0][1].split(".");
/*var promises = [];
//console.log(temp[2]); // Past 7 Days
//console.log(LastWeek[0][2])
for(let j=0;j<LastWeek[0].length;j++){
    // temp[0] = day, temp[1] = month, temp[2] = year
    var temp = (LastWeek[0][j]).split(".")
    console.log(temp[0] + " " + temp[1] + " " + temp[2]);
    tunnit = 24;
    urls.push(`https://www.sahkohinta-api.fi/api/v1/halpa?tunnit=${tunnit}&tulos=haja&aikaraja=${temp[2]}-${temp[1]}-${temp[0]}`);
    //promises = urls.map(url => fetchJSON(url)); tästäkö tuli ongelma??
}*/
//console.log(promises);
//console.log(urls);

app.get("/fetch_spot_data", async (req,res) => {

    var tunnit = 24;
    var year = temp[2];
    var month = temp[1];
    var day = temp[0];
    var temp_t = (LastWeek[0][1]).split(".")
    var urls_2 = [];
    var url;
    url = (`https://www.sahkohinta-api.fi/api/v1/halpa?tunnit=${tunnit}&tulos=haja&aikaraja=${year}-${month}-${day}`);
    if(spot_data.length != 0){
        // lähtee hakemaan Sähköhinta Api sivulta hinnat tunnittain
        console.log("Tietoja ei ole haettu")
    }else{
        // Ei lähde hakemaan sähköhinta Api sivulta hintoja
        console.log("Tiedot haettu")
        res.json(spot_data);
    }
    console.log(url);
    //var promises_2 = urls_2.map(url => fetchJSON(url));
    const options= {
            "method": "GET",
    };
    console.log(temp_t);
    //console.log(promises_2);
    const response = await fetch(url, options)
        .then(res => res.json())
        .then(data => {
            spot_data = data;
        })
        .catch(e => {
            console.error({
                "message": "oh noes",
                error: e
        });
    });
    console.log("RESPONSE: ", response);
    console.log("spot_data: ", spot_data);
    res.json(spot_data);

    /*console.log(urls);

    var spotti_data = [];

    const getData = async (url, res) => {
        
            const resp = await fetch(url);
            const data = await resp.text();
            console.log('data', data);
            //spotti_data = data;
            //res = data;
            //res.send(data);
    }

    for(let i = 0;i <urls.length;i++){
        getData(urls[i]);
    }
    
    //res.send(data);*/

    /*for(let n=0;n<LastWeek[0].length;n++){
    
    }*/
});




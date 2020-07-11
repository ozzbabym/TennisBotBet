let needle = require('needle');
let cheerio = require('cheerio');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let fs = require('fs');
let express = require('express');
let app = express();

const PORT = process.env.PORT || 80;

//if your cuntry in Russia, on 1xStavka
//if your country Europa, on VPN 1xBet
//Если ты в России можно через 1xStavka парсить, и отправлять через телеграмм его разрешили в России, Можно через 1xBet через VPN 


const token = '' //add your Bot
const chat = '' //add your Group ID in Tellegram 

const url = 'https://ar.1xbet.com/en/live/Tennis/';
//const url = "https://1xstavka.ru/en/live/Tennis/";
const url1 = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id='+ chat +'&text='
const xhttp = new XMLHttpRequest()

app.listen(PORT, () => {
    console.log("server has been started...")
})




function getvalue(ourl) {
    return new Promise(function(resolve, reject) {
        needle.get(ourl, function(err, res) {
            try {
                if (err) throw (err);
                let $ = cheerio.load(res.body)


                let names = ($("div.c-events-scoreboard__item").text())
                let name = names.split('\n')
                let namea = name.map(val => val.trim()).filter(val => val !== '')


                var file = fs.readFileSync('recover.txt', "utf8") //=> {

                file = file.split(",")






                var nameWithScore = []

                for (let i = 0; i<namea.length; i++){
                    if(namea[i].startsWith('+')){
                        if(namea[i-1]==='2 Set'){
                            nameWithScore.push(namea[i-11])
                            nameWithScore.push(namea[i-10])
                            nameWithScore.push(namea[i-9])
                            nameWithScore.push(namea[i-8])
                            nameWithScore.push(namea[i-7])
                            nameWithScore.push(namea[i-6])
                            nameWithScore.push(namea[i-5])
                            nameWithScore.push(namea[i-4])
                            nameWithScore.push(namea[i-3])
                            nameWithScore.push(namea[i-2])                       
                        }
                    }
                }
                console.log(nameWithScore)
                
                var vivod = []
                
                for(let i = 3; i < nameWithScore.length; i += 10){                   
                    if(((parseInt(nameWithScore[i]) + parseInt(nameWithScore[i+4]))>=12) && (parseInt(nameWithScore[i]) !== parseInt(nameWithScore[i+4]))){
                        if((parseInt(nameWithScore[i+1]) + parseInt(nameWithScore[i+5]))===0){
                            vivod.push(nameWithScore[i-3],nameWithScore[i-2],nameWithScore[i],nameWithScore[i+4])
                        }
                    }
                }
                
                

                // var good=`${encodeURIComponent('✅✅✅')}`
                // var bad=`${encodeURIComponent('❌❌❌')}`

                

                var yes = []
                for (let i = 0; i < vivod.length; i+=4) {
                     if (vivod[i] !== file[i]) {
                        yes.push(("Strategy Tennis\n" + "1 Set Finished\n" + vivod[i] + ":  " + vivod[i + 2] + "\n" + vivod[i + 1] + ":  " + vivod[i + 3] + "\n2-Set TM 10,5 \n\n" ))
                        
                     }
                }
                console.log(yes)


                xhttp.open("GET", url1 + yes, true)
                xhttp.send()


                fs.writeFile('recover.txt', vivod, (err) => {
                    if (err) throw err
                })

            } catch (err) {
                start()
                console.log("Server restarted")
            }





        })

    })
}


function start() {
    getvalue(url)
    setInterval(() => {
        getvalue(url)

    }, 60000 / 3)
}
start()

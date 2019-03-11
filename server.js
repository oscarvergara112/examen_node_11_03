const PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

const http = require('http');
const fileType = require('file-type');

app.get('/removeduplicatewords', (req, res) => {
    res.render('duplicate',{layout: "main"});
});

app.post('/removeduplicatewords', (req, res) => {
    var js = req.body;
    var finalWords = [];
    var tempWord = "";
    for(let i = 0; i < js.palabras.length; i++){
        if (js.palabras[i] == ',' || i == js.palabras.length - 1){
            if(i == js.palabras.length - 1)tempWord += js.palabras[i];
    
            var duplicate = false;
            for(let j = 0; j < finalWords.length; j++){
                if(tempWord == finalWords[j]){
                    duplicate = true;
                    tempWord = "";
                }
            }
            if(!duplicate){
                finalWords.push(tempWord);
                tempWord = "";
            }
        }
        else{
            tempWord += js.palabras[i];
        }
    }
    
    var response = "";

    for(let i = 0; i < finalWords.length; i++){
        response += finalWords[i];
        if(i != finalWords.length-1){
            response += ','; 
        }
    }
    
    res.send(response);
});

app.get('/detectfiletype', (req, res) => {
    res.render('filetype',{layout: "main"});
});

app.post('/detectfiletype', (req, res) => {
    var js = req.body;
    const url = js.url;

    http.get(url, response => {
        response.on('readable', () => {
            const chunk = response.read(fileType.minimumBytes);
            response.destroy();
            console.log(fileType(chunk));
            //=> {ext: 'gif', mime: 'image/gif'}
        });
    });
});

var botOrders = [];
botOrders.length = 0;
app.get('/botorder/:order', (req, res) => {
    var orderContent;
    if(botOrders.length >= parseInt(req.params.order[5]) && botOrders[parseInt(req.params.order[5]) - 1] != undefined){
        orderContent = botOrders[parseInt(req.params.order[5]) - 1];
    }
    else{
        orderContent = "NONE";
    }
    res.send(orderContent);
    //res.render('botorder',{layout: "main", orderContent: orderContent, order: req.params.order});
});

app.post('/botorder/:order', (req, res) => {
    var js = req.body;
    if(botOrders.length < parseInt(req.params.order[5])){
        botOrders.length = parseInt(req.params.order[5]);
    }
    botOrders[parseInt(req.params.order[5])-1] = js.botorder;
    res.send("OK");
});
app.listen(process.env.PORT || 8000);
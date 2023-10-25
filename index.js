// const hello =  'hello world';
// console.log(hello);

//filesystem
const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemp = require('./modules/replaceTemp')

///////////////////////////

//sychronous file reading (blocking)
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut)

// console.log('File written!');

////////////////////////////////////

//Non blocking asychronous (callback hell)
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1)=>{

//     if(err) return console.log("ERROR!")

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=>{
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log("file written")
//             })
//         })
//     })
// })

// console.log('Will read file!')

/////////////////////////



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');

const overview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const products = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');

const dataObj = JSON.parse(data)

const server = http.createServer((req, res)=>{
    // console.log(req)
    // console.log(req.url)

    const {query, pathname } = url.parse(req.url, true);
    
    // const pathname = req.url

    //overview page
    if(pathname === '/' || pathname === "/overview"){
        res.writeHead(200, {'Content-type': 'text/html'})

        const cards = dataObj.map(data => replaceTemp(card, data)).join('');
        const output = overview.replace('{%PRODUCT_CARD%}', cards);

        res.end(output)
    }
    
    //product page
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemp(products, product);
        res.end(output)
    }
    
    //api
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
        // res.end('API')
    }
    
    //404
    else{
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header' : 'Hello world'
        })
        res.end('<h1>page not found</h1>')
    }

    // res.end('Hello from the server')
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log("listening to req on port 8000")
})
const express = require( 'express');
const nunjucks = require( 'nunjucks');
const dataVideos = require( '../dataVideos.json');
const data = require( '../data.json');
const fs = require('fs');
const multer = require('./middlewares/multer'); 

const server = express();
server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
    express:server,
    autoescape:false,
    noCache: true
})

server.get('/', (request,response)=>{
    const dadosUsuarios = {
        avatar_url: "https://avatars1.githubusercontent.com/u/62598805?s=460&u=be39aa9d611cfa852f701a36f145d7ba02e62ebd&v=4",
        name: "Fabio Abrantes",
        role: "Professor de programação WEB",
        description: "Professor das disciplinas de Linguagens de Script, programação Web 1, Programação para dispositivos móveis e Gestão de TI do",
        links:[
            {name: "GitHub", url: "https://github.com/fabioabrantes"},
            {name: "Twitter", url: "https://twitter.com/Fabinho_Bala"},
            {name: "Linkedin", url: "https://www.linkedin.com/in/fabio-abrantes-diniz-a1357221/"}
        ]
    }
    return response.render('index', {dados:dadosUsuarios});
})

server.get('/classes', (request,response)=>{
    return response.render('classes', {dados:dataVideos});
})


server.get('/products', (request,response)=>{
    const dadosLoja = {
        name: "Launchstore",
        lastName: "COMPRA E VENDA",
        newAd: "Novo anúncio",
        profile: "Minha conta",
        newProd: "Cadastrar Produtos",
        title: "Título",
        description: "Descrição",
        photos: "Fotos"
    }
    return response.render('products', {dados:dadosLoja});
})


server.post('/products',multer.array('photos', 6),(request, response) => {
    const dados = request.body;
    const chaves = Object.keys(dados);
    console.log(chaves);

    for (chave of chaves) {
        if(dados[chave] === ''){
            return response.send('por favor, preencha todos os campus');
        }
    }
    const arquivos = request.files;
    console.log('teste' + arquivos);

     if(arquivos.length == 0){
        return response.send('por favor, envie pelo menos uma imagem');
    } 

    const{ name, description } = dados;

    let filePaths = [];

     arquivos.forEach(file => {
        const {path} = file;
        filePaths.push(path);
    }) 

    data.products.push({
        name,
        description,
        filePaths
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) =>{
        if (error) return response.send('erro durante a escrita no arquivo json')
    })

    return response.redirect('/products');
});


server.listen(5000, () => {
    console.log('server running');
})
const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const config = require('./config');
const port = process.env.PORT || 3000

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

const server = createServer((req, res) => {
  const requestURL = url.parse(req.url);
  const decodedParams = decodeParams(new URLSearchParams(requestURL.search));
  const { search, location, country = 'in' }  = decodedParams;

  const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${search}&where=${location}`;
    if (req.method === 'GET') {
      console.log((`Proxy GET request to : ${targetURL}`));
      axios.get(targetURL)
        .then(response => {
          res.writeHead(200, headers);
          res.end(JSON.stringify(response.data));
        })
        .catch(response => {
          console.log((response));
          res.writeHead(500, headers);
          res.end(JSON.stringify(response));
        });
    } 
});


server.listen(port, () => {
  console.log(('Server listening'));
} );


const decodeParams = searchParams => Array
  .from(searchParams.keys())
  .reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});
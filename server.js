const http = require('http')
const https = require('https')
const port = 3000

const requestHandler = (request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
      };
    
    let data = []
    request.on('data', chunk => {
      data.push(chunk)
    })
    request.on('end', () => {
      let url = JSON.parse(data)["url"];
      

        https.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                response.writeHead(200, headers);
                response.end(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
      
    })
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
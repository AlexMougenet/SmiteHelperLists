/////////////////////// IMPORTS ///////////////////////

const secret = require('./secret');
const fs = require('fs');
const https = require('https');

/////////////////////// VARIABLES ///////////////////////

const buildsDir = 'src/builds';
const options = {
  headers: {
    "x-api-key": secret.apiKey
  }
};
let gods;

/////////////////////// FUNCTIONS ///////////////////////

function httpGet(url) {
  return new Promise ((resolve, reject) => {
    let chunks = [];
    https.get(url, options, (res) => {
      res.on('data', (d) => {
        chunks.push(d);
      });
      res.on('end', () => {
        let data = Buffer.concat(chunks);
        let schema = JSON.parse(data);
        resolve(schema);
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

/////////////////////// LOGIC ///////////////////////

gods = fs.readFileSync(`./src/lists/csv/gods/en.csv`).toString().split(',\n');
gods.pop();
gods.forEach(async god => {
  let res = await httpGet(`https://api.smite.guru/v3/champions/${god}/builds`);
  fs.writeFileSync(`${buildsDir}/${god}.json`, JSON.stringify(res, null, 2));
});

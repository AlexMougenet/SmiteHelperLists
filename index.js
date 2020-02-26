
/////////////////////// IMPORTS ///////////////////////

const secret = require('./secret');
const Hirez = require('./hirez');
const fs = require('fs');

/////////////////////// VARIABLES ///////////////////////

const hirez = new Hirez({
  devId: secret.devId,
  authKey: secret.authKey
});

const listsDir = 'src/lists';

const languages = {
  en: '1',
  de: '2',
  fr: '3',
  es: '7',
  pt: '10'
};

const queues = {
  Conquest: 426,
  Arena: 435,
  DualRanked: 440, // "joustLeague"
  Assault: 445,
  Joust: 448, // "Joust3v3"
  JoustRanked: 450,
  ConquestRanked: 451, // "ConquestLeague"
  Siege: 459,
  Clash: 466,
  // 502 503 504 ?? on smiteguru
}

/////////////////////// LOGIC ///////////////////////

writeFile = (dir, lang, ext, content, shouldStringify) => {
  fs.writeFileSync(`${listsDir}/${ext}/${dir}/${lang}.${ext}`, shouldStringify ? JSON.stringify(content, null, 2) : content);
}

// writeFile('languages', 'langs', 'json', JSON.stringify(languages, null, 2));

hirez.smite('pc').session.generate().then((sessionId) => {
  if (sessionId) {

  Object.keys(languages).forEach((lang) => {
    const langId = languages[lang];

      hirez.smite('pc').getItems(langId).then(items => {
        writeFile('items', lang, 'json', items, true);
        console.log(`Items for ${lang} : OK`);
      }).catch(console.log(`Items for ${lang} : KO`));
      hirez.smite('pc').getGods(langId).then(gods => {
        writeFile('gods', lang, 'json', gods, true);
        // save in csv
        godsNames = '';
        gods.forEach(god => {
          godsNames += `${god.Name},\n`;
        });
        writeFile('gods', lang, 'csv', godsNames);
        console.log((`Gods for ${lang} : OK`));
      }).catch(console.log(`Gods for ${lang} : KO`));
    });
  }
}).catch(console.log);

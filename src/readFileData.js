const readPatientsData = (file) => {
  return new Promise(function(resolve, reject) {
    try {
      const fs = require('fs');

      let fileData = '';

      const readStream = fs.createReadStream(file);
      readStream.on('data', chunk => fileData = fileData.concat(chunk.toString()));
      readStream.on('end', () => resolve(JSON.parse(fileData)));
    } catch(error) { reject(error); }
  });
}

module.exports = {
  readPatientsData,
};
var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
	//Reading and writting csv file
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './public/data/hammer.csv', //out put file path
  header: [
    {id: 'date', title: 'date'},
    {id: 'open', title: 'open'},
    {id: 'high', title: 'high'},
    {id: 'low', title: 'low'},
    {id: 'close', title: 'close'},
  ]
});
var data =[];
fs.createReadStream('./public/data/data.csv') // input file path
  .pipe(csv())
  .on('data', (OHLC) => {
		if(OHLC.open!=OHLC.close&&(OHLC.high==OHLC.close||OHLC.high==OHLC.open))
			if(100*Math.abs(OHLC.open-OHLC.close)/(OHLC.high-OHLC.low)<30)
			data.push(OHLC);						
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
	csvWriter.writeRecords(data).then(()=> console.log('The CSV file was written successfully'));
  });
 
  res.sendFile(path.join(__dirname,'../views/index.html'))
  //res.render('index');
});

module.exports = router;

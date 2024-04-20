import puppeteer from 'puppeteer';
const fs = require('fs');

async function scrapePopulation(url: string) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
      
        const title = await page.title();
        console.log('Title:', title);
      
        const header = await page.$eval("h1", (element) => element.textContent);
        console.log('Header:', header);
      
        const tableData = await page.evaluate(() => {
          const tableHeaders = Array.from(document.querySelectorAll('#example2 thead th')).map(header => header.textContent.trim());
          const tableRows = Array.from(document.querySelectorAll('#example2 tbody tr'));
          const rowData = tableRows.map(row => {
              const cells = Array.from(row.querySelectorAll('td'));
              const rowObj = {};
              cells.forEach((cell, index) => {
                  rowObj[tableHeaders[index]] = cell.textContent.trim();
              });
              return rowObj;
          });
          return rowData;
          });
      
        const jsonData = JSON.stringify(tableData, null, 2);
        fs.writeFileSync('population_by_country.json', jsonData); 
    
        console.log('Table data saved to population_by_country.json');
    
        await browser.close();
    } catch(error) {
        console.error('Error fetching data:', error);
    }
}

const url = 'https://www.worldometers.info/world-population/population-by-country/';
scrapePopulation(url);

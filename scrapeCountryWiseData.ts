import puppeteer from 'puppeteer';
const fs = require('fs');

async function scrapePopulation(url: string) {
    try {
        const browser = await puppeteer.launch({devtools: true});
        const page = await browser.newPage();
        await page.goto(url);
        const title = await page.title();
        console.log('Title:', title);

        const tableData = await page.evaluate(() => {
            const tableHeaders = Array.from(document.querySelectorAll('.table-responsive table thead th')).map(header => header.textContent.trim());
            const tableRows = Array.from(document.querySelectorAll('.table-responsive table tbody tr'));
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
            console.log(tableData);
            const jsonData = JSON.stringify(tableData, null, 2);
            fs.writeFileSync('india_population.json', jsonData); 
        await browser.close();
    } catch(error) {
        console.error('Error fetching data:', error);
    }
}

const url = 'https://www.worldometers.info/world-population/india-population/';
scrapePopulation(url);

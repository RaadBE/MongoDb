const puppeteer = require('puppeteer');
const fs = require('fs');

const { MongoClient, ServerApiVersion } = require('mongodb');


(async () => {
const uri = "mongodb+srv://raadsn11:T1EiV9dxF2Nrt84E@players.by7ln3k.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

    await client.connect();
    // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const db = client.db("PLAYERS"); 
    const playersCollection = db.collection("players");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/opt/google/chrome/chrome' // Note: Ensure this path is correct!
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1900,
    height: 1000
  });


  const pages = 1;
fs.writeFileSync('./scrap/raad.json', '[]');

    for (var i = pages; i < 601; i++) {
        try {
            console.log(`Navigating to page ${i}...`);
            await page.goto(`https://www.fifaindex.com/players/?page=${i}`);
            await page.waitForSelector('[data-playerid]');

            const data = await page.evaluate(() => {
                const parent = document.querySelectorAll('[data-playerid]');
                return Array.from(parent).map(parent => {
                    const name = parent.querySelector('[data-title="Name"]').textContent;
                    const age = parent.querySelector('[data-title="Age"]').textContent;
                    const rating = parent.querySelector('[data-title="OVR / POT"]').textContent;
                    const positin = parent.querySelector('[data-title="Preferred Positions"]').textContent
                    const nat = parent.querySelector('[data-title="Nationality"] img');
                    const srcValue = nat.getAttribute('src');
                    const team = parent.querySelector('[data-title="Team"] img');
                    const teamSrc = team.getAttribute('src');
                    const player = parent.querySelector('.player img');
                    const playerSrc = player.getAttribute('src');
                    return {
                        playerSrc,
                        srcValue,
                        rating,
                        name,
                        positin,
                        age,
                        teamSrc
                    };
                });
            });

            await playersCollection.insertMany(data);
            
            console.log(`Data from page ${i} saved.`);

        } catch (error) {
            console.error(`Error on page ${i}:`, error);
        }

        await page.waitForTimeout(3000); // Wait for 5 seconds before navigating to next page
    }

    await browser.close();
    console.log('Scraping completed.');
})();

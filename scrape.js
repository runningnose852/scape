const puppeteer = require('puppeteer');

async function scrapeData() {
  const data = {};
  const priceSelector = 'div.styled__Details-mfe-pdp__sc-ebmhjv-7.dqYwFc > div.styled__BuyBoxContainer-mfe-pdp__sc-ebmhjv-4.dtAyQn > div.base-components__RootElement-sc-150pv2j-1.styled__Container-sc-159tobh-0.hjMZDF.gUZlYv.ddsweb-buybox__container > div.base-components__BaseElement-sc-150pv2j-0.styled__PriceAndActions-sc-159tobh-3.chGOgR.bgcAqA.ddsweb-buybox__price-and-actions > div.styled__StyledPriceContainer-sc-159tobh-5.fPFdvw > div.base-components__RootElement-sc-150pv2j-1.styled__Container-sc-v0qv7n-0.hjMZDF.gVxPxM.ddsweb-buybox__price.ddsweb-price__container > p.ddsweb-text.styled__PriceText-sc-v0qv7n-1.eNIEDh.f3e9df_GlysEa_text.f3e9df_GlysEa_shortFormLg';
  const clubcardPriceSelector = 'div.styled__Details-mfe-pdp__sc-ebmhjv-7.dqYwFc > div.styled__PromotionsContainer-sc-nc07d4-3.eHwhpv.styled__StyledPromotions-mfe-pdp__sc-ebmhjv-5.bywLgq > div > div.styled__StyledPromotionsWithClubcardPriceContainer-sc-dfqdes-0.fPCGKx > a.styled__Container-sc-1d7lp92-5.uHazN.ddsweb-value-bar__container > div.styled__InnerContainer-sc-1d7lp92-6.jqAUMo.ddsweb-value-bar__inner-container > div.styled__ContentContainer-sc-1d7lp92-8.gpCKUL.ddsweb-value-bar__content-container > p.ddsweb-text.styled__ContentText-sc-1d7lp92-9.lffCZN.ddsweb-value-bar__content-text.f3e9df_GlysEa_text.f3e9df_GlysEa_shortFormMd';
  const url = 'https://www.tesco.com/groceries/en-GB/products/310653147';

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-http2',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set a user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    console.log("Navigating to the page...");
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // Add a delay with setTimeout (works in all versions)
    console.log("Waiting for page to fully load...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("Looking for price elements...");
    
    // Try to find the price element
    let priceElement = null;
    try {
      await page.waitForSelector(priceSelector, { timeout: 10000 });
      priceElement = await page.$(priceSelector);
    } catch (e) {
      console.log("Price selector not found");
    }
    
    // Try to find the clubcard price element
    let clubcardPriceElement = null;
    try {
      await page.waitForSelector(clubcardPriceSelector, { timeout: 10000 });
      clubcardPriceElement = await page.$(clubcardPriceSelector);
    } catch (e) {
      console.log("Clubcard price selector not found");
    }

    // Extract the data
    if (priceElement) {
      data.price = await page.evaluate(el => el.textContent.trim(), priceElement);
    }
    
    if (clubcardPriceElement) {
      data.clubcardPrice = await page.evaluate(el => el.textContent.trim(), clubcardPriceElement);
    }

    console.log(JSON.stringify(data));
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await browser.close();
  }
}

scrapeData();
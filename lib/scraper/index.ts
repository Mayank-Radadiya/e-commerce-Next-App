import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

// curl -i --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_91750c13-zone-pricewise:sy5ncd7mw41o -k "https://geo.brdtest.com/welcome.txt"

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  const userName = String(process.env.BRIGHT_DATA_USERNAME);
  const userPassword = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options: any = {
    auth: {
      userName: `${userName}-session-${session_id}`,
      userPassword,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  // main function start here....
  try {
    const response = await axios.get(url, options);

    //Cheerio is a library that allows you to work with HTML more conveniently. You can load HTML into Cheerio and then use its methods to find elements and extract information.
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();

    const currentPrice = extractPrice(
      // find the price element and extract the price text
      $(".a-price-whole"),
      $("a-price-symbol"),
      $(".a-price aok-align-center reinventPricePriceToPayMargin priceToPay")
    );

    const realPrice = extractPrice(
      //   $(".a-price a-text-price"),
      //   $(".a-offscreen"),
      //   $("#a-offscreen"),
      //   $("#a-size-small aok-offscreen"),
      //   $("#a-size-small a-color-secondary aok-align-center basisPrice"),
      //   $("#a-size-small aok-align-center basisPriceLegalMessage"),
      //   $("#aok-relative"),
      //   $("#a-size-small aok-offscreen"),
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price")
    );

    const outOfStock = $("#a-size-medium a-color-success").text()
        // $(".availability span").text().trim().toLowerCase() 
      //   $(".a-size-medium a-color-success").text().trim().toLowerCase() ===
      //     "currently unavailable" ||
      //   $(".a-declarative").text().trim().toLowerCase() ===
      //     "currently unavailable" ||
      //   $("#availability_feature_div").text().trim().toLowerCase() ===
      //     "currently unavailable" ||
    //   $("span a-section a-spacing-base a-spacing-top-micro")
    //     .text()
    //     .trim()
    //     .toLowerCase() === "currently unavailable";

    //
    console.log({ title, currentPrice, realPrice, outOfStock });
  } catch (error: any) {
    throw new Error(
      `Failed to Scrape Product from Scraper scrapeAmazonProduct Function: ${error.message} `
    );
  }
}

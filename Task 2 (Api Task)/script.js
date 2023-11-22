const Papa = require("papaparse");
const axios = require("axios");
const fs = require("fs");

// There was no access to client id or client secret for me because Admin users can generate client id or client secret from within the merchant dashboard.
// Non-admin users, like Customer Support or Developers, cannot access this panel
// but i have written the logic of the code it will work if valid client id or client secret inserted here

// PUT method https://api.cratejoy.com/v1/subscriptions/{sub_id}/cancel/


//i am using version 2 of there apis, but this cancel subscription api was v1 in v2 docs

// const API_KEY = "";


var client_id = "";
var client_secret = "";

const encodedCredentials = Buffer.from(
  `${client_id}:${client_secret}`
).toString("base64");

const processCancelSubscription = async (subscriptionId) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${encodedCredentials}`,
    };

    const response = await axios.post(
      `https://api.cratejoy.com/v1/subscriptions/${subscriptionId}/cancel/`,
      { platform_subscription_id: subscriptionId },
      { headers }
    );

    const outputData = {
      platform_subscription_id: subscriptionId,
      response_json: JSON.stringify(response.data),
      response_code: response.status,
    };

    const outputCSV = Papa.unparse([outputData], { header: true });

    fs.appendFileSync("output.csv", outputCSV + "\n");
  } catch (error) {
    console.error(`Error ${subscriptionId}:`, error.message || error);
  }
};

const processCSV = async () => {
  try {
    const csvData = fs.readFileSync("input.csv", "utf8");
    const parsedData = Papa.parse(csvData, { header: true });

    for (const row of parsedData.data) {
      const subscriptionId = row.platform_subscription_id;

      if (!subscriptionId) {
        console.log("invalid subscription id:", row);
        continue;
      }
      await processCancelSubscription(subscriptionId);
    }
  } catch (error) {
    console.error("Error processing CSV:", error.message || error);
  }
};

processCSV();

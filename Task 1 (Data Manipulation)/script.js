const fs = require("fs");
const Papa = require("papaparse");

const csvData = fs.readFileSync("input.csv", "utf8");

// csv to objects
Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  complete: (result) => {
    let subscriptions = {};
    let final_result = {};

    result.data.forEach((row) => {
      const subscriptionID = row["Subscription ID"];
      const variantID = row["Variant ID"];
      const lineQuantity = row["Line Quantity"];
      const lineDiscountedPrice = row["Line Discounted Price"];

      // unique key for each subscription identification
      const subscriptionKey = `${subscriptionID}_${variantID}`;

      if (!subscriptions[subscriptionKey]) {
        subscriptions[subscriptionKey] = {
          "Subscription ID": subscriptionKey,
        };
        final_result[subscriptionID] = {
          "Subscription ID": subscriptionID,
        };

        final_result[subscriptionID][`Variant ID`] = variantID;
        final_result[subscriptionID][`Line Quantity`] = lineQuantity;
        final_result[subscriptionID][`Line Discounted Price`] =
          lineDiscountedPrice;
      }

      // mapping values to columns
      subscriptions[subscriptionKey][`Variant ID`] = variantID;
      subscriptions[subscriptionKey][`Line Quantity`] = lineQuantity;
      subscriptions[subscriptionKey][`Line Discounted Price`] =
        lineDiscountedPrice;
    });

    // obj into an array
    const outputData = Object.values(final_result);

    const outputCSV = Papa.unparse(outputData, {
      header: true,
    });

    fs.writeFileSync("output.csv", outputCSV);

    console.log("Output CSV file generated successfully.");
  },
});

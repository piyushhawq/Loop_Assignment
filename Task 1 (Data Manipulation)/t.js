const fs = require("fs");
const Papa = require("papaparse");

// Read the CSV file
const csvData = fs.readFileSync("input.csv", "utf8");

// Parse CSV data
Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  complete: (result) => {
    
    let subscriptions = {};
    let final_result = {}


    result.data.forEach((row) => {
      const subscriptionID = row["Subscription ID"];
      const variantID = row["Variant ID"];
      const lineQuantity = row["Line Quantity"];
      const lineDiscountedPrice = row["Line Discounted Price"];

      // Create a unique key for each subscription
      const subscriptionKey = `${subscriptionID}_${variantID}`;

      // Initialize the subscription object if it doesn't exist
      if (!subscriptions[subscriptionKey]) {
        subscriptions[subscriptionKey] = {
          "Subscription ID": subscriptionKey,
        };
        final_result[subscriptionID] = {
          "Subscription ID": subscriptionID,
        };

        final_result[subscriptionID][`Variant ID`] = variantID;
        final_result[subscriptionID][`Line Quantity`] = lineQuantity;
        final_result[subscriptionID][`Line Discounted Price`] =lineDiscountedPrice;

      }

      // Map values to corresponding columns
      subscriptions[subscriptionKey][`Variant ID`] = variantID;
      subscriptions[subscriptionKey][`Line Quantity`] = lineQuantity;
      subscriptions[subscriptionKey][`Line Discounted Price`] =lineDiscountedPrice;
    });

    // Convert the object into an array of subscriptions
    const outputData = Object.values(final_result);

    // Convert the array of subscriptions back to CSV
    const outputCSV = Papa.unparse(outputData, {
      header: true,
    });

    // Write the output CSV to a new file
    fs.writeFileSync("output.csv", outputCSV);

    console.log("Output CSV file generated successfully.");
  },
});

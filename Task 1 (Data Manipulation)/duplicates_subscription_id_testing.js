const fs = require("fs");
const Papa = require("papaparse");

const csvData = fs.readFileSync("output.csv", "utf8");

Papa.parse(csvData, {
  header: true,
  skipEmptyLines: true,
  complete: (result) => {
    const subscriptionIds = new Set();
    let hasDuplicates = false;

    // Checking for duplicate Subscription IDs
    result.data.forEach((row) => {
      const subscriptionID = row["Subscription ID"];

      if (subscriptionIds.has(subscriptionID)) {
        hasDuplicates = true;
        console.log(
          `Duplicate subscription id found - ${subscriptionID}`
        );
      } else {
        subscriptionIds.add(subscriptionID);
      }
    });

    if (!hasDuplicates) {
      console.log("No duplicates found ");
    }
  },
});

import { DefaultAzureCredential } from "@azure/identity";
import { ConsumptionManagementClient } from "@azure/arm-consumption";

export async function fetchAzureDailyCost(creds) {
  try {
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: creds.clientId,
    });
    const client = new ConsumptionManagementClient(
      credential,
      creds.subscriptionId
    );
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    const result = await client.usageDetails.list(
      `subscriptions/${creds.subscriptionId}`,
      {
        expand: "properties/meterDetails",
      }
    );

    const points = [];
    for await (const item of result) {
      if (item.properties.usageStart) {
        const cost = parseFloat(item.properties.pretaxCost || "0");
        points.push({ date: item.properties.usageStart, amount: cost });
      }
    }
    return { provider: "azure", points };
  } catch (err) {
    return { provider: "azure", error: err.message };
  }
}

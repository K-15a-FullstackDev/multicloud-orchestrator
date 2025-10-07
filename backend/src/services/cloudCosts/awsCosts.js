import AWS from "aws-sdk";

export async function fetchAwsDailyCost(creds) {
  try {
    const ce = new AWS.CostExplorer({
      region: "us-east-1",
      accessKeyId: creds.AWS_ACCESS_KEY_ID,
      secretAccessKey: creds.AWS_SECRET_ACCESS_KEY,
    });

    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    const res = await ce
      .getCostAndUsage({
        TimePeriod: {
          Start: start.toISOString().split("T")[0],
          End: end.toISOString().split("T")[0],
        },
        Granularity: "DAILY",
        Metrics: ["UnblendedCost"],
      })
      .promise();

    const points = res.ResultsByTime.map((t) => ({
      date: t.TimePeriod.Start,
      amount: parseFloat(t.Total.UnblendedCost.Amount || "0"),
    }));
    return { provider: "aws", points };
  } catch (err) {
    return { provider: "aws", error: err.message };
  }
}

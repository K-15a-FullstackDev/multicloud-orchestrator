import AWS from "aws-sdk";
import { DefaultAzureCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";

export async function validateAws(creds) {
  try {
    const sts = new AWS.STS({
      accessKeyId: creds.AWS_ACCESS_KEY_ID,
      secretAccessKey: creds.AWS_SECRET_ACCESS_KEY,
    });
    const id = await sts.getCallerIdentity().promise();
    return { valid: true, meta: { account: id.Account } };
  } catch (err) {
    return { valid: false, meta: { error: err.message } };
  }
}

export async function validateAzure(creds) {
  try {
    const credential = new DefaultAzureCredential({
      managedIdentityClientId: creds.clientId,
    });
    const client = new SubscriptionClient(credential);
    const subs = [];
    for await (const sub of client.subscriptions.list())
      subs.push(sub.subscriptionId);
    return { valid: true, meta: { subs } };
  } catch (err) {
    return { valid: false, meta: { error: err.message } };
  }
}

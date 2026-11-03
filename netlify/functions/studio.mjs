import { withLambda } from "@netlify/aws-lambda-compat";
import serverless from "serverless-http";
import app from "studiospace-api";

const handle = serverless(app);
export default withLambda(async (event, context) => {
  event.headers.host ||= new URL(event.rawUrl).host;
  const response = await handle(event, context);
  // Web Response requires an empty body on no-content replies.
  if (response.statusCode === 204 || response.statusCode === 304) delete response.body;
  return response;
});

export const config = { path: "/api/*" };

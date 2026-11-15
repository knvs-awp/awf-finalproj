| area | draft | decided |
| --- | --- | --- |
| language | not specified | typescript |
| frontend | react | react and vite |
| backend | express and node.js | express and node.js |
| api communication | rest over http | rest over http |
| database | mysql or dynamodb | mysql locally and aws rds mysql in prod |
| models and migrations | not specified | drizzle orm and drizzle kit |
| shared types | not specified | shared typescript interfaces in `contracts/` |
| auth | handled by express, provider not specified | auth0 for email/password and google login, with token checks in express |
| hosting and deployment | aws for frontend, backend, database, storage, and monitoring | aws ec2 for the backend, s3 and cloudfront for the frontend |
| automation | not specified | github actions for ci checks and deployment |

<p align="center">
  <img src="./assets/readme/fieldney-resized.png" width="200" height="200">
</p>
<p align="center">A bot designed to enhance and assist Fielders in their day-to-day tasks within Field Control.</p>

# Fieldney Bot

Aiming for **efficiency**, this bot supports developers in their workflow by automating some of their current manual tasks. Not limited to developers, the bot also aims to provide more autonomy to other teams that need to interact with developers, offering **real-time** transparency with information.

One of the key benefits that this bot promises is the ability to handle critical situations, such as incidents. Its goal is to keep everyone informed throughout the process, without developers having to split their attention between disseminating information and fixing the problem — the bot takes care of that for them :)

#### Install to Trello
On Trello, we need to create a webhook for every model we want to watch, for example, if I want to watch for a board, then I will pass the `boardId` as `modelId` and **Trello** will start to send every board changes to our webhook.

Create a webhook:

```bash
curl -X POST -H "Content-Type: application/json"
https://api.trello.com/1/tokens/{TRELLO_API_TOKEN}/webhooks/
-d '{
  "key": "TRELLO_API_KEY",
  "callbackURL": "{BASE_URL}/hooks/trello",
  "idModel":"MODEL_ID",
  "description": "My first webhook"
}'
```

If you need to delete a webhook, you just need to use DELETE route to webhooks:

```bash
curl -X DELETE
https://api.trello.com/1/tokens/{TRELLO_API_TOKEN}/webhooks/{WEBHOOK_ID}
```

To list created webhooks:
```bash
curl -X GET
https://api.trello.com/1/tokens/{TRELLO_API_TOKEN}/webhooks
```

Also when you revoke the `TRELLO_API_TOKEN`, all webhooks linked to token will be deleted.

## To developers

#### Prerequisites

Install `serverless` globally:

```bash
npm i serverless -g
```

Install `ngrok`:

```bash
snap install ngrok
```

Sign up to `ngrock` to get your token, then add here:

```bash
ngrok config add-authtoken <token>
```

#### Install

```bash
npm install && npm prepare
```

#### Execute

Share your offline serverless port to `ngrock`:

```bash
ngrock http 3000
```

Set `ngrock` forwarded url + `/hooks/github` to `WEBHOOK_PROXY_URL` in your `.env` file, for probot local development:

```bash
WEBHOOK_PROXY_URL="https://forwarded-url.ngrok-free.app/hooks/github"
```

In another terminal, start offline serverless:

```bash
npm start
```

---

<p align="center">
  <img src="https://img.shields.io/badge/node-18.17.0-green?style=flat-square">
</p>

# account-activity-dashboard

Sample web app and helper scripts to get started with Twitter's premium Account Activity API (All Activities). Written in Node.js. Full documentation for this API can be found on the [Account Activity API reference](https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/overview).

For the enterprise tier of the Account Activity API, please check out the [Enterprise Account Activity Dashboard sample app](https://github.com/twitterdev/account-activity-dashboard-enterprise).

## Dependencies

* A Twitter app created on [developer.twitter.com](https://developer.twitter.com/en/apps), enabled for access to the Account Activity API
* [Node.js](https://nodejs.org)
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) or other webhost (optional)
* [ngrok](https://ngrok.com/) or other tunneling service (optional)

## Create and configure a Twitter app

1. Create a Twitter app on [Twitter Developer](https://developer.twitter.com/en/apps)

2. On the **Permissions** tab ➡️ **Edit** ➡️ **Access permission** section ➡️ enable **Read, Write and direct messages**.

3. On the **Keys and Tokens** tab ➡️ **Access token & access token secret** section ➡️ click **Create** button.

4. On the **Keys and Tokens** tab, take note of the **consumer API key**, **consumer API secret**, **access token** and **access token secret**.

## Setup & run the Node.js web app

1. Clone this repository:

    ```bash
    git clone https://github.com/twitterdev/account-activity-dashboard.git
    ```

2. Install Node.js dependencies:

    ```bash
    npm install
    ```

3. Pass your Twitter keys, tokens and webhook environment name as environment variables. Twitter keys and access tokens are found on your app page on your [App Dashboard](https://developer.twitter.com/apps). The basic auth properties can be anything you want, and are used for simple password protection to access the configuration UI. As an alternative, instead of setting up env variables, you can copy the `env.template` file into a file named `.env` and and add these details there. 

   ```bash
   TWITTER_CONSUMER_KEY= # your consumer key
   TWITTER_CONSUMER_SECRET= # your consimer secret
   TWITTER_ACCESS_TOKEN= # your access token
   TWITTER_ACCESS_TOKEN_SECRET= # your access token secret
   TWITTER_WEBHOOK_ENV= # the name of your environment as specified in your App environment on Twitter Developer
   BASIC_AUTH_USER= # your basic auth user
   BASIC_AUTH_PASSWORD= # your basic auth password
   ```



4. Run locally:

    ```bash
    npm start
    ```

5. Deploy app or setup a tunnel to localhost. To deploy to Heroku see "Deploy to Heroku" instructions below. To setup a tunnel use something like [ngrok](https://ngrok.com/).

    Take note of your webhook URL. For example:

    ```text
    https://your.app.domain/webhook/twitter
    ```

6. Take note of the deployed URL, revisit your developer.twitter.com Apps **Settings** page, and add the following URL values as whitelisted Callback URLs:

    ```text
    http(s)://your.app.domain/callbacks/addsub
    http(s)://your.app.domain/callbacks/removesub
    https://chirp-tw-webhook-manager.herokuapp.com/callbacks/addsub
    https://chirp-tw-webhook-manager.herokuapp.com/callbacks/removesub
    ```

## Configure webhook to receive events

To configure your webhook you can use this apps' web UI, or use the example scripts from the command line.

### Using the web UI

Load the web app in your browser and follow the instructions below.

1. Setup webhook config. Navigate to the "manage webhook" view. Enter your webhook URL noted earlier and click "Create/Update."

2. Add a user subscription. Navigate to the "manage subscriptions" view. Click "add" and proceed with Twitter sign-in. Once complete your webhook will start to receive account activity events for the user.

### Using the command line example scripts

These scripts should be executed from root of the project folder. Your environment, url or webhook ID should be passed in as command line arguments.

1. Create webhook config.

    ```bash
    node example_scripts/webhook_management/create-webhook-config.js -e <environment> -u <url>
    ```

2. Add a user subscription for the user that owns the app.

    ```bash
    node example_scripts/subscription_management/add-subscription-app-owner.js -e <environment>
    ```

3. To add a user subscription for another user using PIN-based Twitter sign-in.

    ```bash
    node example_scripts/subscription_management/add-subscription-other-user.js -e <environment>
    ```

**Note:** More example scripts can be found in the [example_scripts](example_scripts) directory to:

* Create, delete, retrieve and validate webhook configs.
* Add, remove, retrieve, count and list user subscriptions.

## Deploy to Heroku (optional)

1. Init Heroku app.

    ```bash
    heroku create
    ```

2. Run locally.

    ```text
    heroku local
    ```

3. Configure environment variables for each  See Heroku documentation on [Configuration and Config Vars](https://devcenter.heroku.com/articles/config-vars).

4. Deploy to Heroku.

    ```bash
    git push heroku master
    ```

**Note:** The free tier of Heroku will put your app to sleep after 30 minutes. On cold start, you app will have very high latency which may result in a CRC failure that deactivates your webhook. To trigger a challenge response request and re-validate, run the following script.

```bash
node example_scripts/webhook_management/validate-webhook-config.js -e <environment> -i <webhook_id>
```

## Production considerations

This app is for demonstration purposes only, and should not be used in production without further modifcations. Dependencies on databases, and other types of services are intentionally not within the scope of this sample app. Some considerations below:

* With this basic application, user information is stored in server side sessions. This may not provide the best user experience or be the best solution for your use case, especially if you are adding more functionality.
* The application can handle light usage, but you may experience API rate limit issues under heavier load. Consider storing data locally in a secure database, or caching requests.
* To support multiple users (admins, team members, customers, etc), consider implementing a form of Access Control List for better security.

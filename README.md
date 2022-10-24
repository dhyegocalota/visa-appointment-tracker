# Visa Appointment Tracker
**This app does not automatically schedule appointments.**

Available schedule dates for US Visa interviews may get very competetive. The waiting for new appointments can be terribly long like more than a year of waiting for the closer coming available date.

Scheduling dates become available due to different reasons such as people that give up or that reschedule their appointments. New available scheduling dates might not last more than a few minutes or hours depending on the region you're scheduling your US Visa interview.

This app is useful for you that scheduled your US Visa interview but you'd like to change the appointment date. This app is designed to track available scheduling dates of your preference. It watchs for scheduling dates that become available and notifies ASAP by making a call through the Twillio API.

*This app isn't meant to automatically schedule or change appointments but only to notify when available dates according to your settings get vacant.*

> This is a hobby project that was born due to a need of finding a closer upcoming appointment date for my US Visa interview. I hope that it can help other people finding vacant dates according to their preferences as soon as they get available in the US System. 
> — <cite>Dhyego Calota, Author</cite>

## Prerequisites
1. Install `Node >=18.0.0`
2. Create a Twilio account with phone calls enabled
    - Notice that a [Twilio's Free-trial](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account) plan tier may fulfill your  needs
    - Twilio's Free-trial tier provides a Caller number and let you configure your existing phone number as the Receiver
3. Make sure to have access to your [US Visa Info's](https://ais.usvisa-info.com/) account
4. Get the US Visa Info's Group ID [[See]](#how-to-get-us-visa-infos-group-id)

### How to Get US Visa Info's Group ID
You can get your Group ID by accessing the dashboard's homepage. Extract the Group ID from the homepage URL.

`https://ais.usvisa-info.com/{lang}/niv/groups/{group_id}`

For example, given the URL:

`https://ais.usvisa-info.com/pt-br/niv/groups/26310047`

The Group ID is: `26310047`

## Setup
1. Complete [Prerequisites](#prerequisites)
2. Create [environment variables](#environment-variables) with the desired settings
3. You're good to [start](#yarn-commands) the app

### Environment Variables
| Name | Type | Default | Notes |
|---|---|---|---|
| `NODE_ENV` | `production` \| `development` | `production` | • Enables the headless browsing in production |
| `VERBOSE` | `true` \| `false` | `false` | • Logs metadata and other debug informations if enabled |
| `DEFAULT_PUPPETEER_TIMEOUT` | `Integer` | `5000` | • Defines the Puppeteer's timeout |
| `GET_AVAILABLE_ APPOINTMENT_CONSULATES_ WORKFLOW_CONFIG_IN_JSON`¹ | [Serialized Workflow Settings in JSON](#get-available-appointment-consulates) | `{}` | • Defines settings for the `Get Available Appointment Consulates` Workflow |

*¹This env var name doesn't have space chars; We only used them to make it better distribute column sizes*

## Workflows
This app may have multiple Workflows with different goals and settings. Currently we support only one [Workflow](#get-available-appointment-consulates).

Take a look at the [Features](#features) section if you're interested about how Workflows work.

### Get Available Appointment Consulates
This Workflow searches for available scheduling dates according to your preferences on all facilities available in the country you scheduled your US Visa interview. It will call you through the Twilio API as soon as it finds an available date.

#### Settings
| Name | Type | Required | Default | Notes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|---|---|---|---|---|
| `cronExpression` | `String` | No | `*/15 * * * *` | • Make sure to use a valid Cron Expression<br>• Determines the interval that this Workflow will be executed<br>• We suggest building the [Crontab App](https://crontab.cronhub.io/)<br>• Intervals shorter than 15 minutes may get banned quickly |
| `visaCredentialsEmail` | `String` | Yes |  | • Make sure to use a valid Email Address<br>• This is credentials email used for accessing your [US Visa Info's](https://ais.usvisa-info.com/) account |
| `visaCredentialsPassword` | `String` | Yes |  | • This is credentials password used for accessing your [US Visa Info's](https://ais.usvisa-info.com/) account |
| `visaGroupId` | `String` | Yes |  | • Follow our [instructions](#) to get your Visa Group ID |
| `visaMinAppointmentDate` | `String` | No | *Set to the first day of the current month* | • Make sure to set using the `YYYY-MM-DD` format<br>• Determines the minimum date that you're interested about |
| `visaMaxAppointmentDate` | `String` | No | *Set to the last day of the current month* | • Make sure to set using the `YYYY-MM-DD` format<br>• Determines the maximum date that you're interested about |
| `visaNotificationMessage` | `String` | No | `This is Visa Appointment Bot. I found <%= it.totalOfAvailableDates %> available dates. Hurry to reschedule your appointment.` | • Determines the notification message that you'll receive through a call<br>• We build this message using the [Eta](https://eta.js.org/) template builder<br>• Notice that this message is able to use some [available variables](#) |
| `visaNotificationMessageLang` | `String` | No | `en-US` | • Make sure to set a Two-letters Code of [ISO 3166](https://www.iso.org/iso-3166-country-codes.html)<br>• Determines the language of the notification message that the call voice should use |
| `twilioAccountSid` | `String` | Yes |  | • Determines the Twilio Account SID used to make phone calls<br>• You can get such credentials by following the [Twilio's blog page](https://www.twilio.com/blog/better-twilio-authentication-csharp-twilio-api-keys) |
| `twilioAuthToken` | `String` | Yes |  | • Determines the Twilio Account Auth Token used to make phone calls<br>• You can get such credentials by following the [Twilio's blog page](https://www.twilio.com/blog/better-twilio-authentication-csharp-twilio-api-keys) |
| `twilioCallerNumber` | `String` | Yes |  | • Determines the Twilio Caller Number used to make phone calls<br>• You can get either add a [Verified Phohe Number](https://support.twilio.com/hc/en-us/articles/223180048-Adding-a-Verified-Phone-Number-or-Caller-ID-with-Twilio) or buy a new [Twillio Phone Number](https://support.twilio.com/hc/en-us/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console) |
| `twilioReceiverNumber` | `String` | Yes |  | • Determines the Twilio Receive Number used to receive the notification phone calls<br>• Make sure to [verify your personal phone number](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account#verify-your-personal-phone-number) if you're using the Twillio free-trial tier |

### Yarn Commands
| Name | Description | Notes |
|---|---|---|
| `yarn build` | Builds the TypeScript and outputs in the `build/` folder | • No need of using this command when using the `yarn serve` |
| `yarn serve` | Sets up a local http server in development mode | • Not meant to use in production |
| `yarn start` | Starts a http server using the `build/` folder | • Requires to execute firstly the `yarn build` command<br>• Will fail if the `build/` folder does not exist |

## Deploying to Production
This app should be easy enough to deploy to any production environment that supports Node 18+ with environment variables.

### Heroku
We encourage using Heroku to deploy this app due to the ease of just clicking in the deploy button below and making sure to configure the [environment variables](#environment-variables).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dhyegocalota/visa-appointment-tracker/tree/main)

*Notice that this app does not use a `web` dyno.*

## Troubleshootings

### Soft Rate-limit Policy
The [US Visa Info](https://ais.usvisa-info.com/) enforces a very tricky Rate-limiting system. There's no official documentation about their policy and all of the things described here are just assumptions or knowledge/experience somehow acquired through usage. 

This rate-limiting system doesn't explicitly lock you out of their dashboard but instead they start to return empty lists in the place of the actual available scheduling dates. We call this behavior a soft-ban that may last up to 5 hours to reset.

#### How to avoid this soft-ban?
We strongly recommend the *Get Available Appointment Consulates* Workflow every 15 minutes or more so you don't get soft-banned in just a few hours.

#### How to know if get soft-banned?
Monitor your logs. You'll start constantly receiving a log line like this in different executions:

`Consulate available dates list is empty. Did you get soft-banned?`

#### What should I do after I get soft-banned?
In case that you get soft-banned, the only possible way to reset this quota is to shutdown the app and wait at least 5 hours until to start it again.

## Features
This app leverages from some cool features that you may get interested of.

### Logs
Logs are incredibly heplful to understand the execution state in real time especially because currently this app only supports terminal as its UI.

### Environment Variables
Rather than hard-coding settings in the codebase, we use Environment Variables to configure this app. Environment Variables is one the [12 factors](https://12factor.net/) that guides to build better production-ready applications.

### Scraping Process
The [US Visa Info](https://ais.usvisa-info.com/) does not offer any kind of automated integrations like a Web API.

The need of watching available scheduling dates was greater than this lack of automations so we automated a scraping process using [Puppeteer](https://pptr.dev/) to interact with the US Visa Info as a human would.

### Composability
This app widely uses the concept of composability to achieve its goals. Rather than writing a single large file with thousands of instruction lines, we implemented the concept of Workflows that may contain multiple Commands.

Each Workflow has a clear and single goal to achieve. We may split a Workflow into multiple Commands where each Command also has a clear and single small goal towards the Workflow's major goal.

### Execution State
Workflows implement their own execution state which makes it so easy to track and debug their execution and progress in real time.

We leverage execution states to write logs to track progress of a Workflow and each one of its Commands.

### Retryability
This app deeply rely on the uncertainty of Network requests and responses. Each Command is susceptible to failures which can be cascaded to the Workflow forcing the entire execution to exit early with an error.

Because of the [soft rate-limiting](#soft-rate-limit-policy) implicitly imposed by the US system, we must set a reasonably interval time between executions so we avoid getting soft-banned. This reasonably interval time makes executions valuable enough to be wasted. We need to make sure to put all effort possible to successfully finish a Workflow execution. This is exactly why the retryability of each Command is so important in this app.

### Auto-discovery
This app supports multiple Workflows and we leverage from a Workflow Registry to manage their lifecycle like registering and initialization. It enables clients to initialize Workflows without the need of knowing each one of them with line of codes as simple as:

```ts
const workflows = WorkflowRegistry.getOrInitialize().buildWorkflows({ config, logger });

workflows.forEach((workflow) => {
  workflow.start();
});
```

### Typing
We use Typing through TypeScript which enables developers to quickly understand the API without the need of reading long documentation pages.

## Contributions
This was a hobby project born out of real needs and there was no funding budget at all.

All kinds of contributions or constructive usage feedbacks are encouraged. Please feel free to [create an Issue](https://github.com/dhyegocalota/visa-appointment-tracker/issues/new), or opening a Pull Request, or even to contribute answering someone else's Issues.

We'll do our best to review new Issues and Pull Requests ASAP.

## Author
Dhyego Calota <dhyegofernando@gmail.com>

## License
MIT

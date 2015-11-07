---
layout: layout.hbs
---

# Hackathon - Twitter Events

You are tasked to watch the tweet stream to analyze what's being said about
Russia.

## Objective

Design and implement a set of event detection functions in [team.html](team.html).
Each function takes an array of tweet objects as the input argument and performs
some logic to decide whether certain interesting event has occurred. For instance.
the function below triggers an event on every five tweets observed.

```
function has_observed_five_tweets(tweets){
  if (tweets.length % 5 == 0) {
    emit_event('has observed ' + tweets.length + ' tweets')
  }
}
```

## Technology

* Real-time database ([https://www.firebase.com/](https://www.firebase.com/))
* Twitter streaming API

### Server
A server process is tracking the Twitter stream using the keyword _Russia_. Every
time it receives a new tweet, it writes the tweet to the following Firebase data
location:

  [https://big-data-hci-hackathon.firebaseio.com/russia.json](https://big-data-hci-hackathon.firebaseio.com/russia.json)

The server code is already done.

### Client

Meanwhile, each client in the browser (i.e., [team.html](team.html)) subscribes
to the _value_ event at the same Firebase data location, using the code below.
```
firebase
  .child('russia')
  .on('value', function(snapshot){
    // this function is invoked each time there's update on the value
    var tweet = snapshot.val()
    update(tweet)
})
```

Whenever there's a change to this value, the callback function is invoked.
Then, `update()` calls a series of event detection functions. If a specific
event is detected, the event is pushed to the firebase at the location

  [https://big-data-hci-hackathon.firebaseio.com/events/team0.json](https://big-data-hci-hackathon.firebaseio.com/events/team0.json)

The code that achieves this is:
```
firebase
  .child('events')
  .child(TEAM_ID)
  .push()
  .set(event)
```

## Your Task

Your task is to work on is [team.html](team.html).

First, change `TEAM_ID` to match your team's name so that your team can be
uniquely identified.

As warmup, implement the detector function

```
function has_observed_two_tweets_in_a_row_about_the_crash(){
  // TODO
}
```

Then, as a team, come up with your own events and write detector functions for them.

## All Teams

[all.html](all.html) is a client page that monitors the events submitted
by all teams. Use this page to look at whether your team's events are posted
correctly, and also what other teams are up to in real-time.

# Submission

## Contributors

The team members who contributed to this hackathon are:

- Nicole Woytarowicz
- Satchel Spencer
- John Murphy
- Sushant Mittal
- Tristan Wagar

## Grading

Each person must implement at least ONE detector function. It must be meaningful.

## Events

Our team came up with the following interesting events:

1. Has observed how many tweets in the last second ? contributed by Satchel Spencer

  Testing tweets per second tells us when activity about russia is peaking.

1. Has observed a tweet in Russian that mentions the crash and terrorist attacks ? contributed by Nicole Woytarowicz

  It would be interesting to see how many tweets in Russian mention both the crash and terrorism because this will probably reflect the feelings of the Russian people about what led to the crash (since they probably won't be tweeting in English). 

1. Has observed when war is mentioned ? contributed by Tristan Wagar

  By seeing how many times war was mentioned we can see how people view the current situation in Syria with Russia's intervention and how close the general public thinks we are to war and how the media are reporting on war. Headlines can make a huge difference in perception so we can also look out for war related head lines too. 

1. Has observed when nuclear is mentioned ? contributed by Sushant Mittal

 Tweets about nuclear can tell the scale of tension between nation.

1. Has observed when ISIS or al-Qaeda are mentioned ? contributed by John Murphy

 The reason for looking the amount Al Qaeda and ISIS mentions in the stream of tweets is two fold. One to see how people are reacting in Russia and taking out their anger. Also I am collecting the percentage to see how much it can take over the conversation. 


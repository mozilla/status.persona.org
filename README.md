## Realtime Service Status for Mozilla Persona

This repository holds the status reporting system for Mozilla Persona
to be hosted at http://personastatus.org.  People who care about 
Persona can check the status of the service at that url.  People working
on persona can report incidents by adding files to this repository.

## How it works

`events/` holds a collection of *incident reports*.  An incident report is a directory,
named by convention `YYYY.MM.DD-#`, containing the following files:

  * `discovery.txt` - A textual report of a discovered problem
  * `update_X.txt` - any number (zero to infinity) of incremental status updates
  * `resolution.txt` - A textual report of the resolution of the problem.

These files have a special first line containing the date of the report, and the rest of the
file is plain text prose.  For example:

    when: Tue Sep 25 22:13:19 PDT 2012

    We've isolated the problem, it's a bogus flux capacitor.  We're going to try to stop
    in the Aquila System to buy one from the semi-hostile Midorians there.
    
**NOTE:** Date parsing is pretty flexible.  When an event occurs, type `date` at your terminal,
and then embed this in your report.

**NOTE:** The .txt suffixes are totally optional.

**NOTE:** you can name updates whatever you want.  The only hardcoded file names are `discovery(.txt)?`
and `resolution(.txt)?`.

## How you report an incident

1. create a new directory for it in `events/`
2. write a `discovery.txt` file
3. commit it
4. push it up to github
5. push updates to the personastatus awsbox (must be a core dev with a key in https://github.com/mozilla/identity-pubkeys)

        git remote add personastatus.org app@personastatus.org:git
        git push personastatus.org master

## How you resolve an incident

1. write a `resolution.txt` file in the directory
2. commit it
3. push it up to github
4. push updates to the personastatus awsbox (must be a core dev with a key in https://github.com/mozilla/identity-pubkeys)

        git remote add personastatus.org app@personastatus.org:git
        git push personastatus.org master

## Some details

Scripts in `scripts/` are responsible for validating the pile of files in `events/`,
turning them into JSON that the webpage (under `html/` can render) 

## hacking on it

1. clone it
2. npm install
3. mkdir html/data 
4. scripts/to_json.js > html/data/1.json
5. scripts/run.js
6. open http://127.0.0.1:8080/
7. hack on html/*


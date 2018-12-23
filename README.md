# Flist Firebase Cloud Functions

[![Flist](https://flist.me/css/favicons/android-icon-72x72.png)](https://flist.me)

Website: https://flist.me

Flist is my personal open-source project. It is intended to help you in keeping all your social contacts at one place so you can easily share them at once with people you meet. The platform allows you to create a profile, which you then fill with the list of any contacts that you want to share; from large social networks such as Facebook, to emails and phone numbers, and to your profiles at small thematic forums. In short, you create your own profile in the online contact book.

### Project

This specific repository is dedicated to the Google's [Firebase Cloud Functions](https://firebase.google.com) that handle some of the backend functionality on server side. They are written in TypeScript. It is much safer and reliable to conduct them server-side than client-side.

There are only two operations so far:
   - **Mirroring subscriptions**: when a user follows another user, not only an entity in "following" table in DB is created, but also a reversed entity in "followed". Firebase's DB is No-SQL, so this is a good practice. The scripts handle deletion as well.
   - **Placeholder Data on Signup**: there is a set of data points that need to be initialized in the user's DB section. It is not only unsafe to rely on client to send reliable data, but they are also unnecessary operations that can and should be handled server-side instead. 


### Other Repos of Flist
   - [IOS App Repo](https://github.com/romatallinn/flist-ios.git) -- the repository for the IOS application project.
   - [Website Repo](https://github.com/romatallinn/flist-ios/blob/master) -- the repository for the web part of Flist. Includes both the landing page and the user's profile page.


### License
This project is licensed under the MIT License - see the LICENSE.md file for details.


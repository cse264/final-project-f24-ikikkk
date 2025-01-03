# Final Project

## Due Last day of Class
## First report due Monday Oct 28, 2024

### Build a web app in a team of 4-5

### Requirements:
* Must have user accounts and different user roles (like user/Admin, free/paid, etc)
* Must use a database (you choose)
* Must have interactive UI (of any kind)
* Must use a library or framework not discussed/used in class
* Must use an outside REST API in some way (Outside as in external, like the Reddit API, etc)

* Feel free to build off other projects and frameworks. For example [https://github.com/sahat/hackathon-starter] is a great starter project that you can build on top of. 

### Instructions
Build your team and write a document describing your application to me by Monday Oct 28, 2024. Email this document to me and the TA for this course (Xinhui Chen xic721@lehigh.edu)  I will approve your web application idea. In your paper, include:
* the name of your application
* Name and roles of all your team members
* its functionality (how does it meet each of the requirements listed above - list each requirement along with your will fulfill it)
* user story/use case (what happens when a user visits your application, what can they do, etc)
* technical design (what is your tech stack)


### Final deliverable due end of the semester:
* Codebase in Github Repo
* README describing your project, with all the information outlined above (team members, application name, description, etc). You will also include detailed instructions of how to install and run your application, and what API keys, databases, etc are needed to run your application.
* Final Presentation and Demo
  * You will prepare a 5 minute presentation and demo of your application in class during the last week of classes

### App info

Application Name : Your ‘tube 

Team Members and Roles (Roles may change throughout the project):
Stone Killen - Front-end
Allen Lee - Backend/Admin
Edwin Chang - Front-end
Lisa Huang - Front-end

User roles: User and Admin accounts 
Database: Trembo
UI : Like, dislike, add comment, add video post
Library / framework: scrollreveal.js, axios.js, mui, bcrypt 
API: Youtube Data API

Use Case: Users will upload youtube video links to share with other users. The idea is to easily share media with others in a more social media format. Rather than being shown videos that the youtube algorithm suggests that you will like. Share videos with friends in one place without cluttering group chats. Users will also be able to like / dislike users posted videos and comment on the posts as well to engage in conversations about the shared content as well as flag content or comments for review. 
Admin Case: Users with admin privileges will be able to remove comments and posts to prevent harmful content as well as disable users accounts for repeated harassment. 

# How to run
start the backend/database
```
  cd backend
  npm install express //first time running it
  npm start
```

  start frontend
```
  cd yourtube
  npm install 
  Full List: npm install @emotion/react @emotion/styled @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome @mui/icons-material @mui/material @testing-library/jest-dom @testing-library/react @testing-library/user-event axios bcrypt react react-dom react-icons react-scripts react-youtube reactjs-popup scrollreveal web-vitals
  npm start
  
```
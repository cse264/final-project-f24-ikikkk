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
Lisa Huang - Backend/Admin

User roles: User and Admin accounts 
Database: Trembo
UI : Like, dislike, comment, add video post
Library / framework: Google API Client library, scrollreveal.js 
API: Youtube Data API

Use Case: Users will upload youtube video links to share with other users. The idea is to easily share media with others in a more social media format. Rather than being shown videos that the youtube algorithm suggests that you will like. Share videos with friends in one place without cluttering group chats. Users will also be able to like / dislike users posted videos and comment on the posts as well to engage in conversations about the shared content as well as flag content or comments for review. 
Admin Case: Users with admin privileges will be able to remove comments and posts to prevent harmful content as well as disable users accounts for repeated harassment. 

### Plans for Now

starting page will welcome the user and have a dropdown for the user to select the account they want to log in as (some will have the admin role for demoing purposes and will say it). 

### Database info

URI: postgresql://postgres:{$POSTGRES_PORT}@{$POSTGRES_DBNAME}:{$POSTGRES_PORT}/{$POSTGRES_USERNAME}

tables:
```
create table users (
  u_id int not null,
  f_name varchar(255),
  l_name varchar(255),
  is_admin boolean,
  primary key (u_id)
)

create table posts (
  p_id int not null,
  u_id int,
  title varchar(255),
  body varchar(255),
  likes int,
  dislikes int,
  primary key (p_id),
)

create table comments (
  c_id int not null,
  u_id int,
  p_id int,
  body varchar(255),
  likes int,
  dislikes int,
  primary key (c_id),
)
```

Default added values:
users:
```
[{"u_id":1,"f_name":"Mustang","l_name":"John","is_admin":false},
{"u_id":2,"f_name":"John","l_name":"Phillips","is_admin":true},
{"u_id":3,"f_name":"Katusha","l_name":"Vasilischev","is_admin":true},
{"u_id":4,"f_name":"Hal","l_name":"Gloster","is_admin":false},
{"u_id":5,"f_name":"Henry","l_name":"Schumacher","is_admin":false}]
```

posts:
```
[{"p_id":1,"u_id":1,"title":"https://www.youtube.com/watch?v=jfKfPfyJRdk","body":"A classic","likes":20,"dislikes":2},
{"p_id":2,"u_id":1,"title":"https://www.youtube.com/watch?v=TyUA1OmXMXA","body":"Learned a lot","likes":100,"dislikes":4},
{"p_id":3,"u_id":4,"title":"https://www.youtube.com/watch?v=ZAqIoDhornk","body":"Physics!!!!","likes":1,"dislikes":0},
{"p_id":4,"u_id":2,"title":"https://www.youtube.com/watch?v=vr5dCRHAgb0","body":"sooo relaxing","likes":20,"dislikes":2},
{"p_id":5,"u_id":5,"title":"https://www.youtube.com/watch?v=xvFZjo5PgG0","body":"It is soooo good!!","likes":2,"dislikes":20},
{"p_id":6,"u_id":5,"title":"https://www.youtube.com/watch?v=xvFZjo5PgG0","body":"It is soooo good!!!!!!","likes":2,"dislikes":100}]
```

comments:
```
[{"c_id":1,"u_id":2,"p_id":1,"body":"I AGREE!!!","likes":100,"dislikes":1},
{"c_id":2,"u_id":5,"p_id":1,"body":"I Watch This Like Everyday!!!","likes":500,"dislikes":10},
{"c_id":3,"u_id":1,"p_id":6,"body":"Please remove for spamming","likes":200,"dislikes":0},
{"c_id":4,"u_id":1,"p_id":6,"body":"AHHHHHHH","likes":100,"dislikes":1}]
```
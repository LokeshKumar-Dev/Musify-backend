## Bootcamp journal - building an API

I'm Jen and I’m in my mid-30’s, making a career change into tech. I'm on Manchester Codes’ [Software Engineering FastTrack](https://www.manchestercodes.com/software-engineer-fasttrack) course - a part-time, 24-week bootcamp based in Manchester, UK.

### Building an API

The past few weeks at bootcamp have been all about building APIs. This blog post is a write-up of how I created a music library API as a bootcamp project and what I've learned along the way.

### Before we dive in...

Before I started coding, like most non-tech people, I only used the term 'website'. Now, I think that most of these 'websites' could be better described as *web applications*. Complex sites like webmail, online banking, auction sites like Ebay and online retail stores can all be described as web apps; they are more than just a basic website with some info and little or no interactivity. I also found this explanation from Wikipedia to be helpful:

> A web application (or web app) is application software that runs on a web server, unlike computer-based software programs that are run locally on the operating system (OS) of the device. Web applications are accessed by the user through a web browser with an active internet connection.

### Back-end basics

We often think of web development in terms of front-end and back-end, right. The front-end of a web app consists of the bits we see, made up of HTML, CSS and JavaScript - the *presentation* layer - but behind that typically sit two more tiers - the *application* and (usually) some sort of *storage* (database). Those two tiers are our back-end and they both sit on a server, hence the term 'server-side' (as opposed to 'client-side' for the front-end).

Wait - it's called a web application and it's usually made up of three tiers, one of which is also called an application?! Confusing, right. 

I've been thinking of it like this - you've made a nice-looking web page, you've put some buttons and things on it. Or imagine you're looking at some other web page - maybe Spotify or an online clothes shop. When you click on a button or type in a particular web address, *something* happens. Behind that nice-looking web page you need an *application* that makes that *something* happen. It takes your request and returns the result of that request back to you, the user. In very simplified human-speak, that request might be 'show me all the women's socks you've got on sale' or 'I want to read more about your company' or 'I'd like to set up an account please' or 'I want to listen to rock music from the 1970s'. The application goes off, talks to its other back-end buddies, like a database, and comes back with a response, whether that's socks, an 'About' page, an 'account creation successful' message, or Led Zeppelin.

In the case of this project, that middle tier - the *application* - is Node.js with the Express framework on top.

[Express](https://expressjs.com/) is a back-end framework used with Node.js, so when you're working with it, the code you write is in JavaScript. You might also hear Express referred to as a 'server-side web framework' or a 'web application framework', it seems they mean the same thing. (FYI, Express is the equivalent of Ruby on Rails or Django for Python, apparently).

### So what does Express actually *do*? (and Node.js, for that matter)

Well first of all, Node.js is a thing that allows JavaScript to be used outside of a browser (remember, JavaScript was originally created as a language to be used with web browsers). It is a JavaScript *runtime* and a runtime converts the code we write (e.g. JavaScript) into something the computer can understand and execute. It allows us to build a back-end using JavaScript, which is handy as we already know it, being web developers.

Node.js can do a lot of things but there are some things that we need a framework like Express for. Frameworks allow us to perform common web development tasks more easily.

These are a few things that Express allows us to do:

* Receive requests from users (aka HTTP requests), do *something* and send appropriate responses
* Set up rules so the appropriate action is taken (the *something*) when a request comes in e.g. if a user searches for women's socks, a page listing all the women's socks is displayed
* Interact with databases e.g. we need to ask the database to send us the info about the socks so we can display it to the user (There's often an additional layer that sits between Express and the database to process these requests - it's known an Object Relational Mapper, or ORM. In this case, I'll be using an ORM called *Sequelize*)
* Format the reponse and/or data we send back e.g. we might use Express alongside a template machine which would simply slot the data we get back from the database into a pre-prepared HTML template
* Many other things such as user authorisation, improving security, cookies and sessions using something called middleware.

So armed with this basic back-end knowledge, I was ready to move on to creating an API using Express. 
### Creating a music library API

This project consists of three main parts - a database, our Express app and an ORM that sits between the two, called Sequelize.
#### Setting up the database

This project uses a MySQL database. MySQL is a popular database management system for creating and working with relational databases. 

As an added quirk, rather than install MySQL directly on our machines, we used Docker to create and run the database inside a *container*. A container is a Docker thing - it is like a self-contained box that lives on your machine and the database then lives inside it. Docker containers come pre-configured for different things - there's a specific MySQL container, and a postgres one, and a mongodb one and hundreds of thousands of others.

Why did we create our database inside a Docker container and not just install MySQL directly on our own computers? Well apparently installing and maintaining MySQL on our machines can be complicated, and the process differs depending on your operating system (one quick look at the 'Getting started' page on the MySQL website confirmed that for me). Because we're a bootcamp class of 15 or so, all with different computers and operating systems, it is simpler for everyone to install Docker and create a MySQL container with a new database in it, which automatically has all the correct configuration for working with a MySQL database, regardless of what sort of computer/Operating System you're on. Handy. It also has the added advantage that it is fairly easy for us to get rid of the container and start again from scratch if we mess our database up.

So, I installed Docker, I also installed Docker Desktop, (which you need if you're on a Mac or Windows as opposed to a Linux machine) and I ran the command we were given, which creates a new MySQL container with a new database inside it. The database was given a name `music_library_mysql` and I also gave it a password:

```docker run -d -p 3307:3306 --name music_library_mysql -e MYSQL_ROOT_PASSWORD=<PASSWORD> mysql```

Next, I downloaded MySQL Workbench, which is a tool that allows you to view and work with your newly created database. When you first open MySQL Workbench, you are prompted to connect to the database by entering the host and port details and the password that was set in the `docker run` command above.

So far so good - we've downloaded Docker, created a new container on our machines with a brand new MySQL database inside. We've also downloaded MySQL Workbench which allows us to work with our new database. We've connected the two and we can see the (empty) database in MySQL Workbench.

Next, we're going to create an API using Express, which we'll use to interact with our new database.

#### Setting up Express

Imagine a user wants to see what's in our music library database, using an imaginary web page that we haven't built yet. They might press a button on the web page that says 'List all albums' next to a photo of, say, The Beatles. When they press that button, an HTTP request will be sent and we need to grab that HTTP request, work out what it wants us to do, then perform that task and send the results back to the user. It is the API that will do all of those things for us.

At a very simple level, it's a bunch of code, written by us in JavaScript which makes use of other bundles of pre-written code (called 'modules') that tells the computer what to do with incoming requests, how to process them, what response to send back and how to send that response.

To get started, we created a new project folder and set it up as a git repository, then we initialised a new NPM project (by running `npm init`) and configured the `package.json` file and added `node_modules` to a `.gitignore` file.

Then we began by installing Express using Node Package Manager (npm).
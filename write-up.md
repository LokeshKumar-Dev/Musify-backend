## Bootcamp journal - building an API

I'm Jen and I’m in my mid-30’s, making a career change into tech. I'm on Manchester Codes’ [Software Engineering FastTrack](https://www.manchestercodes.com/software-engineer-fasttrack) course - a part-time, 24-week bootcamp based in Manchester, UK.

### Building an API

The past few weeks at bootcamp have been all about building APIs. This blog post is a write-up of how I created a music library API and what I've learned along the way.

### Before we dive in...

Before I started coding, like most people, I only used the term 'website'. Now, I've come to understand that most of these 'websites' could be better described as *web applications*. Complex sites like webmail, online banking, auction sites like Ebay and online retail stores can all be described as web apps; they are more than just a basic website with some info and little or no interactivity. I also found this explanation from Wikipedia to be helpful:

> A web application (or web app) is application software that runs on a web server, unlike computer-based software programs that are run locally on the operating system (OS) of the device. Web applications are accessed by the user through a web browser with an active internet connection.

### Back-end basics

We often think of web development in terms of front-end and back-end. The front-end of a web app consists of the bits you see, made up of HTML, CSS and JavaScript - the *presentation* layer - but behind that typically sit two more tiers - the *application* and (usually) some sort of *storage* (database). Those two tiers are our back-end and they both sit on a server, hence the term 'server-side' (as opposed to 'client-side' for the front-end).

Wait - it's called a web application and it's usually made up of three tiers, one of which is also called an application?! Confusing, right. 

I've been thinking of it like this - you've made a nice-looking web page, you've put some buttons and things on it. Or imagine you're looking at some other web page - maybe Spotify or an online clothes shop. When you click on a button or type in a particular web address, *something* happens. Behind that nice-looking web page you need an *application* that makes that *something* happen. It takes your request and returns the result of that request back to you, the user. In very simplified human-speak, that request might be 'show me all the women's socks you've got on sale' or 'I want to read more about your company' or 'I'd like to set up an account please' or 'I want to listen to rock music from the 1970s'. The application goes off, talks to its other back-end buddies, like a database, and comes back with a response, whether that's socks, an 'About' page, an 'account creation successful' message, or Led Zeppelin.

In our case, that middle tier - the *application* - is Node.js with the Express framework on top.

[Express](https://expressjs.com/) is a back-end framework used with Node.js, so when you're working with it, the code you write is in JavaScript. You might also hear Express referred to as a 'server-side web framework' or a 'web application framework', it seems they mean the same thing. (FYI, Express is the equivalent of Ruby on Rails or Django for Python, which you might have also heard of).

### So what does Express actually *do*? (and Node.js, for that matter)

Well first of all, Node.js is a thing that allows JavaScript to be used outside of a browser (remember, JavaScript was originally created as a language to be used with web browsers). It is a JavaScript *runtime* and a runtime converts the code we write (e.g. JavaScript) into something the computer can understand and execute. It allows us to build a back-end using JavaScript, which is handy as we already know it, being web developers.

Node.js can do a lot of things but there are some things that we need a framework like Express for. Frameworks allow us to perform common web development tasks more easily.

These are a few things that Express allows us to do:

* Receive requests from users (aka HTTP requests) and send appropriate responses
* Set up rules so the appropriate action is taken when a request comes in e.g. if a user searches for women's socks, a page listing all the women's socks is displayed
* Interact with databases e.g. we need to ask the database to send us the info about the socks so we can display it to the user (There's often an additional layer that sits between Express and the database to process these requests - it's known an Object Relational Mapper, or ORM. In our case, the ORM used is *Sequelize*)
* Format the reponse and/or data we send back e.g. we might use Express alongside a template machine which would simply slot the data we get back from the database into a pre-prepared HTML template
* Many other things such as user authorisation, improving security, cookies and sessions using something called middleware.

So armed with this basic back-end knowledge, I was ready to move on to creating an API using Express.

### Creating a music library API






[Cover photo by Deleece Cook on unsplash](https://unsplash.com/photos/zzjLGF_6dx4?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink)
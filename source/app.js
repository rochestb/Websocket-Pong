
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , path = require('path')
  , app = express()
  , mongoose =  require('mongoose')
  , mongoStore = require('connect-mongo')(express)
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, '/public')));
  
  app.locals.title ="NodePong";
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/nodePong');
});


route(app)

var server = http.createServer(app)
var io = require('socket.io').listen(server);
var RoomModel = require('./models/roommodel');

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var MobilePlayer = 0;
var clients = 0;
io.sockets.on('connection', function(socket){
	socket.emit('connected', {message: 'Connected to NodePong!', from: "System"});
				 // count users in RoomModel	
		
/*
	countUsers = function(){
		clients = io.sockets.clients('5179546cf0eefca6f8000001').length;
		console.log(clients);
	}
	setInterval(countUsers, 1000);
*/

	socket.on('paddleLocation', function(data, MobilePlayer){
				console.log('===paddlelocation===');
				console.log(data.MobilePlayer);
				socket.broadcast.emit('getPlayers', {data:data})
				socket.broadcast.emit('sendPaddledata', {data:data});
			});	
	socket.on('join', function (data, ball) {
	    RoomModel.findById(data.room, 'title', function(err, room){
	    	if(!err && data.room){
		    	socket.join(room._id);
		    	console.log('joined'); 	
		    }

		    clients = io.sockets.clients('5179546cf0eefca6f8000001').length;
		 	console.log('Player Joined Game ' + clients);
 			socket.broadcast.emit('clients', {});	    
			
			
		}); // End RoomModel
	}); // End  Join
	
	socket.on('disconnect', function () { 
		console.log('disconnected----------');
	});
	
	
}); // End Connection


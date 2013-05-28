	var mobile = mobile || {};
	//centralize app settings
	mobile.config = {
		'server': {
			'url': 'http://localhost:3000'
		}
	};
	var socket = io.connect(window.location);
	
	socket.on('clients', function(data){
		if(data.clients.player1.position == 'closed'){
			$('#player1').hide();
		}
		if(data.clients.player1.position == 'open'){
			$('#player1').show();
			$('#player2').removeClass('connected');
			$('#player1').html('<p>Join as Player 1</p>');
		}
		if(data.clients.player2.position == 'closed'){
			$('#player2').hide()
		}
		if(data.clients.player2.position == 'open'){
			$('#player2').show();
			$('#player2').removeClass('connected');
			$('#player2').html('<p>Join as Player 2</p>');
		}
		if(data.clients.player1.position == 'closed' && data.clients.player2.position == 'closed'){
			$('#roomsClosed').show();
		}
	})
	
	$('#player1').click(function(){
		socket.emit('player1');
		MobilePlayer = 1;	
		$('#player1').addClass('connected');
		$('#player').html( 'Player =  ' + MobilePlayer );
		startPaddle();
	})
	$('#player2').click(function(){
		socket.emit('player2');
		MobilePlayer = 2;
		$('#player1').addClass('connected');
		$('#player').html( 'Player =  ' + MobilePlayer );
		startPaddle();
	})


	
	var beta;
	var paddlePos = 1;
	var self = this;
	var idleSeconds = 20;
	var oldLocation = 0;
	var oldTouch = 350;
	startPaddle = function(){ 
		$('#mobileContent').hide();
		$('#mobileControls').show();
		socket.emit('paddleLocation', {paddlePos: paddlePos});
		

		
		window.addEventListener('touchmove', function(event){	
			resetTimer();
			event.preventDefault();
    		touch = event.touches[0];
 
    		touchLocation = (touch.pageY / $(window).height());
			paddlePos = touchLocation *540;
			
			
			
    		//incPaddle(touchLocation)
			displayPos = Math.round(Math.round(touchLocation*100));
    		
    		$('#paddlePosition').html(displayPos +15);
			socket.emit('paddleLocation', {paddlePos: paddlePos, MobilePlayer:MobilePlayer});
			
		}, false);
		
		window.addEventListener("touchend", function(event){
			oldLocation = touchLocation;
		}, false)
	
		var idleTimer;
		function resetTimer(){
			clearTimeout(idleTimer)
			idleTimer = setTimeout(whenUserIdle, idleSeconds*1000);
		};
		function whenUserIdle(){ // Remove user from game if not active	
			socket.emit('leave', {MobilePlayer:MobilePlayer})
			location.reload();
		};

		socket.on('newGameMobile', function(){
			location.reload();
		})


	}

	
		


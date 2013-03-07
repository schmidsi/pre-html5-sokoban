// JavaScript Document
var intRaster = 20;
var intBoxes;
var intCubes;
var intBoxesInCubes = 0;

$(function() {
					 
	$('#dialog').jqm();
	
	intBoxes = $('.box').length;
	intCubes = $('.cube').length;
	
	if(intBoxes != intCubes) {
		alert('Unlösbar! Nicht gleich viele Cubes wie Boxen')
	}
		
	// Keydown Event auf dem ganzen Fenster abfangen. Pfeiltasten werden weiterverarbeitet.
	$(document).keydown(function(event){
		//alert(event.keyCode);
		switch (event.keyCode)	{
			case 37: //left
				// Default Handler unterdrücken. Browser scrollt normalerweise bei Pfeiltasten
				event.preventDefault();
				movePlayer('left');
				break;
			case 38: //up
				// Default Handler unterdrücken. Browser scrollt normalerweise bei Pfeiltasten
				event.preventDefault();
				movePlayer('up');
				break;
			case 39: //right
				// Default Handler unterdrücken. Browser scrollt normalerweise bei Pfeiltasten
				event.preventDefault();
				movePlayer('right');
				break;
			case 40: //down
				// Default Handler unterdrücken. Browser scrollt normalerweise bei Pfeiltasten
				event.preventDefault();
				movePlayer('down');
				break;
		}
	});	
	
	// Z-Index von allen Elementen berechnen:
	$('.box, .wall, .cube').each(function (i) {
		setZIndex(this);
	});
});

function setZIndex(obj) {
	var intPosX = $(obj).css('left').slice(0, $(obj).css('left').length -2)*1 ;
	var intPosY = $(obj).css('bottom').slice(0, $(obj).css('bottom').length -2)*1;
		
	$(obj).css('z-index', intPosY + intPosX );
	console.log(obj, intPosX, intPosY, $(obj).css('z-index'))
}

function movePlayer(strDirection) {
	// Bewegt den Spieler in die angegebene Richtung. Prüft, ob der Spieler an diese
	// Position sich bewegen kann und ob an dieser Position ein Event ausgelöst werden
	// soll.
	var intPosX = $('#divPlayer').css('left').slice(0, $('#divPlayer').css('left').length -2) ;
	var intPosY = $('#divPlayer').css('bottom').slice(0, $('#divPlayer').css('bottom').length -2);
	var intNewPos;
	
	//console.log('movePlayer', intPosX, intPosY, intHeight, intWidth, strDirection);
	
	switch(strDirection) {
		case 'up':
			intNewPos = intPosY*1 + intRaster;
			if( !isEndOfGameHolder(intPosX, intNewPos) && !isThereAObj(intPosX, intNewPos, '.wall') && pushBox(intPosX, intNewPos, 'up') ){				
				smoothMoveObj('#divPlayer', 'up');
			};
			break;
		case 'down':
			intNewPos = intPosY*1 - intRaster;
			if( !isEndOfGameHolder(intPosX, intNewPos) && !isThereAObj(intPosX, intNewPos, '.wall')  && pushBox(intPosX, intNewPos, 'down') ){
				smoothMoveObj('#divPlayer', 'down');
			};
			break;
		case 'left':
			intNewPos = intPosX*1 - intRaster;
			if( !isEndOfGameHolder(intNewPos, intPosY) && !isThereAObj(intNewPos, intPosY, '.wall') && pushBox(intNewPos, intPosY, 'left') ){				
				smoothMoveObj('#divPlayer', 'left');
			};
			break;
		case 'right':
			intNewPos = intPosX*1 + intRaster;
			if( !isEndOfGameHolder(intNewPos, intPosY) && !isThereAObj(intNewPos, intPosY, '.wall') && pushBox(intNewPos, intPosY, 'right') ){
				smoothMoveObj('#divPlayer', 'right');
			};
			break;
	}
	
	if(intBoxesInCubes == intBoxes) {
		// alert('You got it!');
		$('#divPlayer').animate({
			height: "50%",
			width: "50%",
			opacity: 0.0
		}, 2000, function() {
			$('#dialog').jqmShow()
		});
	}
}

function smoothMoveObj(strJQExpr, strDirection) {
	var intPosX = $(strJQExpr).css('left').slice(0, $('#divPlayer').css('left').length -2)*1;
	var intPosY = $(strJQExpr).css('bottom').slice(0, $('#divPlayer').css('bottom').length -2)*1;
	
	console.log(intPosX, intPosY, strJQExpr, strDirection);
	
	// Falls die Position des Objktes nicht durch das Raster teilbar ist (=> in einer Animation)
	// wird die Funktion abgebrochen.
	if(intPosX%intRaster!=0 || intPosY%intRaster!=0) {
		return false;
	}
	
	switch(strDirection) {
		case 'up':
			$(strJQExpr).stop().animate({bottom : intPosY*1 + intRaster*1}, 100);
			break;
		case 'down':
			$(strJQExpr).stop().animate({bottom : intPosY*1 - intRaster*1}, 100);
			break;
		case 'left':
			$(strJQExpr).stop().animate({left : intPosX*1 - intRaster*1}, 100);
			break;
		case 'right':
			$(strJQExpr).stop().animate({left : intPosX*1 + intRaster*1}, 100);
			break;
	}
	
	return true;
}

function isThereAObj(intPosX, intPosY, strQuery) {
	var blnIsThereAObj = false;
	var intObjPosX;
	var intObjPosY;
	
	$(strQuery).each(function (i) {
		intObjPosX = this.style.left.slice(0, this.style.left.length -2)*1;
		intObjPosY = this.style.bottom.slice(0, this.style.bottom.length -2)*1;
		
		if( (intObjPosX == intPosX) && (intObjPosY == intPosY)  ) {
			blnIsThereAObj = true;
			return false; // Bricht den .each Loop ab.
		} 
	});		
	return blnIsThereAObj;
}

function isEndOfGameHolder(intPosX, intPosY) {
	var intOutBoundX = $('#divGameHolder').css('width').slice(0, $('#divGameHolder').css('width').length -2)*1; 
	var intOutBoundY = $('#divGameHolder').css('height').slice(0, $('#divGameHolder').css('height').length -2)*1;
	
	if ((intPosX >= 0 && intPosY >= 0) && (intPosX < intOutBoundX && intPosY < intOutBoundY)) {
		return false;
	} else {
		return true;
	}
}

function pushBox(intPosX, intPosY, strDirection) {
	// Prüft ob eine Box (movable) an der Position ist, bewegt diese, sofern keine Mauer im Weg steht.
	// Gibt true zurück, wenn eine Box bewegt wurde, oder keine im Weg steht, gib False zurück
	// wenn eine Box nicht bewegbar ist.
	var blnPushBox = true;
	var intBoxPosX;
	var intBoxPosY;
	
	$('.box').each(function (i) { 
		intBoxPosX = this.style.left.slice(0, this.style.left.length -2)*1;
		intBoxPosY = this.style.bottom.slice(0, this.style.bottom.length -2)*1;
		
		if( (intBoxPosX == intPosX) && (intBoxPosY == intPosY) ) {
			// Der Spieler läuft auf eine Box
			switch(strDirection) {
				case 'up':
					if( !isThereAObj(intBoxPosX, intBoxPosY*1 + 20, '.box, .wall' ) && !isEndOfGameHolder(intBoxPosX, intBoxPosY*1 + 20) ){
						this.style.bottom = (intBoxPosY*1 + 20) + 'px';
						setZIndex(this);
						if( isThereAObj(intBoxPosX, intBoxPosY*1 + 20, '.cube' ) ) {
							if( !$(this).hasClass("boxInCube") ) {intBoxesInCubes++}	
							$(this).addClass("boxInCube");
						} else {
							if( $(this).hasClass("boxInCube") ) {intBoxesInCubes--}
							$(this).removeClass("boxInCube");
						}
						blnPushBox = true
						return false; // Bricht den .each Loop ab.
					} else {
						blnPushBox = false
						return false; // Bricht den .each Loop ab.
					}
					break;
				case 'down':
					if( !isThereAObj(intBoxPosX, intBoxPosY*1 - 20, '.box, .wall' ) && !isEndOfGameHolder(intBoxPosX, intBoxPosY*1 - 20) ){
						this.style.bottom = (intBoxPosY*1 - 20) + 'px';
						setZIndex(this);
						if( isThereAObj(intBoxPosX, intBoxPosY*1 - 20, '.cube' ) ) {
							if( !$(this).hasClass("boxInCube") ) {intBoxesInCubes++}
							$(this).addClass("boxInCube");
						} else {
							if( $(this).hasClass("boxInCube") ) {intBoxesInCubes--}
							$(this).removeClass("boxInCube");
						}
						blnPushBox = true
						return false; // Bricht den .each Loop ab.
					} else {
						blnPushBox = false
						return false; // Bricht den .each Loop ab.
					}
					break;
				case 'left':
					if( !isThereAObj(intBoxPosX*1 - 20, intBoxPosY, '.box, .wall' ) && !isEndOfGameHolder(intBoxPosX*1 - 20, intBoxPosY) ){
						this.style.left = (intBoxPosX*1 - 20) + 'px';
						setZIndex(this);
						if( isThereAObj(intBoxPosX*1 - 20, intBoxPosY, '.cube' ) ) {
							if( !$(this).hasClass("boxInCube") ) {intBoxesInCubes++}
							$(this).addClass("boxInCube");
						} else {
							if( $(this).hasClass("boxInCube") ) {intBoxesInCubes--}
							$(this).removeClass("boxInCube");
						}
						blnPushBox = true
						return false; // Bricht den .each Loop ab.
					} else {
						blnPushBox = false
						return false; // Bricht den .each Loop ab.
					}
					break;
				case 'right':
					if( !isThereAObj(intBoxPosX*1 + 20, intBoxPosY, '.box, .wall' ) && !isEndOfGameHolder(intBoxPosX*1 + 20, intBoxPosY) ){
						this.style.left = (intBoxPosX*1 + 20) + 'px';
						setZIndex(this);
						if( isThereAObj(intBoxPosX*1 + 20, intBoxPosY, '.cube' ) ) {
							if( !$(this).hasClass("boxInCube") ) {intBoxesInCubes++}
							$(this).addClass("boxInCube");
						} else {
							if( $(this).hasClass("boxInCube") ) {intBoxesInCubes--}
							$(this).removeClass("boxInCube");
						}
						blnPushBox = true
						return false; // Bricht den .each Loop ab.
					} else {
						blnPushBox = false
						return false; // Bricht den .each Loop ab.
					}
					break;
			}
		};
	});
	
	return blnPushBox;
}
	import Draggabilly from "draggabilly";

	// support
	var is3d = true,
		onEndTransition = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( ev.target != this ) return;
				this.removeEventListener( 'transitionend', onEndCallbackFn );
				if( callback && typeof callback === 'function' ) { callback.call(this); }
			};
			el.addEventListener( 'transitionend', onEndCallbackFn );
			
		
		};

		function classReg( className ) {
		return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
		}

		// classList support for class management
		// altho to be fair, the api sucks because it won't accept multiple classes at once
		var hasClass, addClass, removeClass;


			hasClass = function( elem, c ) {
				return classReg( c ).test( elem.className );
			};
			addClass = function( elem, c ) {
				if ( !hasClass( elem, c ) ) {
				elem.className = elem.className + ' ' + c;
				}
			};
			removeClass = function( elem, c ) {
				elem.className = elem.className.replace( classReg( c ), ' ' );
			};
		

		var classie = {
		// full names
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		// short names
		has: hasClass,
		add: addClass,
		remove: removeClass
		};


	function ElastiStack( el, options ) {
		this.container = el;
		this.options = Object.assign( {}, ElastiStack.options ,options );
  		this._init();
	}

	function setTransformStyle( el, tval ) {
		el.style.WebkitTransform = tval;
		el.style.msTransform = tval;
		el.style.transform = tval;
	}

	ElastiStack.options = {
		// distDragBack: if the user stops dragging the image in a area that does not exceed [distDragBack]px for either x or y then the image goes back to the stack 
		distDragBack : 200,
		// distDragMax: if the user drags the image in a area that exceeds [distDragMax]px for either x or y then the image moves away from the stack 
		distDragMax : 450,
		// callback
		onUpdateStack : function( current ) { return false; }
	};

	ElastiStack.prototype._init = function() {
		// items
		this.items = [].slice.call( this.container.children );
		// last pointer
		this._lastPointer = {};
		// total items
		this.itemsCount = this.items.length;
		// current item's index (the one on the top of the stack)
		this.current = 0;
		// set initial styles
		this._setStackStyle();
		// return if no items or only one
		if( this.itemsCount <= 1 ) return;
		// add dragging capability
		this._initDragg();
		// init drag events
		this._initEvents();
	};

	ElastiStack.prototype._initEvents = function() {
		var self = this;
		this.draggie.on( 'dragStart', function( i, e, p ) { self._onDragStart( i, e, p ); } );
		this.draggie.on( 'dragMove', function( i, e, p ) { self._onDragMove( i, e, p ); } );
		this.draggie.on( 'dragEnd', function( i, e, p ) { self._onDragEnd( i, e, p ); } );
	};

	ElastiStack.prototype._setStackStyle = function() {
		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();

		if( item1 ) {
			item1.style.opacity = 1;
			item1.style.zIndex = 4;
			setTransformStyle( item1, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		}

		if( item2 ) {
			item2.style.opacity = 1;
			item2.style.zIndex = 3;
			setTransformStyle( item2, is3d ? 'translate3d(0,0,-60px)' : 'translate(0,0)' );
		}

		if( item3 ) {
			item3.style.opacity = 1;
			item3.style.zIndex = 2;
			setTransformStyle( item3, is3d ? 'translate3d(0,0,-120px)' : 'translate(0,0)' );
		}
	};

	ElastiStack.prototype._reset = function() {
		// reorder stack
		this.current = this.current < this.itemsCount - 1 ? this.current + 1 : 0;
		// new front items
		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();

		// reset transition timing function
		classie.remove( item1, 'move-back' );
		if( item2 ) classie.remove( item2, 'move-back' );
		if( item3 ) classie.remove( item3, 'move-back' );

		var self = this;
		setTimeout( function() {
			// the upcoming one will animate..
			classie.add( self._lastItem(), 'animate' );
			// reset styles
			self._setStackStyle();
		}, 25 );

		// add dragging capability
		this._initDragg();

		// init drag events on new current item
		this._initEvents();

		// callback
		this.options.onUpdateStack( this.current );
	};

	ElastiStack.prototype._moveAway = function( instance, pointer ) {
		var el = instance.toElement;

		// disable drag
		this._disableDragg();
		
		// add class "animate"
		classie.add( el, 'animate' );
		
		// calculate how much to translate in the x and y axis
		var tVal = this._getTranslateVal( pointer );
		
		// apply it	
		setTransformStyle( el, is3d ? 'translate3d(' + tVal.x + 'px,' + tVal.y + 'px, 0px)' : 'translate(' + tVal.x + 'px,' + tVal.y + 'px)' );
		
		// item also fades out
		el.style.opacity = 0;

		// other items move back to stack
		var item2 = this._secondItem(), item3 = this._thirdItem();

		if( item2 ) {
			classie.add( item2, 'move-back' );
			classie.add( item2, 'animate' );
			setTransformStyle( item2, is3d ? 'translate3d(0,0,-60px)' : 'translate(0,0)' );
		}
		if( item3 ) {
			classie.add( item3, 'move-back' );
			classie.add( item3, 'animate' );
			setTransformStyle( item3, is3d ? 'translate3d(0,0,-120px)' : 'translate(0,0)' );
		}

		// after transition ends..
		var self = this;
		onEndTransition( el, function() {
			// reset first item
			setTransformStyle( el, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)' );
			el.style.left = el.style.top = '0px';
			el.style.zIndex = -1;
			classie.remove( el, 'animate' );

			self._reset();
		} );
	};

	ElastiStack.prototype._moveBack = function( instance ) {
		var item2 = this._secondItem(), item3 = this._thirdItem();

		classie.add( instance.toElement, 'move-back' );
		classie.add( instance.toElement, 'animate' );
		setTransformStyle( instance.toElement, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)' );
		instance.toElement.style.left = '0px';
		instance.toElement.style.top = '0px';

		if( item2 ) {
			classie.add( item2, 'move-back' );
			classie.add( item2, 'animate' );
			setTransformStyle( item2, is3d ? 'translate3d(0,0,-60px)' : 'translate(0,0)' );
		}
		if( item3 ) {
			classie.add( item3, 'move-back' );
			classie.add( item3, 'animate' );
			setTransformStyle( item3, is3d ? 'translate3d(0,0,-120px)' : 'translate(0,0)' );
		}
	};

	ElastiStack.prototype._onDragStart = function( instance, event, pointer ) {
		// remove transition classes if any
		var item2 = this._secondItem(), item3 = this._thirdItem();

		classie.remove( instance.toElement, 'move-back' );
		classie.remove( instance.toElement, 'animate' );

		if( item2 ) {
			classie.remove( item2, 'move-back' );
			classie.remove( item2, 'animate' );
		}
		if( item3 ) {
			classie.remove( item3, 'move-back' );
			classie.remove( item3, 'animate' );
		}
	};

	ElastiStack.prototype._onDragMove = function( instance, event, pointer ) {
		this._lastPointer = pointer;
		if( this._outOfBounds( pointer ) ) {
			this._moveAway( instance, pointer );
		}
		else {
			// the second and third items also move
			var item2 = this._secondItem(), item3 = this._thirdItem();
			if( item2 ) {
				setTransformStyle( item2, is3d ? 'translate3d(' + ( pointer.x * .6 ) + 'px,' + ( pointer.y * .6 ) + 'px, -60px)' : 'translate(' + ( pointer.x * .6 ) + 'px,' + ( pointer.y * .6 ) + 'px)' );
			}
			if( item3 ) {
				setTransformStyle( item3, is3d ? 'translate3d(' + ( pointer.x * .3 ) + 'px,' + ( pointer.y * .3 ) + 'px, -120px)' : 'translate(' + ( pointer.x * .3 ) + 'px,' + ( pointer.y * .3 ) + 'px)' );
			}
		}
	};

	ElastiStack.prototype._onDragEnd = function( instance, event, pointer ) {
		var pointer = this._lastPointer;
		if( this._outOfBounds( pointer ) ) return;
		if( this._outOfSight(pointer) ) {
			this._moveAway( instance, pointer );
		}
		else {
			this._moveBack( instance );
		}
	};

	ElastiStack.prototype._initDragg = function() {
	this.draggie = new Draggabilly( this.items[ this.current ], { handle: '.quiz-cart__title' }  );
	};

	ElastiStack.prototype._disableDragg = function() {
		this.draggie.disable();
	};

	ElastiStack.prototype.nextItem = function( val ) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem();
		
		// first item get class animate
		classie.add( item1, 'animate' );
		if( item2 ) {
			classie.add( item2, 'animate' );
		}
		if( item3 ) {
			classie.add( item3, 'animate' );
		}
		
		// now translate up and fade out (Z axis)
		setTransformStyle( item1, is3d ? val.transform : 'translate(0,0)' );
		item1.style.opacity = 0;
		item1.style.zIndex = 5;

		var self = this;

		onEndTransition( item1, function() {
			classie.remove( item1, 'animate' );
			//classie.remove( this, 'move-back' );
			item1.style.zIndex = -1;

			// reset first item
			setTimeout( function() {
				setTransformStyle( item1, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)' );
				self.isAnimating = false;
			}, 25 );
		} );

		// disable drag
		this._disableDragg();
		this._reset();
	};

	// returns true if x or y is bigger than distDragMax
	ElastiStack.prototype._outOfBounds = function( el ) {
		return Math.abs( el.x ) > this.options.distDragMax || Math.abs( el.y ) > this.options.distDragMax;
	};

	// returns true if x or y is bigger than distDragBack
	ElastiStack.prototype._outOfSight = function( el ) {
		return Math.abs( el.x ) > this.options.distDragBack || Math.abs( el.y ) > this.options.distDragBack;
	};

	ElastiStack.prototype._getTranslateVal = function( el ) {
		var h = Math.sqrt( Math.pow( el.x, 2 ) + Math.pow( el.y, 2 ) ),
			a = Math.asin( Math.abs( el.y ) / h ) / ( Math.PI / 180 ),
			hL = h + this.options.distDragBack,
			dx = Math.cos( a * ( Math.PI / 180 ) ) * hL,
			dy = Math.sin( a * ( Math.PI / 180 ) ) * hL,
			tx = dx - Math.abs( el.x ),
			ty = dy - Math.abs( el.y );
		
		return {
			x : el.x > 0 ? tx : tx * -1, 
			y : el.y > 0 ? ty : ty * -1
		}
	};

	// returns the first item in the stack
	ElastiStack.prototype._firstItem = function() {
		return this.items[ this.current ];
	};
	
	// returns the second item in the stack
	ElastiStack.prototype._secondItem = function() {
		if( this.itemsCount >= 2 ) {
			return this.current + 1 < this.itemsCount ? this.items[ this.current + 1 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 1 ) ) ];
		}
	};
	
	// returns the third item in the stack
	ElastiStack.prototype._thirdItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this.current + 2 < this.itemsCount ? this.items[ this.current + 2 ] : this.items[ Math.abs( this.itemsCount - ( this.current + 2 ) ) ];
		}
	};

	// returns the last item (of the first three) in the stack
	ElastiStack.prototype._lastItem = function() { 
		if( this.itemsCount >= 3 ) {
			return this._thirdItem();
		}
		else {
			return this._secondItem();
		}
	};

	// add to global namespace
	window.ElastiStack = ElastiStack;
	export default ElastiStack;


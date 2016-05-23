;var debug = (function($){	
	var lastNode = null;
	

	function isDebugNode(node){
		return node !== typeof undefined && typeof node.attr('debug') !== typeof undefined && node.attr('debug') !== false;
	}

	function endsWith(str, suffix) {
		if( str === null || suffix === null)
			return false;
	    return str.trim().indexOf(suffix, str.length - suffix.length) !== -1;
	}

	return {
		init: function(){
			$( "<style>.debug-highlight { border: 1px solid black;} .debug-box:{border 1 px solid green; z-index:1} </style>" ).appendTo( "head" );
			$( '<div id="debug-box" class="debug-box"></div>').appendTo( "body" );
			$( '*' ).hover(function(e){
				if(e.ctrlKey){				
					var node = $(this);
					if(isDebugNode(node)){
						var clazz = node.attr('debug');
						if( lastNode === node)
							return;
						if( lastNode !== null){
							lastNode.removeClass('debug-highlight');
						}
						lastNode = node;
						lastNode.addClass('debug-highlight');

						var levelsDeep = 5;
						var level = 0;
						var children = '';
						var parents = '';

						lastNode.contents().filter(function(){
							if(level < levelsDeep){
								if(this.nodeType === 1 && isDebugNode($(this))){
									children += $(this).attr('debug')+'\n';
									level++;
								}

								if(this.nodeType === 8 && !endsWith(this.nodeValue, 'END')){
									children += this.nodeValue.trim()+'\n';
									level++;
								}
							}

							return true;
						});

						level = 0;

						$.each(lastNode.parents(), function(index, value){
							if(level > levelsDeep)
								return false;

							if(value.nodeType === 1 && isDebugNode($(value))){
								parents += $(value).attr('debug')+'\n';
								level++;

								var firstContentNode = $(value).contents()[0]
								if(firstContentNode.nodeType === 8 && !endsWith(firstContentNode.nodeValue, 'END')){
									parents += firstContentNode.nodeValue.trim()+'\n';
									level++;
								}
								
							}
						});

						$('#debug-box').html('PARENTS<br/>--------------------------------<br/>'+parents+'<br/>ITEM<br/>--------------------------------<br/>'+clazz+'<br/>CHILDREN--------------------------------\n'+children+'<br/>');
						
					
					}
				}else{
					if( lastNode !== null){
						lastNode.removeClass('debug-highlight');
					}
				}
			})
		}
	};



})(jQuery);

debug.init();
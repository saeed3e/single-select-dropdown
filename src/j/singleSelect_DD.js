/*jslint eqeq:true*/
/*******Start of singleDD (version : v.2.1.0)*/
(function ($) {
	var curOpen;
	$.fn.singleDD = function(opt){
		
			var defaults = {
						maxHeight		: 	200,
						data 			: 	{},
						width 			: 	false,
						prefillData 	: 	false,
						customScroll 	: 	true,
						sortPrefix 		: 	'',
						//selectedColor 	: 	'#000',
						//selectedId 		: 	'a',
						callBack 		: 	function(){}
			},
			opts 		=  	$.extend({},defaults,opt); //override defaults options

			
			function init(node){
				var _t 					=	this,
					elm 				=	node,
					id 					=	node.attr('id'),
					inp_sdTxt			= 	elm.find('.sdTxt'),
					name 				=	inp_sdTxt.attr('name');
					
				_t.inpTextElm			=	inp_sdTxt.attr({'name':'', 'readonly':'readonly', 'autocomplete':'off','tabIndex':'-1'});
					
				var	inpWrap				=	elm.find('.dWrap').attr({'tabIndex':'0'}),
					scrollClass 		= 	opts.customScroll?'nScroll':'';
					_t.hidElm 				=	$('<input>').attr({'type':'hidden','id':id+'Hid','name':name});
				var	width 				= 	opts.width && opts.width!='auto'?opts.width:elm.width()+'px';
					
				_t.dropCont 			= 	$('<div class="sDrop '+scrollClass +'"></div>').css({width:width,maxHeight:opts.maxHeight});
				_t.currentActive		=	false;		
				inpWrap.append(_t.hidElm);					
				elm.append(_t.dropCont);

				elm.on('mouseenter',function(){
					_t.currentActive = true;
				}).on('mouseleave',function(){
					_t.currentActive = false;
				});

				// bind event on dropdown arrow and input
				inpWrap.on('click','.sdTxt, .smArw',function(e){
					if(_t.currentActive){
						inpWrap[0].focus();
						_t.dropCont.css({'display':'block'});
						$(this).parents('.singleDD').addClass('zIndexIE7');
					}
				}).on('keydown',function(e){
					var kCd = _t.keyCode(e),node;

					if(kCd==40){
						node = _t.nextSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
					}else if(kCd==38){
						node = _t.prevSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
					}else if(kCd==13){
						_t.currentActive =false;
						_t.onblur(e,$(this));
						_t.currentActive =true;
					}else if(kCd==9){
						_t.currentActive = false;
						_t.onblur(e,$(this));
						_t.currentActive = true;
					}

				}).on('focus',function(e){
					_t.disableScroll(e);
					_t.currActiveItem = _t.dropCont.find('li:first-child');
					!_t.inpTextElm.val()? _t.currActiveItem.addClass('sAct'):'';
				}).on('blur',function(e){
					_t.onblur(e,$(this));				
				});



				_t.dropCont.on('click','li',function(){ //Bind click event on each suggestion/options
					var val = $(this).text();
					var id = _t.remDelimiter($(this).attr('id'),opts);
					//var clr = id == opts.softPrefix? '#a9a9a9': opts.//selectedColor;
					if(id){
						_t.inpTextElm.val(val);//.css({'color':clr});
						_t.hidElm.attr({'value':id});
						_t.dropCont.css({'display':'none'});
						inpWrap[0].focus();
						opts.callBack?opts.callBack(id):'';
					}else{
						_t.inpTextElm.val('');
						_t.hidElm.attr({'value':''});
					}					
				}).on('mouseover','li',function(){
					$(this).addClass('sAct');
				}).on('mouseout','li',function(){
					$(this).removeClass('sAct');
				}).html(_t.appendData.call(_t)); // fill data in dropdown;


				_t.prefillData(opts,_t.inpTextElm,id,_t.hidElm);	// set prefill value

			}

			var prototype_Objects = {
				setVal_inHiddenField : function(Ival,Hval){
					this.inpTextElm.val(Ival);
					this.hidElm.val(Hval);
					opts.callBack?opts.callBack(Hval):'';
				},
				onblur : function(e,node){
					var _t = this;
					if(!_t.currentActive){
						_t.dropCont.css({'display':'none'});	
						_t.enableScroll(e);
						node.parents('.singleDD').removeClass('zIndexIE7');
					}
				},
				setValue: function(node){
					var id = node.attr('id');
					if(node && node.length && node.text().toLowerCase() !=="select"){
						prototype_Objects.setVal_inHiddenField.call(this,node.text(),this.remDelimiter(id,opts));
					}else{
						prototype_Objects.setVal_inHiddenField.call(this,'','');
					}
				},
				appendData : function(){
					var li='';
					for(var x in opts.data){
						li += '<li id="'+x+'">'+opts.data[x]+'</li>';
					}
					return '<ul>'+li+'</ul>';
				},

				keyCode : function(e){
					return e.keyCode || e.which ; 
				},

				disb_Scroll_handler : function(e){
					var kCd = prototype_Objects.keyCode(e);
				    if (kCd === 40 || kCd === 38 || kCd === 32) {
				        e.preventDefault();
				        return false;
				    }
				},

				disableScroll : function(e){
					$(window).on('keydown', prototype_Objects.disb_Scroll_handler);	// to disable window scroll
				},

				enableScroll : function(e){
					$(window).off('keydown', prototype_Objects.disb_Scroll_handler);	// to enable window scroll
				},

				nextSelection : function(elm){
					var nextNode = elm.next();
					if(nextNode.length){
						elm.removeClass('sAct');
						this.currActiveItem = nextNode;
						nextNode.addClass('sAct');
					}else{
						nextNode = elm;
					}
					return nextNode;
				},
				
				prevSelection : function(elm){
					var prevNode = elm.prev();
					if(prevNode.length){
						elm.removeClass('sAct');
						this.currActiveItem = prevNode;
						prevNode.addClass('sAct');	
					}
					return prevNode;	
				},

				prefillData : function(opts,inpElm,id,hidElm){	//for prefiil data
					if(opts.data[opts.prefillData]){
						inpElm.val(opts.data[opts.prefillData]);
						hidElm.attr({'value':prototype_Objects.remDelimiter(opts.prefillData,opts)});
					}
				},
						
				remDelimiter : function(txt,op){ // remove prefilx delimeter from the keys
					return txt && op.sortPrefix?txt.replace(op.sortPrefix,''):txt;
				}

			};

			function singleDD_Constructor(nodeElem){
				init.call(this,nodeElem);
			}

			singleDD_Constructor.prototype = prototype_Objects;

			this.each(function(){
				if(!$(this).data('singleDD')){
					var singleDD_instance = new singleDD_Constructor($(this));
					$(this).data('singleDD',singleDD_instance);
				}
			});

			return this.data('singleDD');
		
	};

	
	
	
	
})(jQuery);
//End of singleDD
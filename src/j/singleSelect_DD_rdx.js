/*global ieObj*/
/*jslint eqeq:true*/
/*******Start of singleDD (version : v.3.0.0)*/

$(document).click(function(e){
	if(!$(e.target).parents('.singleDD').length){
		$('.singleDD .sDrop').slideUp(200);
	}
});

var previousOpen;		
(function ($) {
	var curOpen;
	$.fn.singleDD = function(opt){

			var defaults = {
						maxHeight		 : 	200,
						data 			 : 	{},
						defaultIndex	 :  true,
						customScroll 	 : 	true,
						placeholderColor : '#a9a9a9',
						selectColor		 : '#333',
						animationSpeed	 :  200
			},
			opts 		=  	$.extend({},defaults,opt); //override defaults options

			function bindClickEvnet(){
				var _t = this;
				_t.inpWrap.on('click','.sdTxt, .smArw, .arw',function(e){
					if(_t.currentActive){
						_t.inpWrap[0].focus();
						_t.width = 	opts.width && opts.width!='auto'?opts.width:_t.elm.width()+'px';
						_t.dropCont.css({'width':_t.width}).slideDown(opts.animationSpeed,function(){						
							// Custom ScrollBar initialization
							if(_t.dropCont[0].csb){
								_t.dropCont[0].csb.reset();
							}
						});

						if(opts.changeDirection){
							//Direction Code Starts
							if(wrap == null){
								mainEle = $(window).height();
								eleTop = _t.elm.find('.dWrap').offset().top - $(window).scrollTop(); //Element distance from top
							}
							else{
								mainEle = $(wrap).height();
								eleTop = $(wrap).scrollTop() + _t.elm.find('.dWrap').offset().top //Element distance from parent
							}
							var width = opts.width && opts.width!='auto'?opts.width:_t.elm.width()+'px';
							if(mainEle>=opts.maxHeight){
								if(mainEle>=(eleTop+opts.maxHeight)){
									_t.dropCont.css({top:_t.elm.find('.dWrap').outerHeight(), left:0, display:'block'});
								}
								else{
									_t.dropCont.css({top:"-"+opts.maxHeight+"px", left:0, display:'block'});
								}
							}
							else{
								_t.dropCont.css({top:_t.elm.find('.dWrap').outerHeight(), left:0, display:'block'});
							}
						}
						else{
							_t.dropCont.css({top:_t.elm.find('.dWrap').outerHeight(), left:0, display:'block'});
						}
						$(this).parents('.singleDD').addClass('zIndexIE7');
						opts.onOpen?opts.onOpen():'';
					}
				}).on('keydown',function(e){
					var kCd = _t.keyCode(e),node;
					var firstChild = _t.dropCont.find(':first-child');
					var ulCont = _t.dropCont.find('ul');
					var ulCont_hghtCont = ulCont.parents('.sDrop');
					var ulCont_parent = ulCont.parent();

					if(kCd==39 || kCd==40){
						node = _t.nextSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
						ieObj.scrollHandler(ulCont_parent,ulCont_hghtCont,ulCont,firstChild,node);
					}else if(kCd==37 || kCd==38){
						node = _t.prevSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
						ieObj.scrollHandler(ulCont_parent,ulCont_hghtCont,ulCont,firstChild,node);
					}else if(kCd==9 || kCd==13 || kCd == 27){
						_t.currentActive =false;
						_t.onblur(e,$(this));
						_t.currentActive =true;
					}					
				}).on('focus',function(e){
					if(opts.onFocus) opts.onFocus();
					_t.disableScroll(e);
					_t.currActiveItem = _t.dropCont.find('li:first-child');
					!_t.inpTextElm.val()? _t.currActiveItem.addClass('sAct'):'';
				}).on('blur',function(e){
					_t.enableScroll(e);
					_t.onblur(e,$(this));
				}).mousedown(function() {
					 return false;   	// Fix : when click on scorollbar focus lost-> IE (8.0), Opera (11.61), Chrome (17.0) and Safari (5.1) all removed focus from the focusable element
				});
			}

			function init(node){
				var _t 					=	this;
					_t.elm 				=	node;
					var id 					=	node.attr('id'),
					inp_sdTxt			= 	_t.elm.find('.sdTxt'),
					name 				=	inp_sdTxt.attr('name');

					_t._this 			= 	_t;
					
					_t.inpTextElm			=	inp_sdTxt.attr({'name':'', 'readonly':'readonly', 'autocomplete':'off','tabIndex':'-1'});
					_t.inpWrap				=	_t.elm.find('.dWrap').attr({'tabIndex':'0'});

				var scrollClass 		= 	opts.customScroll?'nScroll':'',
					wrap 				=	opt.wrap?opt.wrap:null;
					_t.hidElm 				=	$('<input>').attr({'type':'hidden','id':id+'Hid','name':name});
					
				_t.dropCont 			= 	$('<div class="sDrop '+scrollClass +'"></div>').css({maxHeight:opts.maxHeight});
				_t.currentActive		=	false;		
				_t.inpWrap.append(_t.hidElm);					
				_t.elm.append(_t.dropCont);


				_t.replaceData = function(data){
					_t.setVal_inHiddenField('','');
					_t.dropCont.find('ul').html(_t.appendData(data));
				};

				_t.elm.on('mouseenter',function(){
					_t.currentActive = true;
				}).on('mouseleave',function(){
					_t.currentActive = false;
				});


				// bind event on dropdown arrow and input
				bindClickEvnet.call(_t);

				
				_t.dropCont.on('click','li',function(){ //Bind click event on each suggestion/options
					var val = $(this).text();
					var id = _t.remDelimiter($(this).attr('id'));
					if(opts.defaultIndex && $(this).index()===0){
						_t.setVal_inHiddenField('','',true);
					}else{
						_t.setVal_inHiddenField(val,id);
					}
					_t.inpWrap[0].focus();
					_t.dropCont.slideUp(opts.animationSpeed);//calling callBack first & then hiding the dropdown			
				}).on('mouseover','li',function(){
					$(this).addClass('sAct');
				}).on('mouseout','li',function(){
					$(this).removeClass('sAct');
				}).html(_t.appendData(opts.data)); // fill data in dropdown;


				_t.prefillData(opts,id);	// set prefill value

			}

			var prototype_Objects = {
				
				prefillData : function(opts,id){	//for prefiil data
					if(opts.data[opts.prefillData]){
						//if(opts.callBack)opts.callBack(opts.prefillData);
						prototype_Objects.setVal_inHiddenField.call(this,opts.data[opts.prefillData],prototype_Objects.remDelimiter(opts.prefillData));
					}
				},

				setVal_inHiddenField : function(Ival,Hval,defaultIndex){
					var color;
					if(!jQuery.support.placeholder){
						if(!Ival){
							Ival = this.inpTextElm.attr('placeholder');
							color = opts.placeholderColor;
						}else{
							color = opts.selectColor;
						}
					}
					this.inpTextElm.val(Ival).css({'color':color});
					this.hidElm.val(Hval);
					if(Hval || defaultIndex)opts.callBack?opts.callBack(Hval):'';
				},

				disable :function(){
					this.inpWrap.off('click keydown focus blur');
				},
				enable : function(){
					bindClickEvnet.call(this._this)
				},

				onblur : function(e,node){
					var _t = this;

					if(!_t.currentActive){
						_t.dropCont.slideUp(opts.animationSpeed);
						node.parents('.singleDD').removeClass('zIndexIE7');
						opts.onClose?opts.onClose():'';
						previousOpen = _t.dropCont;
					}
					
				},
				setValue: function(node){
					var id = node.attr('id');
					if(opts.defaultIndex && node.index()==0){
						prototype_Objects.setVal_inHiddenField.call(this,'','');
					}else if(node && node.length){
						prototype_Objects.setVal_inHiddenField.call(this,node.text(),this.remDelimiter(id));
					}
				},
				appendData : function(data){
					var li='';
					for(var x in data){
						if(opts.textWrap){
						li+='<li id="'+x+'"><'+opts.textWrap+'>'+data[x]+'</'+opts.textWrap+'></li>';
						}
						else
						li += '<li id="'+x+'">'+data[x]+'</li>';
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
					$(window).on('keydown', prototype_Objects.disb_Scroll_handler);		// to disable window scroll
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
						
				remDelimiter : function(txt){ // remove prefilx delimeter from the keys
					return txt && opts.sortPrefix?txt.replace(opts.sortPrefix,''):txt;
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

/*Parameters*/
// onChange
// onClose
// onOpen
// sortPrefix
// maxHeight
// prefillData
// width
// customScroll
// data
// replaceData
// enable
// disable

/********************fixes in this version************/
// add disabled function features

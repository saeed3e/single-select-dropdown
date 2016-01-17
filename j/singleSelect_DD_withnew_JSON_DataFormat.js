/*global ieObj*/
/*jslint eqeq:true*/
/*******Start of singleDD (version : v.4.0.0)*/

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

			
			function init(node){
				var _t 					=	this,
					elm 				=	node;
					_t.id 				=	node.attr('id');
				var	inp_sdTxt			= 	elm.find('.sdTxt'),
					name 				=	inp_sdTxt.attr('name');
					
				_t.inpTextElm			=	inp_sdTxt.attr({'name':'', 'readonly':'readonly', 'autocomplete':'off','tabIndex':'-1'});
					
				var	inpWrap				=	elm.find('.dWrap').attr({'tabIndex':'0'}),
					scrollClass 		= 	opts.customScroll?'nScroll':'';
					_t.hidElm 				=	$('<input>').attr({'type':'hidden','id':_t.id+'Hid','name':name});
				var	width 				= 	opts.width && opts.width!='auto'?opts.width:elm.width()+'px';
				_t.dropCont 			= 	$('<div class="sDrop '+scrollClass +'"></div>').css({width:width,maxHeight:opts.maxHeight});
				_t.currentActive		=	false;		
				inpWrap.append(_t.hidElm);					
				elm.append(_t.dropCont);


				_t.replaceData = function(data){
					_t.setVal_inHiddenField('','');
					_t.dropCont.find('ul').html(_t.appendData(data));
				};



				elm.on('mouseenter',function(){
					_t.currentActive = true;
				}).on('mouseleave',function(){
					_t.currentActive = false;
				});

				// bind event on dropdown arrow and input
				inpWrap.on('click','.sdTxt, .smArw',function(e){
					if(_t.currentActive){
						inpWrap[0].focus();

						_t.dropCont.slideDown(opts.animationSpeed,function(){						
							/** Custom ScrollBar initialization */
							if(_t.dropCont[0].csb){
								_t.dropCont[0].csb.reset();
							}
						});
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
						console.log(2)
					}else if(kCd==37 || kCd==38){
						node = _t.prevSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
						ieObj.scrollHandler(ulCont_parent,ulCont_hghtCont,ulCont,firstChild,node);
						console.log(3)
					}else if(kCd==9 || kCd==13 || kCd == 27){
						_t.currentActive =false;
						_t.onblur(e,$(this));
						_t.currentActive =true;
					}					
				}).on('focus',function(e){
					_t.disableScroll(e);
					_t.currActiveItem = _t.dropCont.find('li:first-child');
					!_t.inpTextElm.val()? _t.currActiveItem.addClass('sAct'):'';
				}).on('blur',function(e){
					_t.enableScroll(e);
					_t.onblur(e,$(this));

				}).mousedown(function() {
					 return false;   	// Fix : when click on scorollbar focus lost-> IE (8.0), Opera (11.61), Chrome (17.0) and Safari (5.1) all removed focus from the focusable element
				});



				_t.dropCont.on('click','li',function(){ //Bind click event on each suggestion/options
					var val = $(this).text();
					var id = _t.remDelimiter($(this).attr('id'));
					if(opts.defaultIndex && $(this).index()===0){
						_t.setVal_inHiddenField('','',true);
					}else{
						_t.setVal_inHiddenField(val,id);
					}
					inpWrap[0].focus();
					_t.dropCont.slideUp(opts.animationSpeed);//calling callBack first & then hiding the dropdown			
				}).on('mouseover','li',function(){
					$(this).addClass('sAct');
				}).on('mouseout','li',function(){
					$(this).removeClass('sAct');
				}).html(_t.appendData(opts.data)); // fill data in dropdown;

				
				if(opts.data[opts.prefillData]){
					_t.prefillData(opts.prefillData);	// set prefill value
				}

			}

			var prototype_Objects = {
				
				prefillData : function(key){	//for prefiil data
					this.setVal_inHiddenField.call(this,key,this.remDelimiter(key));
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
					var key = node.data('id');
					if(opts.defaultIndex && node.index()==0){
						this.setVal_inHiddenField.call(this,'','');
					}else if(node && node.length){
						this.setVal_inHiddenField.call(this,node.text(),this.remDelimiter(key));
						console.log(1)
					}
				},
				
				createListTuple:function(data){
					if(opts.textWrap){
						return '<li data-id="'+data.value+'"><'+opts.textWrap+'>'+data.text+'</'+opts.textWrap+'></li>';
					}else{
						return '<li data-id="'+data.value+'">'+data.text+'</li>';
					}
					if(data.selected){
						this.setVal_inHiddenField.call(this,data.value);
					}
				},

				appendData : function(data){
					var li='';
					for(var x in data){
						if(Object.prototype.toString.call(data[x]) == "[object Object]"){
							li += this.createListTuple(data[x]);
						}else{ // this is only fallback to support old json format and old JSON format has been depricated
							if(opts.textWrap){
								li += '<li data-id="'+x+'"><'+opts.textWrap+'>'+data[x]+'</'+opts.textWrap+'></li>';
							}else{
								li += '<li data-id="'+x+'">'+data[x]+'</li>';
							}
						}
					}
					return '<ul>'+li+'</ul>';
				},

				keyCode : function(e){
					return e.keyCode || e.which ; 
				},

				disb_Scroll_handler : function(e){
					var kCd = this.keyCode(e);
				    if (kCd === 40 || kCd === 38 || kCd === 32) {
				        e.preventDefault();
				        return false;
				    }
				},

				disableScroll : function(e){
					$(window).on('keydown', this.disb_Scroll_handler);		// to disable window scroll
				},

				enableScroll : function(e){
					$(window).off('keydown', this.disb_Scroll_handler);	// to enable window scroll
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
						
				remDelimiter : function(key){ // remove prefilx delimeter from the keys
					return key && opts.sortPrefix?(key.toString()).replace(opts.sortPrefix,''):key;
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

/********************fixes in this version************/
// remvoe some fixes

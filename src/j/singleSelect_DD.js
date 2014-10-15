/*global ieObj*/
/*jslint eqeq:true*/
/*******Start of singleDD (version : v.2.2.1)*/

(function ($) {
	var curOpen;
	$.fn.singleDD = function(opt){
		
			var defaults = {
						maxHeight		 : 	200,
						data 			 : 	{},
						customScroll 	 : 	true,
						placeholderColor : '#a9a9a9',
						selectColor		 : '#333',
						animationSpeed	 :  200
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


				_t.replaceData = function(data){
					_t.setVal_inHiddenField('','');
					_t.dropCont.find('ul').html(_t.appendData(data));
				};

				$(document).click(function(e){
					if(!$(e.target).parents('.singleDD').length){
						_t.dropCont.slideUp(opts.animationSpeed);
					}
				});

				elm.on('mouseenter',function(){
					_t.currentActive = true;
				}).on('mouseleave',function(){
					_t.currentActive = false;
				});

				// bind event on dropdown arrow and input
				inpWrap.on('click','.sdTxt, .smArw',function(e){
					if(_t.currentActive){
						inpWrap[0].focus();
						_t.dropCont.slideDown(opts.animationSpeed);
						$(this).parents('.singleDD').addClass('zIndexIE7');
						opts.onOpen?opts.onOpen():'';
						
						/** Custom ScrollBar initialization */
						if(_t.dropCont[0].csb){
							_t.dropCont[0].csb.reset();
						}
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
					_t.disableScroll(e);
					_t.currActiveItem = _t.dropCont.find('li:first-child');
					!_t.inpTextElm.val()? _t.currActiveItem.addClass('sAct'):'';
				}).on('blur',function(e){
					_t.enableScroll(e);
					_t.onblur(e,$(this));

				});



				_t.dropCont.on('click','li',function(){ //Bind click event on each suggestion/options
					var val = $(this).text();
					var id = _t.remDelimiter($(this).attr('id'));

					if($(this).index()===0){
						_t.setVal_inHiddenField('','');
					}else{
						_t.setVal_inHiddenField(val,id);
					}
					inpWrap[0].focus();
					if(opts.callBack)opts.callBack(id);
					_t.dropCont.slideUp(opts.animationSpeed);//calling callBack first & then hiding the dropdown
					if(opts.onChange)opts.onChange(id);				
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
						if(opts.callBack)opts.callBack(opts.prefillData);
						prototype_Objects.setVal_inHiddenField.call(this,opts.data[opts.prefillData],prototype_Objects.remDelimiter(opts.prefillData));
					}
				},

				setVal_inHiddenField : function(Ival,Hval){
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
					opts.callBack?opts.callBack(Hval):'';
				},
				onblur : function(e,node){
					var _t = this;

					if(!_t.currentActive){
						_t.dropCont.slideUp(opts.animationSpeed);
						//_t.enableScroll(e);
						node.parents('.singleDD').removeClass('zIndexIE7');
						opts.onClose?opts.onClose():'';
					}
				},
				setValue: function(node){
					var id = node.attr('id');
					if(node && node.length && node.text().toLowerCase() !=="select"){
						prototype_Objects.setVal_inHiddenField.call(this,node.text(),this.remDelimiter(id));
					}else{
						prototype_Objects.setVal_inHiddenField.call(this,'','');
					}
				},
				appendData : function(data){
					var li='';
					for(var x in opts.data){
						if(opts.textWrap){
						li+='<li id="'+x+'"><'+opts.textWrap+'>'+opts.data[x]+'</'+opts.textWrap+'></li>';
						}
						else
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


/********************Fixes in this version************/
//ie 8 and ie7 issue :  when user click on scroll bar single dd doesn't close 
//Status : Fixed
// add animationSpeed parameter
// Fixed : window scroll enable disable problem


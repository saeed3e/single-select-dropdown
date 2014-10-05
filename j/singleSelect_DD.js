/*jslint eqeq:true*/
/*******Start of singleDD (version : v.2.1.0)*/

var ieObj = {
	scrollHandler : function(container, scrollContainer, firstElement, curActiveTouple){
		if(curActiveTouple.length){
			var scrollTopPos,
				scrollContr 	=	container;
			var maxHeight 		=	scrollContr.outerHeight();
			var visible_top 	=	scrollContr.scrollTop();
			var visible_bottom 	=	maxHeight + visible_top;
			var high_top 		=	(curActiveTouple.position().top - scrollContainer.position().top) + firstElement.scrollTop();
			var high_bottom 	=	high_top + curActiveTouple.outerHeight();

			if (high_bottom >= visible_bottom){
				scrollTopPos = (high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0;
				scrollContr.scrollTop(scrollTopPos);
			} else if (high_top < visible_top){
				scrollTopPos = high_top;
				scrollContr.scrollTop(scrollTopPos);
			}
			return scrollTopPos;	
		}		
	}
};

(function ($) {
	var curOpen;
	$.fn.singleDD = function(opt){
		
			var defaults = {
						maxHeight		: 	200,
						data 			: 	{},
						customScroll 	: 	true
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
						opts.onOpen?opts.onOpen():'';
					}
				}).on('keydown',function(e){
					var kCd = _t.keyCode(e),node;
					var firstChild = _t.dropCont.find(':first-child');
					var ulCont = _t.dropCont.find('ul');
					var ulCont_parent = ulCont.parent();

					if(kCd==39 || kCd==40){
						node = _t.nextSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
						ieObj.scrollHandler(ulCont_parent,ulCont,firstChild,node);
					}else if(kCd==37 || kCd==38){
						node = _t.prevSelection.call(_t,_t.currActiveItem);
						_t.setValue.call(_t,node);
						ieObj.scrollHandler(ulCont_parent,ulCont,firstChild,node);
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
					_t.onblur(e,$(this));				
				});



				_t.dropCont.on('click','li',function(){ //Bind click event on each suggestion/options
					var val = $(this).text();
					var id = _t.remDelimiter($(this).attr('id'));
					if(id){
						_t.inpTextElm.val(val);
						_t.hidElm.attr({'value':id});
					}else{
						_t.inpTextElm.val('');
						_t.hidElm.attr({'value':''});
					}
					_t.dropCont.css({'display':'none'});
					inpWrap[0].focus();
					if(opts.callBack)opts.callBack(id);
					if(opts.onChange)opts.onChange(id);				
				}).on('mouseover','li',function(){
					$(this).addClass('sAct');
				}).on('mouseout','li',function(){
					$(this).removeClass('sAct');
				}).html(_t.appendData.call(_t)); // fill data in dropdown;


				_t.prefillData(opts,id);	// set prefill value

			}

			var prototype_Objects = {
				
				prefillData : function(opts,id){	//for prefiil data
					if(opts.data[opts.prefillData]){
						this.inpTextElm.val(opts.data[opts.prefillData]);
						this.hidElm.attr({'value':prototype_Objects.remDelimiter(opts.prefillData)});
					}
				},

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
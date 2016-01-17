var ieObj = {
	scrollHandler : function(container, heightCont, scrollContainer, firstElement, curActiveTouple){
		if(curActiveTouple.length){
			var scrollTopPos,
				scrollContr 	=	container;
			var maxHeight 		=	heightCont.outerHeight();
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

$.support.placeholder = (function(){
	var i = document.createElement('input');
	return 'placeholder' in i;
})(jQuery);

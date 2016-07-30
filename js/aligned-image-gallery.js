/************
This javascript code combined with the correct html structure will resize
and align images in a gallery to fit their container

Requires jQuery

I coded this to be compatible with the jQuery Lazy Load plugin by Mika Tuupola
found here http://www.appelsiini.net/projects/lazyload

Created by Eric Sadowski
http://www.ericsadowski.com/
*************/


// delay function to prevent image resizing while window is still being resized (found online)
var delay = (function() {
	var timer = 0;
	return function(callback, ms) {
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();
// reset the image sizes back to the startingHeight and calculated width
function resetImageSize(uniqueGalleryId, startingHeight) {
	// strip classes so new rows can be created
	$(uniqueGalleryId + " .galleryDiv").attr("class", "galleryDiv");
	// reset image size to startingHeight and resizedwidth that was stored in data- attribute
	$(uniqueGalleryId + " img").each(function() {
		$(this).height(startingHeight);
		$(this).width($(this).data("resizedwidth"));
	});
	// reset margins
	$(".galleryDiv").css("margin-left", 0);
}
// label images with row numbers based on container width
function createRows(uniqueGalleryName, startingHeight) {
	// calculate and store the width of the gallery container
	var windowWidth = $("#" + uniqueGalleryName).width();
	var rowNum = 1;
	var rowWidth = 0;
	// for each .galleryDiv
	$("#" + uniqueGalleryName + " .galleryDiv").each(function() {
		var elementWidth = $(this).width();
		// add div widths
		rowWidth += elementWidth;
		// until their combined widths are larger than the container width
		if (rowWidth > windowWidth) {
			rowWidth = elementWidth;
			rowNum += 1;
		}
		// then put all of those divs in a row by adding a class
		$(this).addClass(uniqueGalleryName + "-row-" + rowNum);
	});
	// pass an array of things to be used
	return [uniqueGalleryName, rowNum, windowWidth, startingHeight];
}
// resize the images to approximately fill each row
function alignImages(galleryProperties) {
	var uniqueGalleryName = galleryProperties[0];
	var rowNum = galleryProperties[1];
	var windowWidth = galleryProperties[2];
	var startingHeight = galleryProperties[3];
	// calculate the width of the last row
	var lastRowWidth = 0;
	$("." + uniqueGalleryName + "-row-" + rowNum).each(function() {
		lastRowWidth += $(this).outerWidth(true) + 6; // adding 6 creates space between the images
	});
	// if the last row is wide enough, resize the images
	var resizeLastRow = true;
	if (lastRowWidth < (windowWidth * 0.6)) {
		rowNum = rowNum - 1;
		resizeLastRow = false;
	}
	// for each row
	for (var i = 1; i <= rowNum; i++) {
		var rowWidth = 0;
		// row must be less than the width of the container so subtract 1 pixel
		var newRowWidth = windowWidth - 1;
		// calculate the actual width of the row
		// use outerWidth(true) to include padding, margins, border
		$("." + uniqueGalleryName + "-row-" + i).each(function() {
			rowWidth += $(this).outerWidth(true) + 6; // adding 6 creates space between the images
		});
		// calculate the aspect ratio so the row will fill the container width
		var aspect = newRowWidth / rowWidth;
		// apply the calculations
		$("." + uniqueGalleryName + "-row-" + i +" img").each(function() {
			$(this).height(Math.floor(startingHeight * aspect));
			$(this).width(Math.floor($(this).width() * aspect));
		});
	}
	// pass multiple values
	return [uniqueGalleryName, rowNum, windowWidth, startingHeight, resizeLastRow];
}
// add margins so the images are evenly distributed in each row
function distributeImages(galleryProperties) {
	var uniqueGalleryName = galleryProperties[0];
	var rowNum = galleryProperties[1];
	var windowWidth = galleryProperties[2];
	var startingHeight = galleryProperties[3];
	var resizeLastRow = galleryProperties[4];
	// for each row
	for (var i = 1; i <= rowNum; i++) {
		var rowWidth = 0;
		var newRowWidth = windowWidth - 1;
		var imgCount = 1;
		// calculate the actual width of the row
		// use outerWidth(true) to include padding, margins, border
		// count the number of images in the row
		$("." + uniqueGalleryName + "-row-" + i).each(function() {
			rowWidth += $(this).outerWidth(true);
			imgCount += 1;
		});
		// divide the leftover row space by the number of images
		var imgMargin = Math.floor((newRowWidth - rowWidth) / imgCount);
		// apply this to each image
		$("." + uniqueGalleryName + "-row-" + i).css("margin-left", imgMargin);
	}
	if (!resizeLastRow) {
		// distribute the last row with 5px because the last row is not full
		var lastRowNum = rowNum + 1;
		$("." + uniqueGalleryName + "-row-" + lastRowNum).css("margin-left", 5);
	}
}
// used to pass the gallery name and starting image height
function initializeGallery(uniqueGalleryName, startingHeight) {
	// create rows, align the images, then distribute them
	distributeImages(alignImages(createRows(uniqueGalleryName, startingHeight)));
	// record the current width of the container
	var previousWidth = $("#" + uniqueGalleryName).width();
	// runs everytime the window resizes
	$(window).resize(function() {
		// delay by 100 milliseconds
		delay(function() {
			// compare the current width of the container to the recorded width
			// if the width of the container has changed
			if ($("#" + uniqueGalleryName).width() != previousWidth) {
				// reset the images so that new rows may be created
				// the images do not scale in size to the container, they are reorganized according to it
				resetImageSize("#" + uniqueGalleryName, startingHeight);
				// create rows, align the images, then distribute them
				distributeImages(alignImages(createRows(uniqueGalleryName, startingHeight)));
				// record the new width of the container
				previousWidth = $("#" + uniqueGalleryName).width();
			}
		}, 100);
	});
}

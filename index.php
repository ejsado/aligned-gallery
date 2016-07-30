<!DOCTYPE HTML>
<html>
	<head>
		<title>Aligned Image Gallery</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<script src="js/aligned-image-gallery.js"></script>
		<script src="js/jquery.lazyload.min.js"></script>
		<link rel="stylesheet" type="text/css" href="css/gallery.css" />
	</head>
	
	<body>
		<!-- 
			Created by Eric Sadowski
			http://www.ericsadowski.com/
		-->
		<div id="myGallery" class="container">
			<?php
				// set the desired approximate height of each row in pixels
				$baseHeight = 200;
				// array for image filetypes
				$imageTypes = array(
					'gif' => 'image/gif',
					'png' => 'image/png',
					'jpg' => 'image/jpeg',
					'jpeg' => 'image/jpeg'
				);
				$imageDirectory = 'images';
				// create array of file names using folder containing the images to be the gallery
				$imageFiles = scandir($imageDirectory);
				// randomize the order of the images
				shuffle($imageFiles);
				// uncomment line below to limit the number of images to load
				//$imageFiles = array_slice($imageFiles, 0, 200);
				$i = 1;
				// for each image in the array
				foreach($imageFiles as $entry) {
					if (!is_dir($entry)) {
						// check if the file name has the correct extention
						if (in_array(mime_content_type($imageDirectory . '/' . $entry), $imageTypes)) {
							// get the image height and width
							list($imageWidth, $imageHeight) = getimagesize($imageDirectory . '/' . $entry);
							// calculate the resized width based on the baseHeight
							$aspect = $baseHeight / $imageHeight;
							$newWidth = $imageWidth * $aspect;
							// output div with image
							// galleryDiv class must be used for the javascript
							// id is for future use?
							// use data-original instead of src for lazy loading plugin
							// data-resizedwidth is used in the javascript to reset the image size
							echo '<div class="galleryDiv" id="galleryImage-' . $i . '"><a href="' . $imageDirectory . '/' . $entry . '"><img  src="1x1-grey.png" data-original="' . $imageDirectory . '/' . $entry . '" data-resizedwidth="' . $newWidth . '" alt="image" style="width: ' . $newWidth . 'px; height: ' . $baseHeight . 'px;"></a></div>';
							$i += 1;
						}
					}
				};
			?>
		</div>
		<script type="text/javascript">
			// run when page is loaded (not images)
			// this works because the image size is stored in the css
			$(document).ready(function() {
				// lazy load plugin initialization
				$("#myGallery .galleryDiv img").lazyload();
				// js gallery initialization
				initializeGallery("myGallery", <?php echo $baseHeight; ?>);
			});
		</script>
	</body>
</html>
#!/bin/bash

JS_COMPILER=closure_compiler.jar
CSS_COMPILER=closure-stylesheets.jar
WWW_DIR=../../server/www

java -jar $JS_COMPILER --js $WWW_DIR/lib/bootstrap_tagsinput/bootstrap-tagsinput.js \
					   --js $WWW_DIR/js/utils/Constants.js \
					   --js $WWW_DIR/js/services/UtilsService.js \
					   --js $WWW_DIR/js/services/UserService.js \
					   --js $WWW_DIR/js/services/ActivityService.js \
					   --js $WWW_DIR/js/controllers/ActivityDetailController.js \
					   --js $WWW_DIR/js/controllers/ActivityListController.js \
					   --js $WWW_DIR/js/controllers/ActivityPanelController.js \
					   --js $WWW_DIR/js/controllers/LoginFormController.js \
					   --js $WWW_DIR/js/controllers/MainController.js \
					   --js $WWW_DIR/js/controllers/NavigatorController.js \
					   --js $WWW_DIR/js/controllers/ToolbarController.js \
					   --js $WWW_DIR/js/directives/ngEnter.js \
					   --js $WWW_DIR/js/teacherSpace.js \
 					   --js_output_file $WWW_DIR/js/teacherSpace.min.js

java -jar $JS_COMPILER --js $WWW_DIR/js/utils/Constants.js \
					   --js $WWW_DIR/js/services/UtilsService.js \
					   --js $WWW_DIR/js/services/UserService.js \
					   --js $WWW_DIR/js/services/ActivityService.js \
					   --js $WWW_DIR/js/controllers/PlayerMainController.js \
					   --js $WWW_DIR/js/activityPlay.js \
 					   --js_output_file $WWW_DIR/js/activityPlay.min.js

java -jar $CSS_COMPILER --allow-unrecognized-functions \
		  $WWW_DIR/lib/bootstrap_tagsinput/bootstrap-tagsinput.css \
		  $WWW_DIR/css/common.css \
		  $WWW_DIR/css/teacherSpace.css \
		  > $WWW_DIR/css/teacherSpace.min.css

java -jar $CSS_COMPILER --allow-unrecognized-functions \
		  $WWW_DIR/css/common.css \
		  $WWW_DIR/css/activityPlay.css \
		  > $WWW_DIR/css/activityPlay.min.css
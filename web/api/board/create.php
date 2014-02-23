<?php
	$list = array(
		'err' => 0,
		'result' => array(
			'data' => array(
				'_id' => rand(20,100),
				'content' => 'dddd'.rand(0,10),
				'name' => 'test'.rand(23000,22222222),
				'createtime' => time()				
			)
		),
		'msg' => 'ok'
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
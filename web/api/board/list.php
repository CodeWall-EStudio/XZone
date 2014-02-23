<?php

	$pageNum = 10;
	$page = (int) $_GET['page'];

	$fl = array();
	for($i=$page*$pageNum;$i<$page*$pageNum+$pageNum;$i++){
		array_push($fl,array(
				'_id' => $i,
				'content' => $i+rand(0,10),
				'name' => 'test'.$i,
				'createtime' => time()
		));
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'list' => $fl,
			'next' => 1//rand(0,1)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
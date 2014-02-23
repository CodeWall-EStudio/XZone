<?php
	$key = 0;
	if(isset($_GET['keyword'])){
		$key = $_GET['keyword'];
	}
	$pageNum = 10;
	$page = (int) $_GET['page'];

	
	$fl = array();
	$ul = array();
	for($i=$page*$pageNum;$i<$page*$pageNum+$pageNum;$i++){
		if($key){
			$name = 'd'.$key.'test'.rand(0,20);
		}else{
			$name = 'test'.rand(0,20);
		}	

		$rt = array(
			'_id' => $i,
			'fid' => $i+rand(0,10),
			'remark' => 'remark'.rand(200,4000),
			'name' => $name,
			'time' => time(),
			'coll' => 1,
			'type' => rand(1,7)
		);
		array_push($fl,$rt);
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'total' => count($fl),
			'list' => $fl,
			'next' => 1//rand(0,1)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
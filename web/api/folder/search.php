<?php

	$pageNum = 10;
	$page = 0;
	$key = 0;
	if(isset($_GET['keyword'])){
		$key = $_GET['keyword'];
	}
	$gid = (int) $_GET['gid'];
	$fdid = (int) $_GET['folderId'];


	$fl = array();
	for($i=$page*$pageNum;$i<$pageNum;$i++){
		if($key){
			$name = 'd'.$key.'test'.rand(0,20);
		}else{
			$name = 'test'.rand(0,20);
		}
		$ta = array(
			'_id' => $i+1,
			'name' => $name,
			'mark' => 'mark'.rand(0,30),
			'createTime' => time(),
			'hasChild' => rand(0,1),
			'type' => 0,
			'tid' => 0,
			'idpath' => '',
			'pid' => $fdid,
			'prid' => 0
		);
		if($gid){
			$ta['updatetime'] = time();
			$ta['closetime'] = time();
		}
		array_push($fl,$ta);
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'list' => $fl,
			'next' => 1
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
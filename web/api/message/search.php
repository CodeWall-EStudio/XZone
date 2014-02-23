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
		$fuid = rand(20,300);
		$tuid = rand(20,300);

		array_push($ul,array(
			'uid' => $fuid,
			'nick' => '来源昵称'.$fuid
		));

		$rt = array(
			'_id' => $i,
			'fid' => $i+rand(0,10),
			'fuid' => $fuid,
			'tuid' => $tuid,
			'fnick' => '来源昵称',
			'name' => $name,
			'content' => 'mark'.$i,
			'createtime' => time(),
			'size' => rand(200,999).'kb',
			'save' => rand(0,1),
			'type' => rand(1,7),
			'pid' => rand(20,100)
		);
		array_push($fl,$rt);
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'total' => count($fl),
			'list' => $fl,
			'ul' => $ul,
			'next' => rand(0,1)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
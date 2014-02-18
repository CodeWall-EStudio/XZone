<?php

// {
//     err: 0,
//     result: [{//groupFolder
// _id
// name
// gid
// mark
// createtime
// updatetime
// closetime
// type
// pid
// tid
// idpath    },{//userFolder

// _id
// pid
// name
// uid
// mark
// createtime
// updatetime
// type
// tid
// idpath
// prid
// }]
// }

	$pageNum = 10;
	$page = 0;
	$gid = 0;
	if(isset($_GET['groupId'])){
		$gid = (int) $_GET['groupId'];
	}
	$fdid = (int) $_GET['folderId'];


	$fl = array();
	for($i=$page*$pageNum;$i<$pageNum;$i++){
		$ta = array(
			'_id' => rand(0,200000),
			'name' => 'test'.rand(0,20),
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
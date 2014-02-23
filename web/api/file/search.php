<?php
// {
// err: 0,
// result:{
//     total: 11,//符合条件的文件数
//     list: [{//groupfile
// id
// fid
// gid
// fdid
// createtime
// fname
// content
// del
// uid
// fgid
// status
// tag
// rtag
// ttime
// ruid
// },{ // userfile
// id
// fid
// fdid
// name
// uid
// createtime
// content
// tag
// rtag
// ttime
// mark
// del

// }]
// }
// }
	$key = 0;
	if(isset($_GET['keyword'])){
		$key = $_GET['keyword'];
	}
	$pageNum = 10;
	if(isset($_GET['groupId'])){
		$gid = (int) $_GET['groupId'];
	}
	$page = (int) $_GET['page'];
	$fdid = (int) $_GET['folderId'];

	
	$fl = array();
	for($i=$page*$pageNum;$i<$page*$pageNum+$pageNum;$i++){
		if($key){
			$name = 'd'.$key.'test'.rand(0,20);
		}else{
			$name = 'test'.rand(0,20);
		}	
		$rt = array(
			'_id' => $i,
			'resource' => $i+rand(0,10),
			'folder' => $fdid,
			'del' => 0,
			'name' => $name,
			'content' => 'mark'.$i,
			'createTime' => time(),
			'type' => rand(1,7),
			'size' => 2322,//rand(1,900000000000000),
			'coll' => rand(0,1),
			'tag' => '',
			'ttime' => '',
			'mark' => ''
		);	
		if(isset($gid)){
			$rt['gid'] = $gid;
			$rt['uid'] = rand(1,100);
			$rt['ruid'] = rand(1,100);
			$rt['status'] = 0;
			$rt['ruid'] = rand(1,100);
		}
		array_push($fl,$rt);
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'total' => count($fl),
			'list' => $fl,
			'next' => rand(0,1)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
<?php
	$gid = $_GET['groupId'];

/*

{
    err: 0,
    result: {
         data: {//userFolder

_id
pid
name
uid
mark
createtime
updatetime
type
tid
idpath
prid
        }
    }
}
*/
	$id = rand(100,200);
	$pid = rand(40,100);
	$tid = rand(1,30);

	$list = array(
		'err' => 0,
		'result' => array(
			'data' => array(
				'_id' => "13",
				'content'=> "",
				'creator' => "52f2f10071086909323f2610",
				'grade'=> null,
				'name'=> "测试组12322",
				'pid'=> null,
				'pt'=> null,
				'rootfold'=> "52f34c25ec566fec37578559",
				'status'=> true,
				'tag'=> null,
				'type'=> 1,
				'auth'=> 1,
				'members' => array(1,2,3,4,5,6,7,8,9,10,11,12)
			)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
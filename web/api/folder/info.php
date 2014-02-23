<?php
	$fdid = $_GET['fdid'];

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
				'_id' => $id,
				'pid' => $pid,
				'tid' => $tid,
				'name' => '当前目录',
				'pname' => '父目录',
				'pname' => '顶级目录',
				'mark' => 'test',
				'createtime' => time(),
				'updatetime' => time(),
				'type' => 0,
				'idpath' => $tid.','.$pid
			)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
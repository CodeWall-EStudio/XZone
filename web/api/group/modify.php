
<?php	
	$list = array(
		'err' => 0,
		'result' => array(
			'data' => array(
				'_id' => "13",
				'content'=> "",
				'creator' => "52f2f10071086909323f2610",
				'grade'=> null,
				'name'=> "测试组123",
				'pid'=> null,
				'pt'=> null,
				'rootfold'=> "52f34c25ec566fec37578559",
				'status'=> true,
				'tag'=> null,
				'type'=> 1,
				'auth'=> 1				
			)
		),
		'msg' => 'ok'
	);

    header('Cache-Control=> no-cache, must-revalidate');
    header('Expires :  Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type : application/json');	
	echo json_encode($list);
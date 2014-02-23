<?php	
	$list = array(
		'err' => 0,
		'result' => array(
			'data' => array(
			'resource' => 'dskgfsdlkgjskdlh',//真实的文件信息
			'folder' => 'dksgsdjsldkhfsh',
			'name' => "测试文件1",
			'creator' =>  'dsgkdsgsdh',
			'createTime' => 1391749863692,
			'updateTime' => 1391750172423,
			'content' => "",
			'mark' => "",
			'del' => false,
			'status' => 0,
			'validateText' => null,
			'validateStatus' => null,
			'validateTime' => null,
			'validator' => null,
			'group' => '32432563476',
			'fromGroup' =>  '3245236523476',
			'_id' => "52f46ae7bfeef21c4f3996fe"
			)
		)
	);

    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
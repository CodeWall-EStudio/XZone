<?php
	// result : {
	// 	fold :  {
	// 		'id' : {
	// 			'id' : id, //id
	// 			'name' : name, //文件夹名
	// 			'time' : time,  //创建时间
	// 			'mark' : mark, // 备注
	// 		}
	// 	},
	// 	file :　{
	// 		'id' : {
	// 			'id' : id,    //id
	// 			'fid' : 文件id
	// 			'name' :　文件名
	// 			'mark' : 备注
	// 			'time' : 上传时间
	// 			'type' : 文件类型
	// 			'size' : x.xMb, //文件大小
	// 			'coll' : 0 | 1//是否被收藏
	// 		}
	// 	}
	// 	next :  page //下一页的页码
	// }

	$pageNum = 10;
	$page = (int) $_GET['page'];

	$fl = array();
	for($i=$page*$pageNum;$i<$pageNum;$i++){
		array_push($fl,array(
				'_id' => $i,
				'resource' => $i+rand(0,10),
				'name' => 'test'.$i,
				'mark' => 'mark'.$i,
				'createtime' => time(),
				'type' => rand(1,7),
				'size' => rand(1,900).'kb',
				'coll' => rand(0,1)
		));
	}

	$list = array(
		'err' => 0,
		'result' => array(
			'list' => $fl,
			'next' => rand(0,1)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
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

	$fl = array();
	for($i=1;$i<11;$i++){
		array_push($fl,array(
				'_id' => $i,//rand(100000,200000),
				'name' => 'name'.$i+rand(0,10),
				'nick' => '昵称'.$i
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
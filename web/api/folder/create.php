<?php

// {
//   "err"=> 0,
//   "result"=> {
//     "data"=> {
//       "name"=> "test",
//       "creator"=> "52f06510688987e20bf027f9",
//       "mark"=> "",
//       "createtime"=> 1391584689925,
//       "updatetime"=> 1391584689925,
//       "type"=> 0,
//       "pid"=> null,
//       "tid"=> "52f1d110a547838b249b04e0",
//       "haschild"=> false,
//       "prid"=> null,
//       "_id"=> "52f1e5b157f69f7d26561ecb",
//       "idpath"=> "52f1e5b157f69f7d26561ecb"
//     }
//   }
// }

	$name = $_POST['name'];
	$list = array(
		'err' => 0,
		'result' => array(
			'data' => array(
			      "name"=> $name,
			      "creator"=> "52f06510688987e20bf027f9",
			      "mark"=> "",
			      "createtime"=> 1391584689925,
			      "updatetime"=> 1391584689925,
			      "type"=> 0,
			      "pid"=> null,
			      "tid"=> "52f1d110a547838b249b04e0",
			      "haschild"=> false,
			      "prid"=> null,
			      "_id"=> "52f1e5b157f69f7d26561ecb",
			      "idpath"=> "52f1e5b157f69f7d26561ecb"				
				)
		),
		'msg' => 'ok'
	);

    header('Cache-Control=> no-cache, must-revalidate');
    header('Expires=> Mon, 26 Jul 1997 05=>00=>00 GMT');
    header('Content-type=> application/json');	
	echo json_encode($list);
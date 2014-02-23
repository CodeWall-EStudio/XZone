<?php
// {
// err: 0,
// result: {
// user: {
// nick: "李佳",
// name: "lijia",
// auth: 0,
// size: 3221225472,
// used: 0,
// lastgroup: null,
// __id: "52f2f10071086909323f2610"
// },
// groups: [
// {
// __id: "52f34c25ec566fec37578558",
// content: "",
// creator: "52f2f10071086909323f2610",
// grade: null,
// name: "测试组123",
// p_id: null,
// pt: null,
// rootFolder: "52f34c25ec566fec37578559",
// status: true,
// tag: null,
// type: 0,
// auth: 0
// }
// ]
// }
// }

	$myinfo = array(
		'err' => 0,
		'result' => array(
			'user' =>  array(
			'nick' => '打开萨嘎',
			'size' => '3221225472',
			'used' => '2000013',
			'name' => 'test',
			'mailnum' => 20,
			'pre' => '20',
			'auth' => 15,
			'rootFolder' => array(
				'$id' => rand(2000,5000)
			),
			),
			'groups' => array(
				array(
					'name' => '小组1',
					'_id' => 13,
					'type' => 1,
					'auth' => 1,
					'content' => 'sdgsg ',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '小组2',
					'_id' => rand(1,15),
					'type' => 1,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '小组部门444',
					'_id' => rand(1,15),
					'type' => 2,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '部门444',
					'_id' => rand(21,55),
					'type' => 2,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '部门444',
					'_id' => rand(21,55),
					'type' => 2,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '部门444',
					'_id' => rand(21,55),
					'type' => 2,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '一年级',
					'_id' => rand(60,100),
					'type' => 3,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '二年级',
					'_id' => rand(60,100),
					'type' => 3,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				),
				array(
					'name' => '三年级',
					'_id' => rand(60,100),
					'type' => 3,
					'auth' => 1,
					'content' => '',
					'rootFolder' => array(
						'_id' => rand(300,700),
						'name' => '',
						'hasChild' => rand(0,1),
						'creater' => array(
							'id' => rand(1,20)
						)
					)
				)
			),
			'dep' => array(
				array(
					'name' => '部门1',
					'_id' => '21',
					'auth' => 0
				),
				array(
					'name' => '部门2',
					'_id' => '23',
					'auth' => 1
				),
				array(
					'name' => '部门3',
					'_id' => '24',
					'auth' => 1
				)
			),
			'school' => 0
		)
	);
        header('Cache-Control: no-cache, must-reval_idate');
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
        header('Content-type: application/json');	
	echo json_encode($myinfo);
	
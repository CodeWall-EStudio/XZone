<?php
	//$gid = $_GET['groupId'];
	$id = rand(100,200);
	$pid = rand(40,100);
	$tid = rand(1,30);

/*
{
err: 0,
result: {
list: [
{
_id: 'xxx',
name: '备课小组1',
pt
tag
grade
//...
members: [
{
_id:'yyy',
nick:'zzz'
},
...
]
}
]
}
}
*/

	$list = array(
		'err' => 0,
		'result' => array(
			'list' => array(
					array(
					'_id' => "11",
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
					'members' => array(
						array(
							'_id' => 1,
							'nick' => '离家'
						),
						array(
							'_id' => 1,
							'nick' => '离家2'							
						)
					)),
					array(
					'_id' => "14",
					'content'=> "",
					'creator' => "52f2f10071086909323f2610",
					'grade'=> null,
					'name'=> "测试组444",
					'pid'=> null,
					'pt'=> null,
					'rootfold'=> "52f34c25ec566fec37578559",
					'status'=> true,
					'tag'=> null,
					'type'=> 2,
					'auth'=> 1,
					'members' => array(
						array(
							'_id' => 1,
							'nick' => '离家'
						),
						array(
							'_id' => 1,
							'nick' => '离家2'							
						)
					)),										
					array(
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
					'members' => array(
						array(
							'_id' => 1,
							'nick' => '离家'
						),
						array(
							'_id' => 1,
							'nick' => '离家2'							
						)
					),					
				),
							array(
							'_id' => "131",
							'content'=> "",
							'creator' => "52f2f10071086909323f2610",
							'grade'=> 1,
							'name'=> "一年级数学",
							'pid'=> null,
							'pt'=> null,
							'rootfold'=> "52f34c25ec566fec37578559",
							'status'=> true,
							'tag'=> 2,
							'type'=> 3,
							'auth'=> 1,
							'members' => array(1,2,3,4)
							),
							array(
							'_id' => "132",
							'content'=> "",
							'creator' => "52f2f10071086909323f2610",
							'grade'=> 2,
							'name'=> "二年级语文",
							'pid'=> null,
							'pt'=> null,
							'rootfold'=> "52f34c25ec566fec37578559",
							'status'=> true,
							'tag'=> 1,
							'type'=> 3,
							'auth'=> 1,
							'members' => array(9)
							),
							array(
							'_id' => "132",
							'content'=> "",
							'creator' => "52f2f10071086909323f2610",
							'grade'=> 1,
							'name'=> "一年级语文",
							'pid'=> null,
							'pt'=> null,
							'rootfold'=> "52f34c25ec566fec37578559",
							'status'=> true,
							'tag'=> 1,
							'type'=> 3,
							'auth'=> 1,
							'members' => array(9)
							),				
				array(
					'_id' => "15",
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
				),
						array(
						'_id' => "151",
						'content'=> "",
						'creator' => "52f2f10071086909323f2610",
						'grade'=> 2,
						'name'=> "二年级数学",
						'pid'=> null,
						'pt'=> null,
						'rootfold'=> "52f34c25ec566fec37578559",
						'status'=> true,
						'tag'=> 2,
						'type'=> 3,
						'auth'=> 1,
						'members' => array(6,7,8,9)
						),
						array(
						'_id' => "152",
						'content'=> "",
						'creator' => "52f2f10071086909323f2610",
						'grade'=> 2,
						'name'=> "二年级语文",
						'pid'=> null,
						'pt'=> null,
						'rootfold'=> "52f34c25ec566fec37578559",
						'status'=> true,
						'tag'=> 1,
						'type'=> 3,
						'auth'=> 1,
						'members' => array(1,2,6)							
						)				
			)
		)
	);
    header('Cache-Control: no-cache, must-revalidate');
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
    header('Content-type: application/json');	
	echo json_encode($list);
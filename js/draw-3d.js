if ( WEBGL.isWebGLAvailable() === false ) {

	document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container, stats, controls;
var camera, scene, renderer, light;
var meshHelper,cube;
var mouse = new THREE.Vector2();

var clock = new THREE.Clock();

var mixer, mixer2;
var isAnimate;

var canvasContainer = document.getElementById("model3d");
var height1 = window.innerHeight-300;

function startDraw3d(index) {
	init(index);
	animate();
}


function init(index) {

	container = document.createElement( 'div' );

	scene = new THREE.Scene();
	canvasContainer.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / height1, 0.1, 1000 );
	camera.position.set( 0, -10, 100 );
	camera.lookAt( scene.position );


	controls = new THREE.OrbitControls( camera );
	controls.enabled = false;


	light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	light.position.set( 600, 600, 600 );
	scene.add( light );

	// model
	var loader = new THREE.FBXLoader();
	
	loader.load( 'model/model4.fbx', function ( object ) {

		mixer = new THREE.AnimationMixer( object );

		var action = mixer.clipAction( object.animations[ 0 ] );
		action.setDuration(5);
		action.play();
		
		object.traverse( function ( child ) {

			if ( child.isMesh ) {

				child.castShadow = true;
				child.receiveShadow = true;

			}

		} );

		scene.add( object );
		isAnimate = true;

		setTimeout(function() {
			action.stop();
			isAnimate = false;
			scene.remove(object);
			showTime();
		}, 4000)

	} );

	// model
	var loader2 = new THREE.FBXLoader();
	loader2.load( 'model/ceshi2.fbx', function ( object ) {

		mixer2 = new THREE.AnimationMixer( object );

		var action = mixer2.clipAction( object.animations[ 0 ] );
		action.startAt(4)
		action.play();

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh) {

				child.castShadow = true;
				child.receiveShadow = true;
				if(child.name == 'pSphere1') {
					child.material.transparent=true;
					child.material.opacity = 0;
				}

			}
			setTimeout(function() {
				isAnimate = true;
				scene.add( object );
				bindClick();
			}, 8000)

		} );


	} );

	renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, height1 );
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / height1;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, height1 );

}


function animate() {

	requestAnimationFrame( animate );

	var delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );

	renderer.render( scene, camera );

}

function onDocumenClick(e) {
    e.preventDefault();
    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标,具体解释见代码释义
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / (height1)) * 2 + 1;
    //新建一个三维单位向量 假设z方向就是0.5
    //根据照相机，把这个向量转换到视点坐标系
    var vector = new THREE.Vector3(mouse.x, mouse.y,0.5).unproject(camera);
    //标准设备坐标转世界坐标
    var worldVector = vector.unproject(camera);
    //射线投射方向单位向量(worldVector坐标减相机位置坐标)
    var ray = worldVector.sub(camera.position).normalize();
      //camera.updateMatrixWorld();

    //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
    var raycaster = new THREE.Raycaster(camera.position, ray);
    raycaster.setFromCamera(mouse, camera);
    //射线和模型求交，选中一系列直线
    var intersects = raycaster.intersectObjects(scene.children, true);
    console.log(intersects);
    if (intersects.length > 0) {
        //选中第一个射线相交的物体
        unbindClick();
        cardAnimate();
    }


}

function bindClick() {
	window.addEventListener("click", onDocumenClick, false);
}

function unbindClick() {
	window.removeEventListener("click", onDocumenClick, false);
}


# 学习Three.js
## 学习资源
- [B站视频教程](https://www.bilibili.com/video/BV1Gg411X7FY?p=25&spm_id_from=pageDriver&vd_source=694fffefcf74490c8e3795936717a253)
- [three.js中文网站](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)
- [Three.js教程-电子书](http://www.yanhuangxueyuan.com/Three.js/)
- [老陈打码视频素材](https://www.cpengx.cn/)
- [gasp 动画库](https://greensock.com/docs/v3/Eases)

## 最基本步骤
```
// 1 创建场景
const scene = new THREE.Scene()

// 2 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// 设置相机位置
camera.position.set(0, 0, 10)

// 3 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)

// 4 创建物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)

// 5 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)
```


## 粒子动画
[学习文章](https://juejin.cn/post/7053759220188971044)

## 注意
count = array.length/3
import * as THREE from "three"
import { OrbitControls } from "./../node_modules/three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

import dat from "dat.gui"

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
function createMaterial(color) {
  return new THREE.MeshBasicMaterial({
    color,
  })
}
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
})
const cube = new THREE.Mesh(cubeGeometry, [
  createMaterial(0x00ff),
  createMaterial(0xff00),
  createMaterial(0x5500ff),
  createMaterial(0xf66ff),
  createMaterial(0xf0ff),
  createMaterial(0xff08f),
])
scene.add(cube)

// 5 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 阻尼感
let preTime = 0

// gasp动画
gsap.to(cube.position, {
  x: 5,
  y: 5,
  z: -20,
  duration: 5,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
  delay: 0.3, // s
  onComplete: () => {
    console.log("动画完成")
  },
  onStart: () => {
    console.log("动画开始")
  },
})
const animate1 = gsap.to(cube.rotation, {
  x: Math.PI * 2,
  y: Math.PI * 2,
  z: Math.PI * 2,
  duration: 5,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true,
  delay: 0.3,
})

window.addEventListener("dblclick", () => {
  if (animate1.isActive()) {
    animate1.pause()
  } else {
    animate1.resume()
  }
})

const clock = new THREE.Clock()
function render() {
  controls.update()
  const time = clock.getElapsedTime()

  // console.log("时钟运行总时长", time)

  // const n = (time % 5) * 0.01
  // cube.position.x += n
  // // cube.position.y +=n
  // cube.position.z += n
  // if (cube.position.x > 5) {
  //   cube.position.x = -5

  //   cube.position.y = -5

  //   cube.position.z = -5
  // }
  // // cube.rotation.x += Math.PI / 360

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
render()

// 坐标辅助器 用于简单模拟3个坐标轴的对象.4
// 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// cube.scale.set(0.5, 0.2, 0.5)
const dir = new THREE.Vector3(1, 2, 0)
dir.normalize()
const origin = new THREE.Vector3(1, 0, 0)
const length = 1
const hex = 0xffff00
const arrowhelper = new THREE.ArrowHelper(dir, origin, length, hex)
scene.add(arrowhelper)
scene.add(
  new THREE.ArrowHelper(
    new THREE.Vector3(1, 2, 0).normalize(),
    new THREE.Vector3(2, 0, 0),
    1,
    0x000fff
  )
)

// 监听窗口变化 更新视图
window.addEventListener("resize", () => {
  console.log("resize")
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像头投影矩阵
  camera.updateProjectionMatrix()
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
})

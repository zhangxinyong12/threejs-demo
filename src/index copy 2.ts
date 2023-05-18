import * as THREE from "three"
import { OrbitControls } from "./../node_modules/three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

import * as dat from "dat.gui"
import { Color } from "three"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
console.log("cubeGeometry", cubeGeometry)
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
console.log(cube)
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

renderer.render(scene, camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function render() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
render()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const animate1 = gsap.to(cube.position, {
  x: 6,
  duration: 5,
  ease: "power3.inOut",
  repeat: -1,
  yoyo: true,
})
// 双击切换全屏
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement
  console.log(fullScreenElement)

  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen()
  } else {
    // 退出全屏 是文档对象 document
    document.exitFullscreen()
  }
})

const gui = new dat.GUI()
gui
  .add(cube.position, "x", -20, 20, 0.1)
  .name("X轴")
  // .onChange((e) => {
  //   console.log("x=", e)
  // })
  .onFinishChange((x) => {
    console.log("完成停", x)
  })

let ani: gsap.core.Tween
const params = {
  color: "#ffff00",
  fn: (val) => {
    console.log(val)
    if (ani) {
      console.log(ani)
      if (ani.isActive()) {
        ani.pause()
      } else {
        ani.resume()
      }
    } else {
      ani = gsap.to(cube.position, {
        y: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
      })
    }
  },
}
gui.addColor(params, "color").onChange((val) => {
  cube.material.color.set(val)
})
gui.add(cube, "visible").name("显示")
// 设置按钮点击触发事件
gui.add(params, "fn").name("Y轴运动")

const folder = gui.addFolder("设置立方体参数")
folder.add(cube.material, "wireframe")

const geometry1 = new THREE.BufferGeometry()
const vertices = new Float32Array([
  -4.0, -4.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

  1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
])
console.log(vertices)
geometry1.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
const material1 = new THREE.MeshBasicMaterial({ color: 0x223300 })
const mesh1 = new THREE.Mesh(geometry1, material1)
mesh1.position.set(-5, -2, 1)
scene.add(mesh1)

// for (let i = 0; i < 300; i++) {
//   const geo = new THREE.BufferGeometry()
//   const ver = new Float32Array(9)

//   for (let j = 0; j < 9; j++) {
//     ver[j] = Math.random() * 10 - 5
//   }

//   console.log(ver)

//   geo.setAttribute("position", new THREE.BufferAttribute(ver, 3))
//   const color = new THREE.Color(Math.random(), Math.random(), Math.random())
//   const ma = new THREE.MeshBasicMaterial({
//     color,
//     opacity: Math.random(),
//     transparent: true,
//   })
//   const me = new THREE.Mesh(geo, ma)
//   // me.position.set(Math.random() * 2, Math.random() * 10, Math.random() * 10)
//   scene.add(me)
// }

// 纹理
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load("./public/crate.png")

const cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2)
const basiceMaterial2 = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  map: doorColorTexture,
})
const cube2 = new THREE.Mesh(cubeGeometry2, basiceMaterial2)
cube2.position.set(-5, -2, -10)

scene.add(cube2)

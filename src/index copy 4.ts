import * as THREE from "three"
import { OrbitControls } from "./../node_modules/three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"
import { OBJLoader } from "./../node_modules/three/examples/jsm/loaders/OBJLoader.js"
import * as dat from "dat.gui"
import { Color } from "three"
import doorImg from "./assets/crate.png"
import xinImg from "./assets/xin.png"

const TWEEN = (window as any).TWEEN

const scene = new THREE.Scene()
// 背景颜色#1125aa
scene.background = new THREE.Color(0x1125aa)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(0, 0, 100) //设置相机位置
camera.lookAt(new THREE.Vector3(0, 0, 0)) // 让相机指向原点

// 加载纹理贴图
const textureLoader = new THREE.TextureLoader()
// 圆点
const mapDot = textureLoader.load("./gradient.png")

const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

renderer.render(scene, camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const group = new TWEEN.Group()

// 创建个点 测试动画
function createPointTestMove() {
  const vertices: any[] = []

  for (let i = 0; i < 1; i++) {
    const x = random()
    const y = random()
    const z = random()

    vertices.push(10, 0, 0)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position", // THREE.BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
    new THREE.Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  )
  const material = new THREE.PointsMaterial({
    size: 1,
    color: 0xffffff,
  })
  const points = new THREE.Points(geometry, material)

  console.log(points)
  points.position.set(0, 0, 0)
  points.position.set(0, 0, 0) // 将 points 对象位置置为原点
  vertices.length = 0 // 清空 vertices 数组
  vertices.push(0, 0, 0) // 向 vertices 数组中添加一个原点位置的点
  geometry.attributes.position.needsUpdate = true // 更新 position 属性，使得渲染器重新渲染几何体
  scene.add(points)
  // 动画
  // const list = points.geometry.attributes.position.array as number[] // 3个为一组，表示一个点的xyz坐标
  // // 3个一组 循环
  // for (let i = 0; i < list.length; i += 3) {
  //   console.log(i)
  //   const tween = new TWEEN.Tween(
  //     {
  //       x: list[i],
  //       y: list[i + 1],
  //       z: list[i + 2],
  //     },
  //     group
  //   )
  //     .to({ x: 0, y: 0, z: 0 }, 1000 * 10)
  //     .easing(TWEEN.Easing.Quadratic.Out)
  //     .onUpdate((newVal) => {
  //       // points.position.set(newVal.x, newVal.y, newVal.z)
  //       // points.position.set(0, 0, 0)
  //       console.log(newVal)
  //     })
  //     .onComplete(() => {
  //       console.log("动画结束")
  //     })
  //     .start()
  // }
}

// 生成随机数 -max ~ max
function random(max = 200) {
  return Math.random() * max * 2 - max
}

createPointTestMove()

function init() {
  function render() {
    requestAnimationFrame(render)

    controls.update()
    group.update()
    renderer.render(scene, camera)
  }
  render()

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

init()

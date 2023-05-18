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
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(100, 0, 400) //设置相机位置
camera.lookAt(new THREE.Vector3(0, 0, 0)) // 让相机指向原点

// 加载纹理贴图
const textureLoader = new THREE.TextureLoader()
// 圆点
const mapDot = textureLoader.load("./gradient.png")

const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.append(renderer.domElement)

renderer.render(scene, camera)

// 控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

const group = new TWEEN.Group()

let isFirst = true
const maxPoint = 30000
let geometryAni: any = null //
let points: any = null //

// 创建星空背景
function createSky() {
  const vertices: any[] = []
  for (let i = 0; i < 1000; i++) {
    const x = THREE.MathUtils.randFloatSpread(window.innerWidth / 2)
    const y = THREE.MathUtils.randFloatSpread(window.innerHeight / 2)
    const z = THREE.MathUtils.randFloatSpread(1000)
    vertices.push(x, y, z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position", // THREE.BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
    new THREE.Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  )
  const material = new THREE.PointsMaterial({
    size: 1, // 点的大小
    map: mapDot, // 纹理贴图
  })
  const skyPoints = new THREE.Points(geometry, material)

  scene.add(skyPoints)
  return skyPoints
}

// 创建点 后面动画使用
function createPoint(n = 100) {
  const vertices: any[] = []
  const M = 50
  for (let i = 0; i < n; i++) {
    const x = THREE.MathUtils.randFloatSpread(M) - 200
    const y = THREE.MathUtils.randFloatSpread(M)
    const z = THREE.MathUtils.randFloatSpread(M)
    vertices.push(x, y, z)
  }
  geometryAni = new THREE.BufferGeometry()
  geometryAni.setAttribute(
    "position", // THREE.BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
    new THREE.Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  )
  const material = new THREE.PointsMaterial({
    size: 1, // 点的大小
    map: mapDot, // 纹理贴图
  })
  points = new THREE.Points(geometryAni, material)

  scene.add(points)

  const startPositions = geometryAni.getAttribute("position") // 获取顶点位置
  return startPositions
}

// 生成随机数 -max ~ max
function random(max = 200) {
  return Math.random() * max * 2 - max
}

// 加载OBJ文件 成功后的回调函数
function OBJLoaderFunction(obj, startPositions) {
  isleft = !isleft
  // 先根据模型创建随机点
  let M = 50
  // 数组按照 小 大 小 排序
  const listN: number[] = []
  const vertices: any[] = []
  obj.children.forEach((item, index) => {
    const itemGeometry = item.geometry // 获取模型的几何体
    const count = itemGeometry.attributes.position.count
    listN.push(count)
  })
  const totalCount = listN.reduce((a, b) => a + b)
  const spead = 0.1
  for (let i = 0; i < totalCount; i++) {
    if (i < totalCount / 2) {
      M = M + spead
    } else {
      M = M - spead
    }
    const x = THREE.MathUtils.randFloatSpread(M) - (isleft ? 200 : -200)
    const y = THREE.MathUtils.randFloatSpread(M) - 500
    const z = THREE.MathUtils.randFloatSpread(M) - 900
    vertices.push(x, y, z)
  }

  console.log(listN)
  geometryAni.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  )

  startPositions = geometryAni.getAttribute("position") // 获取顶点位置

  console.log("星云点数创建完成", startPositions.count)

  let index_n = 0 // 记录全部点数的index
  let max = 0
  // 通过OBJLoader加载的模型，其模型的所有部分都是一个一个的Mesh，所以我们可以通过遍历的方式来获取到每一个Mesh ，然后将其加入到场景中
  obj.children.forEach((item, index) => {
    const itemGeometry = item.geometry // 获取模型的几何体
    max += itemGeometry.attributes.position.count
    // 通过几何体创建粒子系统
    const particleSystem = new THREE.Points(
      itemGeometry,
      new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        map: mapDot,
      })
    )
    const itemPoints = particleSystem.geometry.getAttribute("position") // 获取顶点位置
    for (let i = 0; i < itemPoints.count; i++) {
      // 放大倍数
      const p = 0.5
      const tween = new TWEEN.Tween(startPositions.array)
        .to(
          {
            [i * 3 + index_n]:
              itemPoints.array[i * 3] * p + (isleft ? 100 : -100), // x轴偏移100
            [i * 3 + 1 + index_n]: itemPoints.array[i * 3 + 1] * p,
            [i * 3 + 2 + index_n]: itemPoints.array[i * 3 + 2] * p,
          },
          3000 * Math.random()
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        // .repeat(Infinity)
        // .yoyo(true)
        .delay(1000 * Math.random())
        .onUpdate(() => {
          startPositions.needsUpdate = true // 告诉渲染器需要更新顶点位置
        })
        .onComplete(() => {
          particleSystem.scale.set(0.5, 0.5, 0.5)
        })
        .start()
    }
    index_n += itemPoints.count * 3
    // 调整粒子系统的位置、旋转和缩放
    particleSystem.position.set(0, 0, 0)
    // particleSystem.rotation.set(0, Math.PI / 2, 0)
    particleSystem.scale.set(0.5, 0.5, 0.5)
    // scene.add(particleSystem) // 将粒子系统加入到场景中
  })
  isFirst = false
  console.log(index_n)

  console.log("obj模型点数", max)
}

// 加载OBJ文件
function loadOBIFN(startPositions) {
  // 创建OBJLoader对象
  const loader = new OBJLoader()
  // 加载OBJ文件
  loader.load(
    // OBJ文件的路径
    // "./a.obj",
    "./2.obj",

    // 当OBJ文件加载完成后执行的回调函数
    (obj) => OBJLoaderFunction(obj, startPositions),

    // 正在加载OBJ文件时执行的回调函数
    function (xhr) {
      console.log("加载完成", (xhr.loaded / xhr.total) * 100 + "% loaded")
    },

    // 加载OBJ文件失败时执行的回调函数
    function (error) {
      console.log("An error happened: " + error)
    }
  )
}

let skyPointsObj: any = null
let skyPointsObj2: any = null
let skyPointsObj3: any = null

function render() {
  requestAnimationFrame(render)
  TWEEN.update()
  skyPointsObj.rotation.y += 0.001
  skyPointsObj2.rotation.x += 0.001
  skyPointsObj2.rotation.z += 0.001
  // controls.update()
  group.update()
  renderer.render(scene, camera)

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

// 监听鼠标移动事件
function mousemoveFN() {
  document.addEventListener("mousemove", (event) => {
    // 计算鼠标位置与画布中心的距离
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY

    // 将距离转换为角度并限制最大旋转角度
    const maxAngle = Math.PI / 30 // 5度对应的弧度值
    const angleX = (deltaY / centerY) * maxAngle
    const angleY = (deltaX / centerX) * maxAngle

    // 应用旋转到立方体
    points.rotation.x = angleX
    points.rotation.y = angleY
  })
}
let isleft = true

function init() {
  skyPointsObj = createSky()
  skyPointsObj2 = createSky()
  skyPointsObj3 = createSky()
  const startPositions = createPoint(10)
  loadOBIFN(startPositions)
  render()
  mousemoveFN()

  setInterval(() => {
    loadOBIFN(startPositions)
  }, 10000)
}

init()

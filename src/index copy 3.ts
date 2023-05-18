import * as THREE from "three"
import { OrbitControls } from "./../node_modules/three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"
import { OBJLoader } from "./../node_modules/three/examples/jsm/loaders/OBJLoader.js"
import * as dat from "dat.gui"
import { Color } from "three"
import doorImg from "./assets/crate.png"
import xinImg from "./assets/xin.png"

// import * as TWEEN from "@tweenjs/tween.js"

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

camera.position.set(0, 0, 50) //设置相机位置
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

//初始化dat.GUI简化试验流程
// var gui
// function initGui() {
//   //声明一个保存需求修改的相关数据的对象
//   gui = {}
//   var datGui = new dat.GUI()
//   //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
// }

// 创建OBJLoader对象
const loader = new OBJLoader()
// 加载OBJ文件
loader.load(
  // OBJ文件的路径
  // "./a.obj",
  "./2.obj",

  // 当OBJ文件加载完成后执行的回调函数
  OBJLoaderFunction,

  // 正在加载OBJ文件时执行的回调函数
  function (xhr) {
    console.log("加载完成", (xhr.loaded / xhr.total) * 100 + "% loaded")
  },

  // 加载OBJ文件失败时执行的回调函数
  function (error) {
    console.log("An error happened: " + error)
  }
)

function OBJLoaderFunction(obj) {
  console.log(obj)

  // 通过OBJLoader加载的模型，其模型的所有部分都是一个一个的Mesh，所以我们可以通过遍历的方式来获取到每一个Mesh ，然后将其加入到场景中
  obj.children.forEach((item) => {
    const geometry = item.geometry // 获取模型的几何体
    // 通过几何体创建粒子系统
    const particleSystem = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        map: mapDot,
      })
    )
    // 获取点的位置
    const vertices = geometry.attributes.position.array
    const tween = new TWEEN.Tween(geometry.attributes.position)
      .to({}, 3000) // 设置目标值和动画持续时间
      .easing(TWEEN.Easing.Quadratic.Out) // 设置缓动函数
      .onComplete(() => {
        // 动画完成时执行的回调函数
        particleSystem.visible = true // 显示粒子系统
        // 使用Tween将所有点的位置设置为原点
        const targetVertices = new Array(vertices.length).fill(0)
        const updateVertices = () => {
          vertices.forEach((v, i) => {
            const setN = (vertices[i] +=
              (targetVertices[i] - vertices[i]) * 0.1)
            if (setN < 10) {
              vertices[i] = random2(5)
            }
          })
          geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3)
          )
        }

        const updateTween = new TWEEN.Tween(this)
          .to({}, 5000)
          .onUpdate(updateVertices)
          .start()
      })
    tween.start()
    console.log(vertices)

    particleSystem.visible = false // 默认隐藏
    // 调整粒子系统的位置、旋转和缩放
    particleSystem.position.set(0, 0, 0)
    particleSystem.rotation.set(0, Math.PI / 2, 0)
    particleSystem.scale.set(0.05, 0.05, 0.05)

    scene.add(particleSystem)
  })

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4) // 环境光(ambientLight)，它的颜色是灰色(0xcccccc)，强度是0.4，它会对整个场景产生均匀的光照
  scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0xffffff, 0.8) // 点光源(pointLight)，它的颜色是白色(0xffffff)，强度是0.8，它会对场景中的某一个点产生照射
  camera.add(pointLight)

  // scene.add(obj) //  单纯的将OBJ模型加入到场景中
}

//使用canvas生成粒子的纹理
function generateSprite() {
  const canvas = document.createElement("canvas")
  canvas.width = 16
  canvas.height = 16

  const context = canvas.getContext("2d")
  const gradient = context!.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  )
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.2, "rgba(0,255,255,1)")
  gradient.addColorStop(0.4, "rgba(0,0,64,1)")
  gradient.addColorStop(1, "rgba(0,0,0,1)")

  context!.fillStyle = gradient
  context!.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

// 生成随机数 -800 ~ 800
function random(max = 200) {
  return Math.random() * max * 2 - max
}

// 生成0-10的随机数
function random2(max = 10) {
  return Math.random() * max
}

// 背景 创建100个点的星空
function createStar(n = 1000) {
  const vertices: any[] = []

  for (let i = 0; i < n; i++) {
    const x = random()
    const y = random()
    const z = random()

    vertices.push(x, y, z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position", // THREE.BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
    new THREE.Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  )

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    map: mapDot,
  }) // 点的材质，这里我们使用THREE.PointsMaterial，表示我们将要渲染的是点，而不是线或者面

  const points = new THREE.Points(geometry, material)
  // 设置点的位置
  points.position.set(0, 0, 0)

  // 创建一个粒子系统Tween对象并定义动画属性
  const tweens = []

  // const tween = new TWEEN.Tween(points.position)
  //   .to({ x: 0, y: 0, z: 0 }, 300) // 设置目标值和动画持续时间
  //   // .easing(TWEEN.Easing.Quadratic.Out) // 设置缓动函数
  //   .onComplete(() => {
  //     // 动画完成时执行的回调函数
  //     // 使用TWEEN将所有点的位置设置为原点

  //     // 使用Tween将所有点的位置设置为原点
  //     const targetVertices = new Array(vertices.length).fill(0)
  //     const updateVertices = () => {
  //       vertices.forEach((v, i) => {
  //         const setN = (vertices[i] += (targetVertices[i] - vertices[i]) * 0.1)
  //         if (setN < 10) {
  //           vertices[i] = random2(5)
  //         }
  //       })
  //       geometry.setAttribute(
  //         "position",
  //         new THREE.Float32BufferAttribute(vertices, 3)
  //       )
  //     }

  //     const updateTween = new TWEEN.Tween(this)
  //       .to({}, 3000)
  //       .onUpdate(updateVertices)
  //       .start()
  //   })
  // tween.start()

  scene.add(points)

  // 动画循环
  function animate() {
    requestAnimationFrame(animate)

    // 点绕中心点旋转
    points.rotation.x += 0.005
    points.rotation.y -= 0.005
    // points.rotation.z -= 0.01

    TWEEN.update()
    renderer.render(scene, camera)
  }
  animate()
}

createStar()

// 先创建一堆点
function createPoint(n = 500) {
  const vertices: any[] = []

  // 随机数 -10 ~10
  function random50() {
    return Math.random() * 10 - 5
  }
  for (let i = 0; i < n; i++) {
    const x = random50()
    const y = random50()
    const z = random50()

    vertices.push(x, y, z)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position", // THREE.BufferAttribute的第一个参数是属性名称，这里我们将其命名为position，表示这个属性是用来控制点的位置的
    new THREE.Float32BufferAttribute(vertices, 3) // 3个为一组，表示一个点的xyz坐标
  )

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    map: mapDot,
  }) // 点的材质，这里我们使用THREE.PointsMaterial，表示我们将要渲染的是点，而不是线或者面

  const points = new THREE.Points(geometry, material)
  // 设置点的位置
  points.position.set(0, 0, 0)
  scene.add(points)
  // 创建中心点作为旋转中心
  const centerPoint = new THREE.Object3D()
  scene.add(centerPoint)

  // 渲染函数
  function render() {
    requestAnimationFrame(render)

    // 使点云绕中心点旋转
    points.rotation.x += 0.01
    points.rotation.y += 0.01

    renderer.render(scene, camera)
  }
  render()
}

createPoint()

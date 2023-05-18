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

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const group = new TWEEN.Group()

// 创建个点 测试动画
function createPointTestMove() {
  const vertices: any[] = []
  for (let i = 0; i < 8000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000)
    const y = THREE.MathUtils.randFloatSpread(2000)
    const z = THREE.MathUtils.randFloatSpread(2000)
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
  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const startPositions = geometry.getAttribute("position") // 获取顶点位置
  console.log(startPositions, startPositions.count)

  // for (let i = 0; i < startPositions.count; i++) {
  //   const tween = new TWEEN.Tween(startPositions.array)
  //     .to(
  //       {
  //         [i * 3]: 0,
  //         [i * 3 + 1]: 0,
  //         [i * 3 + 2]: 0,
  //       },
  //       3000 * Math.random()
  //     )
  //     .easing(TWEEN.Easing.Quadratic.Out)
  //     // .repeat(Infinity)
  //     // .yoyo(true)
  //     .delay(1000 * Math.random())
  //     .onUpdate(() => {
  //       startPositions.needsUpdate = true // 告诉渲染器需要更新顶点位置
  //     })
  //     .onComplete(() => {})
  //     .start()
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
        const cur = i % itemPoints.count
        // 放大倍数
        const p = 0.5
        const tween = new TWEEN.Tween(startPositions.array)
          .to(
            {
              [i * 3]: itemPoints.array[i * 3] * p,
              [i * 3 + 1]: itemPoints.array[i * 3 + 1] * p,
              [i * 3 + 2]: itemPoints.array[i * 3 + 2] * p,
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

      // 调整粒子系统的位置、旋转和缩放
      particleSystem.position.set(0, 0, 0)
      particleSystem.rotation.set(0, Math.PI / 2, 0)
      particleSystem.scale.set(0.5, 0.5, 0.5)

      // scene.add(particleSystem) // 将粒子系统加入到场景中
    })
    console.log(max)
  }

  // 生成随机数 -max ~ max
  function random(max = 200) {
    return Math.random() * max * 2 - max
  }
}

createPointTestMove()

function init() {
  function render() {
    requestAnimationFrame(render)
    TWEEN.update()
    scene.rotation.y += 0.001
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

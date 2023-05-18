// 导入TWEEN库
import TWEEN from "@tweenjs/tween.js"

// 创建点的数量和半径范围
const particleCount = 50
const particleRadius = 20

// 创建点的几何体和材质
const geometry = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)
for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * Math.PI * 2
  const x = Math.cos(theta) * particleRadius
  const y = 0
  const z = Math.sin(theta) * particleRadius
  positions[i * 3] = x
  positions[i * 3 + 1] = y
  positions[i * 3 + 2] = z
}
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
const material = new THREE.PointsMaterial({ color: 0xffffff })

// 创建点集合并加入场景中
const particles = new THREE.Points(geometry, material)
scene.add(particles)

// 定义旋转函数
function rotateParticles() {
  // 创建Tween对象并定义动画属性
  const tween = new TWEEN.Tween(particles.rotation)
    .to({ y: particles.rotation.y - Math.PI * 2 }, 2000)
    .easing(TWEEN.Easing.Linear.None)
    .onComplete(() => {
      // 所有点聚合到原点
      const tweens = []
      const scaleTargets = []
      for (let i = 0; i < particleCount; i++) {
        const position = particles.geometry.attributes.position.array.slice(
          i * 3,
          (i + 1) * 3
        )
        const distance = Math.sqrt(
          position[0] ** 2 + position[1] ** 2 + position[2] ** 2
        )
        const scale = 1 - distance / particleRadius
        scaleTargets.push(scale)
        tweens.push(
          new TWEEN.Tween(positions.slice(i * 3, (i + 1) * 3))
            .to({ x: 0, y: 0, z: 0 }, 3000)
            .easing(TWEEN.Easing.Quadratic.Out)
        )
      }
      new TWEEN.Tween(scaleTargets)
        .to([], 3000)
        .onUpdate(() => {
          material.size =
            (particleRadius * scaleTargets.reduce((sum, s) => sum + s, 0)) /
            particleCount
        })
        .start()
      tweens.forEach((tween) => tween.start())
    })
  tween.start()
}

// 每隔3秒调用一次旋转函数
setInterval(rotateParticles, 3000)

// 在场景更新时调用TWEEN.update()
function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
  renderer.render(scene, camera)
}
animate()

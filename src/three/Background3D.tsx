import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function heartGeometry() {
  const s = new THREE.Shape()
  const x = 0, y = 0
  s.moveTo(x, y + 2.5)
  s.bezierCurveTo(x, y + 4.5, x - 4, y + 4.5, x - 4, y + 2)
  s.bezierCurveTo(x - 4, y - 0.5, x - 1.5, y - 2, x, y - 4)
  s.bezierCurveTo(x + 1.5, y - 2, x + 4, y - 0.5, x + 4, y + 2)
  s.bezierCurveTo(x + 4, y + 4.5, x, y + 4.5, x, y + 2.5)
  return new THREE.ExtrudeGeometry(s, { depth: 1.2, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3 })
}

// Cute blind box toy: pastel box + white lid + little ribbon
function makeBlindBox(color: string) {
  const group = new THREE.Group()
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 2.6, 2.6),
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.05, emissive: color, emissiveIntensity: 0.12 })
  )
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 0.5, 2.9),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 })
  )
  lid.position.y = 1.5
  const ribbonV = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 2.7, 2.61),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 })
  )
  const ribbonH = new THREE.Mesh(
    new THREE.BoxGeometry(2.61, 2.7, 0.45),
    new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 })
  )
  const bow = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#a78bfa', roughness: 0.4 })
  )
  bow.position.y = 1.85
  group.add(box, lid, ribbonV, ribbonH, bow)
  return group
}

export default function Background3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.z = 22

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.5))
    const light = new THREE.DirectionalLight(0xffd6ec, 1.6)
    light.position.set(5, 8, 10)
    scene.add(light)
    const light2 = new THREE.PointLight(0xc4b5fd, 30, 60)
    light2.position.set(-8, -5, 8)
    scene.add(light2)

    const pastel = ['#c4b5fd', '#a78bfa', '#8b5cf6', '#d8b4fe', '#e9d5ff', '#f0abfc']
    const floaters: { obj: THREE.Object3D; speed: number; spin: number; offset: number; baseX: number; baseY: number }[] = []

    const isMobile = window.innerWidth < 768
    const count = isMobile ? 10 : 18

    for (let i = 0; i < count; i++) {
      let obj: THREE.Object3D
      const c = pastel[i % pastel.length]
      const kind = i % 2
      if (kind === 0) {
        obj = new THREE.Mesh(heartGeometry(), new THREE.MeshStandardMaterial({ color: c, roughness: 0.35, emissive: c, emissiveIntensity: 0.15 }))
      } else {
        obj = makeBlindBox(c)
      }
      // Spread items around a ring so the center stays clear
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const radius = 15 + Math.random() * 9
      const baseX = Math.cos(angle) * radius
      const baseY = Math.sin(angle) * radius * 0.7
      obj.position.set(baseX, baseY, (Math.random() - 0.5) * 14 - 8)
      obj.scale.setScalar(0.5 + Math.random() * 0.8)
      scene.add(obj)
      floaters.push({ obj, speed: 0.5 + Math.random() * 1.2, spin: (Math.random() - 0.5) * 0.02, offset: Math.random() * Math.PI * 2, baseX, baseY })
    }

    // Soft sparkles
    const sparkleCount = 300
    const pos = new Float32Array(sparkleCount * 3)
    for (let i = 0; i < sparkleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10
    }
    const sparkleGeo = new THREE.BufferGeometry()
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const sparkles = new THREE.Points(sparkleGeo, new THREE.PointsMaterial({ color: 0xffb6d9, size: 0.16, transparent: true, opacity: 0.8 }))
    scene.add(sparkles)

    const mouse = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      floaters.forEach((f) => {
        // Bounded sin/cos motion — objects always stay on screen and animate forever
        f.obj.position.y = f.baseY + Math.sin(t * f.speed + f.offset) * 1.6
        f.obj.position.x = f.baseX + Math.cos(t * f.speed * 0.6 + f.offset) * 1.2
        f.obj.rotation.x += f.spin
        f.obj.rotation.y += f.spin * 1.4
      })
      sparkles.rotation.y += 0.0008
      sparkles.position.y = Math.sin(t * 0.3) * 1.2
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      sparkleGeo.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Soft round glow texture for sparkles
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  return tex
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

    const tex = glowTexture()
    const pastelColors = ['#ffb6d9', '#d8b4fe', '#c4b5fd', '#f0abfc', '#ffffff', '#e9d5ff'].map(
      (c) => new THREE.Color(c)
    )

    // Builds a sparkle layer spread across the whole page
    const makeLayer = (count: number, size: number, opacity: number) => {
      const pos = new Float32Array(count * 3)
      const col = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 80
        pos[i * 3 + 1] = (Math.random() - 0.5) * 55
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10
        const c = pastelColors[Math.floor(Math.random() * pastelColors.length)]
        col[i * 3] = c.r
        col[i * 3 + 1] = c.g
        col[i * 3 + 2] = c.b
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({
        size,
        map: tex,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
      const points = new THREE.Points(geo, mat)
      scene.add(points)
      return { points, geo, mat, baseOpacity: opacity, baseSize: size }
    }

    const layers = [
      makeLayer(700, 0.35, 0.9), // many small twinkles
      makeLayer(150, 0.8, 0.7), // medium glows
      makeLayer(40, 1.6, 0.5), // few big soft glows
    ]

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
      layers.forEach((l, i) => {
        l.points.rotation.y += 0.0006 + i * 0.0003
        l.points.rotation.x = Math.sin(t * 0.15 + i) * 0.05
        l.points.position.y = Math.sin(t * 0.3 + i * 2) * 1.2
        // Twinkle: opacity and size pulse
        l.mat.opacity = l.baseOpacity * (0.6 + 0.4 * Math.sin(t * (1 + i * 0.7) + i * 1.7))
        l.mat.size = l.baseSize * (0.8 + 0.4 * Math.sin(t * (1.4 + i * 0.5) + i))
      })
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
      layers.forEach((l) => {
        l.geo.dispose()
        l.mat.dispose()
      })
      tex.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}

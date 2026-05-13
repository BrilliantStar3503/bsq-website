'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ShaderAnimationProps {
  /** Extra classes applied to the canvas element */
  className?: string
  /** 0–1 global opacity of the canvas (default 1) */
  opacity?: number
}

/**
 * Full-screen WebGL shader background.
 * Renders a looping, mouse-reactive animated gradient using a custom
 * GLSL fragment shader — no external libraries required.
 *
 * Usage (background):
 *   <ShaderAnimation className="fixed inset-0 z-0" opacity={0.9} />
 */
const ShaderAnimation = ({ className, opacity = 1 }: ShaderAnimationProps) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rafRef      = useRef<number>(0)
  const mouseRef    = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    /* ── Vertex shader ─────────────────────────────────────────── */
    const vertSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    /* ── Fragment shader — BSQ crimson palette ─────────────────── */
    const fragSrc = `
      precision mediump float;

      uniform vec2  u_resolution;
      uniform float u_time;
      uniform vec2  u_mouse;

      /* BSQ palette: dark crimson → near-black with warm flickers */
      vec3 palette(float t) {
        vec3 a = vec3(0.22, 0.04, 0.04);
        vec3 b = vec3(0.30, 0.08, 0.06);
        vec3 c = vec3(1.00, 0.70, 0.55);
        vec3 d = vec3(0.00, 0.08, 0.18);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv  = gl_FragCoord.xy / u_resolution.xy;
        vec2 uv0 = uv;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;

        vec3 col = vec3(0.0);

        for (float i = 0.0; i < 4.0; i++) {
          uv = fract(uv * 1.5) - 0.5;

          float d = length(uv) * exp(-length(uv0));
          vec3 color = palette(length(uv0) + i * 0.4 + u_time * 0.007);

          d = sin(d * 4.0 + u_time) / 36.0;
          d = pow(0.005 / d, 1.5);

          /* Subtle mouse ripple */
          float mouseDist = length(u_mouse - uv0);
          d *= 1.0 + sin(mouseDist * 10.0 - u_time * 2.0) * 0.07;

          col += color * d;
        }

        /* Faint horizontal wave in warm tones */
        float wave = sin(uv0.x * 2.0 + u_time) * 0.006;
        col += vec3(wave * 0.9, wave * 0.2, wave * 0.2);

        /* Dark gradient overlay — keeps background near-black */
        vec3 g1 = vec3(0.04, 0.01, 0.02);
        vec3 g2 = vec3(0.28, 0.03, 0.05);
        vec3 gMix = mix(g1, g2, uv0.y + sin(u_time * 0.4) * 0.15);
        col = mix(col * 0.60, gMix, 0.25);

        gl_FragColor = vec4(col, 1.0);
      }
    `

    /* ── Compile helpers ───────────────────────────────────────── */
    function compileShader(
      gl: WebGLRenderingContext,
      type: number,
      src: string,
    ): WebGLShader | null {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER,   vertSrc)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return

    /* ── Full-screen quad ──────────────────────────────────────── */
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW,
    )

    const posLoc = gl.getAttribLocation(prog, 'a_position')
    const resLoc = gl.getUniformLocation(prog, 'u_resolution')
    const timLoc = gl.getUniformLocation(prog, 'u_time')
    const mouLoc = gl.getUniformLocation(prog, 'u_mouse')

    /* ── Resize ────────────────────────────────────────────────── */
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Mouse ─────────────────────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouse)

    /* ── Render loop ───────────────────────────────────────────── */
    const t0 = Date.now()
    const render = () => {
      const t = (Date.now() - t0) * 0.001

      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timLoc, t)
      gl.uniform2f(mouLoc, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      rafRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('block', className)}
      style={{ opacity }}
    />
  )
}

export default ShaderAnimation

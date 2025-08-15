"use client"

import { useState, useEffect, useRef } from "react"

type Language = "tr" | "en" | "de" | "es" | "ar"

interface GameComponentProps {
  language: Language
  setLanguage: (lang: Language) => void
  gameType: "single" | "multi"
  isMobile: boolean
  t: any
  onBack: () => void
  onHome: () => void
}

export default function GameComponent({
  language,
  setLanguage,
  gameType,
  isMobile,
  t,
  onBack,
  onHome
}: GameComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<any>(null)
  const [autoStart, setAutoStart] = useState(true)
  const [ballSpeed, setBallSpeed] = useState<"slow" | "normal" | "fast" | "ultraFast">("normal")

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const maxWidth = isMobile ? window.innerWidth - 20 : 800
    const maxHeight = isMobile ? window.innerHeight * 0.5 : 400

    canvas.width = Math.min(maxWidth, window.innerWidth - 20)
    canvas.height = Math.min(maxHeight, window.innerHeight - (isMobile ? 300 : 200))

    const getSpeedMultiplier = () => {
      switch (ballSpeed) {
        case "slow":
          return 0.7
        case "fast":
          return 1.4
        case "ultraFast":
          return 2.0
        default:
          return 1
      }
    }

    // Game objects
    const game = {
      ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 3 * getSpeedMultiplier(),
        dy: 3 * getSpeedMultiplier(),
        radius: 8,
      },
      leftPaddle: {
        x: 20,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
      },
      rightPaddle: {
        x: canvas.width - 30,
        y: canvas.height / 2 - 50,
        width: 10,
        height: 100,
        dy: 0,
      },
      leftScore: 0,
      rightScore: 0,
      isPaused: true,
      waitingForStart: true,
      showStartButton: true,
      countdown: 0,
    }

    // Controls
    const keys: { [key: string]: boolean } = {}
    const touchControls = {
      leftUp: false,
      leftDown: false,
      rightUp: false,
      rightDown: false,
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touches = Array.from(e.touches)

      touches.forEach((touch) => {
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top

        if (y < canvas.height / 2) {
          touchControls.leftUp = true
        } else {
          touchControls.leftDown = true
        }
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      touchControls.leftUp = false
      touchControls.leftDown = false
    }

    const handleCanvasClick = (e: MouseEvent) => {
      if (game.showStartButton) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const buttonWidth = 120
        const buttonHeight = 40

        if (
          x >= centerX - buttonWidth / 2 &&
          x <= centerX + buttonWidth / 2 &&
          y >= centerY - buttonHeight / 2 &&
          y <= centerY + buttonHeight / 2
        ) {
          startGame()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false })
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false })
    canvas.addEventListener("click", handleCanvasClick)

    const resetBall = (direction: number) => {
      game.ball.x = canvas.width / 2
      game.ball.y = canvas.height / 2

      // Reset paddle positions to center
      game.leftPaddle.y = canvas.height / 2 - 50
      game.rightPaddle.y = canvas.height / 2 - 50

      const baseSpeed = 3 * getSpeedMultiplier()
      const speedVariation = 0.8 + Math.random() * 0.4 // Random speed between 0.8x and 1.2x
      const angleVariation = (Math.random() - 0.5) * 2 // Random angle variation

      game.ball.dx = direction * baseSpeed * speedVariation
      game.ball.dy = angleVariation * baseSpeed + (Math.random() - 0.5) * 4

      if (autoStart) {
        game.isPaused = true
        game.waitingForStart = true
        game.showStartButton = false
        game.countdown = 3

        const countdownInterval = setInterval(() => {
          game.countdown--
          if (game.countdown <= 0) {
            clearInterval(countdownInterval)
            game.isPaused = false
            game.waitingForStart = false
            game.showStartButton = false
            game.countdown = 0
          }
        }, 1000)
      } else {
        game.isPaused = true
        game.waitingForStart = true
        game.showStartButton = true
        game.countdown = 0
      }
    }

    const startGame = () => {
      game.isPaused = false
      game.waitingForStart = false
      game.showStartButton = false
    }

    // Game loop
    const gameLoop = () => {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!game.isPaused && !game.waitingForStart) {
        if (keys["w"] || keys["W"] || touchControls.leftUp) game.leftPaddle.y -= 5
        if (keys["s"] || keys["S"] || touchControls.leftDown) game.leftPaddle.y += 5

        if (gameType === "single") {
          const ballCenter = game.ball.y
          const paddleCenter = game.rightPaddle.y + game.rightPaddle.height / 2

          const reactionDelay = 0.7
          const errorChance = 0.15
          const maxSpeed = 4.5

          if (game.ball.x > canvas.width / 2 && game.ball.dx > 0) {
            const shouldMakeMistake = Math.random() < errorChance
            const targetY = shouldMakeMistake
              ? ballCenter + (Math.random() - 0.5) * 100
              : ballCenter * reactionDelay + paddleCenter * (1 - reactionDelay)

            const diff = targetY - paddleCenter

            if (Math.abs(diff) > 20) {
              const moveSpeed = Math.min(maxSpeed, Math.abs(diff) * 0.1)
              if (diff < 0) {
                game.rightPaddle.y -= moveSpeed
              } else {
                game.rightPaddle.y += moveSpeed
              }
            }
          } else {
            const centerY = canvas.height / 2 - game.rightPaddle.height / 2
            const diff = centerY - game.rightPaddle.y
            if (Math.abs(diff) > 5) {
              game.rightPaddle.y += diff * 0.02
            }
          }
        } else {
          if (keys["ArrowUp"] || touchControls.rightUp) game.rightPaddle.y -= 5
          if (keys["ArrowDown"] || touchControls.rightDown) game.rightPaddle.y += 5
        }

        game.leftPaddle.y = Math.max(0, Math.min(canvas.height - game.leftPaddle.height, game.leftPaddle.y))
        game.rightPaddle.y = Math.max(0, Math.min(canvas.height - game.rightPaddle.height, game.rightPaddle.y))

        game.ball.x += game.ball.dx
        game.ball.y += game.ball.dy

        if (game.ball.y <= game.ball.radius || game.ball.y >= canvas.height - game.ball.radius) {
          game.ball.dy = -game.ball.dy * (0.98 + Math.random() * 0.04) // Slight energy loss and variation

          // Add small horizontal deflection on wall hits
          game.ball.dx += (Math.random() - 0.5) * 0.3
        }

        if (
          game.ball.x <= game.leftPaddle.x + game.leftPaddle.width + game.ball.radius &&
          game.ball.y >= game.leftPaddle.y &&
          game.ball.y <= game.leftPaddle.y + game.leftPaddle.height &&
          game.ball.dx < 0
        ) {
          const hitPos = (game.ball.y - (game.leftPaddle.y + game.leftPaddle.height / 2)) / (game.leftPaddle.height / 2)

          // Add randomness to ball direction
          const randomFactor = (Math.random() - 0.5) * 0.8
          const spinEffect = hitPos * 4 + randomFactor

          game.ball.dx = -game.ball.dx * (0.95 + Math.random() * 0.1) // Slight speed variation
          game.ball.dy = spinEffect

          // Add slight angle variation
          game.ball.dx += (Math.random() - 0.5) * 0.5
        }

        if (
          game.ball.x >= game.rightPaddle.x - game.ball.radius &&
          game.ball.y >= game.rightPaddle.y &&
          game.ball.y <= game.rightPaddle.y + game.rightPaddle.height &&
          game.ball.dx > 0
        ) {
          const hitPos =
            (game.ball.y - (game.rightPaddle.y + game.rightPaddle.height / 2)) / (game.rightPaddle.height / 2)

          // Add randomness to ball direction
          const randomFactor = (Math.random() - 0.5) * 0.8
          const spinEffect = hitPos * 4 + randomFactor

          game.ball.dx = -game.ball.dx * (0.95 + Math.random() * 0.1) // Slight speed variation
          game.ball.dy = spinEffect

          // Add slight angle variation
          game.ball.dx += (Math.random() - 0.5) * 0.5
        }

        if (game.ball.x < 0) {
          game.rightScore++
          resetBall(1)
        }
        if (game.ball.x > canvas.width) {
          game.leftScore++
          resetBall(-1)
        }
      }

      ctx.fillStyle = "#93E51F"
      ctx.fillRect(game.leftPaddle.x, game.leftPaddle.y, game.leftPaddle.width, game.leftPaddle.height)
      ctx.fillRect(game.rightPaddle.x, game.rightPaddle.y, game.rightPaddle.width, game.rightPaddle.height)

      ctx.beginPath()
      ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      ctx.setLineDash([5, 15])
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, 0)
      ctx.lineTo(canvas.width / 2, canvas.height)
      ctx.strokeStyle = "#333333"
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "#93E51F"
      ctx.font = "32px Arial"
      ctx.textAlign = "center"
      ctx.fillText(game.leftScore.toString(), canvas.width / 4, 50)
      ctx.fillText(game.rightScore.toString(), (canvas.width * 3) / 4, 50)

      if (game.countdown > 0) {
        ctx.fillStyle = "#93E51F"
        ctx.font = "48px Arial"
        ctx.textAlign = "center"
        ctx.fillText(game.countdown.toString(), canvas.width / 2, canvas.height / 2)

        // Add pulsing effect to countdown
        const scale = 1 + Math.sin(Date.now() * 0.01) * 0.2
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2 + 60)
        ctx.scale(scale, scale)
        ctx.fillStyle = "#ffffff"
        ctx.font = "16px Arial"
        ctx.fillText("Başlıyor...", 0, 0)
        ctx.restore()
      }

      if (game.showStartButton) {
        const gradient = ctx.createLinearGradient(
          canvas.width / 2 - 80,
          canvas.height / 2 - 25,
          canvas.width / 2 + 80,
          canvas.height / 2 + 25,
        )
        gradient.addColorStop(0, "#93E51F")
        gradient.addColorStop(1, "#7BC01A")

        const scale = 1 + Math.sin(Date.now() * 0.008) * 0.05
        const shadowOffset = Math.sin(Date.now() * 0.01) * 2

        // Shadow
        ctx.fillStyle = "rgba(147, 229, 31, 0.3)"
        ctx.fillRect(
          canvas.width / 2 - 78 + shadowOffset,
          canvas.height / 2 - 23 + shadowOffset,
          156 * scale,
          46 * scale,
        )

        // Main button
        ctx.fillStyle = gradient
        ctx.fillRect(canvas.width / 2 - 80, canvas.height / 2 - 25, 160 * scale, 50 * scale)

        // Button text
        ctx.fillStyle = "#000000"
        ctx.font = `bold ${18 * scale}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(t.startGame, canvas.width / 2, canvas.height / 2 + 6)

        // Pulse effect
        ctx.strokeStyle = `rgba(147, 229, 31, ${0.5 + Math.sin(Date.now() * 0.01) * 0.3})`
        ctx.lineWidth = 2
        ctx.strokeRect(canvas.width / 2 - 82, canvas.height / 2 - 27, 164, 54)
      }

      gameRef.current = requestAnimationFrame(gameLoop)
    }

    resetBall(1)
    gameLoop()

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("click", handleCanvasClick)
      if (gameRef.current) {
        cancelAnimationFrame(gameRef.current)
      }
    }
  }, [gameType, isMobile, autoStart, ballSpeed, t.startGame])

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-2 py-4">
      <div className="absolute top-4 right-4 z-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-[#93E51F]"
        >
          <option value="tr">TR Türkçe</option>
          <option value="en">EN English</option>
          <option value="de">DE Deutsch</option>
          <option value="es">ES Español</option>
          <option value="ar">AR العربية</option>
        </select>
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#93E51F] mb-2">
          {t.pingPong} - {gameType === "single" ? t.singlePlayer : t.multiPlayer}
        </h2>
        <p className="text-xs md:text-sm text-gray-400 mb-2 px-2">
          {isMobile ? t.mobileControls : gameType === "single" ? t.keyboardControls : t.multiControls}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3 px-2">
          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2 border border-gray-600">
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${autoStart ? "bg-[#93E51F] shadow-lg shadow-[#93E51F]/50" : "bg-gray-600"}`}
              ></div>
              <label className="text-sm font-medium cursor-pointer" onClick={() => setAutoStart(!autoStart)}>
                {t.autoStart}
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2 border border-gray-600">
            <span className="text-sm font-medium">{t.ballSpeed}:</span>
            <select
              value={ballSpeed}
              onChange={(e) => setBallSpeed(e.target.value as "slow" | "normal" | "fast" | "ultraFast")}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 focus:outline-none focus:border-[#93E51F]"
            >
              <option value="slow">{t.slow}</option>
              <option value="normal">{t.normal}</option>
              <option value="fast">{t.fast}</option>
              <option value="ultraFast">{t.ultraFast}</option>
            </select>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="border border-[#93E51F] rounded-lg mb-2 touch-none max-w-full cursor-pointer"
        style={{ maxHeight: isMobile ? "50vh" : "400px" }}
      />

      <div className="flex gap-2 flex-wrap justify-center">
        {!isMobile && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300 text-sm"
          >
            {t.changeMode}
          </button>
        )}
        <button
          onClick={onHome}
          className="px-4 py-2 bg-[#93E51F] text-black font-semibold rounded-lg hover:bg-[#7BC01A] transition-all duration-300 transform hover:scale-105 text-sm"
        >
          {t.homePage}
        </button>
      </div>
    </div>
  )
}

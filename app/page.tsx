"use client"

import Image from "next/image"
import { useState, useEffect, useRef, lazy, Suspense } from "react"

// Lazy load the game component to improve initial page load
const GameComponent = lazy(() => import('./game-component'))

const translations = {
  tr: {
    goodThings: "İyi şeyler zaman alır!",
    underConstruction: 'Bu sadece bir "yapım aşamasında" sayfası',
    needsTime: "Ve biraz daha zamana ihtiyacı var...",
    playGame: "Beklerken Oyun Oyna",
    selectMode: "Oyun Modu Seç",
    howToPlay: "Nasıl oynamak istiyorsun?",
    singlePlayer: "Tek Kişi",
    vsComputer: "Bilgisayara karşı",
    multiPlayer: "Çift Kişi",
    playWithFriend: "Arkadaşınla oyna",
    goBack: "Geri Dön",
    pingPong: "PING PONG",
    mobileControls: "Ekranın üst yarısına dokun: Yukarı | Alt yarısına dokun: Aşağı",
    keyboardControls: "Klavye: W/S tuşları | Mobil: Ekranın üst/alt yarısına dokun",
    multiControls: "Klavye: Sol W/S, Sağ ↑/↓ | Mobil: Sol/sağ yarıya dokun",
    changeMode: "Mod Değiştir",
    homePage: "Ana Sayfa",
    footerText:
      "Plan B tarafından tasarlanan yaratıcı merkez, Game Jam'lerde yolculuğuna başlayıp yakında herkese açılıyor. Sadece oyunlar için değil, sanat, tasarım, animasyon ve tüm yaratıcı projeler için.",
    autoStart: "Otomatik Başlat",
    startGame: "Oyunu Başlat",
    ballSpeed: "Top Hızı",
    slow: "Yavaş",
    normal: "Normal",
    fast: "Hızlı",
    ultraFast: "Ultra Hızlı",
  },
  en: {
    goodThings: "Good things take time!",
    underConstruction: 'This is just an "under construction" page',
    needsTime: "And it needs a little more time...",
    playGame: "Play Game While Waiting",
    selectMode: "Select Game Mode",
    howToPlay: "How do you want to play?",
    singlePlayer: "Single Player",
    vsComputer: "Against Computer",
    multiPlayer: "Multiplayer",
    playWithFriend: "Play with Friend",
    goBack: "Go Back",
    pingPong: "PING PONG",
    mobileControls: "Touch upper half: Up | Touch lower half: Down",
    keyboardControls: "Keyboard: W/S keys | Mobile: Touch upper/lower half",
    multiControls: "Keyboard: Left W/S, Right ↑/↓ | Mobile: Touch left/right half",
    changeMode: "Change Mode",
    homePage: "Home Page",
    footerText:
      "Creative hub designed by Plan B, starting its journey in Game Jams and soon opening to everyone. It's not just for games but for art, design, animation, and all creative projects.",
    autoStart: "Auto Start",
    startGame: "Start Game",
    ballSpeed: "Ball Speed",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
    ultraFast: "Ultra Fast",
  },
  de: {
    goodThings: "Gute Dinge brauchen Zeit!",
    underConstruction: 'Das ist nur eine "im Aufbau" Seite',
    needsTime: "Und es braucht noch etwas mehr Zeit...",
    playGame: "Spiel Während des Wartens",
    selectMode: "Spielmodus Wählen",
    howToPlay: "Wie möchtest du spielen?",
    singlePlayer: "Einzelspieler",
    vsComputer: "Gegen Computer",
    multiPlayer: "Mehrspieler",
    playWithFriend: "Mit Freund Spielen",
    goBack: "Zurück",
    pingPong: "PING PONG",
    mobileControls: "Obere Hälfte berühren: Hoch | Untere Hälfte berühren: Runter",
    keyboardControls: "Tastatur: W/S Tasten | Mobil: Obere/untere Hälfte berühren",
    multiControls: "Tastatur: Links W/S, Rechts ↑/↓ | Mobil: Linke/rechte Hälfte berühren",
    changeMode: "Modus Ändern",
    homePage: "Startseite",
    footerText:
      "Kreatives Zentrum von Plan B entworfen, beginnt seine Reise in Game Jams und öffnet bald für alle. Es ist nicht nur für Spiele, sondern für Kunst, Design, Animation und alle kreativen Projekte.",
    autoStart: "Auto Start",
    startGame: "Spiel Starten",
    ballSpeed: "Ball Geschwindigkeit",
    slow: "Langsam",
    normal: "Normal",
    fast: "Schnell",
    ultraFast: "Ultra Schnell",
  },
  es: {
    goodThings: "¡Las cosas buenas toman tiempo!",
    underConstruction: 'Esta es solo una página "en construcción"',
    needsTime: "Y necesita un poco más de tiempo...",
    playGame: "Jugar Mientras Esperas",
    selectMode: "Seleccionar Modo de Juego",
    howToPlay: "¿Cómo quieres jugar?",
    singlePlayer: "Un Jugador",
    vsComputer: "Contra Computadora",
    multiPlayer: "Multijugador",
    playWithFriend: "Jugar con Amigo",
    goBack: "Volver",
    pingPong: "PING PONG",
    mobileControls: "Toca mitad superior: Arriba | Toca mitad inferior: Abajo",
    keyboardControls: "Teclado: Teclas W/S | Móvil: Toca mitad superior/inferior",
    multiControls: "Teclado: Izq W/S, Der ↑/↓ | Móvil: Toca mitad izq/der",
    changeMode: "Cambiar Modo",
    homePage: "Página Principal",
    footerText:
      "Centro creativo diseñado por Plan B, comenzando su viaje en Game Jams y pronto abriéndose a todos. No es solo para juegos sino para arte, diseño, animación y todos los proyectos creativos.",
    autoStart: "Inicio Automático",
    startGame: "Iniciar Juego",
    ballSpeed: "Velocidad de Pelota",
    slow: "Lento",
    normal: "Normal",
    fast: "Rápido",
    ultraFast: "Ultra Rápido",
  },
  ar: {
    goodThings: "الأشياء الجيدة تحتاج وقت!",
    underConstruction: 'هذه مجرد صفحة "قيد الإنشاء"',
    needsTime: "وتحتاج إلى مزيد من الوقت...",
    playGame: "العب أثناء الانتظار",
    selectMode: "اختر نمط اللعبة",
    howToPlay: "كيف تريد أن تلعب؟",
    singlePlayer: "لاعب واحد",
    vsComputer: "ضد الكمبيوتر",
    multiPlayer: "متعدد اللاعبين",
    playWithFriend: "العب مع صديق",
    goBack: "العودة",
    pingPong: "بينغ بونغ",
    mobileControls: "اضغط النصف العلوي: أعلى | اضغط النصف السفلي: أسفل",
    keyboardControls: "لوحة المفاتيح: مفاتيح W/S | الجوال: اضغط النصف العلوي/السفلي",
    multiControls: "لوحة المفاتيح: يسار W/S، يمين ↑/↓ | الجوال: اضغط النصف الأيسر/الأيمن",
    changeMode: "تغيير النمط",
    homePage: "الصفحة الرئيسية",
    footerText:
      "مركز إبداعي مصمم من قبل Plan B، يبدأ رحلته في Game Jams وسيفتح قريباً للجميع. ليس فقط للألعاب ولكن للفن والتصميم والرسوم المتحركة وجميع المشاريع الإبداعية.",
    autoStart: "البدء التلقائي",
    startGame: "ابدأ اللعبة",
    ballSpeed: "سرعة الكرة",
    slow: "بطيء",
    normal: "عادي",
    fast: "سريع",
    ultraFast: "سريع جداً",
  },
}

type Language = keyof typeof translations

// Loading component for lazy loaded parts
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#93E51F]"></div>
  </div>
)

export default function ComingSoonPage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const systemLang = navigator.language.toLowerCase()

      // Map system language codes to our supported languages
      if (systemLang.startsWith("tr")) return "tr"
      if (systemLang.startsWith("en")) return "en"
      if (systemLang.startsWith("de")) return "de"
      if (systemLang.startsWith("es")) return "es"
      if (systemLang.startsWith("ar")) return "ar"
    }

    // Default to Turkish if system language not supported
    return "tr"
  })

  const [gameMode, setGameMode] = useState(false)
  const [gameType, setGameType] = useState<"single" | "multi">("single")
  const [showGameModes, setShowGameModes] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  const t = translations[language]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Preload critical images
  useEffect(() => {
    const preloadImages = async () => {
      const imageUrls = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/katman_1-YwpSZ1sls1GrTXwi1HFrxhDsEwsuYR.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PlanBLogo_Versions-19%202-bDjHEHN104nypwhvj63Y9WJEf4vI7P.png"
      ]

      try {
        await Promise.all(
          imageUrls.map(url => {
            return new Promise((resolve, reject) => {
              const img = new window.Image()
              img.onload = resolve
              img.onerror = reject
              img.src = url
            })
          })
        )
        setImagesLoaded(true)
      } catch (error) {
        console.warn('Some images failed to preload:', error)
        setImagesLoaded(true) // Continue anyway
      }
    }

    preloadImages()
  }, [])

  if (showGameModes) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
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

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-[#93E51F] mb-4">{t.selectMode}</h2>
          <p className="text-gray-400 text-sm md:text-base">{t.howToPlay}</p>
        </div>

        <div className="flex flex-col gap-6 mb-8 w-full max-w-sm">
          <button
            onClick={() => {
              setGameType("single")
              setGameMode(true)
              setShowGameModes(false)
            }}
            className="px-6 py-6 bg-[#93E51F] text-black font-bold text-lg rounded-lg hover:bg-[#7BC01A] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#93E51F]/25 w-full"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🤖</div>
              <div>{t.singlePlayer}</div>
              <div className="text-sm font-normal mt-1">{t.vsComputer}</div>
            </div>
          </button>

          {!isMobile && (
            <button
              onClick={() => {
                setGameType("multi")
                setGameMode(true)
                setShowGameModes(false)
              }}
              className="px-6 py-6 bg-gray-700 text-white font-bold text-lg rounded-lg hover:bg-gray-600 transition-all duration-300 w-full"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">👥</div>
                <div>{t.multiPlayer}</div>
                <div className="text-sm font-normal mt-1">{t.playWithFriend}</div>
              </div>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowGameModes(false)}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
        >
          {t.goBack}
        </button>
      </div>
    )
  }

  if (gameMode) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <GameComponent 
          language={language}
          setLanguage={setLanguage}
          gameType={gameType}
          isMobile={isMobile}
          t={t}
          onBack={() => {
            setGameMode(false)
            setShowGameModes(true)
          }}
          onHome={() => {
            setGameMode(false)
            setShowGameModes(false)
          }}
        />
      </Suspense>
    )
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-between px-4 py-8 relative overflow-hidden">
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

      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center z-10">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/katman_1-YwpSZ1sls1GrTXwi1HFrxhDsEwsuYR.png"
            alt="SKILLNEST"
            width={300}
            height={80}
            className="mx-auto object-contain w-48 md:w-64 lg:w-80 h-auto"
            priority
            loading="eager"
            onLoad={() => setImagesLoaded(true)}
          />
        </div>

        <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#93E51F] mb-4 md:mb-6 lg:mb-8 leading-tight">
          {t.goodThings}
        </h2>

        <p className="text-xs md:text-sm lg:text-base text-gray-400 mb-3 md:mb-4 lg:mb-6">{t.underConstruction}</p>

        <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white font-medium mb-8 md:mb-12">
          {t.needsTime}
        </p>

        <button
          onClick={() => setShowGameModes(true)}
          className="px-8 py-4 bg-[#93E51F] text-black font-bold text-lg rounded-lg hover:bg-[#7BC01A] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#93E51F]/25"
        >
          {t.playGame}
        </button>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-center mb-3 md:mb-4">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PlanBLogo_Versions-19%202-bDjHEHN104nypwhvj63Y9WJEf4vI7P.png"
            alt="Plan B"
            width={120}
            height={40}
            className="object-contain w-20 md:w-24 lg:w-32 h-auto"
            loading="lazy"
            onLoad={() => setImagesLoaded(true)}
          />
        </div>

        <p className="text-xs md:text-sm text-gray-400 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 text-center">
          {t.footerText}
        </p>
      </div>
    </div>
  )
}

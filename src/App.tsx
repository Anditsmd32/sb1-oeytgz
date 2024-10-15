import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const songs = [
  {
    title: "JME - The Very Best",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/JME%20-%20THE%20VERY%20BEST%20%5B%20ezmp3.cc%20%5D-jJucVODtmvt6NqUFVjSNY4leVjrCMa.mp3"
  },
  {
    title: "Scrufizzer - Pikachu",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Scrufizzer%20%20-%20Pikachu%20Prod%20By%20NibzMusic%20%5B%20ezmp3.cc%20%5D-2EoEz6zR6XiOukTNwRro65DYGJaFP2.mp3"
  },
  {
    title: "Dialect - Pikachu Part 1",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pikachu%20(Poke%CC%81mon)%20-%20Shellers%20%5BPart%201%5D%20_%20FITS%20%5B%20ezmp3.cc%20%5D-GpLCIZWeAkfiXLq9BOFqHpeMubmENn.mp3"
  },
  {
    title: "Dialect - Pikachu Part 2",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pikachu%20-%20Shellers%20%5BPart%202%5D%20_%20FITS%20%5B%20ezmp3.cc%20%5D-Q0hihzpakeLpcwKly4EHzz45tILviA.mp3"
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [teddiBalance, setTeddiBalance] = useState(0);
  const [teddyRewards, setTeddyRewards] = useState(0);
  const [countdown, setCountdown] = useState(24 * 60 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 450], [150, 50]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => console.log("Autoplay prevented:", error));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTeddiBalance(Math.floor(Math.random() * 1000000));
    setTeddyRewards(Math.floor(Math.random() * 10000));
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSong = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentSong((prev) => (prev + 1) % songs.length);
    } else {
      setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} font-sans transition-colors duration-300`}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-opacity-80 backdrop-blur-md p-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <button onClick={togglePlay} className="text-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-2 rounded-full">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={() => changeSong('prev')} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-2 rounded-full">
              <SkipBack size={24} />
            </button>
            <button onClick={() => changeSong('next')} className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-2 rounded-full">
              <SkipForward size={24} />
            </button>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 font-bold">
              {songs[currentSong].title}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 size={24} className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.5"
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.volume = parseFloat(e.target.value);
                }
              }}
              className="w-32 accent-purple-500"
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={songs[currentSong].src} loop />

      {/* Navigation */}
      <header className="p-4 flex justify-between items-center fixed top-12 left-0 right-0 z-10 bg-opacity-80 backdrop-blur-md">
        <motion.div
          ref={headerRef}
          style={{ height: headerHeight, opacity: headerOpacity }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="w-[150px] h-[150px]" />
        </motion.div>
        <nav>
          <ul className="flex space-x-4">
          <li>
  <button
    onClick={() => scrollToSection('about')}
    className="bg-black text-white hover:text-yellow-300"
  >
    About
  </button>
</li>
<li>
  <button
    onClick={() => scrollToSection('pokechain')}
    className="bg-black text-white hover:text-yellow-300"
  >
    Pokechain
  </button>
</li>
<li>
  <button
    onClick={() => scrollToSection('pokedex')}
    className="bg-black text-white hover:text-yellow-300"
  >
    Pokédex
  </button>
</li>
<li>
  <button
    onClick={() => scrollToSection('tokenomics')}
    className="bg-black text-white hover:text-yellow-300"
  >
    Tokenomics
  </button>
</li>
<li>
  <button
    onClick={() => scrollToSection('community')}
    className="bg-black text-white hover:text-yellow-300"
  >
    Community
  </button>
</li>

          </ul>
        </nav>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-opacity-20 backdrop-blur-md">
          <img 
            src={darkMode ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pokemon_sun_symbol_by_alexalan_d9tl89y-fullview-Oin302oKnKCSRchRtiIZiapEtgyHJ3.png" : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pokemon_moon_logo__5000x5000__by_nicholas_checchia_d9tma2e-pre-sUfpzFbYRUW5IMFyUlwDduI8aB3qTX.png"}
            alt={darkMode ? "Light mode" : "Dark mode"}
            className="w-6 h-6"
          />
        </button>
      </header>

      <div className="pt-[160px]">
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/il_300x300.6275181720_sjnk-tLQj90c9u3mjiMFDJcywqZ505wGs7L.webp" alt="Pokemon Characters" className="w-full h-96 object-cover" />
      </div>

      <main className="container mx-auto px-4 py-24">
        {/* Hero Section */}
        <section id="hero" className="text-center mb-16">
          <motion.h1 
            className="text-6xl font-bold mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline w-[180px] h-[180px]" />
          </motion.h1>
          <motion.p 
            className="text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            The cutest token on <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsechain-card.ead95153-tOblpYBeTyIO8ypzGjd1qe2s6T32rJ.png" alt="PulseChain Logo" className="inline mx-1 w-[120px] h-[90px]" />!
          </motion.p>
          
          <motion.div
            className="mt-8 text-4xl font-bold"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              {formatTime(countdown)}
            </span>
          </motion.div>
          <motion.p
            className="mt-4 text-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Until <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> Launch
          </motion.p>
        </section>

        {/* About Section */}
        <section id="about" className="mb-16">
          <motion.div 
            className={`bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-[4px] rounded-lg`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg flex items-center`}>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">About</h2>
                <p className="mb-4"><img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[90px] h-[90px]" /> was airdropped for free to the <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> Chain Community on <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsechain-card.ead95153-tOblpYBeTyIO8ypzGjd1qe2s6T32rJ.png" alt="PulseChain Logo" className="inline mx-1 w-[120px] h-[60px]" />. It's a cute and fun token that brings joy to its holders!</p>
                <p>Teddiursa, the Little Bear <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" />, is known for its adorable appearance and its love for sweet honey. Just like our token, Teddiursa is small but full of potential. It has a crescent moon mark on its forehead, which glows when it finds honey. Similarly, our token aims to sweeten your crypto journey!</p>
              </div>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/teddiursa-400x400-sHct1AhfULZwxz7IauRaOEKUfXQfs7.webp" alt="Teddiursa" className="ml-4 w-[200px] h-[200px]" />
            </div>
          </motion.div>
        </section>

        {/* Pokechain Section */}
        <section id="pokechain" className="mb-16">
          <motion.div 
            className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-[4px] rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-3xl font-bold mb-4">Pokechain: The <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> Trend on <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsechain-card.ead95153-tOblpYBeTyIO8ypzGjd1qe2s6T32rJ.png" alt="PulseChain Logo" className="inline mx-1 w-[120px] h-[60px]" /></h2>
              <p className="mb-4">Pokechain represents the exciting <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" />-inspired trend taking over <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsechain-card.ead95153-tOblpYBeTyIO8ypzGjd1qe2s6T32rJ.png" alt="PulseChain Logo" className="inline mx-1 w-[120px] h-[60px]" />. It's a community-driven movement that brings the nostalgia and fun of <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> into the world of cryptocurrency.</p>
              <p className="mb-4">As part of this trend, various <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" />-themed tokens have emerged, each representing different <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> characters and their unique traits. These tokens not only serve as digital assets but also as a way for <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> fans to engage with their favorite characters in the crypto space.</p>
              <h3 className="text-2xl font-bold mb-2">How <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> Adds Value to Pokechain</h3>
              <ul className="list-disc list-inside">
                <li>Unique Character Representation: <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> brings its cute and lovable personality to the Pokechain ecosystem, adding diversity to the <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" />inspired tokens.</li>
                <li>Community Engagement: As a free airdrop to the Pokechain community, <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> encourages wider participation and helps grow the overall Pokechain movement.</li>
                <li>Reward Mechanism: With its 3% rewards in Teddy tokens, <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> introduces an innovative tokenomics model to the Pokechain trend, potentially inspiring other projects.</li>
                <li>Cross-Token Interactions: The connection between <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> and Teddy tokens showcases the potential for interesting token interactions within the Pokechain ecosystem.</li>
                <li>Community-Driven Liquidity: For the token to thrive and grow, the community will need to add their own liquidity to the trading pools. This active participation ensures a healthy and sustainable ecosystem for <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" />. Users should also keep a healthy bag of <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> liquid to continue receiving rewards.</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Pokedex Section */}
        <section id="pokedex" className="mb-16">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 p-[4px] rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-3xl font-bold mb-4">The Pokedex: Catch 'Em All!</h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-4">
                    The Pokedex is an essential tool for every 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> 
                    trainer. In the world of Pokechain, our Pokedex represents the collection of all 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> 
                    -inspired tokens on the 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pulsechain-card.ead95153-tOblpYBeTyIO8ypzGjd1qe2s6T32rJ.png" alt="PulseChain Logo" className="inline mx-1 w-[120px] h-[60px]" /> 
                    network.
                  </p>
                  <p className="mb-4">
                    Just like in the 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> 
                    world, our goal is to "catch 'em all" - collect and trade various 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> 
                    tokens to complete your digital Pokedex. Each token represents a unique 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" />, 
                    with its own traits, abilities, and potential for growth.
                  </p>
                  <p>
                    Can you catch them all? Start your journey with 
                    <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> 
                    and see how many 
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20(1)-ZMiiH2b3i6xS9jPr1wDUz4vFGiFXAB.png" alt="Pokemon Logo" className="inline mx-1 w-[90px] h-[60px]" /> 
                    tokens you can collect!
                  </p>
                </div>
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dev.mariinkys.StarryDex-dPIUVVN4nPvnsJ6PAsy7EbIOAoO7qB.svg" alt="Pokedex" className="ml-4 w-[200px] h-[200px]" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className="mb-16">
          <motion.div 
            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 p-[4px] rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-3xl font-bold mb-4">Tokenomics</h2>
              <ul className="list-disc list-inside text-xl">
                <li>Airdropped to the Pokechain Community for free (as sweet as honey!)</li>
                <li>3% rewards in <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEDDYBEAR-COINMARKETCAP-LOGO-200X200-QrlRkSKSr3J9R9pq35ZxDEyE6LHS07.webp" alt="Teddy Icon" className="inline mx-1 w-[20px] h-[20px]" /> on buys/sells (because sharing is caring!)</li>
                <li>No honey... err, tokens were harmed in the making of this meme coin!</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Wallet Section */}
        <section id="wallet" className="mb-16">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[4px] rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-3xl font-bold mb-4">Check Your <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEDDYBEAR-COINMARKETCAP-LOGO-200X200-QrlRkSKSr3J9R9pq35ZxDEyE6LHS07.webp" alt="Teddy Icon" className="inline mx-1 w-[30px] h-[30px]" /> Rewards</h2>
              <form onSubmit={handleWalletSubmit} className="mb-4">
                <input
                  type="text"
                  placeholder="Not Yet Live... Stay Tuned"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
                <button type="submit" className="mt-2 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">Check Balance</button>
              </form>
              {teddiBalance > 0 && (
                <div>
                  <p className="text-xl">Your <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> Balance: {teddiBalance.toLocaleString()}</p>
                  <p className="text-xl">Your <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TEDDYBEAR-COINMARKETCAP-LOGO-200X200-QrlRkSKSr3J9R9pq35ZxDEyE6LHS07.webp" alt="Teddy Icon" className="inline mx-1 w-[20px] h-[20px]" /> Rewards: {teddyRewards.toLocaleString()}</p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Community Section */}
        <section id="community" className="mb-16">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[4px] rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className={`${darkMode ? 'bg-black' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-3xl font-bold mb-4">Join the Pokechain Community</h2>
              <p className="mb-4">Be part of the <img src="https://i.ibb.co/nfYN0YW/teddinenew.png" alt="Teddiursa Icon" className="inline mx-1 w-[60px] h-[60px]" /> family! Connect with us on social media and join our Telegram groups for the latest updates, memes, and honey-sweet discussions.</p>
              <div className="mt-4 flex space-x-4">
                <a href="https://t.me/PokechainTeddi" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Teddiursa Telegram</a>
                <a href="https://t.me/Real_Pokecenter" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Pokecenter Telegram</a>
                <a href="https://x.com/PokechainTeddi" className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded">Twitter</a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="text-center py-4 bg-opacity-80 backdrop-blur-md">
        <p>Made with love by Cuddles for the Pokechain Community. 2024</p>
      </footer>
    </div>
  );
}

export default App;
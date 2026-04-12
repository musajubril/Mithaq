"use client";

import Link from "next/link";
import { 
  BookOpen, 
  Heart, 
  Shield, 
  User,
  ArrowRight,
  LogOut,
  Home as HomeIcon,
  Sparkles,
  MessageCircle,
  Users,
  Settings
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import UserDropdown from "@/components/dashboard/UserDropdown";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container min-h-screen transition-colors duration-500">
      {/* Top Navigation - Glassmorphism */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-primary/5">
        <nav className="flex justify-between items-center px-6 h-20 w-full max-w-screen-xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="font-editorial font-bold text-2xl text-primary tracking-tighter italic">
              Mithaq <span className="font-sans ml-1 text-sm opacity-30 not-italic">مِيثَاق</span>
            </Link>
          </motion.div>
          
          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="#" className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Home</Link>
            <Link href="#journey" className="text-on-surface-variant/50 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">Journey</Link>
            <Link href="#features" className="text-on-surface-variant/50 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">Features</Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {!session?.user && (
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-8 py-3 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Join Us
                </Link>
              </div>
            )}
            <UserDropdown user={session?.user as any} />
          </motion.div>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero Section: Intentional Asymmetry */}
        <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center px-8 py-16 max-w-screen-xl mx-auto gap-16 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-10 z-10"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
              The Serene Sanctuary
            </div>
            <h1 className="text-6xl md:text-8xl font-editorial leading-[1.05] tracking-tight text-on-surface">
              Guided paths to <br/>
              <span className="italic text-primary font-normal">everlasting</span> bonds.
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-sans max-w-lg leading-relaxed opacity-80">
              A marriage compatibility platform designed for intentional connection, built on a foundation of shared faith and values.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Link 
                href="/signup"
                className="px-10 py-5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 text-center"
              >
                Get Started
              </Link>
              <button className="px-10 py-5 rounded-full bg-surface-container-high/50 backdrop-blur-sm text-on-surface font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-surface-container-high transition-colors">
                Our Philosophy
              </button>
            </div>
          </motion.div>

          {/* Asymmetric Image Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[700px] group"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] transform rotate-3 -z-10 group-hover:rotate-6 transition-transform duration-1000"></div>
            <div className="w-full h-full rounded-[4rem] overflow-hidden shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02] bg-surface-container-low border border-primary/5">
              <img 
                alt="Relationship focus" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" 
                src="/images/hero.png" 
              />
            </div>
            
            {/* Floating Info Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-8 -left-8 md:left-auto md:-right-8 bg-surface-container-lowest/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0px_20px_50px_rgba(0,0,0,0.08)] max-w-[320px] space-y-6 border border-primary/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl italic text-on-surface">Guided Dialogue</h3>
                <p className="text-sm text-on-surface-variant/80 font-sans leading-relaxed">Thoughtful prompts designed to deepen your spiritual and emotional understanding together.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Value Propositions - Tonal Layering (Bento Grid) */}
        <section id="features" className="bg-surface-container-low/30 py-32 px-8">
          <div className="max-w-screen-xl mx-auto space-y-20">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Our Approach</span>
              <h2 className="text-5xl md:text-6xl font-editorial mt-6 leading-tight italic text-on-surface">Built on Trust and Intent</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Large Feature Card: Compatibility */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-8 bg-surface-container-lowest rounded-[3.5rem] p-12 md:p-16 border border-primary/5 shadow-[0px_20px_60px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-12 items-center group overflow-hidden"
              >
                <div className="flex-1 space-y-8">
                  <div className="inline-block p-4 bg-primary/5 rounded-2xl text-primary">
                    <Sparkles size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-editorial italic text-on-surface">Deeper Compatibility</h3>
                    <p className="text-on-surface-variant/80 leading-relaxed font-sans text-xl">
                      Our sophisticated mapping focuses on shared values, life goals, and spiritual alignment across 200+ unique dimensions of connection.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-6">
                    <div className="flex -space-x-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-14 h-14 rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center text-primary/10">
                          <User size={24} />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Join 12k+ Intentional Souls</span>
                  </div>
                </div>
                <div className="w-full md:w-1/3 aspect-[4/5] rounded-[2.5rem] bg-primary/5 group-hover:scale-105 transition-transform duration-1000 flex items-center justify-center overflow-hidden">
                   <div className="w-1/2 h-1/2 border-2 border-primary/10 rounded-full animate-pulse" />
                </div>
              </motion.div>

              {/* Action Card: Halal Foundation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-4 bg-primary text-on-primary rounded-[3.5rem] p-12 shadow-2xl shadow-primary/20 flex flex-col justify-between group cursor-pointer overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-on-primary/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-1000 opacity-20" />
                <Heart className="w-16 h-16 mb-12 opacity-40 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                <div>
                  <h3 className="text-3xl font-editorial italic mb-4 leading-tight">Halal Foundation</h3>
                  <p className="text-on-primary/70 text-lg leading-relaxed font-sans mb-10">
                    Respect and faith at the core of every intentional interaction.
                  </p>
                  <div className="w-14 h-14 rounded-full bg-on-primary/10 flex items-center justify-center group-hover:bg-on-primary/20 transition-all">
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Privacy Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-4 bg-surface-container-high/40 rounded-[3.5rem] p-12 space-y-12 border border-primary/5"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-surface flex items-center justify-center shadow-inner">
                  <Shield className="text-primary w-10 h-10 opacity-40" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-editorial italic text-on-surface">Private & Secure</h3>
                  <p className="text-on-surface-variant/80 leading-relaxed font-sans text-lg">
                    Your journey is yours alone until you decide to share it. Purely intentional, purely private.
                  </p>
                </div>
              </motion.div>

              {/* Impact Card: Science of Bonds */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="md:col-span-8 bg-surface-container-lowest rounded-[3.5rem] p-12 md:p-16 border border-primary/5 shadow-[0px_20px_60px_rgba(0,0,0,0.03)] relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col h-full justify-between gap-16">
                  <h3 className="text-5xl md:text-6xl font-editorial italic max-w-lg leading-tight text-on-surface">The Science of Lasting Bonds</h3>
                  <div className="flex flex-wrap items-center gap-12 md:gap-20">
                    <div className="space-y-2">
                      <span className="block text-5xl font-editorial text-primary italic">94%</span>
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-on-surface-variant/30">Satisfaction</span>
                    </div>
                    <div className="h-16 w-px bg-primary/10 hidden md:block" />
                    <div className="space-y-2">
                      <span className="block text-5xl font-editorial text-primary italic">12k+</span>
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-on-surface-variant/30">Intentful Users</span>
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-primary/5 group-hover:w-1/2 transition-all duration-1000 ease-in-out -z-0 opacity-30" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Journey Flow Section: The Path to Sakinah */}
        <section id="journey" className="py-32 px-8 bg-surface">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-24 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Process</span>
              <h2 className="text-5xl md:text-6xl font-editorial italic text-on-surface">Your Path to Sakinah</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-y-1/2 -z-10" />
              
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  desc: "Create your intentional profile and set your spiritual foundations.",
                  icon: <User className="w-8 h-8" />,
                },
                {
                  step: "02",
                  title: "Link with Partner",
                  desc: "Connect securely with your partner to begin your shared journey.",
                  icon: <MessageCircle className="w-8 h-8" />,
                },
                {
                  step: "03",
                  title: "Bond",
                  desc: "Engage in guided dialogue and grow closer through shared values.",
                  icon: <Heart className="w-8 h-8" />,
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center space-y-8 group"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[2rem] bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm">
                      {item.icon}
                    </div>
                    <span className="absolute -top-4 -right-4 font-editorial italic text-3xl text-primary/20 group-hover:text-primary/40 transition-colors">
                      {item.step}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-editorial italic text-on-surface">{item.title}</h3>
                    <p className="text-on-surface-variant/70 font-sans leading-relaxed max-w-[280px]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="philosophy" className="py-48 px-8 text-center max-w-5xl mx-auto space-y-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-editorial italic text-on-surface leading-[1.05]"
          >
            Start your journey toward <br/><span className="text-primary not-italic">Sakinah</span> today.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed opacity-70"
          >
            Join a community of intentional individuals seeking meaningful, lasting relationships built on faith.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-10"
          >
            <Link 
              href="/signup"
              className="inline-block px-8 md:px-16 py-5 md:py-7 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-base md:text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 uppercase tracking-[0.3em] text-[10px] whitespace-nowrap"
            >
              Begin Your Mithaq
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Floating Navigation Dock (Mobile Only) */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          className="md:hidden fixed bottom-10 left-1/2 flex justify-around items-center z-[100] bg-surface/80 backdrop-blur-2xl rounded-full w-[85%] max-w-md px-6 py-3 border border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          <Link href="/" className="flex flex-col items-center justify-center p-3 rounded-full bg-primary text-on-primary">
            <HomeIcon size={20} />
          </Link>
          <Link href="#journey" className="flex flex-col items-center justify-center p-3 text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
            <Sparkles size={20} />
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center justify-center p-3 text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
            <Users size={20} />
          </Link>
          <Link href={session?.user ? "/dashboard" : "/login"} className="flex flex-col items-center justify-center p-3 text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity">
            <Settings size={20} />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-24 border-t border-primary/5 bg-surface-container-low/10">
        <div className="max-w-screen-xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-4xl font-editorial italic text-primary tracking-tighter">Mithaq <span className="font-sans text-xl opacity-20 not-italic ml-1">مِيثَاق</span></h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant/30">© 2026 The Serene Sanctuary. All rights reserved.</p>
          </div>
          <div className="flex gap-16">
             <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors">Privacy</Link>
             <Link href="/terms" className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors">Terms</Link>
             <Link href="/contact" className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import {
  Leaf,
  Sparkles,
  Flower2,
  Heart,
  Brain,
  Cloud,
  Play,
  ArrowRight,
  Star,
  Quote,
  ChevronDown,
} from 'lucide-react';
import AmbientBackground from '../components/AmbientBackground';

type Props = {
  onStartGarden: () => void;
  onExploreDemo: () => void;
};

export default function LandingPage({ onStartGarden, onExploreDemo }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    { icon: Flower2, title: 'Living Garden', desc: 'Every memory blooms into a flower, tree, or butterfly in your personal garden.' },
    { icon: Brain, title: 'AI Reflection', desc: 'Gentle weekly insights that help you understand your emotional growth.' },
    { icon: Cloud, title: 'Dynamic Weather', desc: 'Your garden atmosphere shifts with your moods — rain, sunsets, or starry nights.' },
    { icon: Heart, title: 'Memory Capsules', desc: 'Write a memory now and watch it blossom on a future date you choose.' },
    { icon: Sparkles, title: 'Ambient Sounds', desc: 'Forest, rain, river, and piano — sounds that make your garden feel alive.' },
    { icon: Star, title: 'Achievements', desc: 'Earn badges as your garden grows — First Bloom, Gratitude Master, and more.' },
  ];

  const testimonials = [
    { name: 'Maya R.', text: 'BloomVerse turned my journaling into something I actually look forward to. Watching my garden grow is deeply healing.', role: 'Yoga Teacher' },
    { name: 'James L.', text: 'I\'ve tried every journaling app. This is the first one that made me feel something. It\'s like therapy and art combined.', role: 'Software Engineer' },
    { name: 'Aisha K.', text: 'The memory capsules feature made me cry happy tears. I wrote a letter to my future self and it bloomed on my birthday.', role: 'Graduate Student' },
  ];

  const faqs = [
    { q: 'What is BloomVerse?', a: 'BloomVerse is a digital wellness journal that transforms your memories into a living virtual garden. Instead of plain text entries, every memory you save becomes a visual element — flowers, trees, butterflies, mountains, and more.' },
    { q: 'How does the garden visualization work?', a: 'Each memory category maps to a garden element. Happy memories bloom as flowers, achievements grow into trees, gratitude brings butterflies, challenges form mountains, and dreams become stars in the night sky.' },
    { q: 'Is my data private and secure?', a: 'Yes. Your memories are protected with row-level security. Only you can see your garden and journal entries. We never share your data with third parties.' },
    { q: 'Can I use BloomVerse offline?', a: 'BloomVerse works best with an internet connection to sync your garden across devices, but your data is cached locally for a smooth experience.' },
    { q: 'What are memory capsules?', a: 'Memory capsules are time-locked entries that remain hidden as glowing buds in your garden until a future date you choose. When that date arrives, the bud blossoms into a flower, revealing your message.' },
  ];

  return (
    <div className="min-h-screen relative">
      <AmbientBackground weather="sunny" showParticles />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">BloomVerse</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#how" className="hover:text-emerald-600 transition">How it Works</a>
          <a href="#features" className="hover:text-emerald-600 transition">Features</a>
          <a href="#gallery" className="hover:text-emerald-600 transition">Gallery</a>
          <a href="#faq" className="hover:text-emerald-600 transition">FAQ</a>
        </div>
        <button
          onClick={onStartGarden}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-20 pb-32 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-gray-600 font-medium">A new way to remember</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Every memory you save<br />becomes part of a{' '}
          <span className="text-gradient">living garden</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Watch your memories bloom into a living world. BloomVerse is a digital wellness journal
          where every entry grows into something beautiful.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={onStartGarden}
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
            Start Your Garden
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={onExploreDemo}
            className="px-8 py-4 rounded-full glass text-gray-700 font-semibold hover:bg-white/60 transition flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Explore Demo
          </button>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-[5%] animate-sway text-4xl opacity-60 hidden md:block">🌸</div>
        <div className="absolute top-32 right-[8%] animate-sway text-5xl opacity-50 hidden md:block" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute bottom-20 left-[10%] animate-float-up text-3xl opacity-40 hidden md:block">🍃</div>
        <div className="absolute bottom-32 right-[12%] animate-sway text-4xl opacity-50 hidden md:block" style={{ animationDelay: '0.5s' }}>🌻</div>
      </section>

      {/* How it Works */}
      <section id="how" className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">How BloomVerse Works</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Three simple steps to turn your memories into a living sanctuary.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Write a Memory', desc: 'Capture a moment, a feeling, or a milestone. Add photos, tags, and your mood.', icon: '✍️' },
            { step: '02', title: 'Watch it Bloom', desc: 'Your memory transforms into a flower, tree, butterfly, or mountain in your garden.', icon: '🌷' },
            { step: '03', title: 'Grow Over Time', desc: 'As you add more memories, your garden flourishes into a vibrant, living world.', icon: '🌳' },
          ].map((s) => (
            <div key={s.step} className="glass rounded-3xl p-8 hover:shadow-xl transition group">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="text-sm font-bold text-emerald-500 mb-2">{s.step}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Features that make it magical</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Every feature is designed to bring you comfort, joy, and emotional growth.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-3xl p-6 hover:shadow-xl transition hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/80 to-teal-400/80 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">A glimpse of your garden</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">See how memories transform into a living world.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Sunny Garden', emoji: '🌻', gradient: 'from-amber-200 via-yellow-100 to-emerald-200' },
            { title: 'Night with Fireflies', emoji: '🌙', gradient: 'from-indigo-900 via-purple-800 to-slate-800' },
            { title: 'Rainy Afternoon', emoji: '🌧', gradient: 'from-slate-400 via-blue-300 to-sky-200' },
            { title: 'Sunset Meadow', emoji: '🌅', gradient: 'from-orange-300 via-rose-200 to-purple-300' },
            { title: 'Rainbow Valley', emoji: '🌈', gradient: 'from-sky-200 via-pink-100 to-emerald-200' },
            { title: 'Autumn Walk', emoji: '🍂', gradient: 'from-amber-400 via-orange-300 to-rose-200' },
          ].map((g) => (
            <div key={g.title} className={`rounded-3xl p-8 h-48 bg-gradient-to-br ${g.gradient} flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer shadow-lg`}>
              <div className="text-5xl mb-3">{g.emoji}</div>
              <p className="font-semibold text-gray-700">{g.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Loved by gentle souls</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">See what our community says about BloomVerse.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-3xl p-8 hover:shadow-xl transition">
              <Quote className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 px-6 lg:px-12 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-14">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed animate-fade-in-up">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-4xl mx-auto text-center">
        <div className="glass rounded-3xl p-12 lg:p-16">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your garden is waiting</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Start planting memories today and watch your inner world bloom.</p>
          <button
            onClick={onStartGarden}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition flex items-center gap-2 mx-auto"
          >
            Start Your Garden
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-12 border-t border-white/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-700">BloomVerse</span>
          </div>
          <p className="text-sm text-gray-400">Watch your memories bloom into a living world.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-emerald-600">Privacy</a>
            <a href="#" className="hover:text-emerald-600">Terms</a>
            <a href="#" className="hover:text-emerald-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

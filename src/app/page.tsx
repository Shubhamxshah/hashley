"use client";

import { useState } from "react";

const NAV_LINKS = ["Demo", "Pricing", "Shop"];

const AI_ROLES = [
  "Receptionist",
  "SEO Blog Writer",
  "Lead Generation",
  "Legal Assistant",
  "Community Manager",
  "Executive Assistant",
];

const EMPLOYEES = [
  {
    name: "Eva",
    role: "Executive Assistant",
    quote:
      "I craft email replies, filter out junk, manage your calendar and take meeting notes — so you look productive even if you hit snooze three times.",
    emoji: "📧",
  },
  {
    name: "Penny",
    role: "SEO Blog Writer",
    quote:
      "I write SEO-optimized blog posts that make Google happy, your audience obsessed, and your competitors deeply uncomfortable.",
    emoji: "✍️",
  },
  {
    name: "Sonny",
    role: "Community Manager",
    quote:
      "I turn your social media into a lead-generating machine — without you having to dance on camera.",
    emoji: "📱",
  },
  {
    name: "Stan",
    role: "Lead Generation",
    quote:
      'I find leads, send cold emails and follow-ups — turning "not interested" into "where do I sign?"',
    emoji: "🎯",
  },
  {
    name: "Rachel",
    role: "Receptionist",
    quote:
      "I answer calls while you're heads-down building. Never miss a lead, never miss a beat.",
    emoji: "📞",
  },
  {
    name: "Linda",
    role: "Legal Assistant",
    quote:
      "I answer your contract questions and clarify legal documents — so you can stop pretending you read them.",
    emoji: "⚖️",
  },
];

const TIMELINE = [
  {
    time: "7:00 AM",
    text: "Eva organizes your inbox and prepares replies",
    color: "bg-[#c8ff00]",
  },
  {
    time: "11:00 AM",
    text: "You haven't posted today, but Sonny has",
    color: "bg-[#e0e0e0]",
  },
  {
    time: "2:00 PM",
    text: "While you're out, Stan's finding new clients",
    color: "bg-[#c8ff00]",
  },
  {
    time: "5:00 PM",
    text: "Your site's climbing the ranks — Penny's behind it",
    color: "bg-[#e0e0e0]",
  },
  {
    time: "7:00 PM",
    text: "Day's over. Rachel's still answering calls",
    color: "bg-[#c8ff00]",
  },
  {
    time: "11:00 PM",
    text: "The world's asleep. Linda reviews your contracts",
    color: "bg-[#e0e0e0]",
  },
];

const TESTIMONIALS = [
  {
    name: "D. Sharma",
    title: "Agents are finally here",
    text: "Agents are finally here and they don't rest. Honestly blew my mind. They're not perfect, but they've changed the game. Check it out to be part of the future.",
  },
  {
    name: "Elliott A. Perales",
    title: "One of the best AIs",
    text: "This is honestly one of the best AIs I've tried. Sure, it still needs my daily input, but it's already great and I'm super excited for the updates coming soon.",
  },
  {
    name: "Jeff Niegsch",
    title: "Amazing customer service",
    text: "Hashley's support is unmatched. The founder even set up a personal onboarding call with tailored advice. Great product and genuinely helpful people.",
  },
  {
    name: "Marcus Peterson",
    title: "Great for customer support",
    text: "It's been a great addition to my business. Just having the support agent has helped me address customer issues quicker. Social media management is a huge plus.",
  },
  {
    name: "DeiMarlon Scisney",
    title: "Best virtual team for small business",
    text: "I stumbled onto Hashley while desperately searching for help without blowing my budget on agencies. One of the best decisions I've made.",
  },
  {
    name: "Jeremy King",
    title: "Flat out awesome",
    text: "Hashley is flat out awesome. In every possible way. Especially considering the very reasonable price tag.",
  },
];

const CASE_STUDIES = [
  {
    name: "Dave Marquis",
    field: "Digital Marketing",
    title: "How I saved 200+ hours in less than a month using AI employees",
  },
  {
    name: "Nikilette Bowman",
    field: "Wellness Coach",
    title: "Building a wellness business that runs without me",
  },
  {
    name: "James Willson",
    field: "Real Estate Lending",
    title: "How I use AI employees to run my real estate lending business",
  },
  {
    name: "Roger Storm",
    field: "AI Agency",
    title: "How I turned my agency into a scalable machine with Hashley",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to know how to prompt?",
    a: "Not at all. Hashley's AI employees come pre-trained for their roles. Just give them context about your business and they handle the rest.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes! If you're not happy within 7 days, just let us know and we'll give you a full refund — no questions asked.",
  },
  {
    q: "Is there customer support or onboarding?",
    a: "Absolutely. We offer guided onboarding and responsive support to make sure you get the most out of your AI team from day one.",
  },
  {
    q: "Can Hashley integrate with other software I use?",
    a: "Yes. Hashley connects with popular tools like Gmail, Slack, HubSpot, WordPress, and more — with new integrations shipping regularly.",
  },
  {
    q: "Can I manage multiple businesses?",
    a: "Yes. You can run separate AI teams for each of your businesses from a single Hashley account.",
  },
  {
    q: "Do AI employees learn and improve over time?",
    a: "They do. The more context and feedback you provide, the better they get at understanding your tone, preferences, and workflows.",
  },
];

function Marquee() {
  const doubled = [...AI_ROLES, ...AI_ROLES, ...AI_ROLES, ...AI_ROLES];
  return (
    <div className="overflow-hidden py-6 border-y border-[#0a0a0a]/10">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((role, i) => (
          <span
            key={i}
            className="mx-6 text-lg font-medium text-[#0a0a0a]/50 hover:text-[#0a0a0a] transition-colors cursor-default"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0a0a0a]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-6 text-left cursor-pointer"
      >
        <span className="text-lg font-medium pr-8">{q}</span>
        <span
          className={`text-2xl transition-transform duration-300 flex-shrink-0 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 pb-6" : "max-h-0"}`}
      >
        <p className="text-[#0a0a0a]/60 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#0a0a0a] font-[family-name:var(--font-geist-sans)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf8]/80 backdrop-blur-md border-b border-[#0a0a0a]/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="group">
            <span className="text-2xl font-black tracking-tighter lowercase font-[family-name:var(--font-geist-sans)]">
              hashley<span className="inline-block w-2 h-2 rounded-full bg-[#c8ff00] ml-0.5 mb-0.5 group-hover:scale-150 transition-transform duration-300" />
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm text-[#0a0a0a]/60 hover:text-[#0a0a0a] transition-colors hidden sm:block"
            >
              Log in
            </a>
            <a
              href="/social"
              className="bg-[#0a0a0a] text-[#fafaf8] px-5 py-2.5 text-sm font-medium rounded-full hover:bg-[#0a0a0a]/80 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c8ff00]/30 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse" />
            +20,000 happy businesses
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            AI Employees to
            <br />
            <span className="relative">
              scale your business
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 400 8"
                fill="none"
              >
                <path
                  d="M1 5.5C100 2 300 2 399 5.5"
                  stroke="#c8ff00"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#0a0a0a]/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get an AI team who runs your inbox, socials, SEO, lead generation,
            calls, and support — while you focus on what matters.
          </p>
          <a
            href="/get-started"
            className="inline-flex items-center gap-2 bg-[#0a0a0a] text-[#fafaf8] px-8 py-4 text-lg font-medium rounded-full hover:bg-[#0a0a0a]/80 transition-all hover:gap-4"
          >
            Get Started
            <span>→</span>
          </a>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Pain Points */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mb-4">
            Sound familiar?
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-16">
            You want to scale your business, but...
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                text: "You start your day with 100+ unread emails",
                icon: "📬",
              },
              {
                text: "Your social media hasn't been updated in weeks",
                icon: "📉",
              },
              {
                text: 'Everything keeps getting pushed to "next week"',
                icon: "📅",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-[#0a0a0a]/5 hover:border-[#0a0a0a]/15 transition-colors"
              >
                <span className="text-4xl block mb-4">{item.icon}</span>
                <p className="text-lg font-medium leading-snug">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl sm:text-2xl text-[#0a0a0a]/50 max-w-2xl mx-auto leading-relaxed">
              You&apos;re wearing too many hats: CEO, marketer, sales rep,
              operations manager...
            </p>
            <p className="text-3xl sm:text-4xl font-bold mt-6">
              Stop juggling.
            </p>
          </div>
        </div>
      </section>

      {/* AI Team Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] text-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-[#fafaf8]/40 uppercase tracking-widest mb-4">
            Meet your new AI team
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            AI Employees run your inbox,
            <br className="hidden sm:block" /> socials, SEO, sales & calls.
          </h2>
          <p className="text-[#fafaf8]/40 text-lg mb-16 max-w-2xl">
            Each one is specialized, tireless, and ready to start today.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMPLOYEES.map((emp) => (
              <div
                key={emp.name}
                className="group bg-[#fafaf8]/5 rounded-2xl p-6 border border-[#fafaf8]/10 hover:border-[#c8ff00]/50 hover:bg-[#fafaf8]/8 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{emp.emoji}</span>
                  <div>
                    <p className="font-semibold">{emp.name}</p>
                    <p className="text-sm text-[#fafaf8]/40">{emp.role}</p>
                  </div>
                </div>
                <p className="text-[#fafaf8]/60 leading-relaxed text-sm">
                  &ldquo;{emp.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/get-started"
              className="inline-flex items-center gap-2 bg-[#c8ff00] text-[#0a0a0a] px-8 py-4 text-lg font-semibold rounded-full hover:bg-[#d4ff33] transition-all hover:gap-4"
            >
              Get Started
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Timeline - Your New Life */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mb-4 text-center">
            Welcome to
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-16 text-center">
            Your New Life
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[#0a0a0a]/10" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-6 items-start relative">
                  <div
                    className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 z-10 text-xs font-bold`}
                  >
                    {item.time.split(" ")[0]}
                  </div>
                  <div className="pt-3">
                    <p className="text-xs text-[#0a0a0a]/40 uppercase tracking-wider mb-1">
                      {item.time}
                    </p>
                    <p className="text-lg font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 bg-[#f0f0ec]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mb-4">
              Employee of the month. Every month.
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              22,200+ happy businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#0a0a0a]/5"
              >
                <div className="flex items-center gap-1 mb-3 text-[#c8ff00]">
                  {[...Array(5)].map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="font-semibold mb-2">{t.title}</p>
                <p className="text-sm text-[#0a0a0a]/50 leading-relaxed mb-4">
                  {t.text}
                </p>
                <p className="text-sm font-medium text-[#0a0a0a]/70">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/get-started"
              className="inline-flex items-center gap-2 bg-[#0a0a0a] text-[#fafaf8] px-8 py-4 text-lg font-medium rounded-full hover:bg-[#0a0a0a]/80 transition-all hover:gap-4"
            >
              Get Started
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mb-4">
            Scaling shouldn&apos;t be this easy
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-16">
            But here we are.
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {CASE_STUDIES.map((study, i) => (
              <a
                key={i}
                href="#"
                className="group bg-white rounded-2xl p-8 border border-[#0a0a0a]/5 hover:border-[#0a0a0a]/15 transition-all"
              >
                <p className="text-sm text-[#0a0a0a]/40 mb-1">
                  {study.name} · {study.field}
                </p>
                <p className="text-lg font-medium group-hover:text-[#0a0a0a]/70 transition-colors">
                  {study.title}
                </p>
                <span className="inline-block mt-4 text-sm font-medium text-[#0a0a0a]/40 group-hover:text-[#0a0a0a] transition-colors">
                  Read story →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo CTA */}
      <section className="py-24 px-6 bg-[#0a0a0a] text-[#fafaf8]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-[#fafaf8]/40 uppercase tracking-widest mb-4">
            See it in action
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Watch Your AI Team Work
          </h2>
          <p className="text-[#fafaf8]/40 text-lg mb-10 max-w-xl mx-auto">
            Click through this 3-min interactive demo to see what your AI team
            can do.
          </p>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 bg-[#c8ff00] text-[#0a0a0a] px-8 py-4 text-lg font-semibold rounded-full hover:bg-[#d4ff33] transition-all hover:gap-4"
          >
            Get Started
            <span>→</span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-12">
            Questions?
          </h2>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-[#0a0a0a]/40 uppercase tracking-widest mb-6">
            If you&apos;re reading this, you&apos;re already ahead
          </p>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-10">
            Meet Your AI Team
          </h2>
          <a
            href="/get-started"
            className="inline-flex items-center gap-2 bg-[#0a0a0a] text-[#fafaf8] px-10 py-5 text-xl font-medium rounded-full hover:bg-[#0a0a0a]/80 transition-all hover:gap-4"
          >
            Get Started
            <span>→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0a0a0a]/10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <p className="text-2xl font-black tracking-tighter lowercase mb-4">
                hashley<span className="inline-block w-2 h-2 rounded-full bg-[#c8ff00] ml-0.5 mb-0.5" />
              </p>
              <p className="text-sm text-[#0a0a0a]/40">
                Copyright &copy; {new Date().getFullYear()}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0a0a0a]/40 mb-4">
                AI Employees
              </p>
              <ul className="space-y-2 text-sm text-[#0a0a0a]/60">
                <li>AI Executive Assistant</li>
                <li>AI Social Media Manager</li>
                <li>AI Receptionist</li>
                <li>AI Sales Rep</li>
                <li>AI SEO Blog Writer</li>
                <li>AI Legal Assistant</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0a0a0a]/40 mb-4">
                Company
              </p>
              <ul className="space-y-2 text-sm text-[#0a0a0a]/60">
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Shop
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0a0a0a]/40 mb-4">
                Legal
              </p>
              <ul className="space-y-2 text-sm text-[#0a0a0a]/60">
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0a0a0a]/40 mb-4 mt-8">
                Follow us
              </p>
              <div className="flex gap-4 text-sm text-[#0a0a0a]/60">
                <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                  X
                </a>
                <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                  YT
                </a>
                <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                  TT
                </a>
                <a href="#" className="hover:text-[#0a0a0a] transition-colors">
                  LI
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

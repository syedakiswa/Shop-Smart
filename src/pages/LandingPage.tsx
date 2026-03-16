import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, TrendingDown, Bell, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-20 text-center">
        <div className="absolute top-0 -z-10 h-[500px] w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-medium text-emerald-500">
            <TrendingDown className="h-4 w-4" />
            <span>Smart Shopping for Pakistan</span>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Stop Overpaying. <br />
            <span className="text-emerald-500">Start Saving.</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Track prices across Daraz, PriceOye, OLX, and more. Get real-time alerts when prices drop and find the best deals instantly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Start Tracking Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: ShoppingCart,
            title: "Multi-Store Tracking",
            desc: "Add links from Daraz, PriceOye, and more. We monitor them all in one place."
          },
          {
            icon: Bell,
            title: "Price Alerts",
            desc: "Get notified immediately when a product hits your target price."
          },
          {
            icon: ShieldCheck,
            title: "Verified Deals",
            desc: "We track price history to ensure you're getting a real discount, not a fake one."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

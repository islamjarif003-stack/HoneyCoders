import { motion } from "framer-motion";
import { Store, BarChart3, Star, Heart, MessageCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Store,
    title: "Vendor Dashboard",
    description: "Create your store and sell digital products easily",
    color: "from-blue-500/20 to-cyan-500/10",
    link: "/vendor",
  },
  {
    icon: BarChart3,
    title: "Order Management",
    description: "Track orders and manage buyer transactions",
    color: "from-emerald-500/20 to-green-500/10",
    link: "/vendor",
  },
  {
    icon: Star,
    title: "Reviews & Ratings",
    description: "Give reviews and see honest ratings",
    color: "from-amber-500/20 to-yellow-500/10",
    link: "/products",
  },
  {
    icon: Heart,
    title: "Wishlist",
    description: "Save your favorite items for later",
    color: "from-rose-500/20 to-pink-500/10",
    link: "/library",
  },
  {
    icon: MessageCircle,
    title: "Vendor Chat",
    description: "Chat directly with product vendors",
    color: "from-violet-500/20 to-purple-500/10",
    link: "#",
  },
  {
    icon: Zap,
    title: "API Marketplace",
    description: "API and microservice integrations",
    color: "from-primary/20 to-primary-glow/10",
    link: "/products",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeatureCards = () => (
  <section className="py-20">
    <div className="container">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-extrabold text-[#1F403A] md:text-4xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Everything you need to succeed
        </h2>
        <p className="mt-4 text-[16px] font-medium text-[#6A7B75]">
          Powerful, built-in tools for both buyers and vendors.
          <br />
          Start selling your digital products today effortlessly.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feat) => (
          <motion.div key={feat.title} variants={item}>
            <Link
              to={feat.link}
              className="card group relative flex items-start gap-4 overflow-hidden p-5 transition-all duration-300 hover:border-[#1F403A]/20 hover:shadow-elevated hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.03]`} />
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/60 text-[#1F403A] border border-black/5 shadow-sm transition-all group-hover:bg-[#1F403A] group-hover:text-white group-hover:shadow-teal-glow">
                <feat.icon className="h-5 w-5" />
              </div>
              <div className="relative flex-1 mt-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-extrabold text-[#1F403A] group-hover:text-[#2D7A5F] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>{feat.title}</h3>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6A7B75]">{feat.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeatureCards;

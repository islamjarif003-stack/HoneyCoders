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
        <h2 className="font-display text-2xl font-bold md:text-3xl">
          More is coming!
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          SourceStack is constantly evolving with new features.
          <br />
          Stay ahead with a vendor account and start selling today.
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
              className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-glow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                <feat.icon className="h-5 w-5" />
              </div>
              <div className="relative flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{feat.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Soon</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{feat.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default FeatureCards;

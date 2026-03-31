import { motion } from "framer-motion";

const techs = [
  "React", "Next.js", "Tailwind CSS", "Flutter", "Laravel", "Node.js",
  "WordPress", "Vue.js", "Angular", "Django", "TypeScript", "PostgreSQL",
];

const TechMarquee = () => (
  <section className="relative overflow-hidden border-y border-white/60 bg-white/20 backdrop-blur-sm py-12 shadow-sm">
    <motion.div
      className="mb-8 text-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-[#2D7A5F]/30 bg-white/70 px-5 py-2 text-[13px] font-bold text-[#2D7A5F] shadow-sm backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-[#2D7A5F] shadow-[0_0_8px_#2D7A5F] animate-pulse" />
        Modern Tech-Stack Marketplace
      </span>
    </motion.div>

    <div className="relative flex overflow-hidden group">
      {/* Edge fade gradients tailored to the light mesh background */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#F5EFEB]/90 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#F5EFEB]/90 to-transparent" />

      <div className="flex animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] transition-all">
        {[...techs, ...techs].map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="mx-8 flex items-center gap-3 text-[22px] font-black tracking-tight text-[#1F403A]/70 transition-colors duration-300 hover:text-[#2D7A5F]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#2D7A5F]/50 shadow-sm" />
            {tech}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechMarquee;

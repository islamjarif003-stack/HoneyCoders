import { motion } from "framer-motion";

const techs = [
  "React", "Next.js", "Tailwind CSS", "Flutter", "Laravel", "Node.js",
  "WordPress", "Vue.js", "Angular", "Django", "TypeScript", "PostgreSQL",
];

const TechMarquee = () => (
  <section className="relative overflow-hidden border-y border-border py-10">
    <motion.div
      className="mb-6 text-center"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        Modern Tech-Stack Marketplace
      </span>
    </motion.div>

    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...techs, ...techs].map((tech, i) => (
          <div
            key={`${tech}-${i}`}
            className="mx-6 flex items-center gap-2 text-lg font-semibold font-display text-muted-foreground/60"
          >
            <span className="h-2 w-2 rounded-full bg-primary/40" />
            {tech}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechMarquee;

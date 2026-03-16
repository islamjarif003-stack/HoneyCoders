import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const VendorCTA = () => (
  <section className="py-16">
    <div className="container">
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-10 text-center md:p-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradient orbs */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary-glow/10 blur-[80px]" />

        <div className="relative">
          <h2 className="font-display text-2xl font-bold md:text-4xl">
            Become a Vendor Today —{" "}
            <span className="text-gradient">It's Free!</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Sell your digital products to thousands of buyers. Start earning money, upload unlimited products!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-glow px-8">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/products">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" variant="outline" className="border-border hover:border-primary/30 px-8">
                  Learn More
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default VendorCTA;

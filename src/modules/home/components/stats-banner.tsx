export function StatsBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10,000+", label: "Academic Courses", icon: "📚" },
            { value: "25,000+", label: "Active Learners", icon: "🧑‍🎓" },
            { value: "500+", label: "Expert Instructors", icon: "👨‍🏫" },
            { value: "98%", label: "Satisfaction Rate", icon: "⭐" },
          ].map((stat, i) => (
            <div key={i} className="text-center group relative">
              {/* Animated background element */}
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              {/* Stat content */}
              <div className="p-6 space-y-3">
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider opacity-90 font-medium">
                  {stat.label}
                </div>

                {/* Animated underline */}
                <div className="relative mt-4 h-px w-16 mx-auto bg-white/30 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-0 bg-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

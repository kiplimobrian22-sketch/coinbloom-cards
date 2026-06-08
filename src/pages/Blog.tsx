import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const categories = ["All", "Guides", "Tips", "How-To", "Safety"];

const Blog = () => {
  const [active, setActive] = useState("All");
  const posts = active === "All" ? blogPosts : blogPosts.filter(p => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Gift Card Blog – Tips, Guides & News | All Giftcards"
        description="Read expert gift card tips, buying guides, safety advice and news on the All Giftcards blog."
        path="/blog"
        keywords="gift card blog, gift card tips, gift card guides"
      />
      <Header />
      <main>
        <section className="hero-section py-20 text-center text-primary-foreground">
          <div className="mx-auto max-w-4xl px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gift Card Tips, Guides & News</h1>
            <p className="text-lg opacity-90">Expert advice on buying, selling, and getting the most out of your gift cards.</p>
          </div>
        </section>

        <section className="py-12 mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={active === cat ? "default" : "outline"}
                onClick={() => setActive(cat)}
                className={active === cat ? "btn-primary" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="card-glow rounded-xl overflow-hidden flex flex-col">
                <Link to={`/blog/${post.slug}`}>
                  <img src={post.coverImage} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Badge className="self-start mb-3 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">{post.category}</Badge>
                  <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <Button asChild variant="outline" className="self-start">
                    <Link to={`/blog/${post.slug}`}>Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

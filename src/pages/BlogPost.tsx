import { Link, useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const renderContent = (content: string) => {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    elements.push(
      <Tag key={elements.length} className={`${listType === "ol" ? "list-decimal" : "list-disc"} pl-6 my-4 space-y-2 text-foreground/90`}>
        {listBuffer.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />)}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  const inline = (text: string) =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushList(); continue; }
    if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={elements.length} className="text-xl font-bold mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={elements.length} className="text-2xl font-bold mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.startsWith("- ")) {
      if (listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      elements.push(<p key={elements.length} className="my-4 text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: inline(line) }} />);
    }
  }
  flushList();
  return elements;
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${post.title} | All Giftcards Blog`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        keywords={post.tags.join(", ")}
        ogType="article"
        jsonLd={articleSchema}
      />
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
        </Button>

        <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />

        <Badge className="mb-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">{post.category}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(post.date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{post.readTime}</span>
        </div>

        <article className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </article>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="card-glow rounded-xl overflow-hidden block">
                  <img src={r.coverImage} alt={r.title} className="w-full h-32 object-cover" loading="lazy" />
                  <div className="p-4">
                    <Badge className="mb-2 text-xs bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">{r.category}</Badge>
                    <h3 className="font-semibold hover:text-primary transition-colors">{r.title}</h3>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center">Read more <ArrowRight className="ml-1 h-3 w-3" /></p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

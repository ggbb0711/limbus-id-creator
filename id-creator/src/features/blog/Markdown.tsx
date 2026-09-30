import Link from "next/link";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

const components: Components = {
    a: ({ href = "", children }) => href.startsWith("/") || href.startsWith("#")
        ? <Link href={href}>{children}</Link>
        : <a href={href} target="_blank" rel="noreferrer">{children}</a>,
    table: ({ children }) => <div className="blog-table-wrapper"><table>{children}</table></div>,
}

export default function Markdown({ content }: { content: string }) {
    return <div className="blog-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
            {content}
        </ReactMarkdown>
    </div>
}

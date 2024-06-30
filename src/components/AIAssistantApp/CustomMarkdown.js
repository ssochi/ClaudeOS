import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm';

const CustomH1 = ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>;
const CustomH2 = ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>;
const CustomH3 = ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>;
const CustomParagraph = ({ children }) => <p className="my-2">{children}</p>;
const CustomLink = ({ href, children }) => (
  <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
const CustomList = ({ ordered, children }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className={`my-2 pl-6 ${ordered ? 'list-decimal' : 'list-disc'}`}>{children}</Tag>;
};
const CustomListItem = ({ children }) => <li className="my-1">{children}</li>;
const CustomBlockquote = ({ children }) => (
  <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">{children}</blockquote>
);

const CustomMarkdown = ({ content, onCopy }) => {
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    return !inline ? (
      <div className="relative">
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
        <CopyToClipboard text={code} onCopy={onCopy}>
          <button className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs">
            Copy
          </button>
        </CopyToClipboard>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <ReactMarkdown
      components={{
        code: CodeBlock,
        h1: CustomH1,
        h2: CustomH2,
        h3: CustomH3,
        p: CustomParagraph,
        a: CustomLink,
        ul: ({ children }) => <CustomList ordered={false}>{children}</CustomList>,
        ol: ({ children }) => <CustomList ordered={true}>{children}</CustomList>,
        li: CustomListItem,
        blockquote: CustomBlockquote,
      }}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default CustomMarkdown;
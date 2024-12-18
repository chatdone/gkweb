import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

type Props = {
  markdown: string;
  className?: string;
  componentClassName?: {
    link?: string;
  };
};

const MarkdownText = (props: Props) => {
  const { markdown, className, componentClassName } = props;

  return (
    <ReactMarkdown
      className={className}
      children={markdown}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ node, ...props }) => (
          <a
            className={componentClassName?.link}
            {...props}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      }}
    />
  );
};

export default MarkdownText;

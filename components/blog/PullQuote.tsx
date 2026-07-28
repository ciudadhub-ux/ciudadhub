import { Quotes } from "@phosphor-icons/react/dist/ssr";

export default function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="relative my-8 pl-6 md:pl-8 border-l-2 border-orange-500">
      <Quotes size={28} weight="fill" className="text-orange-500/40 mb-2" />
      <p className="text-xl md:text-2xl font-medium text-zinc-100 leading-snug">
        {text}
      </p>
    </blockquote>
  );
}

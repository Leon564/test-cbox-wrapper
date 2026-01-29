import Image from "next/image";
import IframeWrapper from "../components/IframeWrapper";
import Instructions from "../components/Instructions";

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-full bg-zinc-50 dark:bg-black overflow-hidden">
      <IframeWrapper
        src="https://www3.cbox.ws/box/?boxid=3548579&boxtag=ZJc4tl"
        className="w-full h-full border-0"
        allowtransparency="true"
        allow="autoplay"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        scrolling="auto"
      />
      <Instructions />
    </div>
  );
}

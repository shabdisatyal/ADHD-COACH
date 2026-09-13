import CardPageTwo from '../cardpagetwo';
import { Card } from '../cardthatremindsyou';
import { textfolder } from '../cardthatremindsyou';
// import { StickerPlayground } from '../stickerplayground';

export function Home() {
  return (
    <div className="relative">
      <Card text={textfolder[0].text} label={textfolder[0].label} />
      {/* <StickerPlayground /> */}
      <CardPageTwo />
    
    </div>
  );
}
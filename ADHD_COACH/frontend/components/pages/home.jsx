import { Card } from '../cardthatremindsyou';
import { textfolder } from '../cardthatremindsyou';

export function Home() {
  return (
    <div>
      <Card text={textfolder[0].text} label={textfolder[0].label} />
    </div>
  );
}
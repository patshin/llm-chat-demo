import { useMemo, useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileSceneTabs from './MobileSceneTabs';
import MobileShell from './MobileShell';
import './mobile.css';

export type MobileSceneKey = 'singleLarge' | 'group' | 'counterparty' | 'namelist' | 'rating' | 'warning';

const mobileScenes: Array<{ key: MobileSceneKey; label: string; description: string }> = [
  { key: 'singleLarge', label: '大户', description: '单一大户风险查询移动端页面将在 Step 3 接入。' },
  { key: 'group', label: '集中度', description: '集团集中度分析移动端页面后续接入。' },
  { key: 'counterparty', label: '交易对手', description: '交易对手持仓分析移动端页面后续接入。' },
  { key: 'namelist', label: '名单', description: '黑灰白名单查询移动端页面后续接入。' },
  { key: 'rating', label: '评级', description: '评级查询移动端页面后续接入。' },
  { key: 'warning', label: '预警', description: '预警出险查询移动端页面后续接入。' },
];

function MobileApp() {
  const [activeScene, setActiveScene] = useState<MobileSceneKey>('singleLarge');
  const activeSceneMeta = useMemo(
    () => mobileScenes.find((scene) => scene.key === activeScene) ?? mobileScenes[0],
    [activeScene],
  );

  return (
    <MobileShell>
      <MobileHeader />
      <MobileSceneTabs scenes={mobileScenes} activeScene={activeScene} onSceneChange={setActiveScene} />
      <section className="mobile-scene-placeholder" aria-live="polite">
        <p className="mobile-placeholder-eyebrow">当前场景</p>
        <h2>{activeSceneMeta.label}</h2>
        <p>{activeSceneMeta.description}</p>
      </section>
      <div className="mobile-placeholder-stack" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </MobileShell>
  );
}

export default MobileApp;

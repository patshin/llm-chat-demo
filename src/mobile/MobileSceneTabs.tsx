import type { MobileSceneKey } from './MobileApp';

type MobileSceneTab = {
  key: MobileSceneKey;
  label: string;
};

function MobileSceneTabs({
  scenes,
  activeScene,
  onSceneChange,
}: {
  scenes: MobileSceneTab[];
  activeScene: MobileSceneKey;
  onSceneChange: (scene: MobileSceneKey) => void;
}) {
  return (
    <nav className="mobile-scene-tabs" aria-label="移动端场景切换">
      {scenes.map((scene) => (
        <button
          className={scene.key === activeScene ? 'active' : ''}
          key={scene.key}
          type="button"
          onClick={() => onSceneChange(scene.key)}
          aria-pressed={scene.key === activeScene}
        >
          {scene.label}
        </button>
      ))}
    </nav>
  );
}

export default MobileSceneTabs;

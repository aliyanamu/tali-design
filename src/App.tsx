import { useState } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './screens/Overview';
import { ActivityScreen } from './screens/Activity';
import { RulesScreen } from './screens/Rules';
import { AgentScreen } from './screens/Agent';

type Screen = 'overview' | 'activity' | 'rules' | 'agent';

function App() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [darkMode, setDarkMode] = useState(false);

  const content = {
    overview: <Overview />,
    activity: <ActivityScreen />,
    rules: <RulesScreen />,
    agent: <AgentScreen />,
  }[screen];

  return (
    <Layout
      activeScreen={screen}
      onNavigate={setScreen}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode((d) => !d)}
    >
      {content}
    </Layout>
  );
}

export default App;

import { useState } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './screens/Overview';
import { ActivityScreen } from './screens/Activity';
import { RulesScreen } from './screens/Rules';
import { AgentScreen } from './screens/Agent';
import { ProfileScreen } from './screens/Profile';

type Screen = 'overview' | 'activity' | 'rules' | 'agent' | 'profile';

function App() {
  const [screen, setScreen] = useState<Screen>('overview');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => setDarkMode((d) => !d);

  const content = {
    overview: <Overview />,
    activity: <ActivityScreen />,
    rules: <RulesScreen />,
    agent: <AgentScreen />,
    profile: <ProfileScreen darkMode={darkMode} onToggleDark={toggleDark} />,
  }[screen];

  return (
    <Layout
      activeScreen={screen}
      onNavigate={setScreen}
      darkMode={darkMode}
      onToggleDark={toggleDark}
    >
      {content}
    </Layout>
  );
}

export default App;

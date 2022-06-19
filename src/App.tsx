import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Flocking from './components/Flocking';
import PathFinding from './components/PathFinding';
import Sort from './components/Sort';
import Search from './components/Search';

export const App = () => {
  const [chosenTab, setChosenTab] = React.useState<string>('pathFinding');
  const showContent = () => {
    switch (chosenTab) {
      case 'pathFinding':
        return <PathFinding />;
      case 'sort':
        return <Sort />;
      case 'flocking':
        return <Flocking />;
      case 'search':
        return <Search />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <main>
      <Navbar setChosenTab={setChosenTab} chosenTab={chosenTab} />
      {showContent()}
    </main>
  );
};

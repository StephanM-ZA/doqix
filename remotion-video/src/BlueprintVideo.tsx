import React from 'react';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadOpenSans} from '@remotion/google-fonts/OpenSans';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';

import {FPS, SCENE_DURATIONS, TRANSITION_DURATION_FRAMES} from './theme';
import {ProductivityProblem} from './scenes/ProductivityProblem';
import {WhatIsAutomation} from './scenes/WhatIsAutomation';
import {AnatomyOfAutomation} from './scenes/AnatomyOfAutomation';
import {FirstWins} from './scenes/FirstWins';
import {RulesForSuccess} from './scenes/RulesForSuccess';

// Load fonts at module level
loadMontserrat('normal', {weights: ['400', '600', '700'], subsets: ['latin']});
loadOpenSans('normal', {weights: ['400', '600'], subsets: ['latin']});

const scenes = [
  {Component: ProductivityProblem, duration: SCENE_DURATIONS.productivityProblem},
  {Component: WhatIsAutomation, duration: SCENE_DURATIONS.whatIsAutomation},
  {Component: AnatomyOfAutomation, duration: SCENE_DURATIONS.anatomyOfAutomation},
  {Component: FirstWins, duration: SCENE_DURATIONS.firstWins},
  {Component: RulesForSuccess, duration: SCENE_DURATIONS.rulesForSuccess},
];

export const BlueprintVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {scenes.map(({Component, duration}, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={duration * FPS}>
            <Component />
          </TransitionSeries.Sequence>
          {index < scenes.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({
                durationInFrames: TRANSITION_DURATION_FRAMES,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};

// Total duration accounting for transition overlaps
export const TOTAL_DURATION_FRAMES =
  scenes.reduce((sum, s) => sum + s.duration * FPS, 0) -
  TRANSITION_DURATION_FRAMES * (scenes.length - 1);
